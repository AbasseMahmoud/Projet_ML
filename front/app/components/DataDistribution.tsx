// components/DataDistribution.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

interface DistributionData {
  before_smote: {
    non_fraud: number;
    fraud: number;
  };
  after_smote: {
    non_fraud: number;
    fraud: number;
  };
  total_before: number;
  total_after: number;
  source?: string;
  fetchedAt?: string;
  error?: string;
  details?: string;
}

interface DataDistributionProps {
  open: boolean;
  onClose: () => void;
}

const DataDistribution: React.FC<DataDistributionProps> = ({ open, onClose }) => {
  const [distribution, setDistribution] = useState<DistributionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchDistribution();
    }
  }, [open]);

  // const fetchDistribution = async () => {
  //   setLoading(true);
  //   setError(null);
  //   setDistribution(null);
    
  //   try {
  //     console.log(' Fetching dynamic data from Flask...');
  //     const response = await fetch('/api/data-distribution');
      
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
  //     }
      
  //     const data: DistributionData = await response.json();
      
  //     if (data.error) {
  //       throw new Error(data.error);
  //     }
      
  //     console.log(' Dynamic data received:', data);
  //     setDistribution(data);
      
  //   } catch (err) {
  //     const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
  //     setError(errorMessage);
  //     console.error(' Erreur fetch distribution:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchDistribution = async () => {
    setLoading(true);
    setError(null);
    setDistribution(null);
    
    try {
      console.log(' Fetching dynamic data from Flask...');
      
      // REMPLACER CETTE LIGNE :
      // const response = await fetch('/api/data-distribution');
      
      // PAR CELLE-CI :
      const data: DistributionData = await apiService.getDataDistribution();
      
      console.log(' Dynamic data received:', data);
      setDistribution(data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      console.error(' Erreur fetch distribution:', err);
      
      // Optionnel : utiliser des données de secours en cas d'erreur
      // setDistribution(getFallbackDistribution());
    } finally {
      setLoading(false);
    } 
};
  const retryWithFallback = () => {
    setError('Veuillez vérifier que le serveur Flask est démarré sur le port 5000');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto">
        {/* En-tête avec statistiques générales */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Distribution des Données</h2>
              <p className="text-slate-600">Analyse dynamique du déséquilibre des classes</p>
              {distribution?.source === 'flask_dynamic' && (
                <p className="text-sm text-green-600 font-medium">
                  ✓ Données calculées dynamiquement
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {/* Bouton de recalcul */}
              <button
                onClick={fetchDistribution}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:from-blue-300 disabled:to-indigo-300 text-white rounded-xl font-medium disabled:opacity-50 shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center space-x-2"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Calcul en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Recalculer</span>
                  </div>
                )}
              </button>

              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Statistiques générales de la distribution */}
          {distribution && !distribution.error && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Total avant SMOTE</p>
                    <p className="text-lg font-bold text-slate-900">{distribution.total_before.toLocaleString()}</p>
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
                    <p className="text-sm text-slate-600">Total après SMOTE</p>
                    <p className="text-lg font-bold text-slate-900">{distribution.total_after.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Échantillons générés</p>
                    <p className="text-lg font-bold text-slate-900">
                      {(distribution.after_smote.fraud - distribution.before_smote.fraud).toLocaleString()}
                    </p>
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
                    <p className="text-sm font-bold text-slate-900">{new Date().toLocaleString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-red-700 font-medium">{error}</p>
                <p className="text-red-600 text-sm mt-1">
                  Assurez-vous que le serveur Flask est démarré sur le port 5000
                </p>
                <button 
                  onClick={fetchDistribution}
                  className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
              <p className="text-slate-600">Calcul des données en temps réel...</p>
              <p className="text-sm text-slate-500">
                Application de SMOTE et analyse du déséquilibre
              </p>
            </div>
          </div>
        )}

        {distribution && !distribution.error && (
          <div className="space-y-8">
            {/* Indicateur de données dynamiques */}
            {distribution.source === 'flask_dynamic' && (
              <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-green-800 font-medium">Données calculées en temps réel</p>
                    <p className="text-green-700 text-sm">
                      SMOTE appliqué dynamiquement - Données actualisées à chaque chargement
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Distribution avant SMOTE */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60">
              <h3 className="font-semibold text-slate-900 mb-6 text-lg">
                 Distribution Initiale (Avant SMOTE)
              </h3>
              {/* 📊 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <h4 className="font-medium text-slate-900 mb-3">Statistiques Temps Réel</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Non Fraude:</span>
                        <span className="font-semibold text-slate-900">
                          {distribution.before_smote.non_fraud.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Fraude:</span>
                        <span className="font-semibold text-slate-900">
                          {distribution.before_smote.fraud.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-2">
                        <span className="text-slate-600">Total:</span>
                        <span className="font-semibold text-slate-900">
                          {distribution.total_before.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Ratio Fraude:</span>
                        <span className="font-semibold text-red-600">
                          {((distribution.before_smote.fraud / distribution.total_before) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                    <h4 className="font-medium text-orange-900 mb-2">⚠️ Problème de Déséquilibre</h4>
                    <p className="text-sm text-orange-700">
                      Les fraudes représentent seulement {((distribution.before_smote.fraud / distribution.total_before) * 100).toFixed(1)}% des données.
                      Cela peut biaiser l'entraînement des modèles.
                    </p>
                  </div>
                </div>

                {/* Bar Chart dynamique */}
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-4">Répartition Visuelle</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm text-slate-600 mb-1">
                        <span>Non Fraude</span>
                        <span>
                          {distribution.before_smote.non_fraud} ({(distribution.before_smote.non_fraud / distribution.total_before * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-4">
                        <div 
                          className="bg-green-500 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${(distribution.before_smote.non_fraud / distribution.total_before) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-slate-600 mb-1">
                        <span>Fraude</span>
                        <span>
                          {distribution.before_smote.fraud} ({(distribution.before_smote.fraud / distribution.total_before * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-4">
                        <div 
                          className="bg-red-500 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${(distribution.before_smote.fraud / distribution.total_before) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution après SMOTE */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60">
              <h3 className="font-semibold text-slate-900 mb-6 text-lg">
                 Distribution Après SMOTE
              </h3>
              {/* ⚖️ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <h4 className="font-medium text-slate-900 mb-3">Statistiques Équilibrées</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Non Fraude:</span>
                        <span className="font-semibold text-slate-900">
                          {distribution.after_smote.non_fraud.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Fraude:</span>
                        <span className="font-semibold text-slate-900">
                          {distribution.after_smote.fraud.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-2">
                        <span className="text-slate-600">Total:</span>
                        <span className="font-semibold text-slate-900">
                          {distribution.total_after.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Ratio Fraude:</span>
                        <span className="font-semibold text-green-600">
                          {((distribution.after_smote.fraud / distribution.total_after) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2"> Équilibre Atteint</h4>
                    <p className="text-sm text-green-700">
                      SMOTE a généré {distribution.after_smote.fraud - distribution.before_smote.fraud} échantillons de fraude supplémentaires.
                      Les classes sont maintenant parfaitement équilibrées.
                    </p>
                  </div>
                </div>

                {/* Bar Chart après SMOTE */}
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-4">Répartition Équilibrée</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm text-slate-600 mb-1">
                        <span>Non Fraude</span>
                        <span>
                          {distribution.after_smote.non_fraud} ({(distribution.after_smote.non_fraud / distribution.total_after * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-4">
                        <div 
                          className="bg-green-500 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${(distribution.after_smote.non_fraud / distribution.total_after) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-slate-600 mb-1">
                        <span>Fraude</span>
                        <span>
                          {distribution.after_smote.fraud} ({(distribution.after_smote.fraud / distribution.total_after * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-4">
                        <div 
                          className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${(distribution.after_smote.fraud / distribution.total_after) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Résumé et impact de SMOTE */}
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200">
              <h3 className="font-semibold text-indigo-900 mb-4"> Impact de SMOTE</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-xl border border-indigo-200">
                  <div className="text-2xl font-bold text-indigo-600">
                    +{(distribution.after_smote.fraud - distribution.before_smote.fraud).toLocaleString()}
                  </div>
                  <div className="text-sm text-indigo-700 font-medium">Échantillons de fraude générés</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-indigo-200">
                  <div className="text-2xl font-bold text-indigo-600">
                    {((distribution.after_smote.fraud / distribution.before_smote.fraud - 1) * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-indigo-700 font-medium">Augmentation des fraudes</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-indigo-200">
                  <div className="text-2xl font-bold text-indigo-600">
                    {((distribution.after_smote.fraud / distribution.total_after) * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-indigo-700 font-medium">Ratio final équilibré</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-100">
                <h4 className="font-medium text-indigo-900 mb-2">Analyse de l'amélioration</h4>
                <ul className="text-sm text-indigo-700 space-y-1">
                  <li>• Déséquilibre initial: <strong>{((distribution.before_smote.fraud / distribution.total_before) * 100).toFixed(1)}%</strong> de fraudes</li>
                  <li>• Équilibre final: <strong>{((distribution.after_smote.fraud / distribution.total_after) * 100).toFixed(1)}%</strong> de fraudes</li>
                  <li>• Amélioration: <strong>{((distribution.after_smote.fraud / distribution.total_after - distribution.before_smote.fraud / distribution.total_before) * 100).toFixed(1)}%</strong></li>
                </ul>
              </div>
            </div>

            {/* Informations techniques */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60">
              <h3 className="font-semibold text-slate-900 mb-4">🔧 Informations Techniques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-3">Méthodologie SMOTE</h4>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li>• Suréchantillonnage des minorités (fraudes)</li>
                    <li>• Génération d'échantillons synthétiques</li>
                    <li>• Préservation de la distribution originale</li>
                    <li>• Amélioration de la performance des modèles</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-3">Bénéfices</h4>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li>• Réduction du biais envers la classe majoritaire</li>
                    <li>• Amélioration du recall (détection des fraudes)</li>
                    <li>• Meilleure généralisation des modèles</li>
                    <li>• Performance équilibrée sur toutes les métriques</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* État vide quand aucune donnée n'est disponible */}
        {!loading && !distribution && !error && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60">
            <div className="text-slate-400 text-6xl mb-4"></div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Prêt à analyser</h3>
            <p className="text-slate-500 mb-4">Cliquez sur "Recalculer" pour générer les données de distribution</p>
            <button
              onClick={fetchDistribution}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors duration-200"
            >
              Calculer la distribution
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataDistribution;