"use client";

import StudentInvoicesList from "@/components/invoice/StudentInvoicesList";

const InvoicesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Invoices</h1>
        <p className="text-sm text-muted-foreground">
          Access issued and refunded session invoices.
        </p>
      </div>

      <StudentInvoicesList />
    </div>
  );
};

export default InvoicesPage;
