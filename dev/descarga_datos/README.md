# Dataset
La carpeta `/descarga_datos` contiene los diferentes archivos .`ipynb` y .`py` utilizados para descargar y explorar los datos del proyecto.


### **exploracion_datos_1**
    En este  archivo se realiza la carga, limpieza y preprocesamiento para revisar cuantos de los datos utilzados en TemBERTure tenían disponible su estructura en PDB y en AlphaFold.
Esto se realizó utilizando la API de Uniprot y los Protein_ID de los datos originales. 

Se pudo observar que solo  al rededor del 15% de las observaciones contaban con estructuras experimentales de la base de datos PDB. Sin embargo casi el 90% de las observaciones contaron con estructura predicha por AlphaFold.

### **exploracion_datos_1**
    En este  archivo se realiza la carga, limpieza y preprocesamiento de los conjuntos de datos de proteínas utilizados en el finalmente en el proyecto. Estos datos cuentan con codigos o Path a arhcivos PDB que fueron obtenidos de AlphaFold.

En particular se realiza:

* La generación de un identificador único (`Unique_ID`) por entrada de proteína.
* El Filtrado de proteínas sin estructura disponible (donde `PDB_Path == '0'`).

*Nota:* Para los datos finales no se tuvieron en cuenta las estructuras provenientes de la base de datos PDB; únicamente se utilizaron las estructuras de la base de datos AlphaFold. Esta decisión se tomó porque las estructuras del PDB suelen ser más complejas: pueden incluir múltiples unidades o cadenas proteicas, así como ligandos o cofactores. En cambio, las estructuras generadas por AlphaFold tienden a corresponder exclusivamente con la secuencia proteica de interés, lo que las hace más adecuadas para este análisis.

### **descargar_estructuras_alphafold**
Este script descarga estructuras de proteínas predichas por AlphaFold a partir de un archivo de entrada
con identificadores UniProt (columna 'Protein_ID').

Para cada ID:
- Consulta la API de AlphaFold.
- Descarga el archivo de estructura en formato .pdb.gz si está disponible.
- Guarda los archivos en la carpeta especificada ('estructuras/train').

