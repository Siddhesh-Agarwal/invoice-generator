import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type BusinessDetailsType, businessSchema } from "@/types/invoice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import LogoUpload from "./logo-upload";

interface BusinessDetailsProps {
  businessDetails: BusinessDetailsType;
  setBusinessDetails: (details: BusinessDetailsType) => void;
}

const BusinessDetails = ({
  businessDetails,
  setBusinessDetails,
}: BusinessDetailsProps) => {
  const form = useForm<BusinessDetailsType>({
    resolver: zodResolver(businessSchema),
    defaultValues: businessDetails,
    mode: "onChange",
  });
  const watchedValues = form.watch();

  useEffect(() => {
    setBusinessDetails(watchedValues);
  }, [watchedValues, setBusinessDetails]);

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Logo</FormLabel>
              <LogoUpload
                logoUrl={field.value}
                onLogoChange={(url) =>
                  form.setValue("logoUrl", url, { shouldValidate: true })
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <Input {...field} placeholder="Your Business Name" />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input
                {...field}
                type="email"
                placeholder="your-email@example.com"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
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
          render={({ field }) => (
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

export default BusinessDetails;
