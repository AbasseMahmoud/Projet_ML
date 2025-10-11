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
          <Link to="/register" className="hover:text-gray-300">Inscription</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
