import pandas as pd
import os
"""
Este script verifica la existencia de archivos de estructuras 3D (.pdb.gz) correspondientes a una lista
de proteínas y agrega la ruta correspondiente al archivo si existe, o un 0 si no se encuentra.

Funcionamiento:
- Lee un archivo TSV con identificadores de proteínas en la columna 'Protein_ID'.
- Para cada ID, busca si existe un archivo .pdb.gz con ese nombre en la carpeta indicada ('estructuras/train').
- Agrega una nueva columna ('PDB_Path') al DataFrame con la ruta completa al archivo si está presente,
  o un 0 en caso contrario.
- Finalmente, guarda el resultado como un nuevo archivo CSV llamado 'Train_path_dataset.csv'.

Este proceso permite asociar directamente cada proteína con su archivo estructural correspondiente,
lo cual es útil para el preprocesamiento y análisis posterior.
"""
# Ruta al archivo TSV
archivo_tsv = "TemBERTureTrain_structure_id.txt"  # cambia esto si tu archivo tiene otro nombre

# Ruta a la carpeta con los archivos .pdb.gz
ruta_estructuras = "estructuras/train"

# Leer el archivo
df = pd.read_csv(archivo_tsv, sep="\t")

# Lista para almacenar las rutas o 0
rutas_pdb = []

# Verificar existencia de archivo por cada Protein_ID
for protein_id in df["Protein_ID"]:
    nombre_archivo = f"{protein_id}.pdb.gz"
    ruta_completa = os.path.join(ruta_estructuras, nombre_archivo)
    if os.path.isfile(ruta_completa):
        rutas_pdb.append(ruta_completa)
    else:
        rutas_pdb.append(0)

# Agregar la columna al DataFrame
df["PDB_Path"] = rutas_pdb

# Guardar un nuevo archivo si lo deseas
df.to_csv("Train_path_dataset.csv", index=False)

# Mostrar las primeras filas como confirmación
print(df.head())
print(df.tail())
