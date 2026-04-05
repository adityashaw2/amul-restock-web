import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, type Product } from "@/lib/api";
import { SubscribeDialog } from "./SubscribeDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, CheckSquare, Square, Check } from "lucide-react";

interface Props {
  email: string;
  setEmail: (e: string) => void;
}

export function ProductGrid({ email, setEmail }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showDialog, setShowDialog] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", category],
    queryFn: () =>
      api.getProducts({ query: "", category: category || undefined }),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.getCategories(),
  });

  const filtered = useMemo(() => {
    if (!products) return [];
    if (!search) return products;
    const q = search.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, search]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(filtered.map((p) => p.id)));
  const clearAll = () => setSelected(new Set());

  return (
    <div className="space-y-4">
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All Categories</option>
          {categories?.map((c) => (
            <option key={c.category} value={c.category}>
              {fmtCat(c.category)} ({c.totalProducts})
            </option>
          ))}
        </select>
      </div>

      {/* Selection Bar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between bg-accent border border-green-200 rounded-lg px-4 py-3">
          <span className="text-sm font-medium text-green-800">
            <Check className="inline h-4 w-4 mr-1" />
            {selected.size} product{selected.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear
            </Button>
            <Button size="sm" onClick={() => setShowDialog(true)}>
              <Bell className="h-3.5 w-3.5" />
              Subscribe
            </Button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">
          {isLoading ? "Loading..." : `${filtered.length} products`}
        </span>
        <Button variant="ghost" size="sm" onClick={selectAll}>
          <CheckSquare className="h-3.5 w-3.5" />
          Select All
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            selected={selected.has(product.id)}
            onToggle={() => toggle(product.id)}
          />
        ))}
      </div>

      {/* Subscribe Dialog */}
      <SubscribeDialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
          clearAll();
        }}
        productIds={Array.from(selected)}
        productNames={filtered
          .filter((p) => selected.has(p.id))
          .map((p) => p.name)}
        email={email}
        setEmail={setEmail}
      />
    </div>
  );
}

function ProductCard({
  product,
  selected,
  onToggle,
}: {
  product: Product;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
        selected
          ? "border-primary bg-accent"
          : "border-border bg-card hover:border-green-200 hover:shadow-sm"
      }`}
    >
      <div className="flex-shrink-0 text-primary">
        {selected ? (
          <CheckSquare className="h-5 w-5" />
        ) : (
          <Square className="h-5 w-5 text-muted/40" />
        )}
      </div>

      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-12 h-12 object-contain rounded-lg bg-gray-50 flex-shrink-0"
          loading="lazy"
        />
      )}

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-tight line-clamp-2">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-bold text-primary">
            ₹{product.price}
          </span>
          <Badge variant="secondary">{fmtCat(product.category)}</Badge>
        </div>
      </div>
    </div>
  );
}

function fmtCat(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
