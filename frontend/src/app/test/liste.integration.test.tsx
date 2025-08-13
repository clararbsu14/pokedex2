import { render, screen, fireEvent } from "@testing-library/react";
import Liste from "@pages";

describe("Liste Component Integration", () => {
  it("renders Pokémon cards", async () => {
    render(<Liste />);
    const cards = await screen.findAllByRole("img");
    expect(cards.length).toBeGreaterThan(0);
  });

  it("opens the modal when a Pokémon card is clicked", async () => {
    render(<Liste />);
    const card = await screen.findByText(/Pikachu/i);
    fireEvent.click(card);
    const modalTitle = await screen.findByText(/Modifier Pokémon/i);
    expect(modalTitle).toBeInTheDocument();
  });

  it("adds a Pokémon to favorites", async () => {
    render(<Liste />);
    const card = await screen.findByText(/Pikachu/i);
    fireEvent.click(card);
    const favoriteButton = await screen.findByText(/Ajouter aux favoris/i);
    fireEvent.click(favoriteButton);
    expect(localStorage.getItem("favorites")).toContain("Pikachu");
  });
});