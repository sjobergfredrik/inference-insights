# Inference Insights

Interaktiva verktyg för att utforska hur AI-modeller arbetar med språk. Byggt för föreläsningar och workshops vid Uppsala universitet.

## Verktyg

### Token-sannolikheter (`/tokens`)
Chatta med en AI och se hur säker modellen är på varje ord den väljer. Färgkodade tokens (röd → grön), steg-för-steg-läge med sannolikhetsdiagram, och temperaturvisualisering.

### Word2Vec Algebra (`/vectors`)
Utforska hur ord representeras som vektorer i ett matematiskt rum. Gör beräkningar som *king − man + woman = queen* med riktiga GloVe-embeddings (15 000 ord, 50 dimensioner).

## Kom igång

```bash
# Installera beroenden
npm install

# Generera ordvektorer (kräver Python 3 + numpy + scikit-learn)
pip install numpy scikit-learn
python scripts/prepare-embeddings.py

# Skapa .env med din OpenAI-nyckel (behövs för token-verktyget)
cp .env.example .env
# Redigera .env och lägg till OPENAI_API_KEY

# Starta dev-server (Vite + Express)
npm run dev
```

Öppna http://localhost:5173

## Stack

- Vite + React 19 + TypeScript + Tailwind CSS v4
- Express 5 (backend för OpenAI API)
- D3.js (vektorvisualisering) + Recharts (sannolikhetsdiagram)
- GloVe 6B 50d (riktiga ordvektorer med PCA-projektion)
