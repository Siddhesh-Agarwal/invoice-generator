import z from "zod";

export const lineItemSchema = z.object({
  description: z.string().min(1, { message: "Description is required" }),
  quantity: z.number().min(1, { message: "Quantity must be greater than 0" }),
  price: z.number().min(0.01, { message: "Price must be greater than 0" }),
});

export type LineItemType = z.infer<typeof lineItemSchema>;

export const businessSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  logoUrl: z.string().base64({ message: "Invalid logo URL" }).optional(),
});

export type BusinessDetailsType = z.infer<typeof businessSchema>;

export const clientSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

export type ClientDetailsType = z.infer<typeof clientSchema>;

export const invoiceDetailsSchema = z.object({
  invoiceNumber: z.string().min(1, { message: "Invoice number is required" }),
  date: z.date({ message: "Invalid date" }),
  dueDate: z.date({ message: "Invalid due date" }).optional(),
});

export type InvoiceDetailsType = z.infer<typeof invoiceDetailsSchema>;

export const invoiceSchema = z.object({
  invoiceDetails: invoiceDetailsSchema,
  businessDetails: businessSchema,
  clientDetails: clientSchema,
  lineItems: z.array(lineItemSchema).default([]),
  notes: z.string().optional(),
  subtotal: z
    .number()
    .min(0, { message: "Subtotal must be greater than 0" })
    .default(0),
  taxRate: z
    .number()
    .min(0, { message: "Tax rate must be greater than 0" })
    .default(0),
  taxAmount: z
    .number()
    .min(0, { message: "Tax amount must be greater than 0" })
    .default(0),
  total: z
    .number()
    .min(0, { message: "Total must be greater than 0" })
    .default(0),
});

export type InvoiceType = z.infer<typeof invoiceSchema>;
