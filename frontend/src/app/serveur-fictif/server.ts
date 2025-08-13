import { setupServer } from "msw/node";
import { rest } from "msw";

// Configuration du serveur MSW
export const server = setupServer(
  // Mock de l'endpoint pour récupérer la liste des Pokémon
  rest.get("http://localhost:3001/api/pokemons/list", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name_french: "Pikachu", hires: "/pikachu.png", types: ["Electric"] },
        { id: 2, name_french: "Bulbizarre", hires: "/bulbizarre.png", types: ["Grass", "Poison"] },
      ])
    );
  }),

  // Mock de l'endpoint pour mettre à jour un Pokémon
  rest.put("http://localhost:3001/api/pokemons/update/:id", (req, res, ctx) => {
    const { id } = req.params;
    const updatedPokemon = req.body;
    return res(
      ctx.status(200),
      ctx.json({ message: `Pokémon avec l'ID ${id} mis à jour`, updatedPokemon })
    );
  }),

  // Mock de l'endpoint pour supprimer un Pokémon
  rest.delete("http://localhost:3001/api/pokemons/delete/:id", (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({ message: `Pokémon avec l'ID ${id} supprimé` })
    );
  })
);