import {createCaller} from "@/server/api/root";
import {createTRPCContext} from "@/server/api/trpc";
import {signIn, signOut} from "@/server/auth";

export async function serverSignOut() {
  "use server";
  await signOut();
}

export async function serverSignIn() {
  "use server";
  await signIn();
}

export async function getTRPCCaller() {
  "use server";

  const ctx = await createTRPCContext({
    headers: new Headers({}),
  });
  const trpc = createCaller(ctx);
  return trpc;
}

export async function getInvoice(invoiceNumber: number) {
  "use server";

  const trpc = await getTRPCCaller();
  const invoice = await trpc.invoice.get({id: invoiceNumber});
  return invoice;
}

export async function getInvoices() {
  "use server";

  const trpc = await getTRPCCaller();
  const invoices = await trpc.invoice.getByUser();
  return invoices;
}

export async function deleteInvoice(invoiceNumber: number) {
  "use server";

  const trpc = await getTRPCCaller();
  const invoice = await trpc.invoice.delete({id: invoiceNumber});
  return invoice;
}
