import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';

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
                <div className="container mx-auto p-4">
                  <p>My Boxes - Coming soon</p>
                </div>
              </ProtectedRoute>
            )}
          />
          <Route
            path="/trades"
            element={(
              <ProtectedRoute>
                <div className="container mx-auto p-4">
                  <p>My Trades - Coming soon</p>
                </div>
              </ProtectedRoute>
            )}
          />
          <Route
            path="/trainers/search"
            element={(
              <ProtectedRoute>
                <div className="container mx-auto p-4">
                  <p>Search Trainer - Coming soon</p>
                </div>
              </ProtectedRoute>
            )}
          />
          <Route
            path="/pokemons/search"
            element={(
              <ProtectedRoute>
                <div className="container mx-auto p-4">
                  <p>Search Pokémon - Coming soon</p>
                </div>
              </ProtectedRoute>
            )}
          />
          <Route
            path="/profile"
            element={(
              <ProtectedRoute>
                <div className="container mx-auto p-4">
                  <p>Profile - Coming soon</p>
                </div>
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
