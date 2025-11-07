// components/AnalyticsModal.tsx
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

// Icon components for statistics cards
const TrendingUpIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendingDownIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

const BarChartIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const PercentIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

interface OutlierData {
  count: number;
  borne_inf: number;
  borne_sup: number;
  pourcentage: number;
  min_original: number;
  max_original: number;
}

interface AnalyticsData {
  avant: Record<string, OutlierData>;
  apres: Record<string, OutlierData>;
  statistiques: {
    total_avant: number;
    total_apres: number;
    reduction: number;
    pourcentage_reduction: number;
  };
}

interface AnalyticsModalProps {
  open: boolean;
  onClose: () => void;
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ open, onClose }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les données des valeurs aberrantes
  // const loadOutliersData = async () => {
  //   setLoading(true);
  //   setError(null);
    
  //   try {
  //      const response = await fetch('http://localhost:5000/api/valeurs-aberrantes-comparaison');
  //     const result = await response.json();
      
  //     if (result.success) {
  //       setData(result.data);
  //     } else {
  //       setError(result.error || 'Erreur lors du chargement des données');
  //     }
  //   } catch (err) {
  //     setError('Erreur de connexion au serveur');
  //     console.error('Erreur:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const loadOutliersData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    console.log('🔄 Chargement des données des valeurs aberrantes...');
    
    // REMPLACÉ : Utilisation du service API
    const result = await apiService.getValeursAberrantesComparaison();
    console.log('✅ Données reçues:', result);
    
    if (result.success) {
      setData(result.data);
      console.log('📊 Données des valeurs aberrantes mises à jour');
    } else {
      const errorMsg = result.error || 'Erreur lors du chargement des données';
      setError(errorMsg);
      console.error('❌ Erreur API:', errorMsg);
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Erreur de connexion au serveur';
    setError(errorMsg);
    console.error('❌ Erreur de connexion:', err);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    if (open) {
      loadOutliersData();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-200/60">
          <div>
            <h2 className="text-2xl font-bold text-slate-900"> Analytiques des Valeurs Aberrantes</h2>
            <p className="text-slate-500 mt-1">Comparaison avant et après correction</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-slate-100 rounded-2xl transition-colors duration-200 text-slate-500 hover:text-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-auto max-h-[calc(90vh-140px)]">
          {loading && (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-500"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin animation-delay-75"></div>
              </div>
              <div className="mt-6 text-center">
                <div className="text-lg font-semibold text-slate-700 mb-2">Chargement des analytiques...</div>
                <div className="text-sm text-slate-500">Analyse des valeurs aberrantes en cours</div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-gradient-to-br from-red-50 via-red-100 to-pink-50 border-2 border-red-200/60 rounded-3xl p-8 text-center shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-red-500/10 rounded-full">
                  <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="text-red-700 text-xl font-bold mb-3">Erreur de chargement</div>
              <div className="text-red-600 mb-6 max-w-md mx-auto">{error}</div>
              <button
                onClick={loadOutliersData}
                className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Réessayer</span>
              </button>
            </div>
          )}

          {data && !loading && (
            <div className="space-y-8">
              {/* Statistiques Globales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="group bg-gradient-to-br from-red-50 via-red-100 to-orange-100 rounded-3xl p-6 border border-red-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-red-500/10 rounded-2xl">
                      <TrendingUpIcon />
                    </div>
                    <div className="text-red-400 text-sm font-semibold">AVANT</div>
                  </div>
                  <div className="text-4xl font-bold text-red-600 mb-2 group-hover:scale-110 transition-transform duration-300">{data.statistiques.total_avant}</div>
                  <div className="text-sm text-red-500 font-medium">Valeurs aberrantes avant</div>
                </div>

                <div className="group bg-gradient-to-br from-green-50 via-emerald-100 to-teal-100 rounded-3xl p-6 border border-green-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-500/10 rounded-2xl">
                      <TrendingDownIcon />
                    </div>
                    <div className="text-green-400 text-sm font-semibold">APRÈS</div>
                  </div>
                  <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">{data.statistiques.total_apres}</div>
                  <div className="text-sm text-green-500 font-medium">Valeurs aberrantes après</div>
                </div>

                <div className="group bg-gradient-to-br from-blue-50 via-cyan-100 to-indigo-100 rounded-3xl p-6 border border-blue-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl">
                      <BarChartIcon />
                    </div>
                    <div className="text-blue-400 text-sm font-semibold">RÉDUCTION</div>
                  </div>
                  <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">{data.statistiques.reduction}</div>
                  <div className="text-sm text-blue-500 font-medium">Réduction</div>
                </div>

                <div className="group bg-gradient-to-br from-purple-50 via-violet-100 to-indigo-100 rounded-3xl p-6 border border-purple-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-2xl">
                      <PercentIcon />
                    </div>
                    <div className="text-purple-400 text-sm font-semibold">AMÉLIORATION</div>
                  </div>
                  <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">{data.statistiques.pourcentage_reduction}%</div>
                  <div className="text-sm text-purple-500 font-medium">Amélioration</div>
                </div>
              </div>

              {/* Tableau de Comparaison */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 shadow-lg border border-slate-200/60">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-slate-900">Détail par Colonne</h3>
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                    <span>Comparaison détaillée</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-300/60">
                        <th className="text-left pb-6 font-bold text-slate-900 text-lg">Colonne</th>
                        <th className="text-center pb-6 font-bold text-slate-900 text-lg">Avant Correction</th>
                        <th className="text-center pb-6 font-bold text-slate-900 text-lg">Après Correction</th>
                        <th className="text-center pb-6 font-bold text-slate-900 text-lg">Amélioration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/40">
                      {Object.entries(data.avant).map(([colonne, donneesAvant], index) => {
                        const donneesApres = data.apres[colonne];
                        const amelioration = donneesAvant.count - (donneesApres?.count || 0);

                        return (
                          <tr key={colonne} className={`hover:bg-white/60 transition-all duration-300 hover:shadow-sm ${index % 2 === 0 ? 'bg-white/20' : 'bg-slate-50/40'}`}>
                            <td className="py-6 font-semibold text-slate-900 text-lg">{colonne}</td>
                            <td className="py-6 text-center">
                              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-800 rounded-full font-semibold shadow-sm border border-red-300/50">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <span>{donneesAvant.count} valeurs</span>
                              </div>
                            </td>
                            <td className="py-6 text-center">
                              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full font-semibold shadow-sm border border-green-300/50">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span>{donneesApres?.count || 0} valeurs</span>
                              </div>
                            </td>
                            <td className="py-6 text-center">
                              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full font-semibold shadow-sm border ${
                                amelioration > 0
                                  ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300/50'
                                  : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 border-slate-300/50'
                              }`}>
                                {amelioration > 0 && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                                <span>{amelioration > 0 ? `-${amelioration}` : '0'}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  onClick={onClose}
                  className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Fermer</span>
                </button>
                <button
                  onClick={loadOutliersData}
                  className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Actualiser les Données</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;