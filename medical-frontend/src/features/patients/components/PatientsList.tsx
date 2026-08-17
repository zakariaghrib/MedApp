import { useState, useMemo, useId } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  flexRender,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type Column
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, SearchIcon, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { patientService } from '../services/patient.service'
import { PatientForm } from './PatientForm'
import { Patient } from '../schemas/patient.schema'
import { Badge } from '@/components/ui/badge'

const PatientActions = ({ patient }: { patient: Patient }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => patientService.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    }
  });

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
            className="text-red-600 focus:text-red-600"
            onClick={() => {
              if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
      return (
        <Badge variant={status === 'Actif' ? 'default' : 'secondary'} className={status === 'Actif' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
          {status}
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

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'lastName',
      desc: false
    }
  ])

  const { data: response } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientService.getAll()
  })

  const patients = useMemo(() => {
    return response?.data || []
  }, [response])

  const table = useReactTable({
    data: patients,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onSortingChange: setSorting,
    enableSortingRemoval: false
  })

  return (
    <div className='w-full space-y-8'>
      
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
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className='hover:bg-transparent border-b-slate-200'>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} className='relative h-12 text-xs uppercase tracking-wider font-bold text-slate-500'>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                  <div className="flex flex-col items-center justify-center">
                    <SearchIcon className="h-8 w-8 text-slate-300 mb-3" />
                    <p className="text-base font-medium text-slate-900">Aucun patient trouvé</p>
                    <p className="text-sm">Essayez de modifier vos critères de recherche.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            </TableBody>
          </Table>
        </div>
        {/* Pied de la carte : Compteur */}
        <div className='p-4 border-t border-slate-200 text-sm text-slate-500 flex items-center justify-between'>
          <span>
            Affichage de <span className="font-semibold text-slate-900">{table.getFilteredRowModel().rows.length}</span> patient(s)
          </span>
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

  const sortedUniqueValues = useMemo(() => {
    if (filterVariant === 'range') return []

    const values = Array.from(column.getFacetedUniqueValues().keys())

    const flattenedValues = values.reduce((acc: string[], curr) => {
      if (Array.isArray(curr)) {
        return [...acc, ...curr]
      }

      return [...acc, curr]
    }, [])

    return Array.from(new Set(flattenedValues)).sort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [column.getFacetedUniqueValues(), filterVariant])

  if (filterVariant === 'range') {
    return (
      <div className='*:not-first:mt-2'>
        <Label className="text-slate-600">{columnHeader}</Label>
        <div className='flex'>
          <Input
            id={`${id}-range-1`}
            className='flex-1 rounded-r-none [-moz-appearance:textfield] focus:z-10 bg-slate-50'
            value={(columnFilterValue as [number, number])?.[0] ?? ''}
            onChange={e =>
              column.setFilterValue((old: [number, number]) => [
                e.target.value ? Number(e.target.value) : undefined,
                old?.[1]
              ])
            }
            placeholder='Min'
            type='number'
          />
          <Input
            id={`${id}-range-2`}
            className='-ms-px flex-1 rounded-l-none [-moz-appearance:textfield] focus:z-10 bg-slate-50'
            value={(columnFilterValue as [number, number])?.[1] ?? ''}
            onChange={e =>
              column.setFilterValue((old: [number, number]) => [
                old?.[0],
                e.target.value ? Number(e.target.value) : undefined
              ])
            }
            placeholder='Max'
            type='number'
          />
        </div>
      </div>
    )
  }

  if (filterVariant === 'select') {
    const selectItems = [
      { label: 'Tous', value: 'all' },
      ...sortedUniqueValues.map(value => ({
        label: String(value),
        value: String(value)
      }))
    ]

    return (
      <div className='*:not-first:mt-2'>
        <Label htmlFor={`${id}-select`} className="text-slate-600 mb-1.5 block">{columnHeader}</Label>
        <Select
          items={selectItems}
          value={columnFilterValue?.toString() ?? 'all'}
          onValueChange={value => {
            column.setFilterValue(value === 'all' ? undefined : value)
          }}
        >
          <SelectTrigger id={`${id}-select`} className='w-full bg-slate-50'>
            <SelectValue />
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

  return (
    <div className='*:not-first:mt-2'>
      <Label htmlFor={`${id}-input`} className="text-slate-600 mb-1.5 block">{columnHeader}</Label>
      <div className='relative'>
        <Input
          id={`${id}-input`}
          className='peer pl-9 bg-slate-50'
          value={(columnFilterValue ?? '') as string}
          onChange={e => column.setFilterValue(e.target.value)}
          placeholder={`Rechercher par ${columnHeader.toLowerCase()}`}
          type='text'
        />
        <div className='text-slate-400 pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
          <SearchIcon size={16} />
        </div>
      </div>
    </div>
  )
}
