"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { format } from "date-fns";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { isPastAvailabilitySlot } from "@/lib/booking";
import { getStripePromise, hasStripePublishableKey } from "@/lib/stripe";

interface SlotSummary {
  id: string;
  startTime: string;
  endTime: string;
}

interface PaymentIntentResponse {
  paymentIntentId: string;
  clientSecret: string;
  currency?: string;
  totalHours?: number;
  totalAmountCents?: number;
  commissionAmountCents?: number;
  tutorAmountCents?: number;
}

interface BookingRecoveryItem {
  paymentIntentId?: string;
}

interface PaymentFirstBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: SlotSummary | null;
  tutorHourlyRate?: number;
  onSuccess?: () => void;
}

const formatCents = (amountCents?: number, currency = "usd") => {
  if (amountCents === undefined || amountCents === null) return "-";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amountCents / 100);
};

const getHours = (startTime: string, endTime: string) => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  const diff = end - start;
  if (!Number.isFinite(diff) || diff <= 0) return 1;

  return Number((diff / (1000 * 60 * 60)).toFixed(2));
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

function CheckoutForm({
  slot,
  paymentIntent,
  onSuccess,
  onFinalized,
}: {
  slot: SlotSummary;
  paymentIntent: PaymentIntentResponse;
  onSuccess?: () => void;
  onFinalized: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [confirming, setConfirming] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [needsFinalizeRetry, setNeedsFinalizeRetry] = useState(false);
  const slotIsPast = isPastAvailabilitySlot(slot);

  const verifyBookingRecovery = async (paymentIntentId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bookings`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) return false;

      const result = await response.json();
      const bookings: BookingRecoveryItem[] = Array.isArray(result)
        ? result
        : result?.data || [];

      return bookings.some(
        (booking) => booking.paymentIntentId === paymentIntentId,
      );
    } catch {
      return false;
    }
  };

  const finalizeBooking = async () => {
    if (slotIsPast) {
      const expiredMessage =
        "This slot has already passed and cannot be booked.";
      setPaymentError(expiredMessage);
      toast.error(expiredMessage);
      return;
    }

    setFinalizing(true);
    setPaymentError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            slotId: slot.id,
            paymentIntentId: paymentIntent.paymentIntentId,
          }),
        },
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const recovered = await verifyBookingRecovery(
          paymentIntent.paymentIntentId,
        );

        if (recovered) {
          toast.success("Payment confirmed and booking found after refresh.");
          setNeedsFinalizeRetry(false);
          onSuccess?.();
          window.dispatchEvent(new CustomEvent("booking:updated"));
          onFinalized();
          return;
        }

        throw new Error(result?.message || "BOOKING_FINALIZE_RETRY");
      }

      toast.success("Payment successful and booking confirmed.");
      setNeedsFinalizeRetry(false);
      onSuccess?.();
      window.dispatchEvent(new CustomEvent("booking:updated"));
      onFinalized();
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Payment succeeded but booking not finalized. Please retry finalize booking.",
      );

      if (message === "BOOKING_FINALIZE_RETRY") {
        const recoveryMessage =
          "Payment succeeded but booking not finalized. Please retry finalize booking.";
        toast.error(recoveryMessage);
        setPaymentError(recoveryMessage);
        setNeedsFinalizeRetry(true);
      } else {
        toast.error(message);
        setPaymentError(message);
      }
    } finally {
      setFinalizing(false);
    }
  };

  const handlePayAndBook = async () => {
    if (!stripe || !elements) {
      setPaymentError("Payment form is still loading. Please wait a moment.");
      return;
    }

    if (slotIsPast) {
      const expiredMessage =
        "This slot has already passed and cannot be booked.";
      setPaymentError(expiredMessage);
      toast.error(expiredMessage);
      return;
    }

    setPaymentError(null);
    setNeedsFinalizeRetry(false);
    setConfirming(true);

    try {
      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (result.error) {
        setPaymentError(result.error.message || "Payment was not completed.");
        toast.error(result.error.message || "Payment failed.");
        return;
      }

      const paymentStatus = result.paymentIntent?.status;

      if (paymentStatus === "processing") {
        const processingMessage =
          "Payment is processing. Booking will be created after successful confirmation.";
        setPaymentError(processingMessage);
        toast.info(processingMessage);
        return;
      }

      if (paymentStatus === "requires_payment_method") {
        const failedMessage =
          "Payment failed. Please try another payment method.";
        setPaymentError(failedMessage);
        toast.error(failedMessage);
        return;
      }

      if (paymentStatus === "canceled") {
        const cancelledMessage =
          "Payment was canceled. Booking was not created.";
        setPaymentError(cancelledMessage);
        toast.error(cancelledMessage);
        return;
      }

      if (paymentStatus !== "succeeded") {
        setPaymentError("Payment was not completed. Booking was not created.");
        toast.error("Payment not completed. Booking was not created.");
        return;
      }

      setPaymentSucceeded(true);
      await finalizeBooking();
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Unexpected payment error.");
      setPaymentError(message);
      toast.error(message);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/20 p-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Secure payment powered by Stripe
        </div>
        <p className="mt-1 text-xs">
          Your card is charged only through Stripe. Booking is created only
          after payment is successful.
        </p>
      </div>

      <PaymentElement />

      {paymentError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{paymentError}</AlertDescription>
        </Alert>
      )}

      {paymentSucceeded && !finalizing && !paymentError && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Payment confirmed. Finalizing your booking...
          </AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handlePayAndBook}
        disabled={
          confirming ||
          finalizing ||
          needsFinalizeRetry ||
          !stripe ||
          !elements ||
          slotIsPast
        }
        className="w-full gap-2"
      >
        {confirming || finalizing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CreditCard className="h-4 w-4" />
        )}
        {confirming
          ? "Confirming payment..."
          : finalizing
            ? "Finalizing booking..."
            : "Pay and Book"}
      </Button>

      {needsFinalizeRetry && (
        <Button
          variant="outline"
          onClick={finalizeBooking}
          disabled={finalizing || slotIsPast}
          className="w-full"
        >
          {finalizing ? "Retrying finalization..." : "Retry finalize booking"}
        </Button>
      )}
    </div>
  );
}

export default function PaymentFirstBookingDialog({
  open,
  onOpenChange,
  slot,
  tutorHourlyRate,
  onSuccess,
}: PaymentFirstBookingDialogProps) {
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [paymentIntent, setPaymentIntent] =
    useState<PaymentIntentResponse | null>(null);
  const [intentError, setIntentError] = useState<string | null>(null);
  const [intentLoadAttempt, setIntentLoadAttempt] = useState(0);

  const stripePromise = useMemo(() => getStripePromise(), []);

  const estimatedHours = slot ? getHours(slot.startTime, slot.endTime) : 0;
  const estimatedTotal = tutorHourlyRate ? estimatedHours * tutorHourlyRate : 0;
  const isPastSlot = slot ? isPastAvailabilitySlot(slot) : false;

  const resetState = () => {
    setLoadingIntent(false);
    setPaymentIntent(null);
    setIntentError(null);
  };

  useEffect(() => {
    if (!open || !slot) {
      resetState();
      return;
    }

    if (isPastAvailabilitySlot(slot)) {
      resetState();
      setIntentError("This slot has already passed and cannot be booked.");
      return;
    }

    const loadPaymentIntent = async () => {
      if (!hasStripePublishableKey) {
        setIntentError("Stripe is not configured. Please contact support.");
        return;
      }

      setLoadingIntent(true);
      setIntentError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/payment-intent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ slotId: slot.id }),
          },
        );

        const result = await response.json().catch(() => ({}));
        const payload = result?.data || result;

        if (!response.ok) {
          throw new Error(payload?.message || "Could not initialize payment.");
        }

        if (!payload?.clientSecret || !payload?.paymentIntentId) {
          throw new Error("Payment initialization response was incomplete.");
        }

        setPaymentIntent(payload as PaymentIntentResponse);
      } catch (error: unknown) {
        setIntentError(getErrorMessage(error, "Could not initialize payment."));
      } finally {
        setLoadingIntent(false);
      }
    };

    loadPaymentIntent();
  }, [open, slot, intentLoadAttempt]);

  const closeDialog = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetState();
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Secure Checkout</DialogTitle>
          <DialogDescription>
            Review your session details, complete payment, and then your booking
            will be finalized. Old slots cannot be booked.
          </DialogDescription>
        </DialogHeader>

        {slot && (
          <div className="rounded-lg border bg-muted/10 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">
                {format(new Date(slot.startTime), "EEE, MMM d • h:mm a")} -{" "}
                {format(new Date(slot.endTime), "h:mm a")}
              </p>
              <Badge variant="secondary">
                {isPastSlot ? "Old slot" : `${estimatedHours}h`}
              </Badge>
            </div>

            <Separator className="my-3" />

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated total</span>
                <span>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(estimatedTotal)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Estimate only. Final charge is calculated by backend from tutor
                rate and slot duration.
              </p>
              {isPastSlot && (
                <p className="text-xs font-medium text-destructive">
                  This session has already ended and cannot be booked.
                </p>
              )}
            </div>

            {paymentIntent && (
              <div className="mt-3 space-y-1 rounded-md border bg-background p-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Charged amount</span>
                  <span className="font-medium">
                    {formatCents(
                      paymentIntent.totalAmountCents,
                      paymentIntent.currency || "usd",
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Platform commission
                  </span>
                  <span>
                    {formatCents(
                      paymentIntent.commissionAmountCents,
                      paymentIntent.currency || "usd",
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Tutor payout target
                  </span>
                  <span>
                    {formatCents(
                      paymentIntent.tutorAmountCents,
                      paymentIntent.currency || "usd",
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {loadingIntent && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Preparing secure payment...
          </div>
        )}

        {intentError && !loadingIntent && (
          <div className="space-y-3">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{intentError}</AlertDescription>
            </Alert>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIntentLoadAttempt((prev) => prev + 1)}
            >
              Retry payment setup
            </Button>
          </div>
        )}

        {!loadingIntent && paymentIntent?.clientSecret && !intentError && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: paymentIntent.clientSecret,
              appearance: { theme: "stripe" },
            }}
          >
            <CheckoutForm
              slot={slot as SlotSummary}
              paymentIntent={paymentIntent}
              onSuccess={onSuccess}
              onFinalized={() => closeDialog(false)}
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
}
