from sqlalchemy import create_engine, text
import pandas as pd

import os

# Access the environment variable
DATABASE_URL = os.environ.get('DATABASE_URL')

def pull_sql_data():
    query = "SELECT * FROM "
    db_string = DATABASE_URL 
    engine = create_engine(db_string)

    products = pd.read_sql(query + "public.products", engine)

    product_deploy_columns = list(products.columns)

    products['merge'] = 1
    products = products.rename(columns = {'hobbies_interests' : 'product_hobbies_interests', 'tags_sort' : 'product_tags_sort'})

    engine.dispose()

    return products, product_deploy_columns