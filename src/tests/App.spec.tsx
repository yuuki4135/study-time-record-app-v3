import * as React from 'react';
import App from "../App";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';

describe("title", () => {
  it("should render title", () => {
    render(<App />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});