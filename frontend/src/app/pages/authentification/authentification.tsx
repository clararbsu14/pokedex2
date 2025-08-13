import React, { useState, useEffect } from "react";
import "./authentification.css";

function Authentification() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState<string | null>(null);

    // Détecte la session existante
    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrMsg(null);
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3001/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password,
                }),
            });

            if (!res.ok) {
                // essaie de récupérer un message de l'API
                let msg = "Email ou mot de passe incorrect.";
                try {
                    const data = await res.json();
                    if (data?.error) msg = data.error;
                } catch { }
                setErrMsg(msg);
                return;
            }

            const { token, user } = await res.json();
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setIsLoggedIn(true);
            alert("Connexion réussie !");
        } catch (err) {
            console.error("Erreur connexion :", err);
            setErrMsg("Erreur lors de la connexion au serveur.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
    };

    const currentUser = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    })();

    return (
        <div className="container">
            <div className="header">
                <h1>Authentification</h1>
                <p>Veuillez entrer vos identifiants</p>
            </div>

            {!isLoggedIn ? (
                <form className="form" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errMsg && (
                        <div style={{ color: "crimson", fontSize: 14 }}>{errMsg}</div>
                    )}
                    <button type="submit" disabled={loading}>
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>
            ) : (
                <div style={{ textAlign: "center" }}>
                    <h2>Bienvenue{currentUser?.email ? `, ${currentUser.email}` : " !"}</h2>
                    <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center" }}>
                        <a href="/liste">
                            <button type="button">Voir la liste</button>
                        </a>
                        <button onClick={handleLogout}>Se déconnecter</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Authentification;
