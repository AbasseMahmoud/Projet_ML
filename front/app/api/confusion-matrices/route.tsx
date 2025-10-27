// app/api/confusion-matrices/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Essayez d'abord de récupérer depuis Flask
    const flaskResponse = await fetch('http://localhost:5000/api/matrices-confusion', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (flaskResponse.ok) {
      const data = await flaskResponse.json();
      return NextResponse.json(data);
    }
    
    // Si Flask n'est pas disponible, retournez des données simulées
    console.log('Flask API non disponible, utilisation des données simulées');
    
  } catch (error) {
    console.error('Error fetching from Flask, using mock data:', error);
  }

  // Données simulées complètes
  
  
  
}