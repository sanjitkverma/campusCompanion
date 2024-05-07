'''
Author: [Meles Meles]

A constants file which contains the global variables used in the engine.
'''

DATA_DIR = "data"  # directory containing the documents to index
CHUNK_SIZE = 1024   # number of characters in each chunk
CHUNK_OVERLAP = 30  # number of characters to overlap chunks
SENTENCE_WINDOW_SIZE=10 # number of sentences to consider in each window
TEMP = 0.0 # temperature for response control for the LLM