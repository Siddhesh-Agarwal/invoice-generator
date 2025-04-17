import { v4 as uuidv4 } from 'uuid';
import { Plus } from 'lucide-react';
import { InvoiceType, LineItemType } from '@/types/invoice';
import LogoUpload from './LogoUpload';
import BusinessDetails from './BusinessDetails';
import ClientDetails from './ClientDetails';
import LineItem from './LineItem';
import DateInput from './DateInput';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface InvoiceFormProps {
  invoice: InvoiceType;
  setInvoice: React.Dispatch<React.SetStateAction<InvoiceType>>;
}

const InvoiceForm = ({ invoice, setInvoice }: InvoiceFormProps) => {
  const addLineItem = () => {
    const newItem: LineItemType = {
      id: uuidv4(),
      description: '',
      quantity: 1,
      price: 0,
      total: 0,
    };

    setInvoice((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem],
    }));
  };

  const updateLineItem = (updatedItem: LineItemType) => {
    setInvoice((prev) => {
      const updatedLineItems = prev.lineItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );

      // Calculate subtotal
      const subtotal = updatedLineItems.reduce(
        (sum, item) => sum + item.total,
        0
      );

      // Calculate tax amount
      const taxAmount = (subtotal * prev.taxRate) / 100;

      // Calculate total
      const total = subtotal + taxAmount;

      return {
        ...prev,
        lineItems: updatedLineItems,
        subtotal,
        taxAmount,
        total,
      };
    });
  };

  const removeLineItem = (id: string) => {
    setInvoice((prev) => {
      const filteredLineItems = prev.lineItems.filter((item) => item.id !== id);

      // Recalculate totals
      const subtotal = filteredLineItems.reduce(
        (sum, item) => sum + item.total,
        0
      );
      const taxAmount = (subtotal * prev.taxRate) / 100;
      const total = subtotal + taxAmount;

      return {
        ...prev,
        lineItems: filteredLineItems,
        subtotal,
        taxAmount,
        total,
      };
    });
  };

  const updateTaxRate = (rate: number) => {
    setInvoice((prev) => {
      const taxAmount = (prev.subtotal * rate) / 100;
      const total = prev.subtotal + taxAmount;

      return {
        ...prev,
        taxRate: rate,
        taxAmount,
        total,
      };
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice #</Label>
              <Input
                id="invoiceNumber"
                value={invoice.invoiceNumber}
                onChange={(e) =>
                  setInvoice((prev) => ({
                    ...prev,
                    invoiceNumber: e.target.value,
                  }))
                }
              />
            </div>

            <DateInput
              label='Issue Date'
              onChange={(date) =>
                setInvoice((prev) => ({
                  ...prev,
                  dueDate: date || new Date(),
                }))
              }
            />

            <DateInput
              label='Due Date'
              onChange={(date) =>
                setInvoice((prev) => ({
                  ...prev,
                  date: date || new Date(),
                }))
              }
            />

            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={invoice.taxRate}
                min={0}
                onChange={(e) => updateTaxRate(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Business</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <LogoUpload
              logoUrl={invoice.businessDetails.logoUrl}
              onLogoChange={(url) =>
                setInvoice((prev) => ({
                  ...prev,
                  businessDetails: {
                    ...prev.businessDetails,
                    logoUrl: url,
                  },
                }))
              }
            />
          </div>
          <BusinessDetails
            businessDetails={invoice.businessDetails}
            setBusinessDetails={(details) =>
              setInvoice((prev) => ({
                ...prev,
                businessDetails: details,
              }))
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientDetails
            clientDetails={invoice.clientDetails}
            setClientDetails={(details) =>
              setInvoice((prev) => ({
                ...prev,
                clientDetails: details,
              }))
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Line Items</CardTitle>
          <Button onClick={addLineItem} size="sm" className="h-8">
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500 pb-2 border-b">
              <div className="col-span-5">Description</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>

            {invoice.lineItems.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No items added yet. Click the "Add Item" button to add your first item.
              </div>
            ) : (
              invoice.lineItems.map((item) => (
                <LineItem
                  key={item.id}
                  item={item}
                  updateItem={updateLineItem}
                  removeItem={removeLineItem}
                />
              ))
            )}

            {invoice.lineItems.length > 0 && (
              <div className="pt-4 border-t mt-4">
                <div className="flex justify-between py-1">
                  <span className="font-medium">Subtotal:</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium">Tax ({invoice.taxRate}%):</span>
                  <span>${invoice.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-lg font-bold">
                  <span>Total:</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Payment terms, thank you notes, or any additional information..."
            value={invoice.notes}
            className="min-h-[100px]"
            onChange={(e) =>
              setInvoice((prev) => ({
                ...prev,
                notes: e.target.value,
              }))
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceForm;
