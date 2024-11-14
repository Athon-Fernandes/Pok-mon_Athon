const pokemonDetails = document.getElementById('pokemonDetails');
const searchInput = document.getElementById('searchInput');
const evolutionContainer = document.getElementById('evolutionContainer');
const typeDetails = document.getElementById('typeDetails');

// Função principal para buscar Pokémon
async function searchPokemon() {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;

    try {
        const pokemon = await fetchData(`https://pokeapi.co/api/v2/pokemon/${query}`);
        displayPokemonDetails(pokemon);
        fetchEvolutionChain(pokemon.species.url);
        fetchTypeDetails(pokemon.types);
    } catch (error) {
        alert('Erro ao buscar o Pokémon. Tente novamente.');
    }
}

// Função auxiliar para buscar dados da API
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Falha ao buscar dados');
    return response.json();
}

// Exibe detalhes do Pokémon
function displayPokemonDetails(pokemon) {
    pokemonDetails.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h3>${capitalizeFirstLetter(pokemon.name)}</h3>
        <p><span class="stat">ID:</span> ${pokemon.id}</p>
        <p><span class="stat">Altura:</span> ${pokemon.height / 10} m</p>
        <p><span class="stat">Peso:</span> ${pokemon.weight / 10} kg</p>
        <p><span class="stat">Tipo:</span> ${pokemon.types.map(type => type.type.name).join(', ')}</p>
    `;
}

// Função auxiliar para capitalizar a primeira letra
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Buscar e exibir a cadeia de evolução
async function fetchEvolutionChain(speciesUrl) {
    try {
        const speciesData = await fetchData(speciesUrl);
        const evolutionData = await fetchData(speciesData.evolution_chain.url);
        displayEvolutionChain(evolutionData.chain);
    } catch (error) {
        console.error('Erro ao buscar a cadeia de evolução:', error);
    }
}

// Exibe a cadeia de evolução
function displayEvolutionChain(chain) {
    evolutionContainer.innerHTML = '';
    let currentChain = chain;

    while (currentChain) {
        const evolutionName = capitalizeFirstLetter(currentChain.species.name);
        const evolutionElement = document.createElement('p');
        evolutionElement.textContent = evolutionName;
        evolutionContainer.appendChild(evolutionElement);

        // Se existir uma evolução para o próximo Pokémon, continua
        currentChain = currentChain.evolves_to[0];
    }
}