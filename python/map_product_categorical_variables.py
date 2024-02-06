import pickle as pkl
import numpy as np

with open('product_categorical_dictionary.pkl', 'rb') as file:
    product_categorical_dictionary = pkl.load(file)

with open('product_categorical_split_dictionary.pkl', 'rb') as file:
    product_categorical_split_dictionary = pkl.load(file)

with open('categorical_variable_dict.pkl', 'rb') as file:
    categorical_variable_dict = pkl.load(file)

def map_product_categorical_variables(product_df, full_df):
    product_category_vars = ['category', 'gender', 'who_ind', 'occasion']
    product_category_split_vars = ['gift_type', 'product_hobbies_interests', 'product_tags_sort']

    for p in product_category_vars:
        col_nm = 'product_category_' + p
        product_df[col_nm] = product_df[p].map(product_categorical_dictionary[p])
        full_df[col_nm] = full_df.product_id.map(dict(zip(product_df.product_id, product_df[col_nm])))

    for s in product_category_split_vars:
        for product_id, c in zip(product_df.product_id, product_df[s]):
            try:
                cat_list = c.split(',')
                for cat in cat_list:
                    product_categorical_split_dictionary[s][cat].update({product_id : 1})
            except:
                pass

    for i in product_categorical_split_dictionary.keys():
        for k in product_categorical_split_dictionary[i].keys():
            col_nm = 'product_category_' + i + '_' + k
            product_df[col_nm] = product_df.product_id.map(product_categorical_split_dictionary[i][k])
            product_df[col_nm] = np.where(product_df[col_nm].isnull() == True, 0, product_df[col_nm])
    
    for i in product_df.columns:
        if 'product_category' in i:
            full_df[i] = full_df.product_id.map(dict(zip(product_df.product_id, product_df[i])))

    for c in categorical_variable_dict.keys():
        col_nm = c + '_id'
        full_df[col_nm] = full_df[c].map(categorical_variable_dict[c])

    for cat_id in ['who_id', 'gender_id', 'occasion_id', 'age_id']:
        full_df[cat_id] = np.where(full_df[cat_id].isnull() == True, 4, full_df[cat_id])

    return full_df

