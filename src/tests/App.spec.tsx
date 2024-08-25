import * as React from 'react';
import App from "../App";
import '@testing-library/jest-dom';
import { render, screen, waitFor, act } from '@testing-library/react';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: [
        { id: 1, title: 'Test Record', time: 60 },
      ], error: null })),
      insert: jest.fn(() => Promise.resolve({ data: [], error: null })),
      delete: jest.fn(() => {
        return { eq: jest.fn(() => Promise.resolve({ data: [], error: null })) };
      }),
    })),
  })),
}));

describe("loading", () => {
  it("should render loading", () => {
    render(<App />);
    expect(screen.getByText("...loading")).toBeInTheDocument();
  });
});

describe("record", () => {
  it("should render record table", async () => {
    await act(async() => {
     render(<App />);
    })
    await waitFor(() => {
      expect(screen.getByText("Test Record: 60時間")).toBeInTheDocument();
    });
  });

  it("should render record new button", async () => {
    await act(async() => {
     render(<App />);
    })
    await waitFor(() => {
      expect(screen.getByText("追加")).toBeInTheDocument();
    });
  });

  it('should render record title', async () => {
    await act(async() => {
     render(<App />);
    })
    await waitFor(() => {
      const title = screen.getByTestId("title");
      expect(title).toBeInTheDocument();
    });
  });
});
