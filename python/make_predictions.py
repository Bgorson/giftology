import pickle as pkl
import xgboost as xgb

with open('giftology_xgboost.pkl', 'rb') as file:
    giftology_xgboost = pkl.load(file)

def make_predictions(df):
    df['relevance_predictions'] = giftology_xgboost.predict(xgb.DMatrix(df[giftology_xgboost.feature_names], enable_categorical = True))

    return df