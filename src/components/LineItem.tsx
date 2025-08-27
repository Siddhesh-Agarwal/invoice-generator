import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import type {LineItemType} from "@/types/invoice";
import {X} from "lucide-react";
import {useEffect, useState} from "react";
import {TableCell, TableRow} from "./ui/table";

interface LineItemProps {
  item: LineItemType;
  updateItem: (item: LineItemType) => void;
  removeItem: (item: LineItemType) => void;
}

export default function LineItem({
  item,
  updateItem,
  removeItem,
}: LineItemProps) {
  const [description, setDescription] = useState(item.description);
  const [quantity, setQuantity] = useState(item.quantity);
  const [price, setPrice] = useState(item.price);

  useEffect(() => {
    // Update the item total when quantity or price changes
    updateItem({
      description,
      quantity,
      price,
    });
  }, [description, quantity, price, updateItem]);

  return (
    <TableRow>
      <TableCell>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Item description"
        />
      </TableCell>

      <TableCell>
        <Input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number.parseFloat(e.target.value) || 0)}
          className="text-right"
        />
      </TableCell>

      <TableCell>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(Number.parseFloat(e.target.value) || 0)}
          className="text-right"
        />
      </TableCell>

      <TableCell>${(quantity * price).toFixed(2)}</TableCell>

      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={() => removeItem(item)}
        >
          <X className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
