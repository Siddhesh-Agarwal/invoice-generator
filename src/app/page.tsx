"use client";

import InvoiceForm from "@/components/InvoiceForm";
import InvoicePreview from "@/components/InvoicePreview";
import {Button} from "@/components/ui/button";
import {api} from "@/trpc/react";
import {
  type InvoiceType,
  type LineItemType,
  invoiceSchema,
} from "@/types/invoice";
import {Printer, Save} from "lucide-react";
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import {toast} from "sonner";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceType>({
    invoiceDetails: {
      invoiceNumber: "",
      date: new Date(),
      dueDate: undefined,
    },
    businessDetails: {
      name: "",
      email: "",
      address: "",
      phone: "",
      logoUrl: undefined,
    },
    clientDetails: {
      name: "",
      email: "",
      address: "",
      phone: "",
    },
    lineItems: [],
    notes: "",
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
  });
  const invoiceID = searchParams.get("invoice");
  if (invoiceID !== null) {
    const {data} = api.invoice.get.useQuery({invoiceId: invoiceID});
    if (data === undefined) {
      throw new Error("Failed to fetch invoice");
    }
    setInvoice(data.data);
  }

  function handleSave() {
    try {
      // saveInvoice(invoice);
      const invoiceID = searchParams.get("invoice");
      if (invoiceID) {
        // update invoice
        // api.invoice.update({ invoiceId: invoiceID, data: invoice })
        const {mutate} = api.invoice.update.useMutation();
        mutate({invoiceId: invoiceID, data: invoice});
      } else {
        // create invoice
        const {mutate, data} = api.invoice.create.useMutation();
        mutate({data: invoice});

        if (data === undefined) {
          throw new Error("Failed to create invoice");
        }
        const params = new URLSearchParams();
        params.set("invoice", data.id);
        router.push(`?${params.toString()}`);
      }
      toast.success("Invoice saved successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  function handlePrint() {
    if (invoiceSchema.safeParse(invoice).success) {
      window.print();
    } else if (
      confirm(
        "The invoice has incorrect/missing fields. Are you sure you want to print it?",
      )
    ) {
      window.print();
    }
  }

  function addLineItem() {
    const newItem: LineItemType = {
      description: "",
      quantity: 1,
      price: 0,
    };

    setInvoice((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem],
    }));
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between print:hidden">
          <h1 className="font-bold text-3xl text-invoice-primary">
            Invoice Generator
          </h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleSave}
              className="cursor-pointer"
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button onClick={handlePrint} className="cursor-pointer">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="lg:col-span-1 print:hidden">
            <InvoiceForm
              invoice={invoice}
              setInvoice={setInvoice}
              addLineItem={addLineItem}
            />
          </div>
          <div className="rounded-lg bg-card p-6 shadow lg:col-span-1 print:shadow-none">
            <InvoicePreview invoice={invoice} />
          </div>
        </div>
      </div>
    </div>
  );
}
