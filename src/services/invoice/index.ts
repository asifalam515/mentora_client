"use client";

import { apiJson, apiRequest } from "@/lib/api-client";
import { StudentInvoice } from "@/types/invoice/types";

export const getMyInvoices = async () => {
  const payload = await apiJson<unknown>("/invoices/my", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payloadObject =
    payload && typeof payload === "object"
      ? (payload as { data?: StudentInvoice[] })
      : null;

  const invoices: StudentInvoice[] = Array.isArray(payload)
    ? payload
    : payloadObject?.data || [];

  return invoices;
};

export const downloadInvoicePdf = async (
  bookingId: string,
  invoiceNumber?: string,
) => {
  const response = await apiRequest(`/invoices/booking/${bookingId}/pdf`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to download invoice");
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
