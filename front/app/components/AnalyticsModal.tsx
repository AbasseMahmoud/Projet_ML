// components/AnalyticsModal.tsx
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

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
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <div className="text-red-600 text-lg font-semibold mb-2">Erreur</div>
              <div className="text-red-500">{error}</div>
              <button
                onClick={loadOutliersData}
                className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-200"
              >
                Réessayer
              </button>
            </div>
          )}

          {data && !loading && (
            <div className="space-y-8">
              {/* Statistiques Globales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200/60">
                  <div className="text-3xl font-bold text-red-600 mb-2">{data.statistiques.total_avant}</div>
                  <div className="text-sm text-red-500 font-medium">Valeurs aberrantes avant</div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/60">
                  <div className="text-3xl font-bold text-green-600 mb-2">{data.statistiques.total_apres}</div>
                  <div className="text-sm text-green-500 font-medium">Valeurs aberrantes après</div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200/60">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{data.statistiques.reduction}</div>
                  <div className="text-sm text-blue-500 font-medium">Réduction</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200/60">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{data.statistiques.pourcentage_reduction}%</div>
                  <div className="text-sm text-purple-500 font-medium">Amélioration</div>
                </div>
              </div>

              {/* Tableau de Comparaison */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Détail par Colonne</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200/60">
                        <th className="text-left pb-4 font-semibold text-slate-900">Colonne</th>
                        <th className="text-center pb-4 font-semibold text-slate-900">Avant Correction</th>
                        <th className="text-center pb-4 font-semibold text-slate-900">Après Correction</th>
                        {/* <th className="text-center pb-4 font-semibold text-slate-900">Bornes Acceptables</th> */}
                        <th className="text-center pb-4 font-semibold text-slate-900">Amélioration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60">
                      {Object.entries(data.avant).map(([colonne, donneesAvant]) => {
                        const donneesApres = data.apres[colonne];
                        const amelioration = donneesAvant.count - (donneesApres?.count || 0);
                        
                        return (
                          <tr key={colonne} className="hover:bg-white/50 transition-colors duration-200">
                            <td className="py-4 font-medium text-slate-900">{colonne}</td>
                            <td className="py-4 text-center">
                              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                                {donneesAvant.count} valeurs
                              </span>
                            </td>
                            <td className="py-4 text-center">
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                {donneesApres?.count || 0} valeurs
                              </span>
                            </td>
                            {/* <td className="py-4 text-center text-sm text-slate-600">
                              [{donneesAvant.borne_inf.toFixed(2)}, {donneesAvant.borne_sup.toFixed(2)}]
                            </td> */}
                            <td className="py-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                amelioration > 0 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-slate-100 text-slate-500'
                              }`}>
                                {amelioration > 0 ? `-${amelioration}` : '0'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors duration-200"
                >
                  Fermer
                </button>
                <button
                  onClick={loadOutliersData}
                  className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors duration-200"
                >
                  Actualiser les Données
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