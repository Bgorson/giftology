
def map_product_info(df, product_column, variable_list, product_df):
    for v in variable_list:
        df[v] = df[product_column].map(dict(zip(product_df[product_column], product_df[v])))

    return df
