import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-auto" role="contentinfo">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center">
          <Link
            to="/about"
            className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded px-2"
            aria-label="About"
          >
            About
          </Link>
        </div>
        <p className="text-center text-gray-400 text-sm mt-4">
          © 2024 PC Pokémon - All rights reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;
