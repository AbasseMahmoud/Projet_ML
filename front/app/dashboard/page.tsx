"use client";

import React, { useState } from 'react';
import TransactionnelModal from '../components/TransactionModal';
import AlertsModal from './AlertsModal';
import ModelsModal from './ModelsModal';
import ConfusionMatrices from '../components/ConfusionMatrices';
import DataDistribution from '../components/DataDistribution';
import AnalyticsModal from '../components/AnalyticsModal';
import NormalisationStatsModal from '../components/NormalisationStats';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
   
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false); 
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isModelsModalOpen, setIsModelsModalOpen] = useState(false);
  const [isConfusionMatricesOpen, setIsConfusionMatricesOpen] = useState(false); // Ajoutez cet état
  const [isDataDistributionOpen, setIsDataDistributionOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isNormalisationStatsOpen, setIsNormalisationStatsOpen] = useState(false);
  // Données simulées
  const statsData = {
    totalTransactions: 12543,
    fraudDetected: 89,
    accuracyRate: 98.7,
    falsePositives: 23,
    savings: 245000
  };

  const recentAlerts = [
    { id: 1, transaction: 'TRX-7845', amount: '€2,450.00', status: 'Fraude suspectée', time: '2 min', priority: 'high' as const, user: 'Jean D.' },
    { id: 2, transaction: 'TRX-7844', amount: '€150.00', status: 'Analyse en cours', time: '5 min', priority: 'medium' as const, user: 'Marie L.' },
    { id: 3, transaction: 'TRX-7842', amount: '€890.00', status: 'Approuvé', time: '10 min', priority: 'low' as const, user: 'Pierre M.' },
    { id: 4, transaction: 'TRX-7840', amount: '€1,250.00', status: 'Fraude confirmée', time: '15 min', priority: 'high' as const, user: 'Sophie T.' }
  ];

  const modelPerformance = [
    { metric: 'Accuracy', value: 98.7, target: 97.5, color: 'bg-gradient-to-r from-green-400 to-emerald-500' },
    { metric: 'Precision', value: 95.2, target: 94.0, color: 'bg-gradient-to-r from-blue-400 to-cyan-500' },
    { metric: 'Recall', value: 92.8, target: 91.0, color: 'bg-gradient-to-r from-purple-400 to-indigo-500' },
    { metric: 'F1-Score', value: 94.0, target: 92.5, color: 'bg-gradient-to-r from-orange-400 to-red-500' }
  ];

  // Gestionnaire d'actions pour les alertes
  const handleAlertAction = (alertId: number, action: string) => {
    console.log(`Action "${action}" sur l'alerte ${alertId}`);
    // Ici vous pouvez ajouter la logique pour traiter l'alerte
    // Par exemple, appeler une API, mettre à jour l'état, etc.
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-xl border-r border-slate-200/60 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-500 ease-out lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:h-screen lg:sticky lg:top-0 shadow-2xl shadow-blue-500/5`}>
        {/* Logo */}
        <div className="flex items-center justify-center h-20 border-b border-slate-200/60 px-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FraudShield
              </h1>
              <p className="text-xs text-slate-500">AI Powered</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 mt-8 px-4">
          {[
           
            { 
              id: 'normalisation',  
              name: 'Normalisation', 
              icon: '⚖️', 
              badge: 'New',
              onClick: () => setIsNormalisationStatsOpen(true)
            },
            { 
              id: 'transactions', 
              name: 'Transactions', 
              icon: '💳', 
              badge: '12',
              onClick: () => setIsTransactionsModalOpen(true)
            },
            { 
              id: 'alerts', 
              name: 'Valeurs', 
              icon: '🚨', 
              badge: '3',
              onClick: () => setIsAlertsModalOpen(true)
            },
            { 
              id: 'analytics', 
              name: 'Valeurs Aberantes', 
              icon: '📈', 
              badge: null,
              onClick: () => setIsAnalyticsModalOpen(true) 
            },
            
            { 
              id: 'models', 
              name: 'Modèles IA', 
              icon: '🤖', 
              badge: 'New',
              onClick: () => setIsModelsModalOpen(true)
            },
            { 
              id: 'confusion-matrices', 
              name: 'Matrices Confusion', 
              icon: '📊', 
              badge: 'New',
              onClick: () => setIsConfusionMatricesOpen(true)
            },
            {
            id: 'data-distribution', 
            name: 'Distribution Données', 
            icon: '📈', 
            badge: 'New',
            onClick: () => setIsDataDistributionOpen(true)
          },
          { id: 'reports', name: 'Rapports', icon: '📋', badge: null },
            { id: 'settings', name: 'Paramètres', icon: '⚙️', badge: null }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.onClick) {
                  item.onClick();
                }
              }}
              className={`group relative w-full flex items-center justify-between px-4 py-3 rounded-2xl mb-2 transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25' 
                  : 'text-slate-600 hover:bg-white hover:shadow-lg hover:shadow-slate-500/10 hover:border hover:border-slate-200/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                <span className="font-semibold">{item.name}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === item.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-indigo-100 text-indigo-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-6 border-t border-slate-200/60">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl p-4 border border-slate-200/60 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">AD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate">Admin User</p>
                <p className="text-sm text-slate-500 truncate">adminfraude@gmail.com</p>
              </div>
              <button className="p-2 hover:bg-white rounded-xl transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40">
          <div className="flex items-center justify-between px-8 py-5">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl bg-white shadow-lg shadow-slate-500/10 border border-slate-200/60 text-slate-600 hover:text-indigo-600 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Tableau de Bord</h1>
                <p className="text-slate-500">Bienvenue sur votre espace de surveillance</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Search */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 w-80"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Notifications */}
              <button className="relative p-3 rounded-xl bg-white shadow-lg shadow-slate-500/10 border border-slate-200/60 text-slate-600 hover:text-indigo-600 transition-all duration-200 hover:shadow-indigo-500/25">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-8 overflow-auto">
          {/* Stats Grid */}
          {/* Charts and Alerts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            {/* Performance Metrics */}

            {/* Recent Alerts */}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-lg shadow-slate-500/10">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Actions Rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: '📊', title: 'Nouveau Rapport', desc: 'Générer un rapport détaillé' },
                { icon: '🤖', title: 'Entraîner Modèle', desc: 'Optimiser les performances' },
                { icon: '📋', title: 'Matrices Confusion', desc: 'Analyser les performances' },
                { icon: '⚙️', title: 'Paramètres', desc: 'Configurer le système' },
                { icon: '📊', title: 'Distribution Données', desc: 'Analyser le déséquilibre des classes' }
              ].map((action, index) => (
                <button 
                  key={index} 
                  className="group p-6 bg-slate-50 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 rounded-2xl border border-slate-200/60 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 text-left"
                  onClick={() => {
                    if (action.title === 'Entraîner Modèle') {
                      setIsModelsModalOpen(true);
                    } else if (action.title === 'Matrices Confusion') {
                      setIsConfusionMatricesOpen(true);
                    }
                  }}
                >
                  <div className="w-14 h-14 bg-white group-hover:bg-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{action.icon}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{action.title}</h3>
                  <p className="text-sm text-slate-600">{action.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Modal des Transactions */}
      <TransactionnelModal 
        open={isTransactionsModalOpen}
        onClose={() => setIsTransactionsModalOpen(false)}
        onSave={(transactionData) => {
          console.log('Transaction sauvegardée:', transactionData);
          setIsTransactionsModalOpen(false);
        }}
      />

      {/* Modal des Alertes */}
      <AlertsModal 
        open={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        alerts={recentAlerts}
        onAlertAction={handleAlertAction}
      />

      {/* Modal des Modèles IA */}
      <ModelsModal 
        open={isModelsModalOpen}
        onClose={() => setIsModelsModalOpen(false)}
      />

      {/* Modal des Matrices de Confusion */}
      <ConfusionMatrices 
        open={isConfusionMatricesOpen}
        onClose={() => setIsConfusionMatricesOpen(false)}
      />

<NormalisationStatsModal 
  open={isNormalisationStatsOpen}
  onClose={() => setIsNormalisationStatsOpen(false)}
/>

  <DataDistribution 
  open={isDataDistributionOpen}
  onClose={() => setIsDataDistributionOpen(false)}
/>
 {/* Modal des Analytiques  */}
      <AnalyticsModal 
        open={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;