# Dataset
La carpeta `/data` contiene las proteínas utilizadas para crear los diferentes conjuntos de datos empleados en el proyecto.

## raw 
En esta carpeta  `/data/raw` se tienen los sets de datos utilizados en el artículo de TemBERTure [1].
* **TemBERTure_reg.tar.gz**
  - *TemBERTureTrain_reg.txt*: Conjunto de entrenamiento para el modelo de regresión utilizando datos de TemBERTure.
  - *TemBERTureVal_reg.txt*: Conjunto de validación para el modelo de regresión utilizando datos de TemBERTure.
  - *TemBERTureTest_reg.txt*: Conjunto de prueba para el modelo de regresión utilizando datos de TemBERTure.

## preprocessed
En esta carpeta  `/data/preprocessed` se tienen los sets de datos que utilizamos en nuestro proyecto, los cuales se basan en los datos raw de TemBERTure [1] y secuencias descargadas de la base de datos Alphafold [2].

* **preprocessed_data.tar.gz** 
    - *train_preprocessed.txt*: Conjunto de entrenamiento.
  - *val_preprocessed.txt*: Conjunto de validación.
  - *test_preprocessed.txt*: Conjunto de prueba.
  
  Cada uno de estos archivos txt tienen las siguientes columnas.
    - **Protein_ID**: Identificador único de la proteína (es el ID de la base de datos UniProt).
    - **Unique_ID**: Identificador único para cada pbservación, útil ya que hay múltiples entradas u observaciones con el mismo codigo de proteina pero que tienen secuencias ligeramente diferentes.
    - **Sequence**: Secuencia de aminoácidos de la proteína.
    - **Sequence_Length**: Longitud de la secuencia en número de residuos.
    - **Type**: Clasificación de la proteína (*Non-thermophilic* o *Thermophilic*).
    - **Tm**: Temperatura de fusión de la proteína en grados Celsius.
    - **PDB_Path**: Ruta al archivo PDB comprimido (.pdb.gz) que contiene la estructura 3D de la proteína, estos archivos se encuentran en la carpeta `estructuras.tar.gz`

  Cantidad de datos totales y de cada particion:

  | Conjunto     | Cantidad de muestras | Porcentaje |
  |--------------|----------------------|------------|
  | Entrenamiento  | 28,743                | 96.52%     |
  | Validación | 513                   | 1.72%      |
  | Prueba          | 523                   | 1.76%      |
  | **Total**               | **29,779**            | 100%       |

*Nota:* Para los datos finales no se tuvieron en cuenta las estructuras provenientes de la base de datos PDB; únicamente se utilizaron las estructuras de la base de datos AlphaFold. Esta decisión se tomó porque las estructuras del PDB suelen ser más complejas: pueden incluir múltiples unidades o cadenas proteicas, así como ligandos o cofactores. En cambio, las estructuras generadas por AlphaFold tienden a corresponder exclusivamente con la secuencia proteica de interés, lo que las hace más adecuadas para este análisis.

* **estructuras.tar.gz**
  
  (Se tiene como link a drive externo ya que es muy pesado par Github)
  Contiene las estructuras en formato `pdb.gz` distribuidas entre las carpetas `/estructuras/train`, `/estructuras/val` y `/estructuras/test`.
  - train: Conjunto de entrenamiento.
  - val: Conjunto de validación.
  - test: Conjunto de prueba.
 
## Embeddings
En esta carpeta  `/data/embeddings` se tienen embeddings de secuencia y estructura obtenidos. Dato que son datos pesados que no pueden tenerse en el repositorio, en su lugar se tiene un link al drive externo que los contiene.

### **Referencias**

[1] Chiara Rodella, Symela Lazaridi, Thomas Lemmin, TemBERTure: advancing protein thermostability prediction with deep learning and attention mechanisms, Bioinformatics Advances, Volume 4, Issue 1 (2024). https://doi.org/10.1093/bioadv/vbae103

[2] Varadi, M. et al. “AlphaFold Protein Structure Database: massively expanding the structural coverage of protein-sequence space with high-accuracy models.” Nucleic Acids Research, 50(D1), pages D439–D444 (2021). https://doi.org/10.1093/nar/gkab1061

