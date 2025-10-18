'use client'
import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControlLabel, Checkbox } from '@mui/material'
import type { ColumnDef } from '../features/table/types'

export default function ManageColumnsModal({ open, onClose, columns, onToggle }: any) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        {columns.map((col: ColumnDef) => (
          <FormControlLabel
            key={col.key}
            control={<Checkbox checked={col.visible} onChange={() => onToggle(col.key)} />}
            label={col.label}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
