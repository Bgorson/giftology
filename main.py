import ast
import datetime
import pandas as pd
import numpy as np
import psycopg2
from sqlalchemy import create_engine, text
import xgboost as xgb
import plotly.express as px
from fuzzywuzzy import fuzz
from sklearn.preprocessing import MinMaxScaler
import pickle as pkl
import json
import os
import sys

#unitz = ['809bf3d7-d03f-4009-ac07-d3810aadc00b', '9f34dd20-e036-4f64-a435-a87b741f9714', '03f7b677-f7bd-482a-9cb1-1c483b2bd9f9', '653c64b5-2256-4d37-88ff-d801823ec7d3',
#         'e0376ab7-79ab-47e1-bf91-2f21f046e22e', 'd2fd8745-4ae0-4745-a0e4-f91cd9743d3e', '579c41c5-2c70-481f-8f1a-cec2afa7cf80', '90efc6e2-b462-4842-b981-5f906348f344',
#         'd83d641a-77b2-49b6-a80d-29297b4dee66', 'fb5523e3-0acc-458a-9f0d-c59fbb0d2ec6',]

# query = "SELECT * FROM "


def calculate_similarity(df, input_column, sim_columns):
    col_nm = input_column + '_' + sim_columns + '_similarity'
    sim_dict = {}
    df = df.reset_index(drop = True)
    df['idx'] = df.index
    df[input_column] = df[input_column].astype(str)
    df[sim_columns] = df[sim_columns].astype(str)
    
    for idx, input_col, sim_col in zip(df.idx, df[input_column], df[sim_columns]):
        score = fuzz.token_sort_ratio(input_col, sim_col)
        sim_dict.update({idx : score})
        
    df[col_nm] = df.idx.map(sim_dict)
    
    return df

