import React from "react";
import { render, screen } from "@testing-library/react";

import App from "../App";

test("renders Ola mundo", () => {
  render(<App />);
  const linkElement = screen.getByText(/Ola mundo/i);
  expect(linkElement).toBeInTheDocument();
});
