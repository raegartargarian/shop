import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductGrid } from "@/components/ProductGrid";
import type { Product } from "@/lib/types";

const fixtures: Product[] = [
  {
    id: "p1",
    slug: "linen-tee",
    name: "Linen Tee",
    price: 4200,
    category: "apparel",
    description: "A breezy summer tee.",
    image: "/img/linen-tee.jpg",
    stock: 10,
  },
  {
    id: "p2",
    slug: "wool-scarf",
    name: "Wool Scarf",
    price: 6800,
    category: "apparel",
    description: "Heavy winter wrap.",
    image: "/img/wool-scarf.jpg",
    stock: 5,
  },
  {
    id: "p3",
    slug: "ceramic-mug",
    name: "Ceramic Mug",
    price: 1800,
    category: "home",
    description: "Holds twelve ounces of coffee.",
    image: "/img/ceramic-mug.jpg",
    stock: 30,
  },
];

describe("ProductGrid", () => {
  it("renders every product by default", () => {
    render(<ProductGrid products={fixtures} />);
    expect(screen.getAllByTestId("product-card")).toHaveLength(3);
  });

  it("filters by search query and restores on clear", async () => {
    const user = userEvent.setup();
    render(<ProductGrid products={fixtures} />);

    const search = screen.getByPlaceholderText("Search products");
    await user.type(search, "mug");
    expect(screen.getAllByTestId("product-card")).toHaveLength(1);

    await user.clear(search);
    expect(screen.getAllByTestId("product-card")).toHaveLength(3);
  });

  it("filters by category pill", async () => {
    const user = userEvent.setup();
    render(<ProductGrid products={fixtures} />);

    await user.click(screen.getByRole("button", { name: /home/i }));
    const cards = screen.getAllByTestId("product-card");
    expect(cards).toHaveLength(1);
  });
});
