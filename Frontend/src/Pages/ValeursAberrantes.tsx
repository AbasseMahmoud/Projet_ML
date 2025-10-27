import { useEffect, useState } from 'react';

function ValeursAberrantes() {
  const [valeurs, setValeurs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/valeurs-aberrantes')
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
      <h2>Valeurs Aberrantes</h2>
      {Object.keys(valeurs).length === 0 ? (
        <p>Aucune valeur aberrante détectée ✅</p>
      ) : (
        <table cellPadding="8">
          <thead>
            <tr>
              <th>Colonne</th>
              <th>Nombre de valeurs aberrantes</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(valeurs).map(([colonne, valeur]) => (
              <tr key={colonne}>
                <td>{colonne}</td>
                <td> {String (valeur)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ValeursAberrantes;
