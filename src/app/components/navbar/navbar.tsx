import { Link } from "react-router-dom";
import styles from "./navbar.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/" className={styles.link}>Accueil du Pokedex</Link>
        </li>
        <li>
          <Link to="/liste" className={styles.link}>Liste des Pokémon</Link>
        </li>
        <li>
          <Link to="/ajout" className={styles.link}>Ajouter un Pokémon</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;