def main():
    db_string = os.environ.get('DATABASE_URL')
    script_directory = os.path.dirname(os.path.abspath(__file__))
    hobby_dict_path = os.path.join(script_directory, 'hobby_dict.pkl')
    tag_dict_path = os.path.join(script_directory, 'tag_dict.pkl')
    product_categorical_dictionary_path = os.path.join(script_directory, 'product_categorical_dictionary.pkl')
    product_categorical_split_dictionary_path = os.path.join(script_directory, 'product_categorical_split_dictionary.pkl')
    cat_vars_path = os.path.join(script_directory, 'cat_vars.pkl')
    giftology_xgboost_path = os.path.join(script_directory, 'giftology_xgboost.pkl')

    with open(hobby_dict_path, 'rb') as file:
        hobby_dict = pkl.load(file)
    with open(tag_dict_path, 'rb') as file:
        tag_dict = pkl.load(file)
    with open(product_categorical_dictionary_path, 'rb') as file:
        product_categorical_dictionary = pkl.load(file)
    with open(product_categorical_split_dictionary_path, 'rb') as file:
        product_categorical_split_dictionary = pkl.load(file)
    with open(cat_vars_path, 'rb') as file:
        cat_vars = pkl.load(file)
    with open(giftology_xgboost_path, 'rb') as file:
        giftology_xgboost = pkl.load(file)
    engine = create_engine(db_string)

    #quizs = pd.read_sql(query + 'public.quizs', engine)
    #quizs = quizs[quizs['quiz_id'].isin(unitz)].reset_index(drop = True)
    json_object = ast.literal_eval(sys.argv[1])

    quizs = pd.DataFrame([json_object])

    products = pd.read_sql('SELECT * FROM public.products', engine)
    products = products.rename(columns = {'hobbies_interests' : 'product_hobbies_interests', 'tags_sort' : 'product_tags_sort'})
    product_deploy_columns = products.columns

    engine.dispose()

    for quiz_id, hobby in zip(quizs.quiz_id, quizs.hobbies):
        if hobby is not None:
            if isinstance(hobby, list):
                hobby_list = hobby
            else:
                hobby_list = [hobby]

            for h in hobby_list:
                if h not in hobby_dict.keys():
                    hobby_dict.update({h: {quiz_id: 1}})
                    hobby_dict.update({h: {}})
                else:
                    hobby_dict[h].update({quiz_id: 1})

    for quiz_id, tag in zip(quizs.quiz_id, quizs.tags):
        if tag is not None:
            if isinstance(tag, list):
                tag_list = tag
            else:
                tag_list = [tag]

            for t in tag_list:
                if t not in tag_dict.keys():
                    tag_dict.update({t: {quiz_id: 1}})
                    tag_dict.update({t: {}})
                else:
                    tag_dict[t].update({quiz_id: 1})


    for h in hobby_dict.keys():
        quizs[h] = quizs.quiz_id.map(hobby_dict[h])
        quizs[h] = np.where(quizs[h].isnull() == True, 0, 1)
        quizs[h] = quizs[h].astype('category')

    for h in tag_dict.keys():
        quizs[h] = quizs.quiz_id.map(tag_dict[h])
        quizs[h] = np.where(quizs[h].isnull() == True, 0, 1)
        quizs[h] = quizs[h].astype('category')

    quizs['big_merge'] = 1
    products['big_merge'] = 1

    products = products.rename(columns = {'hobbies_interests' : 'product_hobbies_interests', 'tags_sort' : 'product_tags_sort'})

    modeling_df = pd.merge(quizs, products[['product_id', 'big_merge', 'product_hobbies_interests', 'product_tags_sort', 'product_name']], on = ['big_merge'], how = 'inner')
    modeling_df = modeling_df.drop(columns = ['big_merge'])
    modeling_df['base_price'] = modeling_df.product_id.map(dict(zip(products.product_id, products.product_base_price)))
    modeling_df['age_min'] = modeling_df.product_id.map(dict(zip(products.product_id, products.age_min)))
    modeling_df['age_max'] = modeling_df.product_id.map(dict(zip(products.product_id, products.age_max)))
    modeling_df['gender'] = quizs['gender']
    categorical_variable_dict = {'who' : {'myself' : 0, 'relative' : 1, 'friend' : 2, 'spouse' : 3},
                                 'gender' : {'female' : 0, 'male' : 1, 'ratherNot' : 2},
                                 'occasion' : {'holiday' : 0, 'birthday' : 1, 'any' : 3, 'whiteElephant' : 4},
                                 'age' : {'12-20' : 0, '21-44' : 1, '45-65' : 2, '6-11' : 3, '65-100' : 4, '0-2' : 5}}
    for c in categorical_variable_dict.keys():
        col_nm = 'product_category_' + c
        modeling_df[col_nm] = modeling_df[c].map(categorical_variable_dict[c])
    product_category_vars = ['category', 'gender', 'who_ind', 'occasion']
    product_category_split_vars = ['gift_type', 'product_hobbies_interests', 'product_tags_sort']

    for p in product_category_vars:
        col_nm = 'product_category_' + p
        products[col_nm] = products[p].map(product_categorical_dictionary[p])
        modeling_df[col_nm] = modeling_df.product_id.map(dict(zip(products.product_id, products[col_nm])))


    for s in product_category_split_vars:
        for product_id, c in zip(products.product_id, products[s]):
            try:
                cat_list = c.split(',')
                for cat in cat_list:
                    product_categorical_split_dictionary[s][cat].update({product_id : 1})
            except:
                pass

    for i in product_categorical_split_dictionary.keys():
        for k in product_categorical_split_dictionary[i].keys():
            col_nm = 'product_category_' + i + '_' + k
            products[col_nm] = products.product_id.map(product_categorical_split_dictionary[i][k])
            products[col_nm] = np.where(products[col_nm].isnull() == True, 0, products[col_nm])
        
    for i in products.columns:
        if 'product_category' in i:
            modeling_df[i] = modeling_df.product_id.map(dict(zip(products.product_id, products[i])))

 
    
    for c in categorical_variable_dict.keys():
        col_nm = c + '_id'
        modeling_df[col_nm] = modeling_df[c].map(categorical_variable_dict[c])


    modeling_df['who_id'] = np.where(modeling_df['who_id'].isnull() == True, 4, modeling_df['who_id'])
    modeling_df['gender_id'] = np.where(modeling_df['gender_id'].isnull() == True, 3, modeling_df['gender_id'])
    modeling_df['occasion_id'] = np.where(modeling_df['occasion_id'].isnull() == True, 5, modeling_df['occasion_id'])
    modeling_df['age_id'] = np.where(modeling_df['age_id'].isnull() == True, 6, modeling_df['age_id'])

    modeling_df['hour_of_day'] = pd.to_datetime(modeling_df.created_at).dt.hour

    for c in cat_vars:
        modeling_df[c] = modeling_df[c].astype('category')

    modeling_df = pd.merge(modeling_df, products[['product_id', 'tags_display', 'gender', 'who_ind', 'occasion']].rename(columns = {'gender' : 'product_gender',
                                                                                                                                    'occasion' : 'product_occasion'}),
                           on = ['product_id'],
                           how = 'inner')
    
    modeling_df['product_age'] = modeling_df['age_min'].astype(str) + '-' + modeling_df['age_max'].astype(str)
    modeling_df['product_age_similarity'] = np.where(modeling_df['age'] == modeling_df['product_age'], 1, 0)

    modeling_df['occasion_similarity'] = np.where(modeling_df['occasion'] == modeling_df['product_occasion'], 1, 0)
    modeling_df = calculate_similarity(modeling_df, 'hobbies', 'product_hobbies_interests')
    modeling_df = calculate_similarity(modeling_df, 'hobbies', 'product_tags_sort')
    modeling_df = calculate_similarity(modeling_df, 'tags', 'product_hobbies_interests')
    modeling_df = calculate_similarity(modeling_df, 'tags', 'product_tags_sort')
    modeling_df['gender_similarity'] = np.where(modeling_df['gender'] == modeling_df['product_gender'], 1, 0)

    modeling_df['relevance_predictions'] = giftology_xgboost.predict(xgb.DMatrix(modeling_df[giftology_xgboost.feature_names], enable_categorical = True))

    sim_vars = ['product_age_similarity', 'occasion_similarity', 'hobbies_product_hobbies_interests_similarity', 'hobbies_product_tags_sort_similarity',
                'tags_product_hobbies_interests_similarity', 'tags_product_tags_sort_similarity', 'gender_similarity', 'relevance_predictions']
    
    scaler = MinMaxScaler()

    for s in sim_vars:
        modeling_df[s] = scaler.fit_transform(modeling_df[[s]])
    
    modeling_df['new_relevance_predictions'] = modeling_df[sim_vars].sum(axis = 1)
    modeling_df['new_relevance_predictions'] = scaler.fit_transform(modeling_df[['new_relevance_predictions']])

    modeling_df = modeling_df.drop(columns = ['relevance_predictions'])
    modeling_df = modeling_df.rename(columns = {'new_relevance_predictions' : 'score'})

    return_df = modeling_df[['product_id', 'score']]
    return_df = return_df.sort_values(by = ['score'], ascending = (False)).reset_index(drop = True)
    return_df = pd.merge(return_df, products[product_deploy_columns], on = 'product_id', how = 'inner')
    return_df = return_df.rename(columns = {'product_hobbies_interests' : 'hobbies_interests',
                                            'product_tags_sort' : 'tags_sort'})
    
    try:
        print(json.dumps(return_df.to_dict('records')))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
if __name__ == "__main__":
    result = main()
