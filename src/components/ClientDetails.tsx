import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {type ClientDetailsType, clientSchema} from "@/types/invoice";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormField, FormItem, FormLabel, FormMessage} from "./ui/form";

interface ClientDetailsProps {
  clientDetails: ClientDetailsType;
  setClientDetails: (details: ClientDetailsType) => void;
}

const ClientDetails = ({
  clientDetails,
  setClientDetails,
}: ClientDetailsProps) => {
  const form = useForm<ClientDetailsType>({
    resolver: zodResolver(clientSchema),
  });
  form.setValue("name", clientDetails.name);
  form.setValue("email", clientDetails.email);
  form.setValue("phone", clientDetails.phone);
  form.setValue("address", clientDetails.address);
  form.setValue("logoUrl", clientDetails.logoUrl);

  function handleChange(data: ClientDetailsType) {
    setClientDetails(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleChange)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({field}) => (
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <Input {...field} placeholder="Client or Company Name" />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input
                {...field}
                type="email"
                placeholder="client-email@example.com"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({field}) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <Input {...field} type="tel" placeholder="(123) 456-7890" />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({field}) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <Textarea
                {...field}
                placeholder="Street Address, City, State/Province, Postal Code, Country"
                rows={3}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ClientDetails;
