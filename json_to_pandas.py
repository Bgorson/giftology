import pandas as pd
import json
import numpy as np

def json_to_pandas(json_object):
    df = pd.DataFrame.from_dict(json_object, 'index').T
    df['big_merge'] = 1
    
    return df