# Experimentos
La carpeta `/dev/experimentos` contiene los diferentes archivos .`ipynb` y .`py` utilizados para realizar los experimentos asociados a los experientos del proyecto.

Se entrenaron y evaluaron 5 modelos diferentes para cada combinación de embeddings probada. 

*Algoritmos /Modelos de Regresion utilizados*
1. SVR
2. Random Forest
3. Red Neuronal
4. XGBOOST
5. lightGBM
   
*Combinaciones de embeddings*
1. seqvec
2. ProtT5
3. ProtBERT
4. Prost5
5. Prost5 -seqvec
6. Prost5 -ProtT5
7. Prost5 -ProtBERT



## Archivos
Se tiene un archivo por cada combinación de embeddings. Internamente cada archivo entrena y evalúa los 5 modelos para el respectivo input de datos. Todos los modelos tienen unos parametros establecidos que no varian entre combinaciones de embeddings.
* seqvec_exp.py
* ProtT5_exp.py
* ProtBERT_exp.py
* Prost5_exp.py
* Prost5 -seqvec_exp.py
* Prost5 -ProtT5_exp.py
* Prost5 -ProtBERT_exp.py


