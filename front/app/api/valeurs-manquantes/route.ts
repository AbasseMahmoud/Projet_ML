import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:5000/api/valeurs-manquantes');
    if (!response.ok) throw new Error(`Flask error: ${response.status}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur valeurs manquantes' }, { status: 500 });
  }
}