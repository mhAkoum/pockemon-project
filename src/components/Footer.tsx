import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-pokemon-grey-dark text-white mt-auto border-t-4 border-black" role="contentinfo">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center">
          <Link
            to="/about"
            className="pokemon-text text-pokemon-grey-light hover:text-white focus:outline-none rounded px-2"
            aria-label="About"
          >
            About
          </Link>
        </div>
        <p className="text-center pokemon-text text-sm mt-4">
          © 2025 PC Pokémon - By Akouma Matata
        </p>
      </div>
    </footer>
  );
}

export default Footer;
