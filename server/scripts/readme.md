# Population Scripts

The population scripts use data information from official databases to seed our own in order not to exceed api query limits enforced by these services and to also easily parse only the necessary information that we need.
Below are the sources with the download link for independent parsing and use. Each population script should be run individually

**FoodData_Central_branded_food_json_2025-04-24.json:** Branded FoodDb can be downloaded from [here](https://fdc.nal.usda.gov/download-datasets)

**Food.json:** FoodDb json file can be downloaded from [here](https://foodb.ca/downloads)

CompareDb files can be downloaded from [here](https://hesiglobal.org/compare2025-download)

**Root directory:** `server`

Script to populate mongoDB with branded foods

```
node ./scripts/population/brand.js
```

Script to combine foods from the Food.json and the allergenic foods database to create the final_foods.json. Manual editing of some food items will then be needed to remove foods that might fall under food products rather than food ingredients, such as tostada shell, wonton wrappers etc.
```
node ./scripts/ingred.js
```

Script to populate the foods from the final_foods into the mongoDB database
```
node ./scripts/population/ingredPop.js
```

### Branded foods population

### Script running order

# Protein sequence comparison

Utilizes the BLAST+ comparison tool from [NCBI](https://ftp.ncbi.nlm.nih.gov/blast/executables/blast+/LATEST)
Specifically BLASTP for protein comparisons based on local alignment


Installation

```
wget https://ftp.ncbi.nlm.nih.gov/blast/executables/blast+/LATEST/ncbi-blast-2.17.0+-x64-linux.tar.gz

tar -xvzf ncbi-blast-2.17.0+-x64-linux.tar.gz
```

Additional dependency needed

```
sudo apt install libgomp1 -y
```

the following command should then work

```
blastp -version
```

Utilization is to turn the COMPARE FASTA prrotein sequence file into a blast db

```
makeblastdb -in COMPARE2025-FastA-Seq-01-27-2025.txt -dbtype prot -out compare2025_proteins
```

Then run a BLASTP comparison of the database against itself to find all the similar proteins

```
blastp -query COMPARE2025-FastA-Seq-01-27-2025.txt \
       -db compare2025_proteins \
       -outfmt "6 qseqid sseqid pident length mismatch gapopen qstart qend sstart send evalue bitscore" \
       -out crossreac.tsv
```

after getting all the crossreaction similarities combine them into a json with the food item names

```
node ./scripts/compare.js
```

