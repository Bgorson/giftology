import os
import pickle as pkl
import xgboost as xgb

# Get the absolute path of the current script's directory
script_directory = os.path.dirname(os.path.abspath(__file__))

# Use absolute path for loading the pickle file
model_path = os.path.join(script_directory, 'giftology_xgboost.pkl')

with open(model_path, 'rb') as file:
    giftology_xgboost = pkl.load(file)

def make_predictions(df):
    df['relevance_predictions'] = giftology_xgboost.predict(xgb.DMatrix(df[giftology_xgboost.feature_names], enable_categorical=True))
    return df
