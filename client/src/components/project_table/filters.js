import React from 'react'

export const ColumnFilter = ({ column }) => {
  const { filterValue, setFilter } = column
  return (
    <span className='w-full'>
        <input  value={filterValue ||'' } 
                onChange={(e) => setFilter(e.target.value)}
                type='search'
                className="items-center text-black pl-1 py-1 ml-3 focus:outline-none min-w-[150px] w-fit lg:w-full" />
    </span>
  )
}

export const includesFilter = (rows, id, filterValue) => {
  if (!filterValue) return rows

  return rows.filter(row => {
      const rowValue = row.values[id]

      if (Array.isArray(rowValue)) {
          return rowValue.some(contributor => {
              const fullName = `${contributor.firstName} ${contributor.lastName}`.toLowerCase()
              return fullName.includes(filterValue.toLowerCase())
          })
      }

      if (rowValue && typeof rowValue === 'object' && rowValue.firstName && rowValue.lastName) {
          const fullName = `${rowValue.firstName} ${rowValue.lastName}`.toLowerCase()
          return fullName.includes(filterValue.toLowerCase())
      }

      if (typeof rowValue === 'string') {
          return rowValue.toLowerCase().includes(filterValue.toLowerCase())
      }

      return false
  })
}

export const dateFilter = ({ column: { filterValue, setFilter } }) => {

  const handleStartDateChange = (e) => {
      const value = e.target.value
      setFilter((prevFilter) => ({ ...prevFilter, startDate: value }))
  }

  const handleEndDateChange = (e) => {
      const value = e.target.value
      setFilter((prevFilter) => ({ ...prevFilter, endDate: value }))
  }

  return (
      <div className="flex ml-3 space-x-3 font-medium text-zinc-400">
          <input
              type="date"
              value={filterValue?.startDate || ''}
              onChange={handleStartDateChange}
              className="p-1 focus:outline-none hover:text-zinc-600 focus:text-zinc-600 transition-colors delay-[50] duration-75"
          />
          <input
              type="date"
              value={filterValue?.endDate || ''}
              onChange={handleEndDateChange}
              className="p-1 focus:outline-none hover:text-zinc-600 focus:text-zinc-600 transition-colors delay-[50] duration-75"
          />
      </div>
  )
}

export const dateFilterLogic = (rows, id, filterValue) => {
  if (!filterValue || (!filterValue.startDate && !filterValue.endDate)) {
      return rows
  }

  return rows.filter(row => {
      const rowValue = row.values[id]
      const rowDate = new Date(rowValue)

      if (isNaN(rowDate)) {
          return false
      }

      const startDate = filterValue.startDate ? new Date(filterValue.startDate + 'T00:00:00') : null
      const endDate = filterValue.endDate ? new Date(filterValue.endDate + 'T23:59:59') : null

      if (startDate && rowDate < startDate) {
          return false
      }

      if (endDate && rowDate > endDate) {
          return false
      }

      return true
  })
}