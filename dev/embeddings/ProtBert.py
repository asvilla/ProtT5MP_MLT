import os
import sys
import re
import numpy as np
import pandas as pd
from tqdm.auto import tqdm
from bio_embeddings.embed import prottrans_bert_bfd_embedder

def main(split):
    
    input_csv = f"preprocessed_data/preprocessed_data/{split}_preprocessed.txt"
    output_protbert = f"./bio_embeddings/protbert_bfd/{split}/"
    os.makedirs(output_protbert, exist_ok=True)
    
    if not os.path.exists(input_csv):
        print(f"No se encuentra el archivo: {input_csv}")
        return

    print(" Cargando modelos...")
    embedder_protbert = prottrans_bert_bfd_embedder.ProtTransBertBFDEmbedder()
    df = pd.read_csv(input_csv, sep=",")

    for _, row in tqdm(df.iterrows(), total=len(df)):
        unique_id = row["Unique_ID"]
        sequence = row["Sequence"]

        try:
            emb_protbert = embedder_protbert.embed(sequence)
            vec_protbert = np.mean(emb_protbert, axis=0)
            np.save(f"{output_protbert}/{unique_id}_protbert.npy", vec_protbert)
            
        except Exception as e:
            print(f" Error con {unique_id}: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] not in {"train", "val", "test"}:
        sys.exit(1)
    split = sys.argv[1]
    main(split)