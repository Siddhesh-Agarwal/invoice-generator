
import { useState, useEffect } from 'react';
import { type LineItemType } from '../types/invoice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface LineItemProps {
  item: LineItemType;
  updateItem: (item: LineItemType) => void;
  removeItem: (id: string) => void;
}

const LineItem = ({ item, updateItem, removeItem }: LineItemProps) => {
  const [description, setDescription] = useState(item.description);
  const [quantity, setQuantity] = useState(item.quantity);
  const [price, setPrice] = useState(item.price);

  useEffect(() => {
    // Update the item total when quantity or price changes
    const total = quantity * price;
    updateItem({
      ...item,
      description,
      quantity,
      price,
      total,
    });
  }, [description, quantity, price, updateItem, item]);

  return (
    <div className="grid grid-cols-12 gap-2 items-center">
      <div className="col-span-5">
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Item description"
        />
      </div>

      <div className="col-span-2">
        <Input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
          className="text-right"
        />
      </div>

      <div className="col-span-2">
        <Input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
          className="text-right"
        />
      </div>

      <div className="col-span-2 text-right font-medium py-2">
        ${(quantity * price).toFixed(2)}
      </div>

      <div className="col-span-1 text-right">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={() => removeItem(item.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LineItem;
