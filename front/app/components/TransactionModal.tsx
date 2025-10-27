import React, { useState } from 'react';
import axios from 'axios';

const TransactionnelModal = ({ open, onClose, onSave }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [errors, setErrors] = useState({});
  
  if (!open) return null;

  // Fonction de validation des champs
  const validateForm = (formData) => {
    const newErrors = {};
    const requiredFields = [
      'gender', 'age', 'houseTypeID', 'contactAvaliabilityID', 
      'homeCountry', 'accountNo', 'cardExpiryDate', 'transactionAmount',
      'transactionCountry', 'productID', 'cif', 'transactionCurrencyCode'
    ];

    requiredFields.forEach(field => {
      const value = formData.get(field);
      if (!value || value.trim() === '') {
        newErrors[field] = 'Ce champ est obligatoire';
      } else if (field === 'transactionAmount' && parseFloat(value) <= 0) {
        newErrors[field] = 'Le montant doit être supérieur à 0';
      } else if (field === 'age' && (parseInt(value) < 18 || parseInt(value) > 120)) {
        newErrors[field] = 'L\'âge doit être entre 18 et 120 ans';
      }
    });

    return newErrors;
  };

  // Fonction pour analyser la transaction
  const analyzeTransaction = async (transactionData) => {
    setAnalyzing(true);
    try {
      const modelData = mapToModelFeatures(transactionData);
      console.log('Données envoyées au modèle:', modelData);
      
      const response = await axios.post('http://localhost:5000/api/predict', modelData, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.data.success) {
        setPrediction(response.data);
        return response.data;
      } else {
        console.error('Erreur prédiction:', response.data.error);
        throw new Error(response.data.error || 'Erreur de prédiction');
      }
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    } finally {
      setAnalyzing(false);
    }
  };

  // Mapping EXACT selon vos données avec validation
  const mapToModelFeatures = (formData) => {
    // Validation supplémentaire côté client
    const features = {
      Gender: parseInt(formData.gender) || 0,
      Age: parseInt(formData.age) || 0,
      HouseTypeID: parseInt(formData.houseTypeID) || 0,
      ContactAvaliabilityID: parseInt(formData.contactAvaliabilityID) || 0,
      HomeCountry: parseInt(formData.homeCountry) || 0,
      AccountNo: parseInt(formData.accountNo) || 0,
      CardExpiryDate: parseInt(formData.cardExpiryDate) || 0,
      TransactionAmount: parseFloat(formData.transactionAmount) || 0.0,
      TransactionCountry: parseInt(formData.transactionCountry) || 0,
      LargePurchase: parseFloat(formData.transactionAmount) > 1000 ? 1 : 0,
      ProductID: parseInt(formData.productID) || 0,
      CIF: parseInt(formData.cif) || 0,
      TransactionCurrencyCode: parseInt(formData.transactionCurrencyCode) || 0
    };

    // Vérifier qu'aucune valeur n'est NaN
    Object.keys(features).forEach(key => {
      if (isNaN(features[key])) {
        throw new Error(`Valeur invalide pour ${key}`);
      }
    });

    return features;
  };

  // Fonction pour déterminer le statut de fraude
  const getFraudStatus = (predictionData) => {
    if (!predictionData) return { isFraud: false, status: 'Indéterminé', color: 'gray' };
    
    const isFraud = predictionData.prediction === 1;
    const probability = predictionData.probability_fraud * 100;
    
    if (isFraud) {
      return {
        isFraud: true,
        status: 'FRAUDE DÉTECTÉE',
        color: 'red',
        icon: '',
        description: 'Transaction suspecte - Intervention requise'
      };
    } else {
      return {
        isFraud: false,
        status: 'TRANSPARENT',
        color: 'green',
        icon: '',
        description: 'Transaction sécurisée'
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Validation des champs
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Réinitialiser les erreurs
    setErrors({});

    const transactionData = {
      gender: formData.get('gender'),
      age: formData.get('age'),
      houseTypeID: formData.get('houseTypeID'),
      contactAvaliabilityID: formData.get('contactAvaliabilityID'),
      homeCountry: formData.get('homeCountry'),
      accountNo: formData.get('accountNo'),
      cardExpiryDate: formData.get('cardExpiryDate'),
      transactionAmount: formData.get('transactionAmount'),
      transactionCountry: formData.get('transactionCountry'),
      productID: formData.get('productID'),
      cif: formData.get('cif'),
      transactionCurrencyCode: formData.get('transactionCurrencyCode')
    };

    try {
      // Analyser la transaction
      const fraudPrediction = await analyzeTransaction(transactionData);
      
      // Sauvegarder avec prédiction
      const transactionWithPrediction = {
        ...transactionData,
        fraudPrediction: fraudPrediction || {
          prediction: 0,
          probability_fraud: 0,
          risk_level: 'FAIBLE'
        },
        analyzedAt: new Date().toISOString()
      };

      onSave(transactionWithPrediction);
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
     
    }
  };

  // Fonction pour gérer le changement des champs et effacer les erreurs
  const handleInputChange = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  // Composant de champ avec validation
  const FormField = ({ name, label, type = "number", placeholder, step, min, max }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label} {errors[name] && <span className="text-red-500 text-xs">*</span>}
      </label>
      <input 
        name={name} 
        type={type}
        step={step}
        min={min}
        max={max}
        placeholder={placeholder} 
        className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
          errors[name] ? 'border-red-300 bg-red-50' : 'border-slate-200'
        }`}
        onChange={() => handleInputChange(name)}
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1 flex items-center">
          <span className="mr-1">⚠️</span>
          {errors[name]}
        </p>
      )}
    </div>
  );

  const fraudStatus = prediction ? getFraudStatus(prediction) : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Formulaire de detection des fraudes</h2>
            <p className="text-slate-500">Détection de fraude en temps réel</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message d'erreur global */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-2 text-red-700">
              <span>⚠️</span>
              <p className="font-medium">Veuillez corriger les erreurs ci-dessous avant de continuer</p>
            </div>
          </div>
        )}

        {/* Résultat de l'analyse */}
        {prediction && (
          <div className={`mb-6 p-6 rounded-2xl border-l-4 ${
            fraudStatus.isFraud 
              ? 'bg-red-50 border-red-500 shadow-lg shadow-red-100' 
              : 'bg-green-50 border-green-500 shadow-lg shadow-green-100'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full text-2xl ${
                  fraudStatus.isFraud ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {fraudStatus.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-2 ${
                    fraudStatus.isFraud ? 'text-red-800' : 'text-green-800'
                  }`}>
                    {fraudStatus.status}
                  </h3>
                  <p className={`text-lg font-semibold mb-1 ${
                    fraudStatus.isFraud ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {fraudStatus.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-sm text-slate-600">Probabilité de fraude</p>
                      <p className={`text-lg font-bold ${
                        fraudStatus.isFraud ? 'text-red-700' : 'text-green-700'
                      }`}>
                        {(prediction.probability_fraud * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Décision du modèle</p>
                      <p className={`text-lg font-bold ${
                        fraudStatus.isFraud ? 'text-red-700' : 'text-green-700'
                      }`}>
                        {fraudStatus.isFraud ? 'FRAUDE' : 'NORMAL'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                fraudStatus.isFraud 
                  ? 'bg-red-100 text-red-800 border border-red-300' 
                  : 'bg-green-100 text-green-800 border border-green-300'
              }`}>
                {prediction.risk_level}
              </span>
            </div>
            
            {/* Message d'alerte supplémentaire pour les fraudes */}
            {fraudStatus.isFraud && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-red-600">⚠️</span>
                  <p className="text-red-700 font-medium text-sm">
                    Alerte : Cette transaction présente des caractéristiques suspectes. 
                    Recommandation : Vérification manuelle requise.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Informations Client */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Informations Client</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField 
                name="gender"
                label="Gender"
                placeholder="0"
                min="0"
                max="1"
              />
              <FormField 
                name="age"
                label="Age"
                placeholder="56"
                min="18"
                max="120"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField 
                name="houseTypeID"
                label="House Type ID"
                placeholder="1"
                min="0"
              />
              <FormField 
                name="contactAvaliabilityID"
                label="Contact Availability ID"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Section Localisation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Localisation</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField 
                name="homeCountry"
                label="Home Country"
                placeholder="1"
                min="0"
              />
              <FormField 
                name="transactionCountry"
                label="Transaction Country"
                placeholder="1"
                min="0"
              />
            </div>
          </div>

          {/* Section Compte et Transaction */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Compte & Transaction</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField 
                name="accountNo"
                label="Account No"
                placeholder="1109976"
                min="0"
              />
              <FormField 
                name="cardExpiryDate"
                label="Card Expiry Date"
                placeholder="1811"
                min="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField 
                name="transactionAmount"
                label="Transaction Amount"
                type="number"
                step="0.0001"
                placeholder="0.0062"
                min="0.0001"
              />
              <FormField 
                name="productID"
                label="Product ID"
                placeholder="3"
                min="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField 
                name="cif"
                label="CIF"
                placeholder="11020290"
                min="0"
              />
              <FormField 
                name="transactionCurrencyCode"
                label="Currency Code"
                placeholder="1"
                min="0"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-200">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 text-slate-600 hover:text-slate-700 font-medium transition-colors duration-200"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={analyzing}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyse en cours...</span>
                </>
              ) : (
                <span>Analyser la transaction</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionnelModal;