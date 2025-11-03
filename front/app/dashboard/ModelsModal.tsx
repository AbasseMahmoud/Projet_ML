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

interface ModelsModalProps {
  open: boolean;
  onClose: () => void;
}

const ModelsModal: React.FC<ModelsModalProps> = ({ open, onClose }) => {
  const [modelMetrics, setModelMetrics] = useState<ModelMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      fetchModelMetrics();
    }
  }, [open]);

  // const fetchModelMetrics = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await fetch('/api/analyse-metrics');
      
      
  //     if (!response.ok) {
  //       throw new Error('Erreur lors de la récupération des métriques');
  //     }
      
  //     const data = await response.json();
      
  //     let metricsArray: ModelMetric[] = [];
      
  //     if (Array.isArray(data)) {
  //       metricsArray = data;
  //     } else if (data.data && Array.isArray(data.data)) {
  //       metricsArray = data.data;
  //     } else if (data.success && Array.isArray(data.data)) {
  //       metricsArray = data.data;
  //     } else {
  //       console.warn('Format de réponse inattendu, utilisation des données simulées');
  //       metricsArray = getMockMetrics();
  //     }
      
  //     if (metricsArray.length === 0) {
  //       metricsArray = getMockMetrics();
  //     }
      
  //     setModelMetrics(metricsArray);
  //     if (metricsArray.length > 0) {
  //       setActiveModel(metricsArray[0].Model);
  //     }
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Erreur inconnue');
  //     console.error('Erreur fetch metrics:', err);
      
  //     setModelMetrics(getMockMetrics());
  //     if (getMockMetrics().length > 0) {
  //       setActiveModel(getMockMetrics()[0].Model);
  //     }
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
    
    let metricsArray: ModelMetric[] = [];
    
    if (Array.isArray(data)) {
      metricsArray = data;
    } else if (data.data && Array.isArray(data.data)) {
      metricsArray = data.data;
    } else if (data.success && Array.isArray(data.data)) {
      metricsArray = data.data;
    } else {
      console.warn('Format de réponse inattendu, utilisation des données simulées');
      metricsArray = getMockMetrics();
    }
    
    if (metricsArray.length === 0) {
      metricsArray = getMockMetrics();
    }
    
    setModelMetrics(metricsArray);
    if (metricsArray.length > 0) {
      setActiveModel(metricsArray[0].Model);
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erreur inconnue');
    console.error('Erreur fetch metrics:', err);
    
    setModelMetrics(getMockMetrics());
    if (getMockMetrics().length > 0) {
      setActiveModel(getMockMetrics()[0].Model);
    }
  } finally {
    setLoading(false);
  }
};
  // ⭐⭐ NOUVELLE FONCTION : Exportation des données en CSV ⭐⭐
  const exportModelData = () => {
    if (!modelMetrics.length) return;

    try {
      // Préparer les en-têtes CSV
      const headers = ['Model', 'Accuracy', 'Precision', 'Recall', 'F1-score', 'Commentaire'];
      
      // Convertir les données en format CSV
      const csvContent = [
        headers.join(','), // En-têtes
        ...modelMetrics.map(model => [
          `"${model.Model}"`,
          model.Accuracy.toString(),
          model.Precision.toString(),
          model.Recall.toString(),
          model['F1-score'].toString(),
          `"${model.Commentaire.replace(/"/g, '""')}"` // Échapper les guillemets
        ].join(','))
      ].join('\n');

      // Créer un blob et télécharger le fichier
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `modeles-performance-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Erreur lors de l\'exportation:', err);
      setError('Erreur lors de l\'exportation des données');
    }
  };

  // ⭐⭐ FONCTION OPTIONNELLE : Export d'un modèle spécifique ⭐⭐
  const exportSingleModel = (model: ModelMetric) => {
    try {
      const headers = ['Model', 'Accuracy', 'Precision', 'Recall', 'F1-score', 'Commentaire'];
      
      const csvContent = [
        headers.join(','),
        [
          `"${model.Model}"`,
          model.Accuracy.toString(),
          model.Precision.toString(),
          model.Recall.toString(),
          model['F1-score'].toString(),
          `"${model.Commentaire.replace(/"/g, '""')}"`
        ].join(',')
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `modele-${model.Model}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Erreur lors de l\'exportation du modèle:', err);
      setError('Erreur lors de l\'exportation du modèle');
    }
  };

  const getMockMetrics = (): ModelMetric[] => {
    return [
      {
        Model: "SVM",
        Accuracy: 0.872,
        Precision: 0.78,
        Recall: 0.52,
        "F1-score": 0.625,
        Commentaire: "Bon équilibre précision/recall. Performances stables."
      },
      {
        Model: "LogisticRegression", 
        Accuracy: 0.845,
        Precision: 0.71,
        Recall: 0.48,
        "F1-score": 0.573,
        Commentaire: "Nombre élevé de fraudes non détectées. À améliorer."
      },
      {
        Model: "RandomForest",
        Accuracy: 0.892,
        Precision: 0.82,
        Recall: 0.61,
        "F1-score": 0.701,
        Commentaire: "Meilleures performances globales. Bon compromis."
      }
    ];
  };

  const getScoreColor = (score: number, type: 'accuracy' | 'f1' | 'precision' | 'recall') => {
    const thresholds = {
      accuracy: { high: 0.85, medium: 0.70 },
      f1: { high: 0.60, medium: 0.40 },
      precision: { high: 0.80, medium: 0.60 },
      recall: { high: 0.70, medium: 0.50 }
    };

    const threshold = thresholds[type];
    if (score >= threshold.high) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= threshold.medium) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 0.80) return 'Excellent';
    if (score >= 0.65) return 'Bon';
    if (score >= 0.50) return 'Moyen';
    return 'Faible';
  };

  const getModelIcon = (modelName: string) => {
    switch (modelName) {
      case 'SVM':
        return '';
      case 'LogisticRegression':
        return '';
      case 'RandomForest':
        return '';
      case 'DecisionTree':
        return '';
      case 'KNeighbors':
        return '';
      case 'GradientBoosting':
        return '';
      default:
        return '';
    }
  };

  const getModelDescription = (modelName: string) => {
    switch (modelName) {
      case 'SVM':
        return 'Support Vector Machine - Frontière de décision optimale';
      case 'LogisticRegression':
        return 'Régression Logistique - Classification probabiliste';
      case 'RandomForest':
        return 'Forêt Aléatoire - Ensemble de décisions';
      case 'DecisionTree':
        return 'Arbre de Décision - Règles simples et interprétables';
      case 'KNeighbors':
        return 'K Plus Proches Voisins - Classification par similarité';
      case 'GradientBoosting':
        return 'Gradient Boosting - Apprentissage séquentiel';
      default:
        return 'Algorithme de machine learning';
    }
  };

  const selectedModel = Array.isArray(modelMetrics) 
    ? modelMetrics.find(model => model.Model === activeModel)
    : null;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-7xl w-full mx-auto max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Performance des Modèles IA</h2>
            <p className="text-slate-500">
              Analyse comparative des algorithmes de détection de fraude - {modelMetrics.length} modèles disponibles
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* ⭐⭐ BOUTON D'EXPORTATION GLOBAL ⭐⭐ */}
            <button
              onClick={exportModelData}
              disabled={!modelMetrics.length}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-xl font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Exporter CSV</span>
            </button>

            <button
              onClick={fetchModelMetrics}
              disabled={loading}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white rounded-xl font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Chargement...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Rafraîchir</span>
                </>
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

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!Array.isArray(modelMetrics) || modelMetrics.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune donnée disponible</h3>
            <p className="text-slate-500">Les métriques des modèles n'ont pas pu être chargées</p>
            <button 
              onClick={fetchModelMetrics}
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Liste des modèles */}
            <div className="xl:col-span-1">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60">
                <h3 className="font-semibold text-slate-900 mb-4">Modèles Disponibles ({modelMetrics.length})</h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {modelMetrics.map((model) => (
                    <button
                      key={model.Model}
                      onClick={() => setActiveModel(model.Model)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                        activeModel === model.Model
                          ? 'bg-white border-indigo-200 shadow-lg shadow-indigo-500/10'
                          : 'bg-slate-50/50 border-slate-200 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{getModelIcon(model.Model)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900 truncate">{model.Model}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(model['F1-score'], 'f1')}`}>
                              F1: {(model['F1-score'] * 100).toFixed(1)}%
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 text-left mt-1 truncate">
                            {getModelDescription(model.Model)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">
                          Acc: {(model.Accuracy * 100).toFixed(1)}%
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          getPerformanceLevel(model['F1-score']) === 'Excellent' ? 'bg-green-100 text-green-700' :
                          getPerformanceLevel(model['F1-score']) === 'Bon' ? 'bg-blue-100 text-blue-700' :
                          getPerformanceLevel(model['F1-score']) === 'Moyen' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {getPerformanceLevel(model['F1-score'])}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Statistiques globales */}
              <div className="mt-6 bg-white rounded-2xl p-6 border border-slate-200/60">
                <h4 className="font-semibold text-slate-900 mb-4">Statistiques Globales</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Meilleur F1-Score:</span>
                    <span className="font-semibold text-slate-900">
                      {Math.max(...modelMetrics.map(m => m['F1-score'] * 100)).toFixed(1) + '%'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Moyenne Accuracy:</span>
                    <span className="font-semibold text-slate-900">
                      {(modelMetrics.reduce((acc, m) => acc + m.Accuracy, 0) / modelMetrics.length * 100).toFixed(1) + '%'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Modèles Excellents:</span>
                    <span className="font-semibold text-slate-900">
                      {modelMetrics.filter(m => m['F1-score'] >= 0.60).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Détails du modèle sélectionné */}
            <div className="xl:col-span-3">
              {selectedModel ? (
                <div className="space-y-6">
                  {/* En-tête du modèle */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-4xl">{getModelIcon(selectedModel.Model)}</span>
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{selectedModel.Model}</h3>
                          <p className="text-indigo-100">{getModelDescription(selectedModel.Model)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{(selectedModel['F1-score'] * 100).toFixed(1)}%</div>
                        <div className="text-indigo-200">Score F1 Global - {getPerformanceLevel(selectedModel['F1-score'])}</div>
                      </div>
                    </div>
                  </div>

                  {/* Métriques détaillées */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Accuracy', value: selectedModel.Accuracy, type: 'accuracy' },
                      { label: 'Precision', value: selectedModel.Precision, type: 'precision' },
                      { label: 'Recall', value: selectedModel.Recall, type: 'recall' },
                      { label: 'F1-Score', value: selectedModel['F1-score'], type: 'f1' }
                    ].map((metric, index) => (
                      <div key={index} className="text-center p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                        <div className={`text-2xl font-bold mb-2 ${getScoreColor(metric.value, metric.type as any).split(' ')[0]}`}>
                          {(metric.value * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-600 font-medium">{metric.label}</div>
                        <div className={`text-xs mt-1 px-2 py-1 rounded-full ${getScoreColor(metric.value, metric.type as any)}`}>
                          {getPerformanceLevel(metric.value)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Analyse et commentaires */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60">
                    <h4 className="font-semibold text-slate-900 mb-3">Analyse de Performance</h4>
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4 border border-slate-200">
                        <p className="text-slate-700">{selectedModel.Commentaire}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                          <h5 className="font-medium text-slate-900 mb-2">Points Forts</h5>
                          <ul className="text-sm text-slate-600 space-y-1">
                            {selectedModel.Precision > 0.7 && <li>• Bonne précision des détections</li>}
                            {selectedModel.Accuracy > 0.85 && <li>• Haute exactitude globale</li>}
                            {!selectedModel.Commentaire.includes('fausses alertes') && <li>• Faible taux de faux positifs</li>}
                            {selectedModel['F1-score'] > 0.65 && <li>• Excellent équilibre précision/rappel</li>}
                            {selectedModel.Recall > 0.6 && <li>• Bonne détection des fraudes</li>}
                          </ul>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                          <h5 className="font-medium text-slate-900 mb-2">Améliorations</h5>
                          <ul className="text-sm text-slate-600 space-y-1">
                            {selectedModel.Recall < 0.6 && <li>• Améliorer la détection des fraudes</li>}
                            {selectedModel.Commentaire.includes('fausses alertes') && <li>• Réduire les faux positifs</li>}
                            {selectedModel['F1-score'] < 0.6 && <li>• Optimiser l'équilibre précision/rappel</li>}
                            {selectedModel.Precision < 0.7 && <li>• Augmenter la précision des alertes</li>}
                            {selectedModel.Accuracy < 0.85 && <li>• Améliorer la justesse globale</li>}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                    <div className="text-sm text-slate-500">
                      Modèle entraîné sur 12,543 transactions • Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center space-x-3">
                      {/*  BOUTON D'EXPORTATION INDIVIDUEL */}
                      <button 
                        onClick={() => exportSingleModel(selectedModel)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors duration-200 flex items-center space-x-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Exporter Modèle</span>
                      </button>
                      <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors duration-200">
                        Réentraîner
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200/60">
                  <div className="text-slate-400 text-6xl mb-4"></div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun modèle sélectionné</h3>
                  <p className="text-slate-500">Choisissez un modèle dans la liste pour voir ses détails</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelsModal;