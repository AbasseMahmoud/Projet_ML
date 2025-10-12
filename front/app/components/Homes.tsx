import Link from 'next/link';
import React from 'react';

const Home = () => {
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
                            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition duration-300 shadow-md">
                                Démarrer l'analyse
                            </button>
                            <button className="bg-white text-indigo-600 border border-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-indigo-50 transition duration-300">
                                En savoir plus
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Solution IA</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Nous avons développé un modèle d'IA basé sur le machine learning pour identifier a priori les cas de fraude bancaire.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition duration-300">
                            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Détection Préventive</h3>
                            <p className="text-gray-600">
                                Identification des transactions suspectes avant qu'elles ne soient finalisées, réduisant ainsi les risques de fraude.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition duration-300">
                            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Traitement Rapide</h3>
                            <p className="text-gray-600">
                                Analyse en temps réel des transactions avec une latence minimale, permettant une prise de décision immédiate.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition duration-300">
                            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Analyse Précise</h3>
                            <p className="text-gray-600">
                                Modèles d'IA entraînés sur un jeu de données de 2266 observations avec 14 variables pour une détection optimale.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Notre Méthodologie</h2>
                        <p className="max-w-2xl mx-auto opacity-90">
                            Nous avons suivi une approche rigoureuse pour développer notre solution de détection de fraude.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg">
                            <div className="text-2xl font-bold text-indigo-600 mb-2">1</div>
                            <h3 className="font-bold text-lg text-gray-900 mb-3">Préparation des données</h3>
                            <p className="text-gray-800 font-medium text-sm leading-relaxed">
                                Nettoyage, vérification des valeurs manquantes et gestion du déséquilibre des classes.
                            </p>
                        </div>
                        <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
                            <div className="text-2xl font-bold text-indigo-200 mb-2">2</div>
                            <h3 className="font-bold text-lg mb-2">Modélisation</h3>
                            <p className="text-sm opacity-0.1">Implémentation et entraînement de plusieurs modèles de machine learning.</p>
                        </div>
                        <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
                            <div className="text-2xl font-bold text-indigo-200 mb-2">3</div>
                            <h3 className="font-bold text-lg mb-2">Évaluation</h3>
                            <p className="text-sm opacity-90">Analyse des performances via matrice de confusion, accuracy, précision et rappel.</p>
                        </div>
                        <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
                            <div className="text-2xl font-bold text-indigo-200 mb-2">4</div>
                            <h3 className="font-bold text-lg mb-2">Déploiement</h3>
                            <p className="text-sm opacity-90">Intégration du meilleur modèle dans une application web accessible.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 md:p-12 text-white text-center">
                        <h2 className="text-3xl font-bold mb-4">Prêt à améliorer votre sécurité financière ?</h2>
                        <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                            Testez notre solution de détection de fraude bancaire dès aujourd'hui.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition duration-300">
                                Essayer la démo
                            </button>
                            <button className="bg-transparent border border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:bg-opacity-10 transition duration-300">
                                Contacter notre équipe
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold">FraudDetect AI</h3>
                            </div>
                            <p className="text-gray-400">
                                Solution innovante de détection de fraude bancaire par intelligence artificielle.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-4">Navigation</h4>
                            <ul className="space-y-2">
                                <Link href="#" className="text-gray-400 hover:text-white transition">Accueil</Link>
                                <Link href="#" className="text-gray-400 hover:text-white transition">À propos</Link>
                                <Link href="#" className="text-gray-400 hover:text-white transition">Solution</Link>
                                <Link href="#" className="text-gray-400 hover:text-white transition">Contact</Link>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-4">Ressources</h4>
                            <ul className="space-y-2">
                                <Link href="#" className="text-gray-400 hover:text-white transition">Documentation</Link>
                                <Link href="#" className="text-gray-400 hover:text-white transition">API</Link>
                                <Link href="#" className="text-gray-400 hover:text-white transition">Support</Link>
                                <Link href="#" className="text-gray-400 hover:text-white transition">Blog</Link>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-4">Contact</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>contact@frauddetect-ai.com</li>
                                <li>+33 1 23 45 67 89</li>
                                <li>Paris, France</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} FraudDetect AI. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;