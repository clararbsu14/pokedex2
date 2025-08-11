import { Routes, Route } from "react-router";
import { Accueil, Ajout, Liste } from "@pages";
import Navbar from "@components";

function App() {
  return (
    <>
      {/* Barre de navigation commune à toutes les pages */}
      <Navbar />
      {/* Définition des routes pour l’application */}
      <Routes>
        <Route path='/' element={<Accueil />} />       {/* Page d’accueil */}
        <Route path="/liste" element={<Liste />} />   {/* Liste des Pokémon */}
        <Route path='/ajout' element={<Ajout />} />   {/* Formulaire d’ajout */}
      </Routes>
    </>
  );
}

export default App;
