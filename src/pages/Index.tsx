
import React, { useState } from 'react';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePreview from '../components/InvoicePreview';
import { InvoiceType } from '../types/invoice';
import { Button } from '@/components/ui/button';
import { Printer, Save } from 'lucide-react';
import { toast } from 'sonner';

const generateInvoiceNumber = (): string => {
  const prefix = 'INV';
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${date}-${random}`;
};

const Index = () => {
  const [invoice, setInvoice] = useState<InvoiceType>({
    invoiceNumber: generateInvoiceNumber(),
    date: new Date(),
    dueDate: null,
    businessDetails: {
      name: '',
      email: '',
      address: '',
      phone: '',
      logoUrl: null,
    },
    clientDetails: {
      name: '',
      email: '',
      address: '',
      phone: '',
    },
    lineItems: [],
    notes: '',
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
  });

  const handleSave = () => {
    // In a real app, this would save to a database
    toast.success('Invoice saved successfully!');
  };

  const handlePrint = () => {
    window.print();
  };


  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center mb-8 print:hidden">
          <h1 className="text-3xl font-bold text-invoice-primary">Invoice Generator</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleSave} className="cursor-pointer">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={handlePrint} className="cursor-pointer">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1 print:hidden">
            <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
          </div>
          <div className="lg:col-span-1 bg-card shadow rounded-lg p-6 print:shadow-none">
            <InvoicePreview invoice={invoice} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
