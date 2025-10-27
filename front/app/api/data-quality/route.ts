// app/api/data-quality/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log(' Fetching data quality from Flask...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const flaskResponse = await fetch('http://localhost:5000/api/data-quality', {
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
    console.log('Data quality received from Flask:', data);
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error(' Error fetching data quality:', error);
    
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Impossible de récupérer les données de qualité depuis Flask',
        details: error instanceof Error ? error.message : 'Erreur de connexion'
      }, 
      { status: 500 }
    );
  }
}