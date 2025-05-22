# from typing import Optional
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# import torch
# import os

# app = FastAPI()

# origins = [
#     "http://localhost:3000"
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )



# @app.get("/")
# def read_root():
#     return {"Hello": "World"}


# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Optional[str] = None):
#     return {"item_id": item_id, "q": q}


# main.py (con funciones pt5_classification_model_definition y load_model_custom actualizadas)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import torch.nn as nn
import torch.nn.functional as F
from transformers import (
    T5EncoderModel, T5Tokenizer, T5Config, T5PreTrainedModel
    
)
from transformers.models.t5.modeling_t5 import T5Stack
from transformers.modeling_outputs import SequenceClassifierOutput
# from transformers.utils.model_parallel_utils import assert_device_map, get_device_map # No necesario para inferencia

import re
import copy
import numpy as np
import os

# --- Inicio de Clases y Funciones Copiadas/Adaptadas ---

class LoRAConfig:
    def __init__(self):
        self.lora_rank = 4
        self.lora_init_scale = 0.01
        self.lora_modules = ".*SelfAttention|.*EncDecAttention"
        self.lora_layers = "q|k|v|o"
        self.trainable_param_names = ".*layer_norm.*|.*lora_[ab].*"
        self.lora_scaling_rank = 1

class LoRALinear(nn.Module):
    def __init__(self, linear_layer, rank, scaling_rank, init_scale):
        super().__init__()
        self.in_features = linear_layer.in_features
        self.out_features = linear_layer.out_features
        self.rank = rank
        self.scaling_rank = scaling_rank
        self.weight = linear_layer.weight
        self.bias = linear_layer.bias
        if self.rank > 0:
            self.lora_a = nn.Parameter(torch.randn(rank, linear_layer.in_features) * init_scale)
            if init_scale < 0:
                self.lora_b = nn.Parameter(torch.randn(linear_layer.out_features, rank) * init_scale)
            else:
                self.lora_b = nn.Parameter(torch.zeros(linear_layer.out_features, rank))
        if self.scaling_rank:
            self.multi_lora_a = nn.Parameter(
                torch.ones(self.scaling_rank, linear_layer.in_features)
                + torch.randn(self.scaling_rank, linear_layer.in_features) * init_scale
            )
            if init_scale < 0:
                self.multi_lora_b = nn.Parameter(
                    torch.ones(linear_layer.out_features, self.scaling_rank)
                    + torch.randn(linear_layer.out_features, self.scaling_rank) * init_scale
                )
            else:
                self.multi_lora_b = nn.Parameter(torch.ones(linear_layer.out_features, self.scaling_rank))

    def forward(self, input):
        if self.scaling_rank == 1 and self.rank == 0:
            if self.multi_lora_a.requires_grad:
                hidden = F.linear((input * self.multi_lora_a.flatten()), self.weight, self.bias)
            else:
                hidden = F.linear(input, self.weight, self.bias)
            if self.multi_lora_b.requires_grad:
                hidden = hidden * self.multi_lora_b.flatten()
            return hidden
        else:
            weight = self.weight
            if self.scaling_rank:
                weight = weight * torch.matmul(self.multi_lora_b, self.multi_lora_a) / self.scaling_rank
            if self.rank:
                weight = weight + torch.matmul(self.lora_b, self.lora_a) / self.rank
            return F.linear(input, weight, self.bias)

    def extra_repr(self):
        return "in_features={}, out_features={}, bias={}, rank={}, scaling_rank={}".format(
            self.in_features, self.out_features, self.bias is not None, self.rank, self.scaling_rank
        )

def modify_with_lora(transformer, config):
    for m_name, module in dict(transformer.named_modules()).items():
        if re.fullmatch(config.lora_modules, m_name):
            for c_name, layer in dict(module.named_children()).items():
                if re.fullmatch(config.lora_layers, c_name):
                    assert isinstance(
                        layer, nn.Linear
                    ), f"LoRA can only be applied to torch.nn.Linear, but {layer} is {type(layer)}."
                    setattr(
                        module,
                        c_name,
                        LoRALinear(layer, config.lora_rank, config.lora_scaling_rank, config.lora_init_scale),
                    )
    return transformer

class ClassConfig:
    def __init__(self, dropout=0.2, num_labels=1):
        self.dropout_rate = dropout
        self.num_labels = num_labels

class T5EncoderClassificationHead(nn.Module):
    def __init__(self, config, class_config):
        super().__init__()
        self.dense = nn.Linear(config.hidden_size, config.hidden_size)
        self.dropout = nn.Dropout(class_config.dropout_rate)
        self.out_proj = nn.Linear(config.hidden_size, class_config.num_labels)

    def forward(self, hidden_states):
        hidden_states = torch.mean(hidden_states, dim=1)
        hidden_states = self.dropout(hidden_states)
        hidden_states = self.dense(hidden_states)
        hidden_states = torch.tanh(hidden_states)
        hidden_states = self.dropout(hidden_states)
        hidden_states = self.out_proj(hidden_states)
        return hidden_states

