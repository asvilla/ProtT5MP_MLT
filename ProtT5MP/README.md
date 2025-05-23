# ProtT5MP 
<div align="center">
  <img src="ProtT5MP/Logo_ProtT5MP.png" alt="Descripción" width="250"/>
</div>
Tras comparar todos los embeddings y diferentes modelos a partir de los experimentos que se encuentran en la carpeta `dev/`. Se encontró que los embeddings basados en el modelo pre-entrenado Prot_T5_XL_U50 fueron los de mejor desempeño. Por este motivo se seleccionó este modelo para realizar un fine-tuning con LORA y de esta manera obtener nuestro modelo final del proyecto para la predicción de Temperatura de Fusión (Tm) basandose únicamente en datos de secuencia.

Esta carpeta contiene nuestro codigo para realizar fine-tuning con LoRA, el codigo es una adaptación de un codigo guía para fine-tuning de Prot_T5_XL_U50 del repositorio de ProtTrans (https://github.com/agemagician/ProtTrans/tree/master) [1].

## Guía de entrenamiento
Este notebook `ProtT5MP_entrenamiento.ipynb` hace el proceso carga de datos, preprocesamiento, entrenamiento (fine-tuning) y evaluación del modelo ProtT5_XL_U50 que para nuestra tarea de regresion de Tm, lo llamaremos ProtT5MP.

### Datos de entrada
Como datos de entrada se requieren los datos preprocesados los cuales se basan en los datos raw de TemBERTure [2] y secuencias descargadas de la base de datos Alphafold [3]. Estos se encuentran en la carpeta /data/preprocessed. 

`preprocessed_data.tar.gz`
    train_preprocessed.txt: Conjunto de entrenamiento.
    val_preprocessed.txt: Conjunto de validación.
    test_preprocessed.txt: Conjunto de prueba.

### Procesamiento de los datos
Para poder realizar finteunign, se juntan todas las particiones originales de los datos y se hacen nuevas particiones 80:10:10 ......
Se ajustan en un df organizado de la siguiente manera.....

## Entrenamiento -Fine-tuning
(En este notebook se hizo con X epócas, sin embargo en realidad se realizaron 20)

## Evaluacion
metricas 

## Guardar el modelo /pesos




## Referencias
[1] Ahmed Elnaggar, Michael Heinzinger, Christian Dallago, Ghalia Rehawi, Wang Yu, Llion Jones, Tom Gibbs, Tamas Feher, Christoph Angerer, Martin Steinegger, Debsindhu Bhowmik, Burkhard Rost, ProtTrans: Towards Cracking the Language of Life’s Code Through Self-Supervised Deep Learning and High Performance Computing, IEEE Transactions on Pattern Analysis and Machine Intelligence, 2021. https://doi.org/10.1109/TPAMI.2021.3095381

[2] Chiara Rodella, Symela Lazaridi, Thomas Lemmin, TemBERTure: advancing protein thermostability prediction with deep learning and attention mechanisms, Bioinformatics Advances, Volume 4, Issue 1 (2024). https://doi.org/10.1093/bioadv/vbae103

[3] Varadi, M. et al. “AlphaFold Protein Structure Database: massively expanding the structural coverage of protein-sequence space with high-accuracy models.” Nucleic Acids Research, 50(D1), pages D439–D444 (2021). https://doi.org/10.1093/nar/gkab1061

Logo generado con asistencia de inteligencia artificial (ChatGPT, OpenAI).
