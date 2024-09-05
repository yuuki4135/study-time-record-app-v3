import * as React from 'react';
import App from "../App";
import '@testing-library/jest-dom';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: [
        { id: 1, title: 'Test Record', time: 60 }
      ], error: null })),
      insert: jest.fn(() => ({
        select: jest.fn(() => Promise.resolve({ data: [
          { id: 2, title: 'New Record', time: 120 },
        ], error: null })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => Promise.resolve({ data: [
            { id: 1, title: 'Test Record', time: 120 },
          ], error: null})),
        })),
      })),
    })),
  })),
}));

describe("loading", () => {
  it("should render loading", async () => {
    render(<App />);
    expect(screen.getByText("...loading")).toBeInTheDocument();
    await waitFor(() => {
      screen.getByText("60時間");
    });
  });
});

describe("record", () => {
  it("should render record table", async () => {
    await act(async() => {
     render(<App />);
    })
    await waitFor(() => {
      expect(screen.getByText("60時間")).toBeInTheDocument();
    });
  });

  it("should render record new button", async () => {
    await act(async() => {
     render(<App />);
    })
    await waitFor(() => {
      expect(screen.getByText("新規登録")).toBeInTheDocument();
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

  it('submit record', async () => {
    await act(async() => {
     render(<App />);
    })
    await waitFor(async () => {
      const addButton = screen.getByTestId("add-button");
      userEvent.click(addButton);
      const titleInput = screen.getByTestId("title-input");
      await userEvent.type(titleInput, "New Record");
      const timeInput = screen.getByTestId("time-input");
      await userEvent.type(timeInput, "120");
      await userEvent.click(screen.getByTestId("submit-button"));
      expect(screen.getByText("120時間")).toBeInTheDocument();
    });
  })

  it('modal-title-check', async () => {
    await act(async() => {
     render(<App />);
    })
    await waitFor(async () => {
      const addButton = screen.getByTestId("add-button");
      await userEvent.click(addButton);
      expect(screen.getByTestId('modal-title')).toHaveTextContent('新規登録');
    });
  })

  it('input-error', async () => {
    await act(async() => {
     render(<App />);
    })
    await waitFor(async () => {
      const addButton = screen.getByTestId("add-button");
      await userEvent.click(addButton);
      const timeInput = screen.getByTestId("time-input");
      fireEvent.change(timeInput, { target: { value: '-1' } });
      await userEvent.click(screen.getByTestId("submit-button"));
      expect(screen.getByText("時間は0以上である必要があります")).toBeInTheDocument();
    });
  })

  it('delete-record', async () => {
    await act(async() => {
     render(<App />);
    })
    await waitFor(async () => {
      const deleteButton = screen.getByTestId("delete-button");
      await userEvent.click(deleteButton);
        act(() => {
          expect(screen.queryByText("60時間")).toBeNull();
        });
    });
  })

  it('edit-record', async () => {
    await act(async() => {
     render(<App />);
    })
    await waitFor(async () => {
      const editButton = screen.getByTestId("edit-button");
      await userEvent.click(editButton);
      expect(screen.getByText("記録編集")).toBeInTheDocument();
      await userEvent.click(screen.getByTestId("submit-button"));
      expect(screen.getByText("120時間")).toBeInTheDocument();
    });
  })
});
