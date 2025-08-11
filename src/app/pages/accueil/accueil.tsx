// Importation du fichier CSS en module
import styles from "./accueil.module.css";

// Importation du composant Link pour la navigation entre les pages
import { Link } from "react-router-dom";

// Composant principal de la page d'accueil
function Accueil() {
  return (
    <div className={styles.container}>
      {/* En-tête avec titre de la page */}
      <header className={styles.header}>
        <h1>Bienvenue sur le Pokedex</h1>
        <p>Explorez, découvrez et gérez vos Pokémon préférés.</p>
      </header>

      {/* Section de bienvenue avec deux boutons vers la liste et l'ajout */}
      <section className={styles.hero}>
        <h2>Votre compagnon ultime pour les Pokémon</h2>
        <p>Découvrez les statistiques, les évolutions, et bien plus encore !</p>

        {/* Lien vers la page de liste des Pokémon */}
        <Link to="/liste">
          <button className={styles.ctaButton}>Voir la liste des Pokémon</button>
        </Link>

        {/* Lien vers la page d'ajout d'un Pokémon */}
        <Link to="/ajout">
          <button className={styles.ctaButton}>Ajouter un Pokémon</button>
        </Link>
      </section>

      {/* Section listant les fonctionnalités du site */}
      <section className={styles.features}>
        <h2>Fonctionnalités</h2>
        <ul>
          <li>Recherchez des Pokémon par nom ou type</li>
          <li>Consultez les statistiques détaillées</li>
          <li>Découvrez les évolutions et les capacités</li>
          <li>Gérez votre propre collection de Pokémon</li>
          <li>Authentifiez-vous pour accéder aux fonctionnalités avancées tels que l'ajout, la modification et la suppression de Pokémon !</li>
        </ul>
      </section>

      {/* Présentation de l'équipe du projet */}
      <section className={styles.team}>
        <h2>Notre équipe</h2>

        <div className={styles.member}>
          <h3>Lucas Broda</h3>
          <p>Etudiant en AP3</p>
        </div>

        <div className={styles.member}>
          <h3>Axel Fournier</h3>
          <p>Etudiant en AP3</p>
        </div>

        <div className={styles.member}>
          <h3>Lucas Manche</h3>
          <p>Etudiant en AP3</p>
        </div>
      </section>
    </div>
  );
}

// Exportation du composant Accueil pour pouvoir l'utiliser dans les routes
export default Accueil;
