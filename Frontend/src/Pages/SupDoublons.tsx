import { useEffect, useState } from 'react';

function SupprimerDoublons() {
  const [data, setData] = useState<{ Avant: number; Apres: number; Supprimes: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/supprimer-doublons') // vérifie bien l'URL
      .then(response => response.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la suppression des doublons :', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Résultat de la suppression des doublons</h2>
      {data ? (
        <ul>
          <li>Nombre de lignes avant : {data.Avant}</li>
          <li>Nombre de lignes après : {data.Apres}</li>
          <li>Doublons supprimés : {data.Supprimes}</li>
        </ul>
      ) : (
        <p>Aucun résultat disponible.</p>
      )}
    </div>
  );
}

export default SupprimerDoublons;
