'use client';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';

import { apiService } from '../services/apiService';

const Home = () => {
  // Fonction pour tester la connexion à l'API
  const testApiConnection = async () => {
    try {
      const result = await apiService.healthCheck();
      console.log('✅ API connectée:', result);
      alert('✅ Connexion à l\'API réussie !');
    } catch (error) {
      console.error('❌ Erreur API:', error);
      alert('❌ Impossible de se connecter à l\'API');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-purple-600/5 to-blue-600/5"></div>
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        ></motion.div>
        <motion.div
          className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        ></motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-semibold mb-8 shadow-lg"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span>IA de pointe pour la sécurité bancaire</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Détection de fraude bancaire par{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Intelligence Artificielle
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Une solution innovante pour automatiser l'identification des clients frauduleux, permettant aux institutions financières de gagner du temps et de minimiser les risques de fraude.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-6 mb-16"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/dashboard"
                  className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/25 hover:scale-105 transform"
                >
                  <span className="relative z-10">Démarrer l'analyse</span>
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={testApiConnection}
                  className="group relative bg-white text-indigo-600 border-2 border-indigo-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all duration-300 shadow-xl hover:shadow-indigo-500/10 hover:scale-105 transform"
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Tester la connexion API</span>
                  </span>
                </button>
              </motion.div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <motion.div
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>61.3% de précision</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Analyse en 2 secondes</span>
              </motion.div>
              <motion.div
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>10K+ transactions analysées</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-slate-50 to-white"></div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Notre Solution{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                IA
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Nous avons développé un modèle d'IA basé sur le machine learning pour identifier a priori les cas de fraude bancaire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              className="group text-center p-8 bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-slate-200/60"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  ✓
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sécurité Renforcée</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Détection proactive des transactions suspectes avec un taux de précision de 61.3%.
              </p>
            </motion.div>

            <motion.div
              className="group text-center p-8 bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-slate-200/60"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  ⚡
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Temps Réel</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Analyse instantanée des transactions avec résultats en moins de 2 secondes.
              </p>
            </motion.div>

            <motion.div
              className="group text-center p-8 bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-slate-200/60"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  📊
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Analytics Complets</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Tableaux de bord détaillés avec métriques de performance et tendances.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Comment ça marche ?</h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              Notre processus en 3 étapes simples pour détecter les fraudes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold shadow-2xl group-hover:shadow-white/20 transition-all duration-300 group-hover:scale-110">
                  1
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/60 rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Saisie des données</h3>
              <p className="text-indigo-100 text-lg leading-relaxed">
                Entrez les informations de la transaction via notre interface intuitive
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold shadow-2xl group-hover:shadow-white/20 transition-all duration-300 group-hover:scale-110">
                  2
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/60 rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Analyse IA</h3>
              <p className="text-indigo-100 text-lg leading-relaxed">
                Notre modèle évalue la transaction en temps réel avec plus de 50 indicateurs
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold shadow-2xl group-hover:shadow-white/20 transition-all duration-300 group-hover:scale-110">
                  3
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/60 rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Résultats détaillés</h3>
              <p className="text-indigo-100 text-lg leading-relaxed">
                Recevez un rapport complet avec niveau de risque et recommandations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Chiffres Clés</h2>
            <p className="text-gray-600 text-lg">Notre impact en quelques chiffres</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="group text-center p-8 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-3xl hover:shadow-xl transition-all duration-300 hover:scale-105 border border-indigo-200/50">
              <div className="text-5xl font-bold text-indigo-600 mb-4 group-hover:scale-110 transition-transform duration-300">61.3%</div>
              <div className="text-gray-700 font-semibold text-lg">Précision</div>
              <div className="text-gray-500 text-sm mt-2">Taux de détection</div>
            </div>
            <div className="group text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl hover:shadow-xl transition-all duration-300 hover:scale-105 border border-purple-200/50">
              <div className="text-5xl font-bold text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300">2s</div>
              <div className="text-gray-700 font-semibold text-lg">Temps d'analyse</div>
              <div className="text-gray-500 text-sm mt-2">Analyse instantanée</div>
            </div>
            <div className="group text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl hover:shadow-xl transition-all duration-300 hover:scale-105 border border-blue-200/50">
              <div className="text-5xl font-bold text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">10K+</div>
              <div className="text-gray-700 font-semibold text-lg">Transactions</div>
              <div className="text-gray-500 text-sm mt-2">Analysées quotidiennement</div>
            </div>
            <div className="group text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl hover:shadow-xl transition-all duration-300 hover:scale-105 border border-green-200/50">
              <div className="text-5xl font-bold text-green-600 mb-4 group-hover:scale-110 transition-transform duration-300">99.9%</div>
              <div className="text-gray-700 font-semibold text-lg">Disponibilité</div>
              <div className="text-gray-500 text-sm mt-2">Service 24/7</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-blue-600/10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-blue-600/90 backdrop-blur-sm rounded-3xl p-12 md:p-16 text-white text-center shadow-2xl border border-white/10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Prêt à améliorer votre sécurité financière ?</h2>
            <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
              Testez notre solution de détection de fraude bancaire dès aujourd'hui et découvrez comment l'IA peut révolutionner votre approche de la sécurité.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                href="/dashboard"
                className="group relative bg-white text-indigo-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-white/20 hover:scale-105 transform"
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Essayer la démo</span>
                </span>
              </Link>

              <button className="group relative bg-transparent border-2 border-white text-white px-10 py-4 rounded-2xl font-bold hover:bg-white hover:text-indigo-600 transition-all duration-300 hover:scale-105 transform">
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Contacter notre équipe</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">FraudDetect</h3>
                  <p className="text-gray-400 text-sm">AI-Powered Security</p>
                </div>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Solution innovante de détection de fraude bancaire par intelligence artificielle pour une sécurité financière optimale.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Navigation</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors duration-200 flex items-center space-x-2">
                  <span>→</span><span>Accueil</span>
                </Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors duration-200 flex items-center space-x-2">
                  <span>→</span><span>Se connecter</span>
                </Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors duration-200 flex items-center space-x-2">
                  <span>→</span><span>Dashboard</span>
                </Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors duration-200 flex items-center space-x-2">
                  <span>→</span><span>À propos</span>
                </Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Technologies</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>Machine Learning</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>React & Next.js</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Python Flask</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Tailwind CSS</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Analyse temps réel</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">&copy; 2025 FraudDetect. Tous droits réservés.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </Link>
                <Link href="https://www.github.com/AbasseMahmoud" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
