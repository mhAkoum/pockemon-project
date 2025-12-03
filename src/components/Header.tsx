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
    <header className="pokemon-header" role="banner">
      <nav className="container mx-auto px-4 py-3" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold hover:opacity-80 transition-opacity flex items-center gap-2" aria-label="Home - PC Pokémon">
            <span className="pokeball-icon" />
            PC Pokémon
          </Link>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="pokemon-button-green hover:opacity-90"
                  aria-label="Login"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="pokemon-button-blue hover:opacity-90"
                  aria-label="Sign up"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/boxes"
                  className="pokemon-button-blue hover:opacity-90"
                  aria-label="My boxes"
                >
                  My Boxes
                </Link>
                <Link
                  to="/trades"
                  className="pokemon-button-orange hover:opacity-90"
                  aria-label="My trades"
                >
                  My Trades
                </Link>
                <Link
                  to="/trainers/search"
                  className="pokemon-button-green hover:opacity-90"
                  aria-label="Search for a trainer"
                >
                  Search Trainer
                </Link>
                <Link
                  to="/pokemons/search"
                  className="pokemon-button-green hover:opacity-90"
                  aria-label="Search for a Pokémon"
                >
                  Search Pokémon
                </Link>
                <Link
                  to="/profile"
                  className="pokemon-button-blue hover:opacity-90"
                  aria-label="User profile"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="pokemon-button-red hover:opacity-90"
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
