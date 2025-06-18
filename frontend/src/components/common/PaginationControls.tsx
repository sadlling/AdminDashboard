import React from "react";
import { Pagination, ButtonGroup, IconButton } from "@chakra-ui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalCount: number;
  isDisabled?: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalCount,
}) => {
  if (totalCount === 0 || totalPages <= 1) {
    return null;
  }

  return (
    <Pagination.Root
      count={totalCount}
      pageSize={pageSize}
      page={currentPage}
      onPageChange={(details) => onPageChange(details.page)}
      siblingCount={1}
      defaultPage={1}
    >
      <ButtonGroup variant="outline" size="sm" mt={4}>
        <Pagination.PrevTrigger asChild>
          <IconButton aria-label="Previous Page">
            <HiChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>

        <Pagination.Items
          render={(pageItem) => (
            <IconButton
              aria-label={`Go to page ${pageItem.value}`}
              variant={pageItem.value === currentPage ? "solid" : "outline"}
            >
              {pageItem.value}
            </IconButton>
          )}
        />

        <Pagination.NextTrigger asChild>
          <IconButton aria-label="Next Page">
            <HiChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
  );
};

export default PaginationControls;
