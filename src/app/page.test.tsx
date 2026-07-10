import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders the heading", () => {
    render(<Home />);
    expect(screen.getByText(/to get started/i)).toBeInTheDocument();
  });
});
