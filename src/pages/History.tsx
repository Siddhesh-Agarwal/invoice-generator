import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth, continueWithGoogle, listInvoices } from "@/firebase";
import type { InvoiceTypePreview } from "@/types/invoice";
import {
  Clock,
  Edit,
  History,
  PiggyBank,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function HistoryPage() {
  const user = auth.currentUser;
  if (user === null) {
    return (
      <section className="w-full h-screen flex justify-center items-center">
        <div className="flex flex-col items-center">
          <UserPlus
            className="text-muted-foreground border border-border rounded-full p-2"
            size={96}
          />
          <h1 className="text-muted-foreground text-center text-xl">
            <Button
              variant={"link"}
              className="text-xl"
              onClick={() => continueWithGoogle()}
            >
              Create an account
            </Button>
            <br />
            to view invoice history.
          </h1>
        </div>
      </section>
    );
  }

  const [history, setHistory] = useState<InvoiceTypePreview[]>([]);
  const navigate = useNavigate();
  useState(() => {
    async function getHistory() {
      setHistory(await listInvoices());
    }
    getHistory();
  });

  if (history.length === 0) {
    return (
      <section className="w-full h-screen flex justify-center items-center">
        <div className="flex flex-col items-center">
          <History
            className="text-muted-foreground border border-border rounded-full p-2"
            size={96}
          />
          <h1 className="text-muted-foreground font-semibold text-center text-xl">
            No invoices found.
            <br />
            <Button
              variant={"link"}
              className="text-xl"
              onClick={() => navigate("/")}
            >
              Create an invoice
            </Button>
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-screen flex flex-col">
      <h1 className="text-xl font-semibold">Invoice History</h1>
      <div className="flex flex-col">
        {history.map((invoice) => (
          <Card key={invoice.invoiceNumber}>
            <CardHeader>
              <CardTitle>{invoice.clientName}</CardTitle>
              <CardDescription>{invoice.invoiceNumber}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="mr-2" size={16} />
                <h4>{invoice.date.toLocaleDateString()}</h4>
              </div>
              <div className="flex items-center">
                <PiggyBank className="mr-2" size={16} />
                <h4>{invoice.total}</h4>
              </div>
            </CardContent>
            <CardFooter>
              <CardAction>
                <Button
                  variant={"secondary"}
                  onClick={() =>
                    navigate(`/invoice?invoice=${invoice.invoiceNumber}`)
                  }
                >
                  <Edit className="mr-2" size={16} />
                  Edit
                </Button>
                <Button variant={"destructive"}>
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