class T5EncoderForSimpleSequenceClassification(T5PreTrainedModel):
    def __init__(self, config: T5Config, class_config):
        super().__init__(config)
        self.num_labels = class_config.num_labels
        self.config = config
        self.shared = nn.Embedding(config.vocab_size, config.d_model)
        encoder_config = copy.deepcopy(config)
        encoder_config.use_cache = False
        encoder_config.is_encoder_decoder = False
        self.encoder = T5Stack(encoder_config, self.shared)
        self.dropout = nn.Dropout(class_config.dropout_rate) 
        self.classifier = T5EncoderClassificationHead(config, class_config)
        self.post_init()
        self.model_parallel = False
        self.device_map = None

    def get_input_embeddings(self):
        return self.shared

    def set_input_embeddings(self, new_embeddings):
        self.shared = new_embeddings
        self.encoder.set_input_embeddings(new_embeddings)

    def get_encoder(self):
        return self.encoder
        
    def forward(
        self,
        input_ids=None,
        attention_mask=None,
        head_mask=None, 
        inputs_embeds=None, 
        labels=None, 
        output_attentions=None, 
        output_hidden_states=None, 
        return_dict=None,
    ):
        return_dict = return_dict if return_dict is not None else self.config.use_return_dict
        outputs = self.encoder(
            input_ids=input_ids,
            attention_mask=attention_mask,
            return_dict=return_dict,
        )
        hidden_states = outputs[0]
        logits = self.classifier(hidden_states)
        loss = None 
        if not return_dict:
            return (logits,) + outputs[1:] 
        return SequenceClassifierOutput(
            loss=loss, 
            logits=logits,
            hidden_states=outputs.hidden_states,
            attentions=outputs.attentions,
        )

def pt5_classification_model_definition(num_labels, half_precision=False):
    model_name_hf = "Rostlab/prot_t5_xl_uniref50"
    print(f"pt5_classification_model_definition: Loading base T5EncoderModel: {model_name_hf}")
    try:
        if half_precision:
            if not torch.cuda.is_available():
                raise ValueError('Half precision can be run on GPU only.')
            model_name_hf = 'Rostlab/prot_t5_xl_half_uniref50-enc'
            model_base = T5EncoderModel.from_pretrained(model_name_hf, torch_dtype=torch.float16)
            tokenizer = T5Tokenizer.from_pretrained(model_name_hf, do_lower_case=False)
        else:
            model_base = T5EncoderModel.from_pretrained(model_name_hf)
            tokenizer = T5Tokenizer.from_pretrained(model_name_hf, do_lower_case=False)
    except Exception as e:
        print(f"ERROR in pt5_classification_model_definition while loading from_pretrained: {e}")
        raise
    print("pt5_classification_model_definition: Base T5EncoderModel and T5Tokenizer loaded.")

    class_config = ClassConfig(num_labels=num_labels)
    print(f"pt5_classification_model_definition: Initializing T5EncoderForSimpleSequenceClassification with num_labels={num_labels}")
    class_model = T5EncoderForSimpleSequenceClassification(model_base.config, class_config)
    print("pt5_classification_model_definition: T5EncoderForSimpleSequenceClassification initialized.")

    class_model.shared = model_base.shared
    class_model.encoder = model_base.encoder
    del model_base 
    print("pt5_classification_model_definition: Shared embeddings and encoder assigned to classification model.")

    lora_conf = LoRAConfig()
    print("pt5_classification_model_definition: Applying LoRA modifications...")
    class_model = modify_with_lora(class_model, lora_conf)
    print("pt5_classification_model_definition: LoRA modifications applied.")
    
    print("pt5_classification_model_definition: Setting requires_grad for parameters...")
    trainable_params_count = 0
    total_params_count = 0
    for param_name, param in class_model.named_parameters():
        total_params_count += param.numel()
        is_trainable_by_lora_config = re.fullmatch(lora_conf.trainable_param_names, param_name)
        
        if "shared." in param_name or "encoder." in param_name:
            if is_trainable_by_lora_config:
                param.requires_grad = True
                trainable_params_count += param.numel()
            else:
                param.requires_grad = False
        elif "classifier." in param_name:
            param.requires_grad = True 
            trainable_params_count += param.numel()
        elif is_trainable_by_lora_config:
             param.requires_grad = True
             trainable_params_count += param.numel()
        else:
            param.requires_grad = False
    print(f"pt5_classification_model_definition: Parameter requires_grad setting complete. Trainable params: {trainable_params_count}, Total params: {total_params_count}")
    return class_model, tokenizer

def load_model_custom(filepath, num_labels=1, mixed=False):
    print(f"load_model_custom: Attempting to initialize base model and tokenizer (num_labels={num_labels}, mixed={mixed})...")
    model_loaded, tokenizer_loaded = pt5_classification_model_definition(num_labels=num_labels, half_precision=mixed)
    print("load_model_custom: Base model and tokenizer initialized.")

    print(f"load_model_custom: Loading fine-tuned weights from {filepath}...")
    try:
        fine_tuned_weights = torch.load(filepath, map_location=torch.device('cpu'))
        print(f"load_model_custom: Successfully loaded weights from .pth file. Number of weight sets: {len(fine_tuned_weights)}. First 5 keys: {list(fine_tuned_weights.keys())[:5]}...")
    except Exception as e:
        print(f"load_model_custom: ERROR loading .pth file: {e}")
        raise

    print("load_model_custom: Assigning fine-tuned weights to the model...")
    loaded_count = 0
    
    model_params_dict = dict(model_loaded.named_parameters())

    for param_name_loaded, param_value_loaded in fine_tuned_weights.items():
        if param_name_loaded in model_params_dict:
            target_param = model_params_dict[param_name_loaded]
            try:
                if target_param.data.shape == param_value_loaded.data.shape: # Check shape before assigning
                    with torch.no_grad():
                        target_param.data.copy_(param_value_loaded.data)
                    loaded_count += 1
                    # print(f"load_model_custom: Successfully loaded weights for: {param_name_loaded}")
                else:
                    print(f"load_model_custom: WARNING - Shape mismatch for {param_name_loaded}: model expects {target_param.data.shape}, .pth has {param_value_loaded.data.shape}. Skipping.")
            except Exception as e:
                print(f"load_model_custom: ERROR assigning data for {param_name_loaded}: {e}")
        else:
            print(f"load_model_custom: WARNING - Parameter '{param_name_loaded}' from .pth file not found in the initialized model's named_parameters.")

    print(f"load_model_custom: Assigned {loaded_count} out of {len(fine_tuned_weights)} weight sets from the .pth file.")
    if loaded_count == 0 and len(fine_tuned_weights) > 0:
        print("load_model_custom: CRITICAL WARNING - No weights were actually loaded into the model. Check parameter names in your .pth file versus the model's named_parameters().")
    elif loaded_count < len(fine_tuned_weights):
        print("load_model_custom: WARNING - Not all weights from .pth file were loaded. Check parameter names.")
    
    return tokenizer_loaded, model_loaded

# --- Fin de Clases y Funciones ---

app = FastAPI(title="Protein Tm Predictor", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_global = None
tokenizer_global = None
device_global = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class ProteinSequenceInput(BaseModel):
    protein_sequence: str

class TmPredictionOutput(BaseModel):
    predicted_tm: float
    info: str = "ProtT5-XL-UniRef50 fine-tuned with LoRA for Tm prediction."

@app.on_event("startup")
async def load_resources():
    global model_global, tokenizer_global
    # Asegúrate de que la ruta sea correcta desde donde ejecutas uvicorn
    # Si main.py está en 'src' y 'assets' es una subcarpeta de 'src':
    model_path = "backend/src/assets/PT5_finetuned.pth"
    
    # Para depuración, imprime la ruta absoluta que Python está tratando de usar
    absolute_model_path = os.path.abspath(model_path)
    print(f"Startup event: Attempting to load model from relative path: {model_path}")
    print(f"Startup event: Absolute path resolved to: {absolute_model_path}")
    
    if not os.path.exists(model_path): # Usa la ruta relativa aquí para la comprobación inicial
        print(f"CRITICAL ERROR: Model weights file not found at relative path {model_path} (resolved to {absolute_model_path}).")
        print(f"Current working directory: {os.getcwd()}")
        print(f"Files in current directory: {os.listdir('.')}")
        if os.path.exists("./assets"):
             print(f"Files in ./assets directory: {os.listdir('./assets')}")
        model_global = None 
        tokenizer_global = None
        return

    print(f"Loading model from {model_path} (absolute: {absolute_model_path})...")
    try:
        tokenizer_global, model_global = load_model_custom(model_path, num_labels=1, mixed=False)
        model_global.to(device_global)
        model_global.eval() 
        print(f"Model loaded successfully on {device_global}.")
    except Exception as e:
        print(f"CRITICAL ERROR during model loading process: {e}")
        import traceback
        traceback.print_exc() # Imprime el traceback completo
        model_global = None 
        tokenizer_global = None

@app.post("/predict", response_model=TmPredictionOutput, summary="Predict Protein Melting Temperature (Tm)")
async def predict_tm(protein_input: ProteinSequenceInput):
    if model_global is None or tokenizer_global is None:
        raise HTTPException(status_code=503, detail="Model not loaded or loading failed. Check server logs.")

    sequence = protein_input.protein_sequence.upper()
    processed_sequence = re.sub(r"[UZOB]", "X", sequence)
    processed_sequence_spaced = " ".join(list(processed_sequence))

    inputs = tokenizer_global(
        processed_sequence_spaced, 
        return_tensors="pt", 
        padding="longest",
        truncation=True, 
        max_length=1024 
    )
    
    inputs = {k: v.to(device_global) for k, v in inputs.items()}

    try:
        with torch.no_grad():
            outputs = model_global(**inputs)
            logits = outputs.logits 
            predicted_tm = logits.item() 
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during model inference: {e}")

    return TmPredictionOutput(predicted_tm=predicted_tm)

@app.get("/", summary="Root endpoint")
async def read_root():
    return {"message": "ProtT5 Tm Prediction API. Use the /predict endpoint to make predictions."}

# Para ejecutar la aplicación (guarda esto como main.py):
# uvicorn main:app --reload