import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Row, ColumnDef } from './types'
import sample from '../../utils/sampleData'

type TableState = {
  rows: Row[]
  columns: ColumnDef[]
  search: string
  sort: { key: string | null; dir: 'asc' | 'desc' | null }
}

const initialColumns: ColumnDef[] = [
  { key: 'name', label: 'Name', visible: true },
  { key: 'email', label: 'Email', visible: true },
  { key: 'age', label: 'Age', visible: true },
  { key: 'role', label: 'Role', visible: true },
]

const initialState: TableState = {
  rows: sample,
  columns: initialColumns,
  search: '',
  sort: { key: null, dir: null },
}

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<Row[]>) {
      state.rows = action.payload
    },
    deleteRow(state, action: PayloadAction<string>) {
      state.rows = state.rows.filter((r) => r.id !== action.payload)
    },
    toggleColumn(state, action: PayloadAction<string>) {
      const c = state.columns.find((col) => col.key === action.payload)
      if (c) c.visible = !c.visible
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
    setSort(state, action: PayloadAction<{ key: string }>) {
      if (state.sort.key === action.payload.key) {
        state.sort.dir = state.sort.dir === 'asc' ? 'desc' : 'asc'
      } else {
        state.sort.key = action.payload.key
        state.sort.dir = 'asc'
      }
    },
  },
})

export const { setRows, deleteRow, toggleColumn, setSearch, setSort } = tableSlice.actions
export default tableSlice.reducer
