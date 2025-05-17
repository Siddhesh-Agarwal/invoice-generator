import { type ClientDetailsType } from '../types/invoice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ClientDetailsProps {
  clientDetails: ClientDetailsType;
  setClientDetails: (details: ClientDetailsType) => void;
}

const ClientDetails = ({ clientDetails, setClientDetails }: ClientDetailsProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientDetails({
      ...clientDetails,
      [name]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="client-name">Client Name</Label>
        <Input
          id="client-name"
          name="name"
          value={clientDetails.name}
          onChange={handleChange}
          placeholder="Client or Company Name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-email">Email</Label>
        <Input
          id="client-email"
          name="email"
          type="email"
          value={clientDetails.email}
          onChange={handleChange}
          placeholder="client-email@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-phone">Phone</Label>
        <Input
          id="client-phone"
          name="phone"
          value={clientDetails.phone}
          onChange={handleChange}
          placeholder="(123) 456-7890"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-address">Address</Label>
        <Textarea
          id="client-address"
          name="address"
          value={clientDetails.address}
          onChange={handleChange}
          placeholder="Street Address, City, State/Province, Postal Code, Country"
          rows={3}
        />
      </div>
    </div>
  );
};

export default ClientDetails;
