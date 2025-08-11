import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ajout.module.css";

// Composant Ajout pour ajouter un nouveau Pokémon
function Ajout() {
  // État local pour stocker les données du formulaire
  const [formData, setFormData] = useState({
    id: "",
    name_french: "",
    types: "",
    abilities: "",
    hp: "",
    attack: "",
    defense: "",
    sp_attack: "",
    sp_defense: "",
    speed: "",
    description: "",
    height: "",
    weight: "",
    hires: "",
  });

  const navigate = useNavigate(); // Pour naviguer vers une autre page après soumission

  // Gère les changements dans les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Met à jour le champ modifié
  };

  // Gère la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifie que certains champs sont bien des nombres
    const numericFields = ["hp", "attack", "defense", "sp_attack", "sp_defense", "speed"];
    for (const field of numericFields) {
      if (isNaN(Number(formData[field]))) {
        alert(`Le champ ${field} doit contenir un nombre valide.`);
        return;
      }
    }

    try {
      // Récupère le dernier ID existant depuis l’API
      const lastIdResponse = await fetch("http://localhost:3001/api/pokemons/last-id");
      if (lastIdResponse.ok) {
        const { lastId } = await lastIdResponse.json();
        formData.id = (lastId + 1).toString(); // Incrémente l'ID pour le nouveau Pokémon
      } else {
        alert("Erreur lors de la récupération du dernier ID.");
        return;
      }


      // Utiliser une image par défaut si le champ hires est vide
      if (!formData.hires) {
        formData.hires = "../../../../public/lapin.webp"; // Chemin de l'image par défaut
      }

      // Ajout du Pokémon
      // Envoie les données à l’API pour ajouter un nouveau Pokémon
      const response = await fetch("http://localhost:3001/api/pokemons/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Si la réponse est positive, réinitialise le formulaire et redirige
      if (response.ok) {
        alert("Pokémon ajouté avec succès !");
        setFormData({
          id: "",
          name_french: "",
          types: "",
          abilities: "",
          hp: "",
          attack: "",
          defense: "",
          sp_attack: "",
          sp_defense: "",
          speed: "",
          description: "",
          height: "",
          weight: "",
          hires: "",
        });
        navigate("/"); // Redirection vers la page d'accueil
      } else {
        alert("Erreur lors de l'ajout du Pokémon.");
      }
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Ajouter un Pokémon</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Champ pour le nom français */}
        <input
          type="text"
          name="name_french"
          placeholder="Nom (Français)"
          value={formData.name_french}
          onChange={handleChange}
          required
        />
        {/* Champ pour les types */}
        <input
          type="text"
          name="types"
          placeholder="Type(s)"
          value={formData.types}
          onChange={handleChange}
          required
        />
        {/* Champ pour les capacités */}
        <input
          type="text"
          name="abilities"
          placeholder="Capacités (séparées par des virgules)"
          value={formData.abilities}
          onChange={handleChange}
        />
        {/* Statistiques de base */}
        <input
          type="text"
          name="hp"
          placeholder="HP"
          value={formData.hp}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="attack"
          placeholder="Attaque"
          value={formData.attack}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="defense"
          placeholder="Défense"
          value={formData.defense}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="sp_attack"
          placeholder="Attaque Spéciale"
          value={formData.sp_attack}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="sp_defense"
          placeholder="Défense Spéciale"
          value={formData.sp_defense}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="speed"
          placeholder="Vitesse"
          value={formData.speed}
          onChange={handleChange}
          required
        />
        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
        {/* Taille et poids */}
        <input
          type="text"
          name="height"
          placeholder="Taille"
          value={formData.height}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="weight"
          placeholder="Poids"
          value={formData.weight}
          onChange={handleChange}
          required
        />
        {/* Lien vers l’image */}
        <input
          type="text"
          name="hires"
          placeholder="Sprite URL"
          value={formData.hires}
          onChange={handleChange}
        />
        {/* Bouton de soumission */}
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}

export default Ajout;
