import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ArrowLeft, Lock } from "lucide-react";
import { Loader2 } from "lucide-react";

interface Props {
  onSuccess: (paymentIntentId: string) => Promise<void>;
  onBack: () => void;
  total: number;
  formatPrice: (cents: number) => string;
  isCreatingOrder: boolean;
}

export default function StripePaymentForm({
  onSuccess,
  onBack,
  total,
  formatPrice,
  isCreatingOrder,
}: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);

  const busy = isProcessing || isCreatingOrder;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setStripeError(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/checkout`,
        },
      });

      if (error) {
        setStripeError(error.message ?? "Payment failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        await onSuccess(paymentIntent.id);
      } else {
        setStripeError("Payment could not be confirmed. Please try again.");
        setIsProcessing(false);
      }
    } catch {
      setStripeError("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="font-medium tracking-wide mb-6">Payment Details</h2>

      <div className="border border-border rounded-sm p-4 bg-card">
        <PaymentElement
          options={{
            layout: "tabs",
            fields: { billingDetails: { address: { country: "never" } } },
          }}
        />
      </div>

      {stripeError && (
        <p className="text-xs text-destructive bg-destructive/10 px-4 py-3 rounded-sm">
          {stripeError}
        </p>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
        <Lock className="w-3.5 h-3.5" />
        <span>Secured by Stripe · 256-bit SSL encryption</span>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={busy}
          className="flex items-center gap-2 px-6 py-4 border border-border text-xs tracking-[0.15em] uppercase hover:bg-muted transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          type="submit"
          disabled={!stripe || busy}
          className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-4 text-xs tracking-[0.2em] uppercase hover:bg-foreground/80 transition-colors disabled:opacity-60"
        >
          {busy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isCreatingOrder ? "Placing Order…" : "Processing…"}
            </>
          ) : (
            `Pay ${formatPrice(total)}`
          )}
        </button>
      </div>
    </form>
  );
}
