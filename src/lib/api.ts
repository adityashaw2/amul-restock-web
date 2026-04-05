const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/trpc";

async function query<T = unknown>(path: string, input?: unknown): Promise<T> {
  const payload = input !== undefined ? { json: input } : { json: null };
  const params = `?input=${encodeURIComponent(JSON.stringify(payload))}`;
  const resp = await fetch(`${API_URL}/${path}${params}`);
  if (!resp.ok) throw new Error(`API error ${resp.status}`);
  const data = await resp.json();
  return data.result?.data?.json as T;
}

async function mutate<T = unknown>(path: string, input: unknown): Promise<T> {
  const resp = await fetch(`${API_URL}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ json: input }),
  });
  if (!resp.ok) throw new Error(`API error ${resp.status}`);
  const data = await resp.json();
  return data.result?.data?.json as T;
}

export interface Product {
  id: string;
  amulId: string;
  name: string;
  category: string;
  imageUrl: string | null;
  price: number;
}

export interface CategoryAgg {
  category: string;
  totalProducts: number;
}

export interface Subscription {
  id: number;
  pincode: string;
  productId: string;
  productName: string;
  productCategory: string;
  createdAt: string;
}

export const api = {
  getProducts: (p: { query?: string; category?: string }) =>
    query<Product[]>("product.getProducts", p),

  getCategories: () =>
    query<CategoryAgg[]>("product.getProductAggregation"),

  subscribe: (p: { email: string; pincode: string; products: string[] }) =>
    mutate<{ created: number; skipped: number; message: string }>(
      "subscription.createSubscription", p
    ),

  getSubscriptions: (p: { email: string }) =>
    query<Subscription[]>("subscription.getSubscriptions", p),

  cancelSubscriptions: (p: { email: string }) =>
    mutate<{ cancelled: number; message: string }>(
      "subscription.cancelSubscriptions", p
    ),
};
