import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white shadow-md" role="banner">
      <nav className="container mx-auto px-4 py-3" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold hover:text-blue-200" aria-label="Home - PC Pokémon">
            PC Pokémon
          </Link>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Login"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Sign up"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/boxes"
                  className="px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="My boxes"
                >
                  My Boxes
                </Link>
                <Link
                  to="/trades"
                  className="px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="My trades"
                >
                  My Trades
                </Link>
                <Link
                  to="/trainers/search"
                  className="px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Search for a trainer"
                >
                  Search Trainer
                </Link>
                <Link
                  to="/pokemons/search"
                  className="px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Search for a Pokémon"
                >
                  Search Pokémon
                </Link>
                <Link
                  to="/profile"
                  className="px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="User profile"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
