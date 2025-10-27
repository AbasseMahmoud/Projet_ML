// app/api/data-distribution/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔄 Tentative de connexion à Flask pour données SMOTE...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

   const flaskResponse = await fetch('http://localhost:5000/api/data-distribution', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!flaskResponse.ok) {
      const errorText = await flaskResponse.text();
      throw new Error(`Flask API error: ${flaskResponse.status} - ${errorText}`);
    }

    const data = await flaskResponse.json();
    console.log('✅ Données SMOTE reçues de Flask:', data);
    
    return NextResponse.json({
      ...data,
      source: 'flask_dynamic',
      fetchedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erreur de connexion à Flask:', error);
    
    // Retourne une erreur claire
    return NextResponse.json(
      { 
        error: 'Impossible de récupérer les données dynamiques depuis Flask',
        details: error instanceof Error ? error.message : 'Erreur de connexion',
        source: 'error',
        fetchedAt: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}