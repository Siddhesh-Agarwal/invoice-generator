import {Button} from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {serverSignIn} from "@/lib/helpers";
import {auth} from "@/server/auth";
import {api} from "@/trpc/react";
import {
  Ban,
  Clock,
  DollarSign,
  Edit,
  Hash,
  History,
  Trash2,
  UserPlus,
} from "lucide-react";
import Link from "next/link";

export default async function Page() {
  const user = await auth().then((user) => user?.user);
  const {data: history, isLoading, error} = api.invoice.getByUser.useQuery();

  async function deleteInvoice(id: string) {
    api.invoice.delete.useMutation().mutate({invoiceId: id});
    history?.filter((invoice) => invoice.id !== id);
  }

  if (!user || !user.id) {
    return (
      <section className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <UserPlus
            className="rounded-full border border-border p-2 text-muted-foreground"
            size={96}
          />
          <h1 className="flex flex-col items-center text-center text-muted-foreground text-xl">
            <form onSubmit={serverSignIn}>
              <Button variant={"link"} className="text-xl" type="submit">
                Create an account
              </Button>
            </form>
            <span>to view invoice history.</span>
          </h1>
        </div>
      </section>
    );
  }

  if (isLoading || !history) {
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

  if (!history.length) {
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
            <Link href="/" passHref prefetch>
              <Button variant={"link"} className="text-xl">
                Create an invoice
              </Button>
            </Link>
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-screen w-full flex-col p-4 md:p-8">
      <h1 className="font-semibold text-2xl">Invoice History</h1>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {history.map((invoice) => (
          <Card
            key={invoice.data.invoiceDetails.invoiceNumber}
            className="w-full hover:shadow-xl"
          >
            <CardHeader>
              <CardTitle className="uppercase">
                {invoice.data.clientDetails.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Hash size={16} />
                {invoice.data.invoiceDetails.invoiceNumber}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="mr-2" size={16} />
                <h4>{invoice.createdAt.toLocaleDateString()}</h4>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2" size={16} />
                <h4>{invoice.data.total}</h4>
              </div>
            </CardContent>
            <CardFooter>
              <CardAction className="flex items-center gap-2">
                <Link
                  href={`/invoice?invoice=${invoice.data.invoiceDetails.invoiceNumber}`}
                  passHref
                >
                  <Button variant={"secondary"}>
                    <Edit className="mr-2" size={16} />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant={"destructive"}
                  onClick={() => deleteInvoice(invoice.id)}
                >
                  <Trash2 className="mr-2" size={16} />
                  Delete
                </Button>
              </CardAction>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
