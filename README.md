# ProtT5MP

<div align="center">
  <img src="ProtT5MP/Logo_ProtT5MP.png" alt="Descripción" width="250"/>
</div>

### Predicción de la estabilidad térmica de proteínas mediante un enfoque exploratorio basado en secuencia y estructura

Este repositorio contiene el código, datos y resultados del proyecto final del curso *Machine Learning Techniques*, donde se evaluaron modelos de regresión para predecir la temperatura de fusión (Tm) de proteínas a partir de representaciones embebidas de su secuencia y estructura. Finalmente se seleccionó el mejor modelo que fue basado unicamente en secuencia y se denominó ProtT5MP.

## 📌 Descripción del proyecto

La estabilidad térmica de las proteínas es una propiedad crítica para diversas aplicaciones biotecnológicas. Tradicionalmente, la predicción de Tm se ha basado únicamente en la secuencia de aminoácidos. Este proyecto propone un enfoque combinado que evalua la integración de:

- Embeddings de secuencia obtenidos con modelos de lenguaje de proteínas (ProtT5, ProtBert, SeqVec).
- Embeddings de estructura generados con ProstT5, a partir de estructuras predichas por AlphaFold.


## 📂 Estructura del repositorio ESTO HAY QUE ORGANIZARLO BIEN, ESTE ES UN EJEMPLO

```
ProtT5MP/
│
├── data/                  # Scripts y enlaces para obtener y procesar los datos
│   ├── download/          # Scripts para descargar PDBs y estructuras AlphaFold
│   └── processed/         # Datos finales usados en el entrenamiento
│
├── notebooks/             # Jupyter notebooks de análisis y entrenamiento
│  
│
├── models/                # Modelos entrenados y serializados (.pkl o .pt)
│
├── ProtT5MP/               # Guía de entrenamiento de nuestro mejor modelo.
│
│
└── README.md              # Este archivo
```

## 🚀 Cómo ejecutar

Las instrucciones o guía de entrenamiento se encuentran en la carpeta ProtT5MP de nuestro modelo final.


## 📚 Citas mas relevantes

- Rodella et al. (2024). *TemBERTure: Predicting protein thermostability with protein language models*.  
- Elnaggar et al. (2022). *ProtTrans: Towards Cracking the Language of Life’s Code Through Self-Supervised Deep Learning and High Performance Computing*.

## 📬 Contacto

Proyecto realizado por Ana Sofía Villa Benavides ,Julieth Zamara Rincón​,Natalia Andrea Duarte​ y Santiago Alejandro Jaimes​, estudiantes de la Universidad de los Andes.  
