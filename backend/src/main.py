from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from joblib import load, dump
import pandas as pd
import os

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Definir los modelos de datos
class TextosInput(BaseModel):
    Textos_espanol: List[str]

class ReentrenarInput(BaseModel):
    Textos_espanol: List[str]
    sdg: List[int]

# Cargar el modelo
model_path = "backend/src/assets/pipeline_funcional.joblib"
pipeline = None

try:
    pipeline = load(model_path)
except:
    print(f"No se encontró el modelo en {model_path}. Asegúrese de añadir el modelo antes de usar el endpoint /predict/")

@app.get("/")
def read_root():
    return {"message": "API de clasificación de ODS activa"}

@app.post("/predict/")
def predict(textos_input: TextosInput):
    if pipeline is None:
        raise HTTPException(status_code=500, detail="Modelo no cargado correctamente")
    
    try:
        # Convertir textos a DataFrame
        df = pd.DataFrame({"text": textos_input.Textos_espanol})
        
        # Obtener predicciones y probabilidades
        predictions = pipeline.predict(df["text"])
        probabilities = pipeline.predict_proba(df["text"])
        
        return {
            "predictions": predictions.tolist(),
            "probabilities": probabilities.tolist()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en predicción: {str(e)}")

@app.post("/reentrenar/")
def reentrenar(input_data: ReentrenarInput):
    if pipeline is None:
        raise HTTPException(status_code=500, detail="Modelo no cargado correctamente")
    
    try:
        # Crear DataFrame con nuevos datos
        new_data = pd.DataFrame({
            "text": input_data.Textos_espanol,
            "sdg": input_data.sdg
        })
        
        # Reentrenar el modelo
        X = new_data["text"]
        y = new_data["sdg"]
        pipeline.fit(X, y)
        
        # Evaluar el modelo reentrenado
        predictions = pipeline.predict(X)
        from sklearn.metrics import precision_score, recall_score, f1_score
        precision = precision_score(y, predictions, average='weighted')
        recall = recall_score(y, predictions, average='weighted')
        f1 = f1_score(y, predictions, average='weighted')
        
        # Guardar el modelo reentrenado
        dump(pipeline, model_path)
        
        return {
            "message": "Modelo reentrenado correctamente",
            "metrics": {
                "precision": f"{precision:.5f}",
                "recall": f"{recall:.5f}",
                "f1_score": f"{f1:.5f}"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en reentrenamiento: {str(e)}")