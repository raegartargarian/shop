import { render, screen } from "@testing-library/react";

const usePathname = jest.fn<string, []>();

jest.mock("next/navigation", () => ({
  usePathname: () => usePathname(),
}));

import { StepIndicator } from "@/components/checkout/StepIndicator";

describe("StepIndicator", () => {
  it("marks cart current and the rest upcoming on /checkout/cart", () => {
    usePathname.mockReturnValue("/checkout/cart");
    render(<StepIndicator />);

    expect(screen.getByTestId("step-cart")).toHaveAttribute(
      "data-status",
      "current",
    );
    expect(screen.getByTestId("step-address")).toHaveAttribute(
      "data-status",
      "upcoming",
    );
    expect(screen.getByTestId("step-payment")).toHaveAttribute(
      "data-status",
      "upcoming",
    );
    expect(screen.getByTestId("step-review")).toHaveAttribute(
      "data-status",
      "upcoming",
    );
  });

  it("marks earlier steps done and review current on /checkout/review", () => {
    usePathname.mockReturnValue("/checkout/review");
    render(<StepIndicator />);

    expect(screen.getByTestId("step-cart")).toHaveAttribute(
      "data-status",
      "done",
    );
    expect(screen.getByTestId("step-address")).toHaveAttribute(
      "data-status",
      "done",
    );
    expect(screen.getByTestId("step-payment")).toHaveAttribute(
      "data-status",
      "done",
    );
    expect(screen.getByTestId("step-review")).toHaveAttribute(
      "data-status",
      "current",
    );
  });
});
