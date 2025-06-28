import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getPaginationNumbers = (page: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];

  if (page <= 3) {
    pages.push(1, 2, 3, 4, "...", totalPages - 2, totalPages - 1, totalPages);
  } else if (page >= totalPages - 2) {
    pages.push(1, 2, 3, "...", totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push(
      1,
      "...",
      page - 1,
      page,
      page + 1,
      "...",
      totalPages - 2,
      totalPages - 1,
      totalPages
    );
  }

  return pages.filter((p, idx, arr) =>
    p === "..."
      ? arr[idx - 1] !== "..."
      : typeof p === "number" && p >= 1 && p <= totalPages
  );
};

const PaginationBar = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;
  return (
    <Pagination className="mt-5">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(Math.max(page - 1, 1));
            }}
            className={page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {getPaginationNumbers(page, totalPages).map((p, idx) => {
          if (p === "...") {
            return (
              <PaginationItem key={`paginationItem_ellipsis_${idx}`}>
                <span className="px-2">...</span>
              </PaginationItem>
            );
          }
          return (
            <PaginationItem key={`paginationItem_${p}`}>
              <PaginationLink
                href="#"
                isActive={p === page}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(Number(p));
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(Math.min(page + 1, totalPages));
            }}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationBar;
