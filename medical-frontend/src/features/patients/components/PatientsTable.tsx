import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { flexRender, type Table } from '@tanstack/react-table'
import { SearchIcon } from "lucide-react"
import { Patient } from '../schemas/patient.schema'

interface PatientsTableProps {
  table: Table<Patient>;
  columnsLength: number;
}

export function PatientsTable({ table, columnsLength }: PatientsTableProps) {
  return (
    <div className='w-full border border-slate-200 rounded-xl overflow-hidden'>
      <div className='overflow-x-auto'>
        <UITable>
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
              <TableCell colSpan={columnsLength} className='h-32 text-center text-slate-500'>
                <div className="flex flex-col items-center justify-center">
                  <SearchIcon className="h-8 w-8 text-slate-300 mb-3" />
                  <p className="text-base font-medium text-slate-900">Aucun patient trouvé</p>
                  <p className="text-sm">Essayez de modifier vos critères de recherche.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
          </TableBody>
        </UITable>
      </div>
      {/* Pied de la carte : Compteur */}
      <div className='p-4 border-t border-slate-200 text-sm text-slate-500 flex items-center justify-between'>
        <span>
          Affichage de <span className="font-semibold text-slate-900">{table.getFilteredRowModel().rows.length}</span> patient(s)
        </span>
      </div>
    </div>
  )
}
