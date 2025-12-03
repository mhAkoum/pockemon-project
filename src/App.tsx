import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import BoxList from './pages/BoxList';
import BoxDetail from './pages/BoxDetail';
import BoxCreate from './pages/BoxCreate';
import PokemonDetail from './pages/PokemonDetail';
import PokemonAdd from './pages/PokemonAdd';
import PokemonSearch from './pages/PokemonSearch';
import TrainerProfile from './pages/TrainerProfile';
import TrainerSearch from './pages/TrainerSearch';
import ProfileEdit from './pages/ProfileEdit';
import TradeList from './pages/TradeList';
import TradeDetail from './pages/TradeDetail';
import TradeCreate from './pages/TradeCreate';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/boxes"
            element={(
              <ProtectedRoute>
                <BoxList />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/boxes/create"
            element={(
              <ProtectedRoute>
                <BoxCreate />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/boxes/:boxId"
            element={(
              <ProtectedRoute>
                <BoxDetail />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/trades"
            element={(
              <ProtectedRoute>
                <TradeList />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/trades/create"
            element={(
              <ProtectedRoute>
                <TradeCreate />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/trades/:tradeId"
            element={(
              <ProtectedRoute>
                <TradeDetail />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/trainers/search"
            element={(
              <ProtectedRoute>
                <TrainerSearch />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/trainers/:trainerId"
            element={(
              <ProtectedRoute>
                <TrainerProfile />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/pokemons/add"
            element={(
              <ProtectedRoute>
                <PokemonAdd />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/pokemons/search"
            element={(
              <ProtectedRoute>
                <PokemonSearch />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/pokemons/:pokemonId"
            element={(
              <ProtectedRoute>
                <PokemonDetail />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/profile"
            element={(
              <ProtectedRoute>
                <TrainerProfile />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/profile/edit"
            element={(
              <ProtectedRoute>
                <ProfileEdit />
              </ProtectedRoute>
            )}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
