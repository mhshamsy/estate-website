import { PropertyStatus } from "@/types/propertyStatus";
import { Badge } from "./ui/badge";

const statusLabel = {
  for_sale: "For Sale",
  withdrawn: "Withdrawn",
  draft: "Draft",
  sold: "Sold",
};

const variant: {
  [key: string]: "primary" | "destructive" | "secondary" | "success";
} = {
  for_sale: "primary",
  withdrawn: "destructive",
  draft: "secondary",
  sold: "success",
};

function PropertyStatusBadge({
  status,
  className,
}: {
  status: PropertyStatus;
  className?: string;
}) {
  const label = statusLabel[status];
  return <Badge variant={variant[status]} className={className}>{label}</Badge>;
}

export default PropertyStatusBadge;
