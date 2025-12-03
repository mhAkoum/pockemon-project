function About() {
  return (
    <main className="container mx-auto p-4 max-w-3xl">
      <div className="pokemon-box mt-8">
        <h1 className="pokemon-title mb-6">About</h1>
        <div className="pokemon-box-inner">
          <p className="pokemon-text mb-4">
            PC Pokémon is a web application that allows trainers to manage their Pokémon collection
            and trade with other trainers.
          </p>
          <h2 className="pokemon-subtitle mt-6 mb-4">Features</h2>
          <ul className="list-disc list-inside pokemon-text space-y-2">
            <li>Manage your Pokémon boxes</li>
            <li>Search for Pokémon and trainers</li>
            <li>Trade system between trainers</li>
            <li>Custom user profile</li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default About;
