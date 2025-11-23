import React, { useState } from 'react';
import axios from 'axios';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (result?: TransactionResult) => void;
}

// Interface pour la prédiction
interface PredictionData {
  prediction: number;
  probability_fraud: number;
}

// Interface pour le résultat
interface TransactionResult {
  transactionData: any;
  type: 'transaction' | 'fraude';
  probability: number;
  prediction: PredictionData | null;
}

const TransactionnelModal: React.FC<TransactionModalProps> = ({ open, onClose, onSave }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  if (!open) return null;

  // Validation simple - seulement champs obligatoires
  const validateForm = (formData: FormData): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    const requiredFields = [
      'gender', 'age', 'houseTypeID', 'contactAvaliabilityID',
      'homeCountry', 'accountNo', 'cardExpiryDate', 'transactionAmount',
      'transactionCountry', 'productID', 'cif', 'transactionCurrencyCode'
    ];

    requiredFields.forEach(field => {
      const value = formData.get(field) as string | null;
      if (!value || value.trim() === '') {
        newErrors[field] = 'Ce champ est obligatoire';
      }
    });

    return newErrors;
  };

  // Mapping des données
  const mapToModelFeatures = (formData: any) => {
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

    return features;
  };

  // Fonction pour analyser la transaction
  const analyzeTransaction = async (transactionData: Record<string, any>): Promise<PredictionData> => {
    setAnalyzing(true);
    try {
      const modelData = mapToModelFeatures(transactionData);
      console.log('Données envoyées au modèle:', modelData);
      
      const response = await axios.post('https://projet-ml-uxvm.onrender.com/api/predict', modelData, {
        timeout: 30000,
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('Réponse API:', response.data);
      
      if (response.data && response.data.success) {
        const predictionData: PredictionData = {
          prediction: response.data.prediction,
          probability_fraud: response.data.probability_fraud
        };
        
        setPrediction(predictionData);
        return predictionData;
      } else {
        throw new Error('Erreur de prédiction: ' + (response.data?.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    } finally {
      setAnalyzing(false);
    }
  };

  // ✅ CORRECTION : Seuil à 50% au lieu de 15%
  // const getTransactionType = (predictionData: PredictionData | null): 'transaction' | 'fraude' => {
  //   if (!predictionData) return 'transaction';
    
  //   console.log('🔍 Analyse de la prédiction:', {
  //     prediction: predictionData.prediction,
  //     probability_fraud: predictionData.probability_fraud,
  //     interpretation: predictionData.prediction === 1 ? 'FRAUDE (PotentialFraud=1)' : 'TRANSACTION (PotentialFraud=0)'
  //   });
    
  //   // ✅ CORRECTION : Seuil à 50% pour éviter les faux positifs
  //   const isFraudByPrediction = predictionData.prediction === 1;
  //   const isFraudByProbability = predictionData.probability_fraud > 0.50; // Seuil à 50%
    
  //   console.log('📊 Décision:', {
  //     isFraudByPrediction,
  //     isFraudByProbability,
  //     finalDecision: (isFraudByPrediction || isFraudByProbability) ? 'FRAUDE' : 'TRANSACTION'
  //   });
    
  //   return (isFraudByPrediction || isFraudByProbability) ? 'fraude' : 'transaction';
  // };

  const getTransactionType = (predictionData: PredictionData | null): 'transaction' | 'fraude' => {
  if (!predictionData) return 'transaction';

  const seuil = 0.70;

  const isHighProb = predictionData.probability_fraud >= seuil;
  const isFraud = predictionData.prediction === 1 && isHighProb;

  return isFraud ? 'fraude' : 'transaction';
};

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    const transactionData = Object.fromEntries(formData.entries());
    
    try {
      const fraudPrediction = await analyzeTransaction(transactionData);
      const transactionType = getTransactionType(fraudPrediction);
      
      const transactionResult: TransactionResult = {
        transactionData: {
          ...transactionData,
          analyzedAt: new Date().toISOString()
        },
        type: transactionType,
        probability: (fraudPrediction.probability_fraud || 0) * 100,
        prediction: fraudPrediction
      };
      
      onSave(transactionResult);
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      setErrors({ 
        global: 'Erreur lors de l\'analyse de la transaction. Veuillez réessayer.' 
      });
    }
  };

  // Fonction pour gérer le changement des champs et effacer les erreurs
  const handleInputChange = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  // Composant de champ sans validation spécifique
  const FormField = ({ name, label, type = "text", placeholder }: any) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label} {errors[name] && <span className="text-red-500 text-xs">*</span>}
      </label>
      <input 
        name={name} 
        type={type}
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

  // Détermination du type de transaction
  const transactionType = getTransactionType(prediction);
  const probability = prediction ? (prediction.probability_fraud * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Détection de Fraude</h2>
            <p className="text-slate-500">Analyse en temps réel : Transaction ou Fraude</p>
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
        {errors.global && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-2 text-red-700">
              <span>⚠️</span>
              <p className="font-medium">{errors.global}</p>
            </div>
          </div>
        )}

        {/* Résultat */}
        {prediction && (
          <div className={`mb-6 p-6 rounded-2xl border-l-4 ${
            transactionType === 'fraude' 
              ? 'bg-red-50 border-red-500 shadow-lg shadow-red-100' 
              : 'bg-green-50 border-green-500 shadow-lg shadow-green-100'
          }`}>
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full text-2xl ${
                transactionType === 'fraude' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
              }`}>
                {transactionType === 'fraude' ? '🚨' : '✅'}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-2 ${
                  transactionType === 'fraude' ? 'text-red-800' : 'text-green-800'
                }`}>
                  {transactionType === 'fraude' ? 'FRAUDE DÉTECTÉE' : 'TRANSACTION NORMALE'}
                </h3>
                <p className={`text-lg font-semibold mb-1 ${
                  transactionType === 'fraude' ? 'text-red-700' : 'text-green-700'
                }`}>
                  {transactionType === 'fraude' 
                    ? `Transaction suspecte (${probability.toFixed(1)}% risque)` 
                    : 'Transaction légitime - Aucun problème détecté'
                  }
                </p>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-sm text-slate-600">Probabilité de fraude</p>
                    <p className={`text-lg font-bold ${
                      transactionType === 'fraude' ? 'text-red-700' : 'text-green-700'
                    }`}>
                      {probability.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-slate-100 rounded-lg">
                  <p className="text-xs text-slate-600">
                    Probabilité: {(prediction.probability_fraud * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            
            {/* Message d'alerte seulement pour les fraudes */}
            {transactionType === 'fraude' && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-red-600">🚨</span>
                  <p className="font-medium text-sm text-red-700">
                    Alerte : Transaction bloquée pour suspicion de fraude
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Formulaire sans validations spécifiques */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section Informations Client */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Informations Client</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField 
                name="gender"
                label="Gender"
                placeholder="0"
              />
              <FormField 
                name="age"
                label="Age"
                placeholder="56"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField 
                name="houseTypeID"
                label="House Type ID"
                placeholder="1"
              />
              <FormField 
                name="contactAvaliabilityID"
                label="Contact Availability ID"
                placeholder="0"
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
              />
              <FormField 
                name="transactionCountry"
                label="Transaction Country"
                placeholder="1"
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
              />
              <FormField 
                name="cardExpiryDate"
                label="Card Expiry Date"
                placeholder="1811"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField 
                name="transactionAmount"
                label="Transaction Amount"
                type="text"
                placeholder="0.0034"
              />
              <FormField 
                name="productID"
                label="Product ID"
                placeholder="3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField 
                name="cif"
                label="CIF"
                placeholder="11020290"
              />
              <FormField 
                name="transactionCurrencyCode"
                label="Currency Code"
                placeholder="1"
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
