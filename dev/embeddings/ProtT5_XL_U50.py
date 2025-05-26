import os
import sys
import re
import numpy as np
import pandas as pd
from tqdm.auto import tqdm
from bio_embeddings.embed import prottrans_t5_embedder

def main(split):
    
    input_csv = f"preprocessed_data/preprocessed_data/{split}_preprocessed.txt"
    output_ProtT5_XL_U50 = f"./bio_embeddings/ProtT5_XL_U50/{split}/"
    os.makedirs(output_ProtT5_XL_U50, exist_ok=True)


    if not os.path.exists(input_csv):
        print(f"No se encuentra el archivo: {input_csv}")
        return

    print(" Cargando modelos...")
    embedder = prottrans_t5_embedder.ProtTransT5XLU50Embedder()


    df = pd.read_csv(input_csv, sep=",")

    for _, row in tqdm(df.iterrows(), total=len(df)):
        unique_id = row["Unique_ID"]
        sequence = row["Sequence"]

        try:
            
            emb_ProtT5_XL_U50 = embedder.embed(sequence)
            embedding_avg = emb_ProtT5_XL_U50.mean(axis=0)
            np.save(f"{output_ProtT5_XL_U50}/{unique_id}_ProtT5_XL_U50.npy", embedding_avg)
            

        except Exception as e:
            print(f" Error con {unique_id}: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] not in {"train", "val", "test"}:
        sys.exit(1)
    split = sys.argv[1]
    main(split)