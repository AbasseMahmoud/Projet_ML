import { useState, useEffect } from "react";

type DataRow = {
  [key: string]: string | number;
};

const Data = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
      .then((response) => response.json())
      .then((jsonData) => {
        // jsonData est un objet avec des colonnes -> on transforme en tableau de lignes
        const keys = Object.keys(jsonData);
        const rowCount = Object.values(jsonData[keys[0]]).length;

        const rows: DataRow[] = [];

        for (let i = 0; i < rowCount; i++) {
          const row: DataRow = {};
          keys.forEach((key) => {
            row[key] = jsonData[key][i];
          });
          rows.push(row);
        }

        setData(rows);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement :", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des données...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Aperçu des données</h2>
      <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key} className="border border-gray-300 px-2 py-1">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {Object.values(row).map((value, i) => (
                <td key={i} className="border border-gray-300 px-2 py-1">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Data;
