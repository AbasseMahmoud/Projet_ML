"use client";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import TransactionnelModal, { TransactionResult } from '../components/TransactionModal';
import AlertsModal from './AlertsModal';
import ConfusionMatrices from '../components/ConfusionMatrices';
import DataDistribution from '../components/DataDistribution';
import AnalyticsModal from '../components/AnalyticsModal';
import NormalisationStatsModal from '../components/NormalisationStats';

// Interface pour le message flash - CORRIGÉE
interface FlashMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  transactionResult?: {
    type: 'transaction' | 'fraude'; // ✅ Changé de isFraud à type
    probability: number;
    transactionData: any;
    prediction: any | null;
  };
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [flashMessages, setFlashMessages] = useState<FlashMessage[]>([]);

  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isModelsModalOpen, setIsModelsModalOpen] = useState(false);
  const [isConfusionMatricesOpen, setIsConfusionMatricesOpen] = useState(false);
  const [isDataDistributionOpen, setIsDataDistributionOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isNormalisationStatsOpen, setIsNormalisationStatsOpen] = useState(false);

  // Fonction pour ajouter un message flash
  const addFlashMessage = (message: Omit<FlashMessage, 'id' | 'timestamp'>) => {
    const newMessage: FlashMessage = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    
    setFlashMessages(prev => [newMessage, ...prev]);
  };

  // Fonction pour supprimer un message flash
  const removeFlashMessage = (id: string) => {
    setFlashMessages(prev => prev.filter(msg => msg.id !== id));
  };

  // Suppression automatique après 5 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (flashMessages.length > 0) {
        setFlashMessages(prev => prev.slice(0, -1));
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [flashMessages]);

  // Fonction pour déterminer les styles du message flash
  const getFlashMessageStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  // Fonction pour obtenir l'icône du message
  const getFlashMessageIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return '💡';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex">
      {/* Messages Flash */}
      {flashMessages.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md w-full">
          {flashMessages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-2xl border-2 shadow-lg animate-fade-in-up ${getFlashMessageStyles(message.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-xl mt-0.5">{getFlashMessageIcon(message.type)}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm mb-1">{message.title}</h4>
                    <p className="text-sm opacity-90">{message.message}</p>
                    {message.transactionResult && (
                      <div className="mt-2 p-2 bg-white/50 rounded-lg">
                        <p className="text-xs font-medium">
                          {/* ✅ CORRIGÉ : Utiliser type au lieu de isFraud */}
                          Statut: {message.transactionResult.type === 'fraude' ? 'Fraude' : 'Transaction Normale'}
                        </p>
                        <p className="text-xs">
                          Risque: {(message.transactionResult.probability || 0).toFixed(1)}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeFlashMessage(message.id)}
                  className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}

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
              <Link href='/dashboard' className="text-2xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FraudShield
              </Link>
              <p className="text-xs text-slate-500">AI Powered</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-8 px-4">
          {[
            { 
              id: 'transactions', 
              name: 'Transactions', 
              icon: '💳', 
              onClick: () => setIsTransactionsModalOpen(true)
            },
            { 
              id: 'alerts', 
              name: 'Modeles IA et Valeurs', 
              icon: '🚨', 
              badge: '2',
              onClick: () => setIsAlertsModalOpen(true)
            },
            { 
              id: 'analytics', 
              name: 'Valeurs Aberantes', 
              icon: '📈', 
              badge: '',
              onClick: () => setIsAnalyticsModalOpen(true) 
            },
            { 
              id: 'confusion-matrices', 
              name: 'Matrices Confusion', 
              icon: '📊', 
              badge: '5',
              onClick: () => setIsConfusionMatricesOpen(true)
            },
            {
              id: 'data-distribution', 
              name: 'Distribution Données', 
              icon: '📈', 
              badge: '2',
              onClick: () => setIsDataDistributionOpen(true)
            },
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

      {/* Modal des Transactions - VERSION CORRIGÉE */}
      <TransactionnelModal 
        open={isTransactionsModalOpen}
        onClose={() => setIsTransactionsModalOpen(false)}
        onSave={(transactionResult) => {
          if (transactionResult) {
            console.log('Transaction sauvegardée:', transactionResult);
            
            // ✅ CORRIGÉ : Utiliser transactionResult.type
            let messageType: 'success' | 'warning' | 'error' = 'success';
            let messageTitle = 'Transaction Approuvée';
            let messageText = 'La transaction a été analysée et approuvée avec succès.';

            if (transactionResult.type === 'fraude') {
              messageType = 'error';
              messageTitle = 'Fraude Détectée !';
              messageText = 'Transaction bloquée - Activité suspecte détectée.';
            }

            // Ajouter le message flash
            addFlashMessage({
              type: messageType,
              title: messageTitle,
              message: messageText,
              transactionResult: {
                type: transactionResult.type, // ✅ Utiliser type
                probability: transactionResult.probability,
                transactionData: transactionResult.transactionData,
                prediction: transactionResult.prediction
              }
            });
          }
          
          setIsTransactionsModalOpen(false);
        }}
      />

      {/* Modal des Alertes */}
      <AlertsModal
        open={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
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

      {/* Modal des Analytiques */}
      <AnalyticsModal 
        open={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;