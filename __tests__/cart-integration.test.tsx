import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddToCartButton } from "@/components/AddToCartButton";
import { CartIcon } from "@/components/CartIcon";

jest.mock("next/link", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  return {
    __esModule: true,
    default: ({
      href,
      children,
      ...rest
    }: {
      href: string;
      children: React.ReactNode;
    }) =>
      React.createElement("a", { href, ...rest }, children),
  };
});

beforeEach(() => {
  window.localStorage.clear();
});

describe("cart integration", () => {
  it("badge updates as items are added across components", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <CartIcon />
        <AddToCartButton productId="p1" />
        <AddToCartButton productId="p2" />
      </div>,
    );

    const icon = screen.getByTestId("cart-icon");
    expect(icon.textContent).toBe("cart");

    const buttons = screen.getAllByTestId("add-to-cart");
    await user.click(buttons[0]);
    expect(icon).toHaveTextContent("1");

    await user.click(buttons[0]);
    expect(icon).toHaveTextContent("2");

    await user.click(buttons[1]);
    expect(icon).toHaveTextContent("3");
  });

  it("button shows transient added feedback and resets", async () => {
    jest.useFakeTimers();
    try {
      const user = userEvent.setup({
        advanceTimers: jest.advanceTimersByTime,
      });
      render(<AddToCartButton productId="p1" />);

      const button = screen.getByTestId("add-to-cart");
      expect(button).toHaveTextContent("Add to cart");

      await user.click(button);
      expect(button).toHaveTextContent("added");

      act(() => {
        jest.advanceTimersByTime(1300);
      });
      expect(button).toHaveTextContent("Add to cart");
    } finally {
      jest.useRealTimers();
    }
  });
});
