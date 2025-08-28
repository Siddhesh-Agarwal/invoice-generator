"use client";

import {Button, buttonVariants} from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Skeleton} from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {api} from "@/trpc/react";
import {
  Ban,
  CalendarCheck,
  CalendarClock,
  DollarSign,
  Edit,
  Hash,
  History,
  Trash2,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

export default function Page() {
  const {data: history, isLoading, error} = api.invoice.getByUser.useQuery();

  async function deleteInvoice(id: string) {
    const {mutateAsync} = api.invoice.delete.useMutation();
    await mutateAsync({invoiceId: id});
    history?.filter((invoice) => invoice.id !== id);
  }

  async function updateInvoiceStatus(
    id: string,
    status: "draft" | "pending" | "paid" | "failed",
  ) {
    const {mutateAsync} = api.invoice.updateStatus.useMutation();
    await mutateAsync({invoiceId: id, status});
  }

  if (isLoading) {
    return (
      <section className="flex h-screen w-full items-center justify-center">
        <Skeleton className="h-6 w-full max-w-xl" />
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </section>
    );
  }

  if (error) {
    if (error.data?.code === "UNAUTHORIZED") {
      return (
        <section className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center">
            <UserPlus
              className="rounded-full border border-border p-2 text-muted-foreground"
              size={96}
            />
            <h1 className="flex flex-col items-center text-center text-muted-foreground text-xl">
              <Button variant={"link"} className="text-xl" type="submit">
                Create an account
              </Button>
              <span>to view invoice history.</span>
            </h1>
          </div>
        </section>
      );
    }
    return (
      <section className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <Ban
            className="text-center font-semibold text-destructive-foreground text-xl"
            size={96}
          />
          <h1 className="text-center font-semibold text-destructive-foreground text-xl">
            Something went wrong. Please try again later.
          </h1>
        </div>
      </section>
    );
  }

  if (!history || !history.length) {
    return (
      <section className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <History
            className="rounded-full border border-border p-2 text-muted-foreground"
            size={96}
          />
          <h1 className="text-center font-semibold text-muted-foreground text-xl">
            No invoices found.
            <br />
            <Link
              href="/"
              className={buttonVariants({variant: "link"})}
              prefetch
            >
              Create an invoice
            </Link>
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-screen w-full flex-col p-4 md:p-8">
      <h1 className="font-semibold text-2xl">Invoice History</h1>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Client Name</TableHead>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.length === 0 ? (
            <TableRow className="h-24 text-muted-foreground">
              <TableCell className="font-medium uppercase" colSpan={7}>
                No invoices found.
                <br />
                <Link
                  href="/"
                  prefetch
                  className={buttonVariants({variant: "link"})}
                >
                  Create an invoice
                </Link>
              </TableCell>
            </TableRow>
          ) : (
            history.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium uppercase">
                  {invoice.data.clientDetails.name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Hash size={16} />
                    {invoice.data.invoiceDetails.invoiceNumber}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <CalendarCheck className="mr-2" size={16} />
                    {invoice.data.invoiceDetails.date.toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <CalendarClock className="mr-2" size={16} />
                    {invoice.data.invoiceDetails.dueDate?.toLocaleDateString() ||
                      "N/A"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <DollarSign className="mr-2" size={16} />
                    {invoice.data.total}
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={invoice.paymentStatus}
                    onValueChange={(value) =>
                      updateInvoiceStatus(
                        invoice.id,
                        value as "draft" | "pending" | "paid" | "failed",
                      )
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="flex items-center justify-end gap-2">
                  <Link
                    href={`/invoice?invoice=${invoice.data.invoiceDetails.invoiceNumber}`}
                    className={buttonVariants({
                      variant: "secondary",
                      size: "sm",
                    })}
                  >
                    <Edit className="mr-2" size={16} />
                    Edit
                  </Link>
                  <Button
                    variant={"destructive"}
                    size={"sm"}
                    onClick={() => deleteInvoice(invoice.id)}
                  >
                    <Trash2 className="mr-2" size={16} />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </section>
  );
}
