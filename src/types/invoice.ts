
export interface LineItemType {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface BusinessDetailsType {
  name: string;
  email?: string;
  address?: string;
  phone?: string;
  logoUrl?: string;
}

export interface ClientDetailsType {
  name: string;
  email?: string;
  address?: string;
  phone?: string;
}

export interface InvoiceType {
  invoiceNumber: string;
  date: Date;
  dueDate?: Date;
  businessDetails: BusinessDetailsType;
  clientDetails: ClientDetailsType;
  lineItems: LineItemType[];
  notes?: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}
