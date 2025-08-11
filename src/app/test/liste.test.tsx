import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Liste from "@pages";

describe("Liste Component", () => {
  it("renders the Pokedex title", () => {
    render(<Liste />);
    const title = screen.getByText(/Pokedex/i);
    expect(title).toBeInTheDocument();
  });

  it("filters Pokémon by name", () => {
    render(<Liste />);
    const input = screen.getByPlaceholderText("Filtrer par nom");
    fireEvent.change(input, { target: { value: "Pikachu" } });
    expect(input).toHaveValue("Pikachu");
  });

  it("filters Pokémon by type", () => {
    render(<Liste />);
    const input = screen.getByPlaceholderText("Filtrer par type");
    fireEvent.change(input, { target: { value: "Electric" } });
    expect(input).toHaveValue("Electric");
  });

  it("toggles favorites filter", () => {
    render(<Liste />);
    const checkbox = screen.getByLabelText(/Afficher uniquement les favoris/i);
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});