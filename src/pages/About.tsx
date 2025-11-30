function About() {
  return (
    <main className="container mx-auto p-4 max-w-3xl">
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">About</h1>
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            PC Pokémon is a web application that allows trainers to manage their Pokémon collection
            and trade with other trainers.
          </p>
          <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-4">Features</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
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
