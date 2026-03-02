#!/usr/bin/env python3
"""
Prepare GloVe embeddings for the Word2Vec Algebra Explorer.

Downloads GloVe 6B 50d, filters to the top N most common words,
computes PCA for 2D projection, and outputs a compact JSON file.

Usage:
  pip install numpy scikit-learn
  python prepare-embeddings.py

Output: ../public/data/embeddings.json
"""

import json
import os
import sys
import zipfile
import urllib.request
from pathlib import Path

import numpy as np
from sklearn.decomposition import PCA

GLOVE_URL = "https://nlp.stanford.edu/data/glove.6B.zip"
GLOVE_FILE = "glove.6B.50d.txt"
MAX_WORDS = 15000
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "data"
OUTPUT_FILE = OUTPUT_DIR / "embeddings.json"
CACHE_DIR = Path(__file__).parent / ".cache"
FLOAT_PRECISION = 4  # decimal places to keep (reduces file size)


def download_glove():
    """Download GloVe if not cached."""
    cache_file = CACHE_DIR / "glove.6B.zip"
    txt_file = CACHE_DIR / GLOVE_FILE

    if txt_file.exists():
        print(f"Using cached {txt_file}")
        return txt_file

    CACHE_DIR.mkdir(parents=True, exist_ok=True)

    if not cache_file.exists():
        print(f"Downloading GloVe from {GLOVE_URL}...")
        print("(This is ~862MB and may take a few minutes)")
        urllib.request.urlretrieve(GLOVE_URL, cache_file)
        print("Download complete.")

    print(f"Extracting {GLOVE_FILE}...")
    with zipfile.ZipFile(cache_file, "r") as zf:
        zf.extract(GLOVE_FILE, CACHE_DIR)

    return txt_file


def load_glove(filepath, max_words):
    """Load GloVe vectors, keeping only the first max_words entries."""
    words = []
    vectors = []

    print(f"Loading top {max_words} words from {filepath}...")
    with open(filepath, "r", encoding="utf-8") as f:
        for i, line in enumerate(f):
            if i >= max_words:
                break
            parts = line.strip().split()
            word = parts[0]
            # Skip words that are purely numeric or contain weird chars
            if not word.isascii():
                continue
            try:
                vec = [float(x) for x in parts[1:]]
                if len(vec) != 50:
                    continue
                words.append(word)
                vectors.append(vec)
            except ValueError:
                continue

    print(f"Loaded {len(words)} words with {len(vectors[0])}D vectors")
    return words, np.array(vectors, dtype=np.float64)


def compute_pca(vectors):
    """Compute PCA to reduce from 50D to 2D."""
    print("Computing PCA (50D -> 2D)...")
    pca = PCA(n_components=2)
    positions_2d = pca.fit_transform(vectors)

    print(f"Explained variance ratio: {pca.explained_variance_ratio_}")
    print(f"Total variance explained: {sum(pca.explained_variance_ratio_):.2%}")

    return positions_2d, pca.components_, pca.mean_


def build_output(words, vectors, positions_2d, pca_components, pca_mean):
    """Build the JSON output structure."""
    print("Building JSON output...")

    def round_list(arr):
        return [round(float(x), FLOAT_PRECISION) for x in arr]

    words_dict = {}
    for i, word in enumerate(words):
        words_dict[word] = {
            "v": round_list(vectors[i]),
            "p": [
                round(float(positions_2d[i][0]), FLOAT_PRECISION),
                round(float(positions_2d[i][1]), FLOAT_PRECISION),
            ],
        }

    return {
        "meta": {
            "dimensions": int(vectors.shape[1]),
            "wordCount": len(words),
            "source": "glove.6B.50d",
            "pcaComponents": [
                round_list(pca_components[0]),
                round_list(pca_components[1]),
            ],
            "pcaMean": round_list(pca_mean),
        },
        "words": words_dict,
    }


def main():
    # Check for numpy and sklearn
    try:
        import numpy
        import sklearn
    except ImportError:
        print("Missing dependencies. Install them with:")
        print("  pip install numpy scikit-learn")
        sys.exit(1)

    # Download and load GloVe
    glove_path = download_glove()
    words, vectors = load_glove(glove_path, MAX_WORDS + 2000)  # load extra to account for filtered words

    # Take only MAX_WORDS
    words = words[:MAX_WORDS]
    vectors = vectors[:MAX_WORDS]

    # Compute PCA
    positions_2d, pca_components, pca_mean = compute_pca(vectors)

    # Build and write output
    output = build_output(words, vectors, positions_2d, pca_components, pca_mean)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False)

    file_size = os.path.getsize(OUTPUT_FILE)
    print(f"\nOutput: {OUTPUT_FILE}")
    print(f"File size: {file_size / 1024 / 1024:.1f} MB")
    print(f"Words: {len(words)}")
    print(f"Done!")


if __name__ == "__main__":
    main()
