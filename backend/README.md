# BackEnd - API
Esta aplicación cuenta con dos Endpoints que corren en `localhost:8000`:

* */predict (POST)*:  Este endpoint es el encargado de la predicción. Recibe una secuencia de proteína en formato JSON y retorna la temperatura de fusión (Tm) predicha por el modelo ProtT5MP, junto con información adicional del modelo.

```
# INPUT
{
  "protein_sequence": "MKHENPHHKHSHPHSEPQHAHPSGGHAAHTGHDKHAGHTPEMFRDRFFVSLLLTLPILYFSEHFQDWFGYRAAQFPGSAWVNPVLGTILYFYGGLVFLKGALRELRARTPGMMTLIALGITAAYGYSLAVSLGLPGKPFYWELATLIDVMLLGHWLEMASVQAASRALEELSKLMPTTAHRILGDRIEDIPVSALKEGDLILIRPGEQVPADGVVVEGASTMNEAFLTGESRPVPKEPGDEVIAGAVNGEGALKVRVTRTGEATTLSQILRLVQEAQASRSRFQALADRVAGWLFYIALTLGTLTFLVWLALGRDFNFALSLAVTVVVIACPHALGLAIPLVTVNATALAAKNGILVRNREAFERGREIRFVALDKTGTLTEGRFAVRAVYAHETSEEEALSLAAALEALSEHPLAQAIVEAAEGKGLPRPEVRDFQAVPGKGVEGTLGGKRYRVGRPEWAEELGLKVSEPLKRGLKEAEARGESVVALMDEARVLALLALADRIRPSAKEAIRRLKAMGITPVMITGDAEAVARTVAQELGIERYHARVLPEDKARRVRELKREGPTAFVGDGINDAPALLEADLGIAIGAGTNVAIEAADLVLVESDPLDVVRALTLARATYAKMVQNLFWATGYNAIALPLAAGVAYPWGIVLSPAVGALLMSLSTVAVAVNAMLLRRAALTAL"
}

# OUTPUT
{
  "predicted_tm": 76.19392395019531,
  "info": "ProtT5-XL-UniRef50 fine-tuned with LoRA for Tm prediction."
}
```
## ¿Cómo Ejecutar?

### Ejecución con comandos Shell
Navegar a la carpeta raíz del proyecto.

Ejecutar individualmente POR PRIMERA VEZ con:
* `python -m venv venv`
* `venv\Scripts\activate`
* `pip install --no-cache-dir -r requirements.txt`
* `uvicorn backend.src.main:app --reload`

Ejecutar después de instalado con:
* `venv\Scripts\activate`
* `uvicorn backend.src.main:app --reload`

# FrontEnd - ReactJS
Esta aplicación cuenta con un FrontEnd elaborado con el framework React JS que corre en `localhost:5173/`.

## ¿Cómo Ejecutar?
En una terminal diferente a la del BackEnd (deben estar corriendo en simultáneo), aplicar los siguientes comandos:

* `npm install`
* `npm run dev`


# Opciones de Uso
Es posible navegar a la página principal desde cualquier navegador en la ruta `localhost:5173/`. En esta opción, el usuario puede interactuar con la aplicación web y todas sus funcionalidades.

\
También, si se desea, es posible correr las peticiones en el back directamente, respetando la estructura de los JSON en la siguiente ruta: `localhost:8000/docs/`

