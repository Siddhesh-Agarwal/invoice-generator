
import { InvoiceType } from '../types/invoice';
import { format } from 'date-fns';

interface InvoicePreviewProps {
  invoice: InvoiceType;
}

const InvoicePreview = ({ invoice }: InvoicePreviewProps) => {
  return (
    <div className="p-6 print:p-0 animate-fade-in">
      <div className="text-sm text-gray-500 mb-8 text-right print:hidden">
        Preview
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          {invoice.businessDetails.logoUrl && (
            <img
              src={invoice.businessDetails.logoUrl}
              alt="Business Logo"
              className="max-h-20 max-w-[200px] mb-4"
            />
          )}
          <div className="text-xl font-semibold">
            {invoice.businessDetails.name || "Your Business Name"}
          </div>
          {
            invoice.businessDetails?.address && (
              <div className="text-gray-500 whitespace-pre-line">
                {invoice.businessDetails.address}
              </div>
            )
          }
          <div className="text-gray-500">
            {invoice.businessDetails.email && (
              <div>{invoice.businessDetails.email}</div>
            )}
            {invoice.businessDetails.phone && (
              <div>{invoice.businessDetails.phone}</div>
            )}
          </div>
        </div>

        <div className="text-right">
          <h1 className="text-3xl font-bold text-invoice-primary mb-2">INVOICE</h1>
          <div className="text-gray-500">
            <div>
              <span className="font-semibold"># </span>
              {invoice.invoiceNumber}
            </div>
            <div>
              <span className="font-semibold">Date: </span>
              {format(invoice.date, 'PPP')}
            </div>
            {
              invoice.dueDate && (
                <div>
                  <span className="font-semibold">Due Date: </span>
                  {format(invoice.dueDate, 'PPP')}
                </div>
              )
            }
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-1">BILL TO</div>
        <div className="font-semibold">{invoice.clientDetails.name || "Client Name"}</div>
        {
          invoice.clientDetails.address && (
            <div className="text-gray-500 whitespace-pre-line">
              {invoice.clientDetails.address}
            </div>
          )
        }
        <div className="text-gray-500">
          {invoice.clientDetails.email && <div>{invoice.clientDetails.email}</div>}
          {invoice.clientDetails.phone && <div>{invoice.clientDetails.phone}</div>}
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 font-semibold">Description</th>
              <th className="py-2 font-semibold text-right">Qty</th>
              <th className="py-2 font-semibold text-right">Price</th>
              <th className="py-2 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  No items added yet
                </td>
              </tr>
            ) : (
              invoice.lineItems.map((item) => (
                <tr key={item.id} className="border-b border-border">
                  <td className="py-3">{item.description || "Item description"}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                  <td className="py-3 text-right">${item.total.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-1">
            <span className="font-medium">Subtotal:</span>
            <span>${invoice.subtotal.toFixed(2)}</span>
          </div>
          {invoice.taxRate ? (
            <div className="flex justify-between py-1">
              <span className="font-medium">Tax ({invoice.taxRate}%):</span>
              <span>${invoice.taxAmount.toFixed(2)}</span>
            </div>
          ) : (
            <></>
          )}
          <div className="flex justify-between py-1 text-lg font-bold border-t border-border mt-1 pt-1">
            <span>Total:</span>
            <span>${invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="border-t border-border pt-4">
          <div className="text-sm text-gray-600 font-semibold mb-1">Notes</div>
          <div className="text-sm text-gray-500 whitespace-pre-line">{invoice.notes}</div>
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;
