import joblib as jb
import pandas as pd

# Chargez le nouveau modèle
model = jb.load("Model/best_model.pkl")

# Votre transaction problématique
transaction_test = pd.DataFrame([{
    'Gender': 0, 
    'Age': 56, 
    'HouseTypeID': 1, 
    'ContactAvaliabilityID': 0,
    'HomeCountry': 1, 
    'AccountNo': 1109976, 
    'CardExpiryDate': 1811,
    'TransactionAmount': 0.0062, 
    'TransactionCountry': 1, 
    'LargePurchase': 0,
    'ProductID': 3, 
    'CIF': 11020290, 
    'TransactionCurrencyCode': 1
}])

print("🧪 TEST DE LA TRANSACTION PROBLÉMATIQUE:")
print("Données:", transaction_test.iloc[0].to_dict())

# Prédiction
prediction = model.predict(transaction_test)[0]
probability = model.predict_proba(transaction_test)[0]

print(f"\n📊 RÉSULTATS:")
print(f"Prediction: {prediction} ({'FRAUDE' if prediction == 1 else 'TRANSACTION NORMALE'})")
print(f"Probabilité: Normale={probability[0]:.3f}, Fraude={probability[1]:.3f}")

# Testez aussi avec un montant plus réaliste
transaction_normal = transaction_test.copy()
transaction_normal['TransactionAmount'] = 50.0  # Montant normal

prediction_normal = model.predict(transaction_normal)[0]
probability_normal = model.predict_proba(transaction_normal)[0]

print(f"\n🧪 COMPARAISON - Montant 50.0€:")
print(f"Prediction: {prediction_normal} ({'FRAUDE' if prediction_normal == 1 else 'TRANSACTION NORMALE'})")
print(f"Probabilité: Normale={probability_normal[0]:.3f}, Fraude={probability_normal[1]:.3f}")