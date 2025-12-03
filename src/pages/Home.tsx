function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="text-center py-12">
        <div className="pokemon-box max-w-2xl mx-auto">
          <h1 className="pokemon-title mb-6">PC Pokémon</h1>
          <div className="pokemon-box-inner">
            <p className="pokemon-text text-xl mb-4">
              Manage and trade your Pokémon with other trainers
            </p>
            <p className="pokemon-text">
              Welcome to your PC Pokémon. Log in to start managing your collection.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;
