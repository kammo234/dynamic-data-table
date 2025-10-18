import Papa from 'papaparse'
import { Row } from '../features/table/types'
import { saveAs } from 'file-saver'

export function parseCsvFile(file: File): Promise<{ rows: Row[]; errors: string[] }> {
  return new Promise((res) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows: Row[] = (results.data as any[]).map((r, i) => ({
          id: r.id || `csv-${i}`,
          name: r.name || r.Name || '',
          email: r.email || r.Email || '',
          age: Number(r.age || r.Age || 0),
          role: r.role || r.Role || '',
        }))
        res({ rows, errors: [] })
      },
    })
  })
}

export function exportToCsv(rows: any[], columns: { key: string; label: string }[]) {
  const header = columns.map((c) => c.label)
  const keys = columns.map((c) => c.key)
  const csvRows = [header.join(',')]
  rows.forEach((r) => {
    const line = keys.map((k) => `"${String(r[k] ?? '')}"`)
    csvRows.push(line.join(','))
  })
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, 'table-export.csv')
}
