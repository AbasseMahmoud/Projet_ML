"use client";

import React, { useState, useEffect } from 'react';

interface Alert {
  id: number;
  transaction: string;
  amount: string;
  status: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  user: string;
}

interface ModelMetric {
  Model: string;
  Accuracy: number;
  Precision: number;
  Recall: number;
  'F1-score': number;
  Commentaire: string;
}

interface DataQuality {
  valeurs_manquantes: any;
  valeurs_aberrantes: any;
  doublons: any;
  total_lignes: number;
  total_colonnes: number;
  fetchedAt: string;
}

interface QualityValue {
  count?: number;
  [key: string]: any;
}

interface AlertsModalProps {
  open: boolean;
  onClose: () => void;
  alerts: Alert[];
  onAlertAction?: (alertId: number, action: string) => void;
}

const AlertsModal: React.FC<AlertsModalProps> = ({ 
  open, 
  onClose, 
  alerts,
  onAlertAction 
}) => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'models' | 'data-quality'>('alerts');
  const [modelMetrics, setModelMetrics] = useState<ModelMetric[]>([]);
  const [dataQuality, setDataQuality] = useState<DataQuality | null>(null);
  const [doublons, setDoublons] = useState<any>(null);
  const [valeursManquantes, setValeursManquantes] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (activeTab === 'data-quality') {
        fetchModelMetrics();
      } else if (activeTab === 'models') {
        fetchAllDataQuality();
      }
    }
  }, [open, activeTab]);

  const fetchModelMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyse-metrics');
      if (!response.ok) throw new Error('Erreur lors de la récupération des métriques');
      const data = await response.json();
      if (data.success) {
        setModelMetrics(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDataQuality = async () => {
    setLoading(true);
    setError(null);
    try {
      const qualityResponse = await fetch('/api/data-quality');
      if (!qualityResponse.ok) throw new Error('Erreur data-quality');
      const qualityData = await qualityResponse.json();
      
      if (qualityData.success) {
        setDataQuality(qualityData.data);
      } else {
        await fetchIndividualQualityData();
      }
    } catch (err) {
      // Fallback: Récupérer les données individuellement
      await fetchIndividualQualityData();
    } finally {
      setLoading(false);
    }
  };

  const fetchIndividualQualityData = async () => {
    try {
      const [doublonsRes, manquantesRes] = await Promise.all([
        fetch('/api/doublons'),
        fetch('/api/valeurs-manquantes')
      ]);

      const doublonsData = await doublonsRes.json();
      const manquantesData = await manquantesRes.json();

      if (doublonsData.success) setDoublons(doublonsData.data);
      if (manquantesData.success) setValeursManquantes(manquantesData.data);

    } catch (err) {
      setError('Erreur lors de la récupération des données de qualité');
    }
  };

  const getQualityColor = (count: number, total: number) => {
    const percentage = (count / total) * 100;
    if (percentage < 1) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage < 5) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const renderQualitySection = (title: string, data: any, type: string) => {
    if (!data || typeof data !== 'object') {
      return (
        <div className="text-center p-6 bg-slate-50 rounded-xl">
          <p className="text-slate-500">Aucune donnée disponible</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => {
          // CORRECTION : Gestion sécurisée des types
          let displayValue: string;
          let count: number;

          if (typeof value === 'object' && value !== null && 'count' in value) {
            // Pour les objets avec propriété count
            const qualityValue = value as QualityValue;
            displayValue = qualityValue.count?.toString() || '0';
            count = qualityValue.count || 0;
          } else if (typeof value === 'number') {
            // Pour les nombres directs
            displayValue = value.toString();
            count = value;
          } else if (typeof value === 'string') {
            // Pour les strings
            displayValue = value;
            count = parseInt(value) || 0;
          } else {
            // Pour les autres types
            displayValue = '0';
            count = 0;
          }

          return (
            <div key={key} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
              <div className="flex-1">
                <span className="font-medium text-slate-800">{key}</span>
                <span className="text-sm text-slate-500 ml-2">
                  ({type === 'doublons' ? 'doublon(s)' : 'valeur(s) manquante(s)'})
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                getQualityColor(count, dataQuality?.total_lignes || 1000)
              }`}>
                {displayValue}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-7xl w-full mx-auto max-h-[90vh] overflow-y-auto">
        {/* En-tête avec onglets */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {activeTab === 'data-quality' ? 'Qualité des Données' : 
               activeTab === 'models' ? 'Performance des Modèles IA' : 
               'Gestion des Alertes'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab('alerts')} 
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'alerts' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Alertes
            </button>
            <button 
              onClick={() => setActiveTab('models')} 
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'models' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Modèles IA
            </button>
            <button 
              onClick={() => setActiveTab('data-quality')} 
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'data-quality' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Qualité Données
            </button>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'alerts' ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-6 bg-white rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{alert.transaction}</h3>
                    <p className="text-slate-600">{alert.user} - {alert.amount}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    alert.priority === 'high' ? 'bg-red-100 text-red-600' :
                    alert.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {alert.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'models' ? (
          <div className="space-y-6">
            {modelMetrics.map((model, index) => (
              <div key={index} className="p-6 bg-white rounded-2xl border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{model.Model}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-600">Accuracy</p>
                    <p className="text-lg font-bold text-blue-700">{(model.Accuracy * 100).toFixed(1)}%</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <p className="text-sm text-green-600">Precision</p>
                    <p className="text-lg font-bold text-green-700">{(model.Precision * 100).toFixed(1)}%</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-xl">
                    <p className="text-sm text-purple-600">Recall</p>
                    <p className="text-lg font-bold text-purple-700">{(model.Recall * 100).toFixed(1)}%</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-xl">
                    <p className="text-sm text-orange-600">F1-Score</p>
                    <p className="text-lg font-bold text-orange-700">{(model['F1-score'] * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Onglet Qualité des Données */
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <h3 className="font-semibold text-slate-900">Analyse de la Qualité des Données</h3>
                <p className="text-sm text-slate-500">Doublons et valeurs manquantes</p>
              </div>
              <button 
                onClick={fetchAllDataQuality} 
                disabled={loading} 
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium disabled:opacity-50"
              >
                {loading ? 'Chargement...' : 'Actualiser'}
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="grid gap-6">
                {/* Doublons */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">Doublons</h4>
                  {renderQualitySection('Doublons', dataQuality?.doublons || doublons, 'doublons')}
                </div>

                {/* Valeurs Manquantes */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200">
                  <h4 className="text-lg font-bold text-slate-900 mb-4">Valeurs Manquantes</h4>
                  {renderQualitySection('Valeurs Manquantes', dataQuality?.valeurs_manquantes || valeursManquantes, 'manquantes')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pied de page */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          <div className="text-sm text-slate-500">
            Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
          </div>
          <button onClick={onClose} className="px-6 py-3 bg-indigo-500 text-white font-medium rounded-xl">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertsModal;