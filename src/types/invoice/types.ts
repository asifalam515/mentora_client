export type InvoiceStatus = "ISSUED" | "REFUNDED";

export interface StudentInvoice {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  amountCents: number;
  commissionAmountCents: number;
  tutorAmountCents: number;
  currency: string;
  issuedAt: string;
  booking: {
    id: string;
    date: string;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    paymentStatus: "PENDING" | "PAID" | "TRANSFERRED" | "REFUNDED";
    totalHours: number;
  };
  tutor: {
    id: string;
    name: string;
    email: string;
  };
  downloadUrl: string;
}
