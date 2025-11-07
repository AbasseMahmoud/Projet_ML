"use client";

import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

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
}

const AlertsModal: React.FC<AlertsModalProps> = ({
  open,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'models' | 'data-quality'>('models');
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

  // const fetchModelMetrics = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await fetch('/api/analyse-metrics');
  //     if (!response.ok) throw new Error('Erreur lors de la récupération des métriques');
  //     const data = await response.json();
  //     if (data.success) {
  //       setModelMetrics(data.data);
  //     } else {
  //       throw new Error(data.error);
  //     }
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Erreur inconnue');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchModelMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      // REMPLACÉ : Utilisation du service API
      const data = await apiService.getStats();
      
      if (data.success) {
        setModelMetrics(data.data);
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur fetch metrics:', err);
    } finally {
      setLoading(false);
    }
  };
  // const fetchAllDataQuality = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const qualityResponse = await fetch('/api/data-quality');
  //     if (!qualityResponse.ok) throw new Error('Erreur data-quality');
  //     const qualityData = await qualityResponse.json();
      
  //     if (qualityData.success) {
  //       setDataQuality(qualityData.data);
  //     } else {
  //       await fetchIndividualQualityData();
  //     }
  //   } catch (err) {
  //     // Fallback: Récupérer les données individuellement
  //     await fetchIndividualQualityData();
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchAllDataQuality = async () => {
    setLoading(true);
    setError(null);
    try {
      // REMPLACÉ : Utilisation du service API
      const qualityData = await apiService.getDataQuality();
      
      if (qualityData.success) {
        setDataQuality(qualityData.data);
      } else {
        // Fallback: Récupérer les données individuellement
        await fetchIndividualQualityData();
      }
    } catch (err) {
      // Fallback: Récupérer les données individuellement
      await fetchIndividualQualityData();
    } finally {
      setLoading(false);
    }
  };

  // const fetchIndividualQualityData = async () => {
  //   try {
  //     const [doublonsRes, manquantesRes] = await Promise.all([
  //       fetch('/api/doublons'),
  //       fetch('/api/valeurs-manquantes')
  //     ]);

  //     const doublonsData = await doublonsRes.json();
  //     const manquantesData = await manquantesRes.json();

  //     if (doublonsData.success) setDoublons(doublonsData.data);
  //     if (manquantesData.success) setValeursManquantes(manquantesData.data);

  //   } catch (err) {
  //     setError('Erreur lors de la récupération des données de qualité');
  //   }
  // };

  const fetchIndividualQualityData = async () => {
    try {
      // REMPLACÉ : Utilisation des services API
      const [doublonsData, manquantesData] = await Promise.all([
        apiService.getDoublons(),
        apiService.getValeursManquantes()
      ]);

      if (doublonsData.success) setDoublons(doublonsData.data);
      if (manquantesData.success) setValeursManquantes(manquantesData.data);

    } catch (err) {
      setError('Erreur lors de la récupération des données de qualité');
      console.error('Erreur fetch individual quality:', err);
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
               'Performance des Modèles IA'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-2xl">
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
        {activeTab === 'models' ? (
          <div className="space-y-8">
            {/* Header avec statistiques générales des modèles */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Performance des Modèles IA</h3>
                  <p className="text-slate-600">Analyse comparative des métriques de performance des différents modèles</p>
                </div>
                <button
                  onClick={fetchModelMetrics}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-medium disabled:opacity-50 shadow-lg shadow-blue-500/25 transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Chargement...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Actualiser</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Statistiques générales des modèles */}
              {modelMetrics.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Modèles actifs</p>
                        <p className="text-lg font-bold text-slate-900">{modelMetrics.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Accuracy moyenne</p>
                        <p className="text-lg font-bold text-slate-900">
                          {(modelMetrics.reduce((acc, model) => acc + model.Accuracy, 0) / modelMetrics.length * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">F1-Score moyen</p>
                        <p className="text-lg font-bold text-slate-900">
                          {(modelMetrics.reduce((acc, model) => acc + model['F1-score'], 0) / modelMetrics.length * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Dernière analyse</p>
                        <p className="text-sm font-bold text-slate-900">{new Date().toLocaleString('fr-FR')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col justify-center items-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
                <p className="text-slate-600">Analyse des modèles en cours...</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {modelMetrics.map((model, index) => (
                  <div key={index} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg shadow-slate-500/10 hover:shadow-xl hover:shadow-slate-500/20 transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">{model.Model}</h3>
                        <p className="text-slate-600">{model.Commentaire || 'Modèle de détection de fraude'}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          {(model.Accuracy * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-500">Accuracy globale</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-sm font-semibold text-blue-700">Accuracy</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-800">{(model.Accuracy * 100).toFixed(1)}%</p>
                        <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${model.Accuracy * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <span className="text-sm font-semibold text-green-700">Precision</span>
                        </div>
                        <p className="text-2xl font-bold text-green-800">{(model.Precision * 100).toFixed(1)}%</p>
                        <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${model.Precision * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span className="text-sm font-semibold text-purple-700">Recall</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-800">{(model.Recall * 100).toFixed(1)}%</p>
                        <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${model.Recall * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <span className="text-sm font-semibold text-orange-700">F1-Score</span>
                        </div>
                        <p className="text-2xl font-bold text-orange-800">{(model['F1-score'] * 100).toFixed(1)}%</p>
                        <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${model['F1-score'] * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Onglet Qualité des Données */
          <div className="space-y-8">
            {/* Header avec statistiques générales */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Analyse de la Qualité des Données</h3>
                  <p className="text-slate-600">Évaluation complète des données : doublons, valeurs manquantes et anomalies</p>
                </div>
                <button
                  onClick={fetchAllDataQuality}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-medium disabled:opacity-50 shadow-lg shadow-indigo-500/25 transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Chargement...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Actualiser</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Statistiques générales */}
              {dataQuality && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Total Lignes</p>
                        <p className="text-lg font-bold text-slate-900">{dataQuality.total_lignes?.toLocaleString() || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Total Colonnes</p>
                        <p className="text-lg font-bold text-slate-900">{dataQuality.total_colonnes || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Dernière analyse</p>
                        <p className="text-sm font-bold text-slate-900">{dataQuality.fetchedAt ? new Date(dataQuality.fetchedAt).toLocaleString('fr-FR') : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col justify-center items-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500 mb-4"></div>
                <p className="text-slate-600">Analyse en cours...</p>
              </div>
            ) : (
              <div className="grid gap-8">
                {/* Doublons */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg shadow-slate-500/10">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                      <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">Doublons</h4>
                      <p className="text-slate-600">Lignes dupliquées dans le dataset</p>
                    </div>
                  </div>
                  {renderQualitySection('Doublons', dataQuality?.doublons || doublons, 'doublons')}
                </div>

                {/* Valeurs Manquantes */}
                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg shadow-slate-500/10">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                      <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-5v2m0 0v2m0-2h2m-2 0h-2" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">Valeurs Manquantes</h4>
                      <p className="text-slate-600">Données absentes par colonne</p>
                    </div>
                  </div>
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