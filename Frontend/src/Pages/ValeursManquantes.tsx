import { useEffect, useState } from 'react';

function ValeursManquantes() {
  const [valeurs, setValeurs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/valeurs-manquantes')
      .then(response => response.json())
      .then(data => {
        setValeurs(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données :', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h2>Valeurs Manquantes</h2>
      {Object.keys(valeurs).length === 0 ? (
        <p>Aucune valeur manquante détectée ✅</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Colonne</th>
              <th>Valeurs Manquantes</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(valeurs).map(([colonne, valeur]) => (
              <tr key={colonne}>
                <td>{colonne}</td>
                <td>{String(valeur)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ValeursManquantes;
