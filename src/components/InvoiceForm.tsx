import {Plus} from "lucide-react";
import {v4 as uuidv4} from "uuid";

import type {
  InvoiceDetailsType,
  InvoiceType,
  LineItemType,
} from "@/types/invoice";
import BusinessDetails from "./BusinessDetails";
import ClientDetails from "./ClientDetails";
import InvoiceDetails from "./InvoiceDetails";
import LineItem from "./LineItem";
import {Button} from "./ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {Textarea} from "./ui/textarea";

interface InvoiceFormProps {
  invoice: InvoiceType;
  setInvoice: React.Dispatch<React.SetStateAction<InvoiceType>>;
}

const InvoiceForm = ({invoice, setInvoice}: InvoiceFormProps) => {
  const addLineItem = () => {
    const newItem: LineItemType = {
      id: uuidv4(),
      description: "",
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
        item === updatedItem ? updatedItem : item,
      );

      // Calculate subtotal
      const subtotal = updatedLineItems.reduce(
        (sum, item) => sum + item.total,
        0,
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

  const removeLineItem = (removedItem: LineItemType) => {
    setInvoice((prev) => {
      const filteredLineItems = prev.lineItems.filter(
        (item) => item !== removedItem,
      );

      // Recalculate totals
      const subtotal = filteredLineItems.reduce(
        (sum, item) => sum + item.total,
        0,
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

  function updateInvoice(details: InvoiceDetailsType) {
    setInvoice((prev) => ({
      ...prev,
      invoiceDetails: details,
    }));
  }

  return (
    <div className="space-y-6">
      <Card className="border-none">
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InvoiceDetails
            invoiceDetails={invoice.invoiceDetails}
            setInvoiceDetails={updateInvoice}
          />
        </CardContent>
      </Card>

      <Card className="border-none">
        <CardHeader>
          <CardTitle>Your Business</CardTitle>
        </CardHeader>
        <CardContent>
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

      <Card className="border-none">
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

      <Card className="border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Line Items</CardTitle>
          <Button
            onClick={addLineItem}
            size="sm"
            className="h-8 cursor-pointer"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.lineItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No items added yet. Click the "Add Item" button to add
                      your first item.
                    </TableCell>
                  </TableRow>
                ) : (
                  invoice.lineItems.map((item) => {
                    const id = uuidv4();
                    return (
                      <LineItem
                        key={id}
                        item={{...item, id}}
                        updateItem={updateLineItem}
                        removeItem={removeLineItem}
                      />
                    );
                  })
                )}
              </TableBody>
            </Table>

            {invoice.lineItems.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between py-1">
                  <span className="font-medium">Subtotal:</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium">Tax ({invoice.taxRate}%):</span>
                  <span>${invoice.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 font-bold text-lg">
                  <span>Total:</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none">
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
