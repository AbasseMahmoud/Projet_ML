// app/api/analyse-metrics/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Fetching metrics from Flask API...');
    
    // Appel à votre API Flask
    const flaskResponse = await fetch('http://localhost:5000/api/analyse-metrics', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!flaskResponse.ok) {
      throw new Error(`Flask API error: ${flaskResponse.status}`);
    }

    const data = await flaskResponse.json();
    console.log('✅ Metrics fetched successfully');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error fetching from Flask:', error);
    
    // Données simulées en cas d'erreur
    const mockData = [
      {
        Model: "RandomForest",
        Accuracy: 0.882353,
        Precision: 0.75,
        Recall: 0.45,
        "F1-score": 0.540230,
        Commentaire: "Nombre élevé de fraudes non détectées."
      },
      {
        Model: "DecisionTree",
        Accuracy: 0.885294,
        Precision: 0.72,
        Recall: 0.44,
        "F1-score": 0.535714,
        Commentaire: "Nombre élevé de fraudes non détectées."
      },
      {
        Model: "KNeighbors",
        Accuracy: 0.827941,
        Precision: 0.65,
        Recall: 0.38,
        "F1-score": 0.460829,
        Commentaire: "Nombre élevé de fraudes non détectées."
      }
    ];

    console.log('📊 Using mock data');
    return NextResponse.json(mockData);
  }
}