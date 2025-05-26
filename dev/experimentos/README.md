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

*Finetuning*
Se realizó finetuning al modelo que mostró el mejor desempeño en la producción de embeddings ProtT5-XL-U50. Aunque en nuestro estudio realizamos finetunig utilizando tanto las particiones utilizadas por [Rodella et al. (2024)](https://academic.oup.com/bioinformaticsadvances/article/4/1/vbae103/7713394) (96:2:2) en TemBERTure, en el notebook de finetuning de este repositorio (ProtT5_finetuning.ipynb) solo se incluye las particiones 80:10:10 con las que fue esntrenado nuestro modelo con mejor desempeño ProtT5MP. Asimismo, en nuestro estudio hicimos finetunig del modelo por 20 epocas, teniendo en cuenta que este notebook es explicativo, solo se corrieron 5 epocas dado el tiempo y la demanda computacional que esto requiere.

## Archivos
Se tiene un archivo por cada combinación de embeddings. Internamente cada archivo entrena y evalúa los 5 modelos para el respectivo input de datos. Todos los modelos tienen unos parametros establecidos que no varian entre combinaciones de embeddings.
* seqvec_exp.py
* ProtT5_exp.py
* ProtBERT_exp.py
* Prost5_exp.py
* Prost5 -seqvec_exp.py
* Prost5 -ProtT5_exp.py
* Prost5 -ProtBERT_exp.py
* ProtT5_finetuning.ipynb

