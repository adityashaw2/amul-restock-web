import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  productIds: string[];
  productNames: string[];
  email: string;
  setEmail: (e: string) => void;
}

export function SubscribeDialog({
  open,
  onClose,
  productIds,
  productNames,
  email,
  setEmail,
}: Props) {
  const [pincode, setPincode] = useState(
    () => localStorage.getItem("amul_pincode") || ""
  );
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      api.subscribe({ email, pincode, products: productIds }),
    onSuccess: (data) => {
      setResult(data.message);
      setError(null);
      localStorage.setItem("amul_email", email);
      localStorage.setItem("amul_pincode", pincode);
    },
    onError: (err: Error) => {
      setError(err.message);
      setResult(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || pincode.length !== 6 || productIds.length === 0) return;
    mutation.mutate();
  };

  const handleClose = () => {
    setResult(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogHeader>
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Subscribe to Restock Alerts
        </h2>
      </DialogHeader>

      <DialogContent>
        {/* Selected products */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs font-semibold text-muted mb-2">
            {productIds.length} product{productIds.length !== 1 ? "s" : ""}{" "}
            selected
          </p>
          <div className="flex flex-wrap gap-1.5">
            {productNames.slice(0, 5).map((name, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {name.length > 35 ? name.slice(0, 35) + "…" : name}
              </Badge>
            ))}
            {productNames.length > 5 && (
              <Badge variant="secondary">
                +{productNames.length - 5} more
              </Badge>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="sub-email">
              Email
            </label>
            <Input
              id="sub-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="sub-pincode">
              Delivery Pincode
            </label>
            <Input
              id="sub-pincode"
              type="text"
              placeholder="560037"
              value={pincode}
              onChange={(e) =>
                setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength={6}
              required
            />
            <p className="text-xs text-muted">
              Stock varies by pincode — enter yours for accurate alerts
            </p>
          </div>

          {result && (
            <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              {result}
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={
              mutation.isPending || !email || pincode.length !== 6
            }
          >
            {mutation.isPending ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
