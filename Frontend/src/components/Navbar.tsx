import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo ou nom du projet */}
        <Link to="/" className="text-xl font-bold">
          Projet_ML
        </Link>

        {/* Liens de navigation */}
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/login" className="hover:text-gray-300">Connexion</Link>
          <Link to="/data" className="hover:text-gray-300">DataFrame</Link>
          <Link to="/register" className="hover:text-gray-300">Inscription</Link>
          <Link to="/doublons" className="hover:text-gray-300">DB</Link>
          <Link to="/valeurmanquantes" className="hover:text-gray-300">VM</Link>
          <Link to="/doublonsupprimes" className="hover:text-gray-300">SuppresionDoublons</Link>
          <Link to="/valeursAberrantes" className="hover:text-gray-300">ValeursAberrantes</Link>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
