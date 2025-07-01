import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "react-router-dom";

const sortOptions = [
  { value: "name.asc", label: "Name: A to Z" },
  { value: "name.desc", label: "Name: Z to A" },
  { value: "price.asc", label: "Price: Low to High" },
  { value: "price.desc", label: "Price: High to Low" },
  { value: "rating.asc", label: "Rating: Low to High" },
  { value: "rating.desc", label: "Rating: High to Low" },
  { value: "created_at.asc", label: "Oldest to Newest" },
  { value: "created_at.desc", label: "Newest to Oldest" },
];

const Filters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (value: string) => {
    const [field, order] = value.split(".");
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("orderBy", field);
      params.set("order", order);
      params.set("page", "1");
      return params;
    });
  };

  const currentField = searchParams.get("orderBy");
  const currentOrder = searchParams.get("order");
  const currentValue =
    currentField && currentOrder
      ? `${currentField}.${currentOrder}`
      : undefined;
  const selected = sortOptions.some((o) => o.value === currentValue)
    ? currentValue
    : undefined;
  return (
    <div className="mb-5 flex gap-4">
      <Select onValueChange={handleChange} value={selected}>
        <SelectTrigger>
          <SelectValue placeholder="Sort Products" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {sortOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filters;
