from sqlalchemy import create_engine, text
import pandas as pd

def pull_sql_data():
    host = """ec2-54-83-138-228.compute-1.amazonaws.com"""
    database = """db3p12kidckcnn"""
    user = """xmkfvpotxjhkqj"""
    password = """62c24155350158f58645db4c24b90dcfd4daeefa9e52b14d7ba13438ead3e627"""
    port = "5432"

    query = "SELECT * FROM "

    db_string = "postgresql+psycopg2://xmkfvpotxjhkqj:62c24155350158f58645db4c24b90dcfd4daeefa9e52b14d7ba13438ead3e627@ec2-54-83-138-228.compute-1.amazonaws.com:5432/db3p12kidckcnn"
    engine = create_engine(db_string)

    products = pd.read_sql(query + "public.products", engine)

    product_deploy_columns = list(products.columns)

    products['merge'] = 1
    products = products.rename(columns = {'hobbies_interests' : 'product_hobbies_interests', 'tags_sort' : 'product_tags_sort'})

    engine.dispose()

    return products, product_deploy_columns