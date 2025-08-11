import React, { useState, useEffect } from "react";
import styles from "./liste.module.css";

// Type pour un Pokémon
type Pokemon = {
  id: number;
  name_french: string;
  hires: string;
  types: string[];
};

// Props attendues par la modale
type ModalProps = {
  pokemon: Pokemon | null;
  onClose: () => void;
  onUpdate: (updatedPokemon: Pokemon) => void;
  onDelete: (pokemonId: number) => void;
  onAddFavorite: (pokemon: Pokemon) => void;
};

// Composant modale d’un Pokémon
function PokemonModal({ pokemon, onClose, onUpdate, onDelete, onAddFavorite }: ModalProps) {
  const [editedPokemon, setEditedPokemon] = useState<Pokemon | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditedPokemon(pokemon);
    setIsEditing(false);
  }, [pokemon]);

  if (!editedPokemon) return null;

  const handleChange = (field: keyof Pokemon, value: any) => {
    setEditedPokemon({ ...editedPokemon, [field]: value });
  };

  const saveChanges = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/pokemons/update/${editedPokemon.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedPokemon),
      });
      if (res.ok) {
        onUpdate(editedPokemon);
        setIsEditing(false);
        alert("Modifications sauvegardées !");
      } else {
        alert("Erreur lors de la sauvegarde.");
      }
    } catch (e) {
      alert("Erreur réseau.");
    }
  };

  const deletePokemon = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/pokemons/delete/${editedPokemon.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onDelete(editedPokemon.id);
        onClose();
        alert("Pokémon supprimé avec succès !");
      } else {
        alert("Erreur lors de la suppression.");
      }
    } catch (e) {
      alert("Erreur réseau.");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>

        {!isEditing ? (
          <>
            <h2>{editedPokemon.name_french}</h2>
            <img src={editedPokemon.hires} alt={editedPokemon.name_french} style={{ width: "100%", borderRadius: "10px" }} />
            <p><strong>Type(s) :</strong> {editedPokemon.types.join(", ")}</p>
            <p><strong>ID :</strong> {editedPokemon.id}</p>

            <button onClick={() => onAddFavorite(editedPokemon)}>Ajouter aux favoris</button>
            <button onClick={() => setIsEditing(true)}>Modifier</button>
            <button onClick={deletePokemon} style={{ marginLeft: "10px", color: "red" }}>Supprimer</button>
          </>
        ) : (
          <>
            <h2>Modifier Pokémon</h2>
            <label>Nom :</label>
            <input
              type="text"
              value={editedPokemon.name_french}
              onChange={(e) => handleChange("name_french", e.target.value)}
            />
            <label>Image URL :</label>
            <input
              type="text"
              value={editedPokemon.hires}
              onChange={(e) => handleChange("hires", e.target.value)}
            />
            <label>Types (séparés par des virgules) :</label>
            <input
              type="text"
              value={editedPokemon.types.join(", ")}
              onChange={(e) =>
                handleChange(
                  "types",
                  e.target.value.split(",").map((type) => type.trim())
                )
              }
            />
            <div style={{ marginTop: "15px" }}>
              <button onClick={saveChanges}>Sauvegarder</button>
              <button onClick={() => setIsEditing(false)} style={{ marginLeft: "10px" }}>Annuler</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Composant principal de la liste de Pokémon
function Liste() {
  const [pokemons, setPokemons] = useState<Array<Pokemon>>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Array<Pokemon>>([]);
  const [favorites, setFavorites] = useState<Array<number>>(() => {
    const storedFavorites = localStorage.getItem("favorites");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  const [limit, setLimit] = useState(10);
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterFavorites, setFilterFavorites] = useState(false); // Nouveau filtre pour les favoris
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    fetchPokemons();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [limit, filterName, filterType, filterFavorites, pokemons]);

  const fetchPokemons = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/pokemons/list`);
      const data = await response.json();
      setPokemons(
        data.map((pokemon: any) => ({
          id: pokemon.id,
          name_french: pokemon.name_french,
          hires: pokemon.hires,
          types: pokemon.types.split(",").map((type: string) => type.trim()),
        }))
      );
    } catch (error) {
      console.error("Erreur lors de la récupération des Pokémon :", error);
    }
  };

  const applyFilters = () => {
    let filtered = [...pokemons];
    filtered = filtered.slice(0, limit);

    if (filterName) {
      filtered = filtered.filter((pokemon) =>
        pokemon.name_french.toLowerCase().includes(filterName.toLowerCase())
      );
    }

    if (filterType) {
      filtered = filtered.filter((pokemon) =>
        pokemon.types.some((type) => type.toLowerCase() === filterType.toLowerCase())
      );
    }

    if (filterFavorites) {
      filtered = filtered.filter((pokemon) => favorites.includes(pokemon.id));
    }

    setFilteredPokemons(filtered);
  };

  const handleUpdate = (updatedPokemon: Pokemon) => {
    setPokemons((prev) =>
      prev.map((p) => (p.id === updatedPokemon.id ? updatedPokemon : p))
    );
  };

  const handleDelete = (pokemonId: number) => {
    setPokemons((prev) => prev.filter((p) => p.id !== pokemonId));
  };

  const handleAddFavorite = (pokemon: Pokemon) => {
    if (!favorites.includes(pokemon.id)) {
      const updatedFavorites = [...favorites, pokemon.id];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      alert(`${pokemon.name_french} ajouté aux favoris !`);
    } else {
      alert(`${pokemon.name_french} est déjà dans les favoris.`);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Pokedex</h1>
      <div className={styles.controls}>
        <label htmlFor="limit">Nombre de Pokémon à afficher :</label>
        <select
          id="limit"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={809}>Tous</option>
        </select>
        <input
          type="text"
          placeholder="Filtrer par nom"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filtrer par type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={filterFavorites}
            onChange={(e) => setFilterFavorites(e.target.checked)}
          />
          Afficher uniquement les favoris
        </label>
      </div>
      <div className={styles.cards}>
        {filteredPokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            className={styles.card}
            onClick={() => setSelectedPokemon(pokemon)}
            style={{ cursor: "pointer" }}
          >
            <img src={pokemon.hires} alt={pokemon.name_french} />
            <h2>{pokemon.name_french}</h2>
            <p>Type(s) : {pokemon.types.join(", ")}</p>
            <p>ID : {pokemon.id}</p>
          </div>
        ))}
      </div>
      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onAddFavorite={handleAddFavorite}
        />
      )}
    </div>
  );
}

export default Liste;