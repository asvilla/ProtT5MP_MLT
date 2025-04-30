@echo off
if not exist venv (
    echo Creando entorno virtual...
    python -m venv venv
)
call venv\Scripts\activate
pip install --no-cache-dir -r backend\requirements.txt
echo Iniciando servidor...
uvicorn backend.src.main:app --reload
