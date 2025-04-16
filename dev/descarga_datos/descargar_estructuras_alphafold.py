#!/usr/bin/env python3
import os
import csv
import gzip
import requests

"""
Este script descarga estructuras de proteínas predichas por AlphaFold a partir de un archivo de entrada
con identificadores UniProt (columna 'Protein_ID').

Para cada ID:
- Consulta la API de AlphaFold.
- Descarga el archivo de estructura en formato .pdb.gz si está disponible.
- Guarda los archivos en la carpeta especificada ('estructuras/train').

Si alguna estructura no está disponible o hay un error durante la descarga, el ID se almacena en un archivo
de texto ('fallos_train_af.txt') para referencia posterior.

Requisitos:
- El archivo de entrada debe estar en formato TSV (tab separado) y contener una columna llamada 'Protein_ID'.
- El script crea automáticamente la carpeta de salida si no existe.
"""

def download_alphafold_structure(alpha_id, out_dir, uniprot_id):
    url_api = f"https://alphafold.ebi.ac.uk/api/prediction/{alpha_id}"
    try:
        response = requests.get(url_api)
        response.raise_for_status()
        data = response.json()
        if not data:
            return False
        pdb_url = data[0]["pdbUrl"]
        pdb_response = requests.get(pdb_url)
        pdb_response.raise_for_status()
        filepath = os.path.join(out_dir, f"{uniprot_id}.pdb.gz")
        with gzip.open(filepath, 'wb') as f:
            f.write(pdb_response.content)
        return True
    except:
        return False

output_dir = "estructuras/train"
input_file = "TemBERTureTrain_structure_id.txt"
fallos_file = "fallos_train_af.txt"

# Crear carpeta de salida si no existe
os.makedirs(output_dir, exist_ok=True)

fallos = []

with open(input_file, newline='', encoding='utf-8') as tsvfile:
    reader = csv.DictReader(tsvfile, delimiter='\t')
    for row in reader:
        uniprot_id = row.get("Protein_ID", "").strip()
        
        success = False
        success = download_alphafold_structure(uniprot_id, output_dir, uniprot_id)

        if not success:
            fallos.append(uniprot_id)

# Guardar lista de fallos en archivo
if fallos:
    with open(fallos_file, 'w') as f:
        for protein_id in fallos:
            f.write(protein_id + '\n')



