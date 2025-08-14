import { Select } from 'rizzui';

import { cn } from '../../../utils/cn';

import Pagination, { type PaginationProps } from './pagination';

const paginationLimitOptions = [5, 10, 20, 50].map((v) => ({
  label: String(v),
  value: v,
}));

export type TablePaginationProps = {
  pageSize: number;
  setPageSize?: React.Dispatch<React.SetStateAction<number>>;
  paginatorClassName?: string;
} & PaginationProps;

export default function TablePagination({
  pageSize,
  setPageSize,
  total,
  paginatorClassName,
  ...props
}: TablePaginationProps) {
  return (
    <div
      className={cn(
        'table-pagination flex flex-col sm:flex-row items-center justify-between w-full',
        paginatorClassName,
      )}
    >
      <div className="items-center flex gap-3 mb-4 sm:mb-0">
        <span className="text-sm text-steel-700 dark:text-steel-100">
          Rows per page:
        </span>
        <Select
          options={paginationLimitOptions as any}
          onChange={setPageSize}
          size="sm"
          variant="flat"
          value={pageSize}
          getOptionValue={({ value }) => value}
          dropdownClassName="!p-1.5 border w-12 border-[#f3f4f6] dark:border-[#374151] bg-white dark:bg-muted/80 !z-10 shadow-lg"
          className="ms-1 w-auto [&_button]:font-medium [&_button]:border [&_button]:border-stroke [&_button]:dark:border-strokedark [&_button]:hover:ring-0 [&_button]:focus:ring-0"
          optionClassName="px-1 hover:bg-[#e5e7eb] dark:hover:bg-[#374151]"
        />
      </div>
      {total! > pageSize && (
        <Pagination
          total={total}
          pageSize={pageSize}
          defaultCurrent={1}
          showLessItems={true}
          prevIconClassName="py-0 text-black dark:text-white !leading-[26px]"
          nextIconClassName="py-0 text-black dark:text-white !leading-[26px]"
          {...props}
        />
      )}
    </div>
  );
}
