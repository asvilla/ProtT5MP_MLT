# Embeddings
La carpeta `/dev/embeddings` contiene los diferentes archivos .`ipynb` y .`py` utilizados para realizar los embeddings asociados a los experientos del proyecto.

Se realizaron 2 tipos de embeddings: estructura y secuencia.

#### Secuencia
* SeqVec
* ProtT5-XL-U50
* ProtBert-BFD

#### Estructura
* Prost5

### SeqVec.py

    En este archivo se generan embeddings con Seqvec [1]
    
### ProtBert.py
    En este archivo se generan embeddings con ProtBert-BFD [2]
    
### ProtT5_XL_U50.py
    En este archivo se generan embeddings con ProtT5-XL-U50 [2]
    
### Foldseek_3di.py
    Para poder realizar el embedding con Prost5 se debe tener como archivo de entrada en vez de archivo PDB una secuencia 3DI, en este codigo se hace la transformación de formato con Foldseek [3]
    
### Prost5.ipynb
    En este archivo se generan embeddings con Prost5 [4]

## Referencias
[1] Heinzinger, M., Elnaggar, A., Wang, Y., Dallago, C., Nechaev, D., Matthes, F., & Rost, B. (2019). Modeling aspects of the language of life through transfer-learning protein sequences. BMC Bioinformatics, 20(1), 1–17. https://doi.org/10.1186/S12859-019-3220-8/FIGURES/5

[2] Elnaggar, A., Heinzinger, M., Dallago, C., Rehawi, G., Wang, Y., Jones, L., Gibbs, T., Feher, T., Angerer, C., Steinegger, M., Bhowmik, D., & Rost, B. (2022). ProtTrans: Toward Understanding the Language of Life Through Self-Supervised Learning. IEEE Transactions on Pattern Analysis and Machine Intelligence, 44(10), 7112–7127. https://doi.org/10.1109/TPAMI.2021.3095381

[3] van Kempen, M., Kim, S. S., Tumescheit, C., Mirdita, M., Lee, J., Gilchrist, C. L. M., Söding, J., & Steinegger, M. (2024). Fast and accurate protein structure search with Foldseek. Nature Biotechnology, 42(2), 243–246. https://doi.org/10.1038/S41587-023-01773-0;SUBJMETA=114,535,631,794;KWRD=COMPUTATIONAL+BIOLOGY+AND+BIOINFORMATICS,SOFTWARE,STRUCTURAL+BIOLOGY

[4] Heinzinger, M., Weissenow, K., Sanchez, J. G., Henkel, A., Mirdita, M., Steinegger, M., & Rost, B. (2024). Bilingual language model for protein sequence and structure. NAR Genomics and Bioinformatics, 6(4), 150. https://doi.org/10.1093/NARGAB/LQAE150





