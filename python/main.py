import os
import datetime
import json
import pandas as pd
import pickle as pkl
from json_to_pandas import json_to_pandas
from pull_product_info import pull_sql_data
from map_product_info import map_product_info
from map_product_categorical_variables import map_product_categorical_variables
from make_predictions import make_predictions

working_directory = os.getcwd()

def main(json_object):

    with open(working_directory + '/hobby_dict.pkl', 'rb') as file:
        hobby_dict = pkl.load(file)

    with open(working_directory + '/tag_dict.pkl', 'rb') as file:
        tag_dict = pkl.load(file)

    data_dictionary = json.loads(json_object)
    
    quizs = pd.DataFrame.from_dict(json_object, 'index').T
    quizs['merge'] = 1
    user_hobbies = quizs.hobbies.iloc[0]
    user_tags = quizs.tags.iloc[0]
    products, product_deploy_columns = pull_sql_data()

    for hobby in hobby_dict.keys():
        if hobby in user_hobbies:
            quizs[hobby] = 1
        else:
            quizs[hobby] = 0
    
        quizs[hobby] = quizs[hobby].astype('category')

    for tag in tag_dict.keys():
        if tag in user_tags:
            quizs[tag] = 1
        else:
            quizs[tag] = 0

        quizs[tag] = quizs[tag].astype('category')

    modeling_df = pd.merge(quizs, products[['product_id', 'merge', 'product_hobbies_interests', 'product_tags_sort']], on = ['merge'], how = 'inner')

    modeling_df = map_product_info(modeling_df, 'product_id', ['product_base_price',
                                                            'age_min',
                                                            'age_max'],
                                                            products)

    modeling_df = modeling_df.rename(columns = {'product_base_price' : 'base_price'})
    modeling_df = map_product_categorical_variables(products, modeling_df)
    #modeling_df['created_at'] = datetime.datetime.utcnow()
    modeling_df['hour_of_day'] = pd.to_datetime(modeling_df.created_at).dt.hour
    modeling_df = make_predictions(modeling_df)
    modeling_df = modeling_df.sort_values(by = ['relevance_predictions'], ascending = (False)).reset_index(drop = True)
    return_df = modeling_df[['product_id', 'relevance_predictions']].rename(columns = {'relevance_predictions' : 'relevance_score'})
    return_df = pd.merge(return_df,
                        products.rename(columns = {'product_hobbies_interests' : 'hobbies_interests',
                                                    'product_tags_sort' : 'tags_sort'})[product_deploy_columns],
                                                    on = 'product_id',
                                                    how = 'inner')
    
    return return_df.to_dict('records')
