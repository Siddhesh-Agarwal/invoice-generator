
import { type BusinessDetailsType } from '../types/invoice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface BusinessDetailsProps {
  businessDetails: BusinessDetailsType;
  setBusinessDetails: (details: BusinessDetailsType) => void;
}

const BusinessDetails = ({ businessDetails, setBusinessDetails }: BusinessDetailsProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessDetails({
      ...businessDetails,
      [name]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="business-name">Business Name</Label>
        <Input
          id="business-name"
          name="name"
          value={businessDetails.name}
          onChange={handleChange}
          placeholder="Your Business Name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="business-email">Email</Label>
        <Input
          id="business-email"
          name="email"
          type="email"
          value={businessDetails.email}
          onChange={handleChange}
          placeholder="your-email@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="business-phone">Phone</Label>
        <Input
          id="business-phone"
          name="phone"
          value={businessDetails.phone}
          onChange={handleChange}
          placeholder="(123) 456-7890"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="business-address">Address</Label>
        <Textarea
          id="business-address"
          name="address"
          value={businessDetails.address}
          onChange={handleChange}
          placeholder="Street Address, City, State/Province, Postal Code, Country"
          rows={3}
        />
      </div>
    </div>
  );
};

export default BusinessDetails;
