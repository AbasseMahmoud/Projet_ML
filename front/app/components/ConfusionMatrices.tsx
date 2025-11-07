"use client";

import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

// Icon components for enhanced UI
const MatrixIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
interface ConfusionMatrixData {
  model: string;
  matrix: number[][];
  image: string;
  metrics: {
    true_negatives: number;
    false_positives: number;
    false_negatives: number;
    true_positives: number;
    precision: number;
    recall: number;
    f1_score: number;
    accuracy?: number; 
  };
}

interface ConfusionMatricesProps {
  open: boolean;
  onClose: () => void;
}

const ConfusionMatrices: React.FC<ConfusionMatricesProps> = ({ open, onClose }) => {
  const [matrices, setMatrices] = useState<ConfusionMatrixData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchMatrices();
    }
  }, [open]);

  // const fetchMatrices = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     //  URL de l'API Flask
  //     // const response = await fetch('http://localhost:5000/api/matrices-confusion');
  //     const response = await apiService.getConfusionMatrices();
      
  //     if (!response.ok) {
  //       throw new Error(`Erreur HTTP: ${response.status}`);
  //     }
      
  //     const result = await response.json();
      
  //     // CORRECTION : Vérifier la structure de la réponse
  //     if (result.success && Array.isArray(result.data)) {
  //       setMatrices(result.data);
  //       if (result.data.length > 0) {
  //         setSelectedModel(result.data[0].model);
  //       }
  //     } else if (Array.isArray(result)) {
  //       // Si l'API retourne directement un tableau
  //       setMatrices(result);
  //       if (result.length > 0) {
  //         setSelectedModel(result[0].model);
  //       }
  //     } else {
  //       throw new Error('Format de réponse inattendu de l\'API');
  //     }
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Erreur inconnue');
  //     console.error('Erreur fetch matrices:', err);
  //     // Données de secours
  //     setMatrices(getFallbackMatrices());
  //     if (getFallbackMatrices().length > 0) {
  //       setSelectedModel(getFallbackMatrices()[0].model);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchMatrices = async () => {
  setLoading(true);
  setError(null);
  try {
    // CORRECTION : Le service retourne déjà les données JSON
    const result = await apiService.getConfusionMatrices();
    
    // Vérifier la structure de la réponse
    if (result.success && Array.isArray(result.data)) {
      setMatrices(result.data);
      if (result.data.length > 0) {
        setSelectedModel(result.data[0].model);
      }
    } else {
      throw new Error('Format de réponse inattendu');
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erreur inconnue');
    console.error('Erreur fetch matrices:', err);
    // Données de secours
    setMatrices(getFallbackMatrices());
    if (getFallbackMatrices().length > 0) {
      setSelectedModel(getFallbackMatrices()[0].model);
    }
  } finally {
    setLoading(false);
  }
};
  const selectedMatrix = matrices && Array.isArray(matrices) 
    ? matrices.find(matrix => matrix.model === selectedModel)
    : null;

  const getPerformanceColor = (f1Score: number) => {
    if (f1Score >= 0.5) return 'bg-green-100 text-green-700';
    if (f1Score >= 0.3) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 rounded-3xl p-8 max-w-7xl w-full mx-auto max-h-[95vh] overflow-y-auto shadow-2xl shadow-indigo-500/10 border border-slate-200/60">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <MatrixIcon />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-br from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Matrices de Confusion
              </h2>
              <p className="text-slate-600 font-medium">
                Analyse approfondie des performances des modèles IA
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchMatrices}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed"
            >
              <RefreshIcon />
              <span>{loading ? 'Chargement...' : 'Actualiser'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-3 hover:bg-slate-100 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <span className="ml-3 text-slate-600">Chargement des matrices...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Liste des modèles */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60">
                <h3 className="font-semibold text-slate-900 mb-4">Modèles ({matrices.length})</h3>
                <div className="space-y-3">
                  {matrices.map((matrix) => (
                    <button
                      key={matrix.model}
                      onClick={() => setSelectedModel(matrix.model)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                        selectedModel === matrix.model
                          ? 'bg-white border-indigo-200 shadow-lg shadow-indigo-500/10'
                          : 'bg-slate-50/50 border-slate-200 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{matrix.model}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(matrix.metrics.f1_score)}`}>
                          F1: {(matrix.metrics.f1_score * 100).toFixed(1)}%
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Détails de la matrice sélectionnée */}
            <div className="lg:col-span-2">
              {selectedMatrix ? (
                <div className="space-y-6">
                  {/* Image de la matrice */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200/60">
                    <h3 className="font-semibold text-slate-900 mb-4">
                      Matrice de Confusion - {selectedMatrix.model}
                    </h3>
                    <div className="flex justify-center">
                      <img 
                        src={selectedMatrix.image} 
                        alt={`Matrice de confusion ${selectedMatrix.model}`}
                        className="max-w-full h-auto rounded-lg shadow-lg border"
                        onError={(e) => {
                          // Fallback si l'image ne charge pas
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden text-center p-8 bg-slate-100 rounded-lg">
                        <div className="text-slate-400 text-4xl mb-2"></div>
                        <p className="text-slate-500">Image non disponible</p>
                      </div>
                    </div>
                  </div>

                  {/* Métriques détaillées */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedMatrix.metrics.true_negatives}
                      </div>
                      <div className="text-sm text-green-700 font-medium">Vrais Négatifs</div>
                    </div>
                    
                    <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                      <div className="text-2xl font-bold text-red-600">
                        {selectedMatrix.metrics.false_positives}
                      </div>
                      <div className="text-sm text-red-700 font-medium">Faux Positifs</div>
                    </div>
                    
                    <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                      <div className="text-2xl font-bold text-orange-600">
                        {selectedMatrix.metrics.false_negatives}
                      </div>
                      <div className="text-sm text-orange-700 font-medium">Faux Négatifs</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedMatrix.metrics.true_positives}
                      </div>
                      <div className="text-sm text-blue-700 font-medium">Vrais Positifs</div>
                    </div>
                  </div>

                  {/* Scores de performance */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                      <div className="text-xl font-bold text-purple-600">
                        {(selectedMatrix.metrics.precision * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-purple-700 font-medium">Precision</div>
                    </div>
                    
                    <div className="text-center p-4 bg-cyan-50 rounded-xl border border-cyan-200">
                      <div className="text-xl font-bold text-cyan-600">
                        {(selectedMatrix.metrics.recall * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-cyan-700 font-medium">Recall</div>
                    </div>
                    
                    <div className="text-center p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                      <div className="text-xl font-bold text-indigo-600">
                        {(selectedMatrix.metrics.f1_score * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-indigo-700 font-medium">F1-Score</div>
                    </div>
                  </div>

                  {/* Matrice brute */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60">
                    <h4 className="font-semibold text-slate-900 mb-4">Matrice Brute</h4>
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div></div>
                        <div className="font-semibold text-slate-700">Prédit Non Fraude</div>
                        <div className="font-semibold text-slate-700">Prédit Fraude</div>
                        
                        <div className="font-semibold text-slate-700">Réel Non Fraude</div>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-black">
                          {selectedMatrix.matrix[0][0]}
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-black">
                          {selectedMatrix.matrix[0][1]}
                        </div>
                        
                        <div className="font-semibold text-slate-700">Réel Fraude</div>
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 text-black">
                          {selectedMatrix.matrix[1][0]}
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-black">
                          {selectedMatrix.matrix[1][1]}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60">
                  <div className="text-slate-400 text-6xl mb-4"></div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune matrice sélectionnée</h3>
                  <p className="text-slate-500">Choisissez un modèle dans la liste pour voir sa matrice de confusion</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getFallbackMatrices = (): ConfusionMatrixData[] => [
  {
    model: 'RandomForest',
    matrix: [[565, 39], [31, 45]],
    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    metrics: {
      true_negatives: 565,
      false_positives: 39,
      false_negatives: 31,
      true_positives: 45,
      precision: 0.5867,
      recall: 0.579,
      f1_score: 0.583
    }
  },
  {
    model: 'DecisionTree',
    matrix: [[560, 44], [34, 42]],
    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    metrics: {
      true_negatives: 560,
      false_positives: 44,
      false_negatives: 34,
      true_positives: 42,
      precision: 0.488,
      recall: 0.592,
      f1_score: 0.529
    }
  },
  {
    model: 'LogisticRegression',
    matrix: [[590, 14], [76, 0]],
    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    metrics: {
      true_negatives: 590,
      false_positives: 14,
      false_negatives: 76,
      true_positives: 0,
      precision: 0.0,
      recall: 0.0,
      f1_score: 0.0
    }
  }
];

export default ConfusionMatrices;