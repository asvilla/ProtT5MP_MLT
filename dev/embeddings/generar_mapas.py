import os
import sys
import csv
import gzip
from Bio.PDB import PDBParser
import numpy as np
from sklearn.decomposition import PCA

"""
Este script genera mapas de contacto a partir de estructuras 3D (.pdb.gz) de proteínas, utilizando como entrada
archivos preprocesados con rutas a las estructuras correspondientes.

Funcionamiento:
- Para cada proteína listada en el archivo `<split>_preprocessed.txt`, se carga la estructura desde su archivo .pdb.gz.
- Se extraen las coordenadas de los átomos C-alpha.
- Se calcula una matriz de distancias entre todos los C-alpha y se genera un mapa de contacto binario con umbral de 8 Ångstroms.
- El mapa de contacto se reduce dimensionalmente usando PCA (99% de varianza explicada).
- El resultado se guarda como vector plano en un archivo `.txt`.

Parámetros:
- El script se ejecuta con un argumento obligatorio: `train`, `val` o `test`, indicando el conjunto a procesar.
  Ejemplo de uso:
      python3 generar_mapas.py train

Requisitos:
- Archivos `.txt` de entrada deben estar en `../preprocessed_data/`
- Estructuras `.pdb.gz` deben estar en `../estructuras/<split>/`
- Los mapas generados se guardan en `./contact_maps/<split>/`
"""

def generate_contact_map(pdb_gz_file):
    parser = PDBParser(QUIET=True)
    with gzip.open(pdb_gz_file, 'rt') as handle:
        structure = parser.get_structure("protein", handle)
    model = structure[0]

    c_alpha_atoms = []
    for chain in model:
        for residue in chain:
            try:
                c_alpha_atoms.append(residue["CA"].get_coord())
            except KeyError:
                continue

    if not c_alpha_atoms:
        raise ValueError("No se encontraron átomos C-alpha.")

    n_atoms = len(c_alpha_atoms)
    distances = np.zeros((n_atoms, n_atoms))
    for i in range(n_atoms):
        for j in range(i + 1, n_atoms):
            dist = np.linalg.norm(c_alpha_atoms[i] - c_alpha_atoms[j])
            distances[i, j] = dist
            distances[j, i] = dist

    threshold = 8.0
    contact_map = np.where(distances <= threshold, 1, 0)

    pca = PCA(n_components=0.99)
    reduced = pca.fit_transform(contact_map)
    return reduced.flatten()

def main(split):
    input_csv = f"../preprocessed_data/{split}_preprocessed.txt"
    pdb_dir = f"../estructuras/{split}/"
    output_dir = f"./contact_maps/{split}/"

    if not os.path.exists(input_csv):
        print(f"No se encuentra el archivo: {input_csv}")
        return
    if not os.path.isdir(pdb_dir):
        print(f"No se encuentra el directorio con estructuras: {pdb_dir}")
        return
    os.makedirs(output_dir, exist_ok=True)

    with open(input_csv, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            protein_id = row["Protein_ID"]
            pdb_filename = os.path.basename(row["PDB_Path"])
            pdb_path = os.path.join(pdb_dir, pdb_filename)
            out_file = os.path.join(output_dir, f"{protein_id}_map.txt")

            if os.path.exists(out_file):
                print(f"Ya existe: {out_file}, omitiendo.")
                continue
            if not os.path.exists(pdb_path):
                print(f"No se encontró el archivo PDB: {pdb_path}")
                continue

            try:
                contact_vector = generate_contact_map(pdb_path)
                np.savetxt(out_file, contact_vector, fmt='%.6f')
            except Exception as e:
                print(f"Error procesando {protein_id}: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] not in {"test", "train", "val"}:
        print("Uso: python3 generar_mapas.py [test|train|val]")
        sys.exit(1)
    main(sys.argv[1])
