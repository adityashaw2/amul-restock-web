import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Inbox, Trash2 } from "lucide-react";

interface Props {
  email: string;
  setEmail: (e: string) => void;
}

export function MySubscriptions({ email, setEmail }: Props) {
  const [lookupEmail, setLookupEmail] = useState(email);
  const [activeEmail, setActiveEmail] = useState(email);
  const queryClient = useQueryClient();

  const { data: subscriptions } = useQuery({
    queryKey: ["subscriptions", activeEmail],
    queryFn: () => api.getSubscriptions({ email: activeEmail }),
    enabled: !!activeEmail,
  });

  const cancelMutation = useMutation({
    mutationFn: () => api.cancelSubscriptions({ email: activeEmail }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subscriptions", activeEmail],
      });
    },
  });

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveEmail(lookupEmail);
    setEmail(lookupEmail);
    localStorage.setItem("amul_email", lookupEmail);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleLookup} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            type="email"
            placeholder="Enter your email to view alerts"
            value={lookupEmail}
            onChange={(e) => setLookupEmail(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Look Up</Button>
      </form>

      {activeEmail && subscriptions && (
        <>
          {subscriptions.length === 0 ? (
            <div className="text-center py-16 text-muted">
              <Inbox className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <h3 className="text-lg font-semibold text-foreground">
                No active alerts
              </h3>
              <p className="text-sm mt-1">
                Browse products and subscribe to get notified when they
                restock.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {subscriptions.length} active alert
                  {subscriptions.length !== 1 ? "s" : ""}
                </h2>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (
                      confirm(
                        `Cancel all ${subscriptions.length} alerts for ${activeEmail}?`
                      )
                    ) {
                      cancelMutation.mutate();
                    }
                  }}
                  disabled={cancelMutation.isPending}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {cancelMutation.isPending ? "Cancelling..." : "Cancel All"}
                </Button>
              </div>

              <div className="space-y-2">
                {subscriptions.map((sub) => (
                  <Card key={sub.id} className="p-4">
                    <h3 className="text-sm font-semibold">
                      {sub.productName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="secondary">
                        {fmtCat(sub.productCategory)}
                      </Badge>
                      <span className="text-xs text-muted flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {sub.pincode}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function fmtCat(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
