"use client";

import { StudentInvoice } from "@/types/invoice/types";

const parseApiError = async (response: Response, fallback: string) => {
  try {
    const payload = await response.json();
    return payload?.message || payload?.error || fallback;
  } catch {
    return fallback;
  }
};

export const getMyInvoices = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/invoices/my`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const message = await parseApiError(response, "Failed to load invoices");
    throw new Error(message);
  }

  const payload = await response.json();
  const invoices: StudentInvoice[] = Array.isArray(payload)
    ? payload
    : payload?.data || [];

  return invoices;
};

export const downloadInvoicePdf = async (
  bookingId: string,
  invoiceNumber?: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/invoices/booking/${bookingId}/pdf`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const message = await parseApiError(response, "Failed to download invoice");
    throw new Error(message);
  }

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = `${invoiceNumber || `invoice-${bookingId}`}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(blobUrl);
};
