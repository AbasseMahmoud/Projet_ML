"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://backend-machinelearning.onrender.com/api/login',
        {
          username: formData.email, // Remplacer selon ton backend si c'est 'username' ou 'email'
          password: formData.password
        }
      );

      console.log('Connexion réussie:', response.data);

      // Stocker le token dans localStorage si tu utilises JWT
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      // Redirection vers le dashboard ou autre page protégée
      window.location.href = '/dashboard';

    } catch (err: any) {
      console.error('Erreur de connexion:', err.response?.data || err.message);
      setError('Nom d’utilisateur ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email professionnel
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            placeholder="votre@entreprise.com"
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            placeholder="Votre mot de passe"
          />
        </div>

        {/* Message d'erreur */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Options */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              Se souvenir de moi
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        {/* Bouton de connexion */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200 shadow-lg ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        {/* Lien d'inscription */}
        <div className="text-center">
          <p className="text-gray-600">
            Pas encore de compte ?{' '}
            <a href="/register" className="text-indigo-600 hover:text-indigo-500 font-semibold">
              S'inscrire
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
