import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders the project placeholder with a main landmark", () => {
    render(<Home />);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "IshpreetOS", level: 1 })).toBeInTheDocument();
  });
});
