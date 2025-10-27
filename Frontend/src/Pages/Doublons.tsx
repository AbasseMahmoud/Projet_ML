import  { useEffect, useState } from 'react';

function Doublons() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/doublons')
      .then(response => response.json())
      .then(result => setData(result))
      .catch(error => console.error('Erreur :', error));
  }, []);

  return (
    <div>
      <h2>Résultat des doublons</h2>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre> // Affiche les données formatées
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
}

export default Doublons;
