import { useId, useMemo } from 'react'
import type { Column, Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SearchIcon } from "lucide-react"
import { Patient } from '../schemas/patient.schema'

export function Filter({ column }: { column: Column<Patient, unknown> }) {
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

interface PatientsFilterProps {
  table: Table<Patient>;
  globalFilter: string;
  setGlobalFilter: (val: string) => void;
}

export function PatientsFilter({ table, globalFilter, setGlobalFilter }: PatientsFilterProps) {
  return (
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
  )
}
