'use client';

import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Edit, Filter, MoreHorizontal, Plus, Trash, X } from 'lucide-react';

interface DynamicTableProps {
  data: any[];
  columns: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onRowClick?: (row: any) => void;
  onAddNewRecord?: (record: any) => void;
    customActions?: {
    label: string;
    icon: any;
    onClick: (row: any) => void;
  }[];
  showAddNewRecord?:boolean,
}

interface Filter {
  column: string;
  value: string;
}

export function AppTable({
  data,
  columns,
  onEdit,
  onDelete,
  onRowClick,
  onAddNewRecord,
  customActions,
  showAddNewRecord = false,
}: DynamicTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filter[]>([]);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [newRecord, setNewRecord] = useState<Record<string, string>>({});
  const [editingFilter, setEditingFilter] = useState<Filter | null>(null);

  const handleAddFilter = () => {
    if (selectedColumn && selectedValue) {
      if (editingFilter) {
        setActiveFilters(activeFilters.map(f => 
          f.column === editingFilter.column ? { column: selectedColumn, value: selectedValue } : f
        ));
      } else {
        setActiveFilters([...activeFilters, { column: selectedColumn, value: selectedValue }]);
      }
      const column = table.getColumn(selectedColumn);
      if (column) {
        column.setFilterValue(selectedValue);
      }
      setShowFilterDialog(false);
      setSelectedColumn('');
      setSelectedValue('');
      setEditingFilter(null);
    }
  };

  const handleRemoveFilter = (filter: Filter) => {
    setActiveFilters(activeFilters.filter(f => f.column !== filter.column));
    const column = table.getColumn(filter.column);
    if (column) {
      column.setFilterValue('');
    }
  };

  const handleEditFilter = (filter: Filter) => {
    setEditingFilter(filter);
    setSelectedColumn(filter.column);
    setSelectedValue(filter.value);
    setShowFilterDialog(true);
  };

  const handleSubmitNewRecord = () => {
    if (onAddNewRecord) {
      onAddNewRecord(newRecord);
    }
    setNewRecord({});
    setShowAddDialog(false);
  };

  const tableColumns: ColumnDef<any>[] = [
    ...columns.map((col) => ({
      accessorKey: col.accessorKey,
      header: ({ column }: any) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="w-full flex items-center justify-between"
          >
            {col.header}
            {col.sortable && <ArrowUpDown className="ml-2 h-4 w-4" />}
          </Button>
        );
      },
      enableSorting: col.sortable,
    })),
    {
      id: 'actions',
      cell: ({ row }) => {
        const rowData = row.original;

        return (
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(rowData);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(rowData);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
            {customActions && customActions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                  {customActions.map((action, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick(rowData);
                      }}
                    >
                      <action.icon className="mr-2 h-4 w-4" />
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setEditingFilter(null);
              setSelectedColumn('');
              setSelectedValue('');
              setShowFilterDialog(true);
            }}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        {showAddNewRecord &&  <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer capitalize"
              onClick={() => handleEditFilter(filter)}
            >
              {filter.column}: {filter.value}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFilter(filter);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary hover:bg-primary">
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={`${
                        header.id === headerGroup.headers[0].id ||
                        header.id === 'actions'
                          ? 'sticky z-10'
                          : ''
                      } ${
                        header.id === headerGroup.headers[0].id
                          ? 'left-0'
                          : header.id === 'actions'
                          ? 'right-0'
                          : ''
                      } text-primary-foreground border-[0.5px] border-primary-foreground/10`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`${
                          cell.column.id === row.getVisibleCells()[0].column.id ||
                          cell.column.id === 'actions'
                            ? 'sticky z-10 bg-background'
                            : ''
                        } ${
                          cell.column.id === row.getVisibleCells()[0].column.id
                            ? 'left-0'
                            : cell.column.id === 'actions'
                            ? 'right-0'
                            : ''
                        }`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingFilter ? 'Edit Filter' : 'Add Filter'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select
              value={selectedColumn}
              onValueChange={setSelectedColumn}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {columns
                  .filter((col) => col.filterType === 'select')
                  .map((col) => (
                    <SelectItem key={col.id} value={col.id}>
                      {col.header}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {selectedColumn && (
              <Select
                value={selectedValue}
                onValueChange={setSelectedValue}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select value" />
                </SelectTrigger>
                <SelectContent>
                  {columns
                    .find((col) => col.id === selectedColumn)
                    ?.filterOptions.map((option: string) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowFilterDialog(false);
              setEditingFilter(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddFilter}>
              {editingFilter ? 'Update Filter' : 'Add Filter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Record</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {columns.map((col) => (
              <div key={col.id} className="grid grid-cols-4 items-center gap-4">
                <label htmlFor={col.id} className="text-right">
                  {col.header}
                </label>
                <Input
                  id={col.id}
                  className="col-span-3"
                  placeholder={`Enter ${col.header.toLowerCase()}`}
                  value={newRecord[col.accessorKey] || ''}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, [col.accessorKey]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              setNewRecord({});
            }}>
              Cancel
            </Button>
            <Button onClick={handleSubmitNewRecord}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}