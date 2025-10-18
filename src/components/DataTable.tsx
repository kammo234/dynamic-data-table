'use client'

import React, { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  TextField,
  IconButton,
  Switch,
  AppBar,
  Toolbar,
  TablePagination,
} from '@mui/material'
import { Download, Upload, Settings, Delete, Add, Edit, Save, Close, ArrowUpward, ArrowDownward } from '@mui/icons-material'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import Papa from 'papaparse'
import { saveAs } from 'file-saver'

interface RowData {
  [key: string]: string | number
}

const defaultColumns = ['Name', 'Email', 'Age', 'Role']
const defaultData = Array.from({ length: 20 }, (_, i) => ({
  Name: `User ${i + 1}`,
  Email: `user${i + 1}@example.com`,
  Age: 20 + i,
  Role: ['Admin', 'Editor', 'Viewer'][i % 3],
}))

export default function DataTable() {
  const [data, setData] = useState<RowData[]>(defaultData)
  const [columns, setColumns] = useState<string[]>(defaultColumns)
  const [visibleColumns, setVisibleColumns] = useState<string[]>(defaultColumns)
  const [open, setOpen] = useState(false)
  const [imported, setImported] = useState(false)
  const [newColumn, setNewColumn] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [themeDark, setThemeDark] = useState(false)
  const [editCache, setEditCache] = useState<RowData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const rowsPerPage = 10
  const [sortConfig, setSortConfig] = useState<{ column: string; direction: 'asc' | 'desc' } | null>(null)

  // CSV Import
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const importedData = result.data as RowData[]
        if (importedData.length > 0) {
          const newColumns = Object.keys(importedData[0])
          setColumns(newColumns)
          setVisibleColumns(newColumns)
          setData(importedData)
          setImported(true)
        } else {
          alert('Invalid CSV format!')
        }
      },
    })
  }

  // CSV Export
  const handleExportCSV = () => {
    const filteredData = data.map((row) => {
      const obj: any = {}
      visibleColumns.forEach((col) => (obj[col] = row[col]))
      return obj
    })
    const csv = Papa.unparse(filteredData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'table_data.csv')
  }

  // Clear Import
  const handleClearImport = () => {
    setData(defaultData)
    setColumns(defaultColumns)
    setVisibleColumns(defaultColumns)
    setImported(false)
  }

  // Toggle column visibility
  const toggleColumn = (col: string) => {
    if (visibleColumns.includes(col)) {
      setVisibleColumns(visibleColumns.filter((c) => c !== col))
    } else {
      setVisibleColumns([...visibleColumns, col])
    }
  }

  // Add new column
  const handleAddColumn = () => {
    const trimmed = newColumn.trim()
    if (!trimmed) return
    if (columns.includes(trimmed)) {
      alert('Column already exists!')
      return
    }

    const updatedColumns = [...columns, trimmed]
    const updatedData = data.map((row) => ({ ...row, [trimmed]: '' }))

    setColumns(updatedColumns)
    setVisibleColumns([...visibleColumns, trimmed])
    setData(updatedData)
    setNewColumn('')
  }

  // Delete row
  const handleDeleteRow = (idx: number) => {
    if (confirm('Are you sure you want to delete this row?')) {
      const newData = [...data]
      newData.splice(idx, 1)
      setData(newData)
    }
  }

  // Inline editing
  const handleEditMode = () => {
    setEditCache([...data])
    setEditMode(true)
  }
  const handleSaveEdit = () => setEditMode(false)
  const handleCancelEdit = () => {
    setData(editCache)
    setEditMode(false)
  }

  // Handle cell change with validation
  const handleCellChange = (rowIdx: number, col: string, value: string) => {
    if (col === 'Age' && value !== '' && !/^\d*$/.test(value)) return
    const newData = [...data]
    newData[rowIdx][col] = col === 'Age' ? Number(value) : value
    setData(newData)
  }

  // Column drag & drop
  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    const newColumns = Array.from(columns)
    const [removed] = newColumns.splice(result.source.index, 1)
    newColumns.splice(result.destination.index, 0, removed)
    setColumns(newColumns)
    setVisibleColumns(newColumns.filter((c) => visibleColumns.includes(c)))
  }

  // Sort columns
  const handleSort = (col: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.column === col && sortConfig.direction === 'asc') direction = 'desc'
    setSortConfig({ column: col, direction })
  }

  // Filtered + Sorted + Paginated Data
  const processedData = useMemo(() => {
    let filtered = data.filter((row) =>
      visibleColumns.some((col) =>
        String(row[col]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.column]
        const bVal = b[sortConfig.column]
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    const start = currentPage * rowsPerPage
    return filtered.slice(start, start + rowsPerPage)
  }, [data, visibleColumns, searchTerm, currentPage, sortConfig])

  const totalRows = useMemo(
    () => data.filter((row) =>
      visibleColumns.some((col) =>
        String(row[col]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    ).length,
    [data, visibleColumns, searchTerm]
  )

  return (
    <Box
      p={2}
      sx={{
        bgcolor: themeDark ? '#121212' : '#f5f5f5',
        color: themeDark ? '#fff' : '#000',
        minHeight: '100vh',
      }}
    >
      {/* AppBar with Theme Toggle */}
      <AppBar position="static" color={themeDark ? 'default' : 'primary'}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Dynamic Data Table</Typography>
          <FormControlLabel
            control={<Switch checked={themeDark} onChange={() => setThemeDark(!themeDark)} />}
            label={themeDark ? 'Dark' : 'Light'}
          />
        </Toolbar>
      </AppBar>

      {/* Action Buttons + Search */}
      <Box mt={2} mb={2} display="flex" gap={1} flexWrap="wrap">
        <TextField
          size="small"
          label="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            input: { color: themeDark ? '#fff' : '#000' },
            label: { color: themeDark ? '#fff' : '#000' },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: themeDark ? '#777' : undefined,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: themeDark ? '#aaa' : undefined,
            },
          }}
        />
        <Button variant="contained" component="label" startIcon={<Upload />}>
          Import CSV
          <input hidden type="file" accept=".csv" onChange={handleImportCSV} />
        </Button>
        <Button variant="outlined" startIcon={<Download />} onClick={handleExportCSV}>
          Export CSV
        </Button>
        <Button variant="outlined" startIcon={<Settings />} onClick={() => setOpen(true)}>
          Manage Columns
        </Button>
        {imported && (
          <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleClearImport}>
            Clear Import
          </Button>
        )}
        {!editMode ? (
          <Button variant="contained" color="secondary" startIcon={<Edit />} onClick={handleEditMode}>
            Edit Rows
          </Button>
        ) : (
          <>
            <Button variant="contained" color="success" startIcon={<Save />} onClick={handleSaveEdit}>
              Save All
            </Button>
            <Button variant="outlined" color="error" startIcon={<Close />} onClick={handleCancelEdit}>
              Cancel All
            </Button>
          </>
        )}
      </Box>

      {/* Table */}
      <Box sx={{ overflowX: 'auto' }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="columns" direction="horizontal" type="column">
            {(provided) => (
              <Table {...provided.droppableProps} ref={provided.innerRef} sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
                    {columns.map((col, index) => (
                      <Draggable key={col} draggableId={col} index={index}>
                        {(provided) => (
                          <TableCell
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ cursor: 'grab', minWidth: 120, color: themeDark ? '#fff' : '#000' }}
                          >
                            <Box display="flex" alignItems="center" onClick={() => handleSort(col)}>
                              {col}
                              {sortConfig?.column === col ? (
                                sortConfig.direction === 'asc' ? (
                                  <ArrowUpward fontSize="small" />
                                ) : (
                                  <ArrowDownward fontSize="small" />
                                )
                              ) : null}
                            </Box>
                          </TableCell>
                        )}
                      </Draggable>
                    ))}
                    <TableCell sx={{ color: themeDark ? '#fff' : '#000' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processedData.map((row, rowIdx) => (
                    <TableRow key={rowIdx}>
                      {columns.map((col) => (
                        <TableCell key={col} sx={{ color: themeDark ? '#fff' : '#000' }}>
                          {editMode ? (
                            <TextField
                              value={row[col]}
                              size="small"
                              fullWidth
                              onChange={(e) => handleCellChange(currentPage * rowsPerPage + rowIdx, col, e.target.value)}
                              sx={{
                                input: { color: themeDark ? '#fff' : '#000' },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: themeDark ? '#777' : undefined,
                                },
                              }}
                            />
                          ) : (
                            row[col]
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Tooltip title="Delete Row">
                          <IconButton onClick={() => handleDeleteRow(currentPage * rowsPerPage + rowIdx)}>
                            <Delete sx={{ color: themeDark ? '#fff' : undefined }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {provided.placeholder}
              </Table>
            )}
          </Droppable>
        </DragDropContext>
      </Box>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={totalRows}
        page={currentPage}
        onPageChange={(_, newPage) => setCurrentPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
        sx={{
          color: themeDark ? '#fff' : '#000', 
          '.MuiTablePagination-displayedRows': {
            color: themeDark ? '#fff' : '#000',
          },
          '.MuiIconButton-root': {
            color: themeDark ? '#fff' : undefined,
          },
        }}
      />

      {/* Manage Columns Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Manage Columns</DialogTitle>
        <DialogContent>
          {columns.map((col) => (
            <FormControlLabel
              key={col}
              control={<Checkbox checked={visibleColumns.includes(col)} onChange={() => toggleColumn(col)} />}
              label={col}
            />
          ))}
          <Box mt={2} display="flex" gap={1}>
            <TextField
              fullWidth
              size="small"
              label="Add New Column"
              value={newColumn}
              onChange={(e) => setNewColumn(e.target.value)}
              sx={{
                input: { color: themeDark ? '#fff' : '#000' },
                label: { color: themeDark ? '#fff' : '#000' },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: themeDark ? '#777' : undefined,
                },
              }}
            />
            <Button variant="contained" startIcon={<Add />} onClick={handleAddColumn}>
              Add
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
