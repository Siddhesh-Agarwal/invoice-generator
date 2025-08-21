"use client";

import InvoiceForm from "@/components/InvoiceForm";
import InvoicePreview from "@/components/InvoicePreview";
import {Button} from "@/components/ui/button";
import type {InvoiceType} from "@/types/invoice";
import {Printer, Save} from "lucide-react";
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {toast} from "sonner";

export default function Page() {
  const searchParams = useSearchParams();
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

  function handleSave() {
    try {
      // saveInvoice(invoice);
      toast.success("Invoice saved successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown error");
    }
  }

  function handlePrint() {
    window.print();
  }

  useEffect(() => {
    async function handleInvoiceNumberInSearchParam() {
      const invoiceNumberString = searchParams.get("invoice");
      if (invoiceNumberString) {
        const invoiceNumber = Number.parseInt(invoiceNumberString);
        if (Number.isNaN(invoiceNumber)) {
          return;
        }
        // const user = await auth();
        // if (!user || !user.user || !user.user.id) {
        //   forbidden();
        // }
        // await getInvoice(invoiceNumber)
        //   .then((res) => {
        //     if (res) {
        //       setInvoice(res.data as InvoiceType);
        //     }
        //   }).catch((err) => {
        //     console.error(err instanceof Error ? err.message : "Unknown error");
        //     forbidden();
        //   })
      }
    }

    try {
      handleInvoiceNumberInSearchParam();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown error");
    }
  }, [searchParams.get]);

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
            <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
          </div>
          <div className="rounded-lg bg-card p-6 shadow lg:col-span-1 print:shadow-none">
            <InvoicePreview invoice={invoice} />
          </div>
        </div>
      </div>
    </div>
  );
}
