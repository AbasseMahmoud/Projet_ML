'use client'; 
import Link from 'next/link';
import React from 'react'; 

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Détection de fraude bancaire par <span className="text-indigo-600">Intelligence Artificielle</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              Une solution innovante pour automatiser l'identification des clients frauduleux, permettant aux institutions financières de gagner du temps et de minimiser les risques de fraude.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {/* REMPLACER LE BOUTON PAR UN LINK */}
              <Link 
                href="/predict" 
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition duration-300 shadow-md text-center"
              >
                Démarrer l'analyse
              </Link>
              
              {/* BOUTON POUR TESTER L'API */}
              <button 
                onClick={testApiConnection}
                className="bg-white text-indigo-600 border border-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-indigo-50 transition duration-300"
              >
                Tester la connexion API
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - RESTE IDENTIQUE */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Solution IA</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nous avons développé un modèle d'IA basé sur le machine learning pour identifier a priori les cas de fraude bancaire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* ... Le reste de votre code Features Section reste identique ... */}
          </div>
        </div>
      </section>

      {/* Process Section - RESTE IDENTIQUE */}
      <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        {/* ... Votre code Process Section reste identique ... */}
      </section>

      {/* CTA Section - MODIFIER LE BOUTON */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à améliorer votre sécurité financière ?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Testez notre solution de détection de fraude bancaire dès aujourd'hui.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {/* REMPLACER CE BOUTON PAR UN LINK */}
              <Link 
                href="/predict"
                className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition duration-300 text-center"
              >
                Essayer la démo
              </Link>
              
              <button className="bg-transparent border border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:bg-opacity-10 transition duration-300">
                Contacter notre équipe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - RESTE IDENTIQUE */}
      <footer className="bg-gray-900 text-white py-12">
        {/* ... Votre code Footer reste identique ... */}
      </footer>
    </div>
  );
}

export default Home;