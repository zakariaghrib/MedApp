import { useState, useMemo, useId } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type Column,
  type PaginationState
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Plus, SearchIcon, MoreHorizontal, Eye, Edit, Ban, CheckCircle, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { patientService } from '../services/patient.service'
import { PatientForm } from './PatientForm'
import { Patient } from '../schemas/patient.schema'
import { Badge } from '@/components/ui/badge'
import { useDebounce } from '@/hooks/use-debounce'

const PatientActions = ({ patient }: { patient: Patient }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => patientService.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => patientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    }
  });

  const isActive = patient.status === 'ACTIVE';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100 p-0 text-slate-500 transition-colors">
          <span className="sr-only">Ouvrir le menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate(`/patients/${patient.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            Afficher
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className={isActive ? "text-amber-600 focus:text-amber-600" : "text-green-600 focus:text-green-600"}
            onClick={() => {
              const actionName = isActive ? 'désactiver' : 'réactiver';
              if (window.confirm(`Êtes-vous sûr de vouloir ${actionName} ce patient ?`)) {
                if (patient.id) statusMutation.mutate({ id: patient.id, status: isActive ? 'ARCHIVED' : 'ACTIVE' });
              }
            }}
          >
            {isActive ? <Ban className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            {isActive ? 'Désactiver' : 'Réactiver'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-600 focus:text-red-600"
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement ce patient ? Cette action est irréversible.')) {
                if (patient.id) deleteMutation.mutate(patient.id);
              }
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le patient</DialogTitle>
            <DialogDescription>
              Modifiez les informations du patient ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <PatientForm 
            patient={patient} 
            onSuccess={() => setIsEditOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: 'lastName',
    header: 'Nom',
  },
  {
    accessorKey: 'firstName',
    header: 'Prénom',
  },
  {
    accessorKey: 'phone',
    header: 'Téléphone',
  },
  {
    accessorKey: 'status',
    header: 'Statut',
    meta: {
      filterVariant: 'select'
    },
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const isActive = status === 'ACTIVE';
      return (
        <Badge variant={isActive ? 'default' : 'secondary'} className={isActive ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
          {isActive ? 'Actif' : 'Non Actif'}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <PatientActions patient={row.original} />
  }
]

export function PatientsList() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const debouncedSearch = useDebounce(globalFilter, 500)

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'createdAt',
      desc: true
    }
  ])

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, // Zero-based internally in Tanstack
    pageSize: 10,
  })

  // Extract status filter for the API call
  const statusFilter = columnFilters.find(f => f.id === 'status')?.value as string;

  const queryParams = useMemo(() => {
    return {
      page: pagination.pageIndex + 1, // API expects 1-based page
      limit: pagination.pageSize,
      search: debouncedSearch,
      status: statusFilter,
      sortBy: sorting[0]?.id,
      sortOrder: sorting[0]?.desc ? 'desc' : 'asc'
    }
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearch, statusFilter, sorting])

  const { data: response, isLoading } = useQuery({
    queryKey: ['patients', queryParams],
    queryFn: () => patientService.getAll(queryParams)
  })

  const patients = useMemo(() => {
    return response?.data || []
  }, [response])

  const meta = response?.meta

  const table = useReactTable({
    data: patients,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination
    },
    pageCount: meta?.totalPages ?? -1,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableSortingRemoval: false
  })

  return (
    <div className='w-full space-y-8 pb-12'>
      
      {/* 1. EN-TÊTE DE LA PAGE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Patients</h2>
          <p className="text-slate-500 mt-1">Gérez votre base de données de patients et leurs dossiers médicaux.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-white shadow-sm bg-blue-600 hover:bg-blue-700 h-9 rounded-full px-6 py-2 text-sm">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Patient
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouveau patient</DialogTitle>
              <DialogDescription>
                Remplissez les informations ci-dessous pour ajouter un patient au dossier médical.
              </DialogDescription>
            </DialogHeader>
            <PatientForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* 2. BLOC FILTRES */}
      <div className='p-5 border border-slate-200 rounded-xl'>
        <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
          <div className="relative w-full max-w-md">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="search"
              placeholder="Rechercher par nom, prénom, téléphone..."
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="pl-10 bg-slate-50 border-slate-200 shadow-sm w-full rounded-full focus-visible:ring-blue-500"
            />
          </div>
          <div className='w-full sm:w-48'>
            <Filter column={table.getColumn('status')!} />
          </div>
        </div>
      </div>
        
      {/* 3. BLOC TABLEAU */}
      <div className='w-full border border-slate-200 rounded-xl overflow-hidden'>
        <div className='overflow-x-auto relative'>
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          <Table>
            <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className='hover:bg-transparent border-b-slate-200'>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} className='relative h-12 text-xs uppercase tracking-wider font-bold text-slate-500 cursor-pointer select-none' onClick={header.column.getToggleSortingHandler()}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="hover:bg-slate-200/40 transition-colors border-b-slate-200">
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-32 text-center text-slate-500'>
                  {!isLoading && (
                    <div className="flex flex-col items-center justify-center">
                      <SearchIcon className="h-8 w-8 text-slate-300 mb-3" />
                      <p className="text-base font-medium text-slate-900">Aucun patient trouvé</p>
                      <p className="text-sm">Essayez de modifier vos critères de recherche.</p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
            </TableBody>
          </Table>
        </div>
        {/* Pied de la carte : Pagination */}
        <div className='p-4 border-t border-slate-200 text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <div>
            Affichage de <span className="font-semibold text-slate-900">{patients.length}</span> patient(s) sur <span className="font-semibold text-slate-900">{meta?.total || 0}</span> au total
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>
            <div className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} sur {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Filter({ column }: { column: Column<Patient, unknown> }) {
  const id = useId()
  const columnFilterValue = column.getFilterValue()
  const { filterVariant } = column.columnDef.meta ?? {}
  const columnHeader = typeof column.columnDef.header === 'string' ? column.columnDef.header : ''

  if (filterVariant === 'select') {
    const selectItems = column.id === 'status' ? [
      { label: 'Tous', value: 'all' },
      { label: 'Actif', value: 'ACTIVE' },
      { label: 'Non Actif', value: 'ARCHIVED' }
    ] : [
      { label: 'Tous', value: 'all' },
    ]

    const selectedItem = selectItems.find(item => item.value === (columnFilterValue?.toString() ?? 'all'));

    return (
      <div className='*:not-first:mt-2'>
        <Label htmlFor={`${id}-select`} className="text-slate-600 mb-1.5 block">{columnHeader}</Label>
        <Select
          value={columnFilterValue?.toString() ?? 'all'}
          onValueChange={value => {
            column.setFilterValue(value === 'all' ? undefined : value)
          }}
        >
          <SelectTrigger id={`${id}-select`} className='w-full bg-slate-50'>
            <span className="flex flex-1 text-left line-clamp-1 items-center gap-1.5">{selectedItem?.label ?? 'Tous'}</span>
          </SelectTrigger>
          <SelectContent className='p-1'>
            {selectItems.map(item => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return null
}
