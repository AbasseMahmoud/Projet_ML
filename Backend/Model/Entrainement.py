import pandas as pd

def train_model():
    pf = pd.read_csv("Model/creditcarddata.csv")  
    print(pf.head())
   
    return pf.head().to_dict() 
