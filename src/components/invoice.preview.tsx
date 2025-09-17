import { format } from "date-fns";
import type { InvoiceType } from "@/types/invoice";

interface InvoicePreviewProps {
  invoice: InvoiceType;
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  return (
    <div className="animate-fade-in p-6 print:p-0">
      <div className="mb-8 grid grid-cols-2 gap-8">
        <div>
          {invoice.businessDetails.logoUrl && (
            <img
              src={invoice.businessDetails.logoUrl}
              alt="Business Logo"
              className="mb-4 max-h-20 max-w-[200px]"
            />
          )}
          <div className="font-semibold text-xl">
            {invoice.businessDetails.name || "Your Business Name"}
          </div>
          {invoice.businessDetails?.address && (
            <div className="whitespace-pre-line text-muted-foreground">
              {invoice.businessDetails.address}
            </div>
          )}
          <div className="text-muted-foreground">
            {invoice.businessDetails.email && (
              <div>{invoice.businessDetails.email}</div>
            )}
            {invoice.businessDetails.phone && (
              <div>{invoice.businessDetails.phone}</div>
            )}
          </div>
        </div>

        <div className="text-right">
          <h1 className="mb-2 font-bold text-3xl text-invoice-primary">
            INVOICE
          </h1>
          <div className="text-muted-foreground">
            <div>
              <span className="font-semibold"># </span>
              {invoice.invoiceDetails.invoiceNumber}
            </div>
            <div>
              <span className="font-semibold">Date: </span>
              {format(invoice.invoiceDetails.date, "PPP")}
            </div>
            {invoice.invoiceDetails.dueDate && (
              <div>
                <span className="font-semibold">Due Date: </span>
                {format(invoice.invoiceDetails.dueDate, "PPP")}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-1 text-muted-foreground text-sm">BILL TO</div>
        <div className="font-semibold">
          {invoice.clientDetails.name || "Client Name"}
        </div>
        {invoice.clientDetails.address && (
          <div className="whitespace-pre-line text-muted-foreground">
            {invoice.clientDetails.address}
          </div>
        )}
        <div className="text-muted-foreground">
          {invoice.clientDetails.email && (
            <div>{invoice.clientDetails.email}</div>
          )}
          {invoice.clientDetails.phone && (
            <div>{invoice.clientDetails.phone}</div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-border border-b text-left">
              <th className="py-2 font-semibold">Description</th>
              <th className="py-2 text-right font-semibold">Qty</th>
              <th className="py-2 text-right font-semibold">Price</th>
              <th className="py-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-4 text-center text-muted-foreground"
                >
                  No items added yet
                </td>
              </tr>
            ) : (
              invoice.lineItems.map((item, index) => (
                <tr
                  key={`${invoice.invoiceDetails.invoiceNumber}-${index}`}
                  className="border-border border-b"
                >
                  <td className="py-3">
                    {item.description || "Item description"}
                  </td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                  <td className="py-3 text-right">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mb-8 flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-1">
            <span className="font-medium">Subtotal:</span>
            <span>${invoice.subtotal.toFixed(2)}</span>
          </div>
          {invoice.taxRate !== 0 && (
            <div className="flex justify-between py-1">
              <span className="font-medium">Tax ({invoice.taxRate}%):</span>
              <span>${invoice.taxAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="mt-1 flex justify-between border-border border-t py-1 pt-1 font-bold text-lg">
            <span>Total:</span>
            <span>${invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="border-border border-t pt-4">
          <div className="mb-1 font-semibold text-sm">Notes</div>
          <div className="whitespace-pre-line text-muted-foreground text-sm">
            {invoice.notes}
          </div>
        </div>
      )}
    </div>
  );
}
