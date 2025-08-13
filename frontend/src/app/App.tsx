import { Routes, Route } from "react-router";
import Accueil from "./pages/accueil/accueil";
import Ajout from "./pages/ajout/ajout";
import Liste from "./pages/liste/liste";
import Navbar from "./components/navbar/navbar";
import Authentification from "./pages/authentification/authentification";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/liste" element={<Liste />} />
        <Route path="/ajout" element={<Ajout />} />
        <Route path="/authentification" element={<Authentification />} />
      </Routes>
    </>
  );
}

export default App;
