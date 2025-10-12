import  { useEffect, useState } from 'react';

const Home = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(console.error);
  }, []);

  return (
    <div className='container'>
      <h1>Page d'accueil</h1>
      <p>Message depuis Flask: {message}</p>
    </div>
  );
};

export default Home;
