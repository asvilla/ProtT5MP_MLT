import os
import sys
import re
import numpy as np
import pandas as pd
from tqdm.auto import tqdm
from bio_embeddings.embed import seqvec_embedder

def main(split):
    
    input_csv = f"preprocessed_data/preprocessed_data/{split}_preprocessed.txt"
    output_seqvec = f"./bio_embeddings/seqvec/{split}/"
    os.makedirs(output_seqvec, exist_ok=True)

    if not os.path.exists(input_csv):
        print(f"No se encuentra el archivo: {input_csv}")
        return

    print(" Cargando modelos...")
    embedder_seqvec = seqvec_embedder.SeqVecEmbedder()
    df = pd.read_csv(input_csv, sep=",")

    for _, row in tqdm(df.iterrows(), total=len(df)):
        unique_id = row["Unique_ID"]
        sequence = row["Sequence"]

        try:
            emb_seqvec = embedder_seqvec.embed(sequence)
            vec_seqvec = embedder_seqvec.reduce_per_protein(emb_seqvec)
            np.save(f"{output_seqvec}/{unique_id}_seqvec.npy", vec_seqvec)

        except Exception as e:
            print(f" Error con {unique_id}: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2 or sys.argv[1] not in {"train", "val", "test"}:
        sys.exit(1)
    split = sys.argv[1]
    main(split)