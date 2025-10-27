// components/NormalisationStats.tsx
import React, { useState, useEffect } from 'react';

interface NormalisationStats {
  avant_normalisation: {
    moyenne_globale: number;
    ecart_type_global: number;
    min_global: number;
    max_global: number;
    shape: number[];
    colonnes: string[];
  };
  apres_normalisation: {
    moyenne_globale: number;
    ecart_type_global: number;
    min_global: number;
    max_global: number;
    shape: number[];
  };
  verification: {
    moyenne_proche_zero: boolean;
    ecart_type_proche_un: boolean;
    score_qualite: string;
    moyenne_calculee: number;
    ecart_type_calcule: number;
  };
  details_colonnes: {
    [key: string]: {
      avant: {
        moyenne: number;
        ecart_type: number;
        min: number;
        max: number;
      };
      apres: {
        moyenne: number;
        ecart_type: number;
        min: number;
        max: number;
      };
    };
  };
  details_techniques: {
    type_normaliseur: string;
    algorithme: string;
    colonnes_normalisees: number;
    taille_entrainement: number;
    taille_test: number;
    nombre_features: number;
  };
}

interface NormalisationStatsModalProps {
  open: boolean;
  onClose: () => void;
}

const NormalisationStatsModal: React.FC<NormalisationStatsModalProps> = ({ open, onClose }) => {
  const [stats, setStats] = useState<NormalisationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/statistiques-normalisation');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error || 'Erreur lors du chargement des statistiques');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadStats();
    }
  }, [open]);

  // Fonction utilitaire pour formater les nombres avec sécurité
  const formatNumber = (value: number | undefined, decimals: number = 4, defaultValue: string = '0.0000') => {
    return value ? value.toFixed(decimals) : defaultValue;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-200/60">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">📊 Statistiques de Normalisation</h2>
            <p className="text-slate-500 mt-1">Comparaison avant et après StandardScaler</p>
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
                onClick={loadStats}
                className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-200"
              >
                Réessayer
              </button>
            </div>
          )}

          {stats && !loading && (
            <div className="space-y-8">
              {/* Indicateur de qualité */}
              <div className={`p-6 rounded-2xl border ${
                stats.verification?.score_qualite?.includes('✅') 
                  ? 'bg-green-50 border-green-200' 
                  : stats.verification?.score_qualite?.includes('⚠️')
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Qualité de la Normalisation</h3>
                    <p className="text-slate-600 mt-1">{stats.verification?.score_qualite || 'Non disponible'}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className={`text-sm font-medium ${
                      stats.verification?.moyenne_proche_zero ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Moyenne: {formatNumber(stats.verification?.moyenne_calculee, 6, '0.000000')}
                      {stats.verification?.moyenne_proche_zero ? ' ✅' : ' ❌'}
                    </p>
                    <p className={`text-sm font-medium ${
                      stats.verification?.ecart_type_proche_un ? 'text-green-600' : 'text-red-600'
                    }`}>
                      Écart-type: {formatNumber(stats.verification?.ecart_type_calcule, 6, '0.000000')}
                      {stats.verification?.ecart_type_proche_un ? ' ✅' : ' ❌'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparaison avant/après */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avant normalisation */}
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 tex-black">📈 Avant Normalisation</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Moyenne globale</span>
                      <span className="font-semibold text-red-600">
                        {formatNumber(stats.avant_normalisation?.moyenne_globale)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Écart-type global</span>
                      <span className="font-semibold text-red-600">
                        {formatNumber(stats.avant_normalisation?.ecart_type_global)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Valeur min</span>
                      <span className="font-semibold text-red-600">
                        {formatNumber(stats.avant_normalisation?.min_global)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Valeur max</span>
                      <span className="font-semibold text-red-600">
                        {formatNumber(stats.avant_normalisation?.max_global)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Dimensions</span>
                      <span className="font-semibold text-red-600">
                        {stats.avant_normalisation?.shape?.[0] || 0} × {stats.avant_normalisation?.shape?.[1] || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Après normalisation */}
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">🎯 Après Normalisation</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Moyenne globale</span>
                      <span className="font-semibold text-blue-600">
                        {formatNumber(stats.apres_normalisation?.moyenne_globale, 6, '0.000000')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Écart-type global</span>
                      <span className="font-semibold text-blue-600">
                        {formatNumber(stats.apres_normalisation?.ecart_type_global, 6, '0.000000')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Valeur min</span>
                      <span className="font-semibold text-blue-600">
                        {formatNumber(stats.apres_normalisation?.min_global)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Valeur max</span>
                      <span className="font-semibold text-blue-600">
                        {formatNumber(stats.apres_normalisation?.max_global)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Dimensions</span>
                      <span className="font-semibold text-blue-600">
                        {stats.apres_normalisation?.shape?.[0] || 0} × {stats.apres_normalisation?.shape?.[1] || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Détails par colonne */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">📋 Détails par Colonne</h3>
                <div className="grid gap-4">
                  {stats.details_colonnes && Object.entries(stats.details_colonnes).map(([colonne, details]) => (
                    <div key={colonne} className="bg-white rounded-xl p-4 border border-slate-200">
                      <h4 className="font-semibold text-slate-800 mb-3">{colonne}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-slate-600 mb-2">Avant</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Moyenne:</span>
                              <span>{formatNumber(details?.avant?.moyenne)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Écart-type:</span>
                              <span>{formatNumber(details?.avant?.ecart_type)}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-blue-600 mb-2">Après</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Moyenne:</span>
                              <span className="text-blue-600">
                                {formatNumber(details?.apres?.moyenne, 6, '0.000000')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Écart-type:</span>
                              <span className="text-blue-600">
                                {formatNumber(details?.apres?.ecart_type, 6, '0.000000')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Détails techniques */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">⚙️ Détails Techniques</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-xl">
                    <p className="text-sm text-slate-500">Type</p>
                    <p className="font-semibold text-slate-900">
                      {stats.details_techniques?.type_normaliseur || 'Non spécifié'}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl">
                    <p className="text-sm text-slate-500">Features</p>
                    <p className="font-semibold text-slate-900">
                      {stats.details_techniques?.nombre_features || 0}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl">
                    <p className="text-sm text-slate-500">Train</p>
                    <p className="font-semibold text-slate-900">
                      {stats.details_techniques?.taille_entrainement || 0} éch.
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl">
                    <p className="text-sm text-slate-500">Test</p>
                    <p className="font-semibold text-slate-900">
                      {stats.details_techniques?.taille_test || 0} éch.
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl">
                    <p className="text-sm text-slate-500">Colonnes</p>
                    <p className="font-semibold text-slate-900">
                      {stats.details_techniques?.colonnes_normalisees || 0}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl">
                    <p className="text-sm text-slate-500">Algorithme</p>
                    <p className="font-semibold text-slate-900 text-xs">
                      {stats.details_techniques?.algorithme || 'Non spécifié'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200/60">
          <div className="text-sm text-slate-500">
            Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={loadStats}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors duration-200"
            >
              Actualiser
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors duration-200"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NormalisationStatsModal;