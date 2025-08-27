import {type InvoiceDetailsType, invoiceDetailsSchema} from "@/types/invoice";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {DateInput} from "./ui/date-input";
import {Form, FormField, FormItem, FormLabel, FormMessage} from "./ui/form";
import {Input} from "./ui/input";

export default function InvoiceDetails({
  invoiceDetails,
  setInvoiceDetails,
}: {
  invoiceDetails: InvoiceDetailsType;
  setInvoiceDetails: (details: InvoiceDetailsType) => void;
}) {
  const form = useForm<InvoiceDetailsType>({
    resolver: zodResolver(invoiceDetailsSchema),
    defaultValues: invoiceDetails,
    mode: "onChange",
  });
  const watchedValues = form.watch();

  useEffect(() => {
    setInvoiceDetails(watchedValues);
  }, [watchedValues, setInvoiceDetails]);

  return (
    <Form {...form}>
      <form className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="invoiceNumber"
          render={({field}) => (
            <FormItem>
              <FormLabel>Invoice #</FormLabel>
              <Input {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({field}) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <DateInput {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({field}) => (
            <FormItem>
              <FormLabel>Invoice Date</FormLabel>
              <DateInput {...field} />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
