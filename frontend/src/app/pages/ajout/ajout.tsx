import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ajout.module.css";

function Ajout() {
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

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1) Vérifs simples
    const numericFields = ["hp", "attack", "defense", "sp_attack", "sp_defense", "speed"];
    for (const field of numericFields) {
      if (isNaN(Number((formData as any)[field]))) {
        alert(`Le champ ${field} doit contenir un nombre valide.`);
        return;
      }
    }

    // 2) Récup token
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vous devez être connecté(e) pour ajouter un Pokémon.");
      return;
    }

    try {
      // 3) Dernier ID
      const lastIdResponse = await fetch("http://localhost:3001/api/pokemons/last-id");
      if (!lastIdResponse.ok) {
        alert("Erreur lors de la récupération du dernier ID.");
        return;
      }
      const { lastId } = await lastIdResponse.json();

      // 4) Payload propre (parse des nombres, types en CSV propre, image par défaut)
      const payload = {
        ...formData,
        id: String((lastId ?? 0) + 1),
        hp: Number(formData.hp),
        attack: Number(formData.attack),
        defense: Number(formData.defense),
        sp_attack: Number(formData.sp_attack),
        sp_defense: Number(formData.sp_defense),
        speed: Number(formData.speed),
        types: formData.types
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
          .join(","), // si ton backend stocke en CSV
        hires:
          formData.hires?.trim() ||
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
      };

      // 5) Appel protégé avec Authorization: Bearer <token>
      const response = await fetch("http://localhost:3001/api/pokemons/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

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
        navigate("/");
      } else if (response.status === 401) {
        alert("Session expirée ou non authentifiée. Reconnectez-vous.");
      } else {
        const msg = await response.text();
        console.error("Ajout KO:", msg);
        alert("Erreur lors de l'ajout du Pokémon.");
      }
    } catch (err) {
      console.error("Erreur réseau:", err);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Ajouter un Pokémon</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" name="name_french" placeholder="Nom (Français)" value={formData.name_french} onChange={handleChange} required />
        <input type="text" name="types" placeholder="Type(s)" value={formData.types} onChange={handleChange} required />
        <input type="text" name="abilities" placeholder="Capacités (séparées par des virgules)" value={formData.abilities} onChange={handleChange} />
        <input type="text" name="hp" placeholder="HP" value={formData.hp} onChange={handleChange} required />
        <input type="text" name="attack" placeholder="Attaque" value={formData.attack} onChange={handleChange} required />
        <input type="text" name="defense" placeholder="Défense" value={formData.defense} onChange={handleChange} required />
        <input type="text" name="sp_attack" placeholder="Attaque Spéciale" value={formData.sp_attack} onChange={handleChange} required />
        <input type="text" name="sp_defense" placeholder="Défense Spéciale" value={formData.sp_defense} onChange={handleChange} required />
        <input type="text" name="speed" placeholder="Vitesse" value={formData.speed} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="text" name="height" placeholder="Taille" value={formData.height} onChange={handleChange} required />
        <input type="text" name="weight" placeholder="Poids" value={formData.weight} onChange={handleChange} required />
        <input type="text" name="hires" placeholder="Sprite URL" value={formData.hires} onChange={handleChange} />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}

export default Ajout;
