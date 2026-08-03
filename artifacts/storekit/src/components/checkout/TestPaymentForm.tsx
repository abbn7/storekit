/**
 * TestPaymentForm — shown when Stripe keys are not configured.
 * Lets the store owner test the full order flow without a real payment.
 */
import { ArrowLeft, Lock, FlaskConical } from "lucide-react";
import { Loader2 } from "lucide-react";

interface Props {
  onSubmit: () => Promise<void>;
  onBack: () => void;
  total: number;
  formatPrice: (cents: number) => string;
  isSubmitting: boolean;
}

export default function TestPaymentForm({
  onSubmit,
  onBack,
  total,
  formatPrice,
  isSubmitting,
}: Props) {
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-medium tracking-wide">Payment Details</h2>
        <span className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase bg-amber-100 text-amber-800 px-2.5 py-1 rounded-sm">
          <FlaskConical className="w-3 h-3" /> Test Mode
        </span>
      </div>

      <div className="border border-dashed border-amber-300 bg-amber-50/50 rounded-sm p-5 space-y-2">
        <p className="text-sm font-medium text-amber-900">Development / Preview Mode</p>
        <p className="text-xs text-amber-700 leading-relaxed">
          No real payment is processed. To enable live payments, add{" "}
          <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px]">STRIPE_PUBLISHABLE_KEY</code>{" "}
          and{" "}
          <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px]">STRIPE_SECRET_KEY</code>{" "}
          to your Railway environment variables.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
        <Lock className="w-3.5 h-3.5" />
        <span>This is a test order — no charge will be made</span>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-4 border border-border text-xs tracking-[0.15em] uppercase hover:bg-muted transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background py-4 text-xs tracking-[0.2em] uppercase hover:bg-foreground/80 transition-colors disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Placing Order…
            </>
          ) : (
            `Place Test Order — ${formatPrice(total)}`
          )}
        </button>
      </div>
    </form>
  );
}
