"use client";

import { format } from "date-fns";
import { Download, FileText, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { downloadInvoicePdf, getMyInvoices } from "@/services/invoice";
import { StudentInvoice } from "@/types/invoice/types";

interface StudentInvoicesListProps {
  limit?: number;
  showHeader?: boolean;
}

const statusBadgeConfig: Record<
  StudentInvoice["status"],
  { label: string; className: string }
> = {
  ISSUED: {
    label: "Issued",
    className: "bg-emerald-50 text-emerald-700",
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-rose-50 text-rose-700",
  },
};

const formatAmount = (amountCents: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amountCents / 100);

export default function StudentInvoicesList({
  limit,
  showHeader = true,
}: StudentInvoicesListProps) {
  const [invoices, setInvoices] = useState<StudentInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingBookingId, setDownloadingBookingId] = useState<
    string | null
  >(null);

  const displayedInvoices = useMemo(() => {
    if (!limit) return invoices;
    return invoices.slice(0, limit);
  }, [invoices, limit]);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await getMyInvoices();
      setInvoices(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to load invoices";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();

    const handleRefresh = () => {
      loadInvoices();
    };

    window.addEventListener("booking:updated", handleRefresh);

    return () => {
      window.removeEventListener("booking:updated", handleRefresh);
    };
  }, []);

  const handleDownload = async (invoice: StudentInvoice) => {
    setDownloadingBookingId(invoice.booking.id);
    try {
      await downloadInvoicePdf(invoice.booking.id, invoice.invoiceNumber);
      toast.success(`Downloaded ${invoice.invoiceNumber}`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to download invoice";
      toast.error(message);
    } finally {
      setDownloadingBookingId(null);
    }
  };

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Invoices
          </CardTitle>
          <CardDescription>
            Download professional PDF invoices for your paid sessions.
          </CardDescription>
        </CardHeader>
      )}

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading invoices...
          </div>
        ) : displayedInvoices.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No invoices yet. Invoices appear after successful payments.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{invoice.tutor.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {invoice.tutor.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(invoice.booking.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {formatAmount(invoice.amountCents, invoice.currency)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`border-0 ${statusBadgeConfig[invoice.status].className}`}
                    >
                      {statusBadgeConfig[invoice.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(invoice)}
                      disabled={downloadingBookingId === invoice.booking.id}
                      className="gap-2"
                    >
                      {downloadingBookingId === invoice.booking.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
