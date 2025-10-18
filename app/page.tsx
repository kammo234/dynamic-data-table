'use client'

import { Container, Typography } from '@mui/material'
import DataTable from '../src/components/DataTable'

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>
        Dynamic Data Table Manager
      </Typography>
      <DataTable />
    </Container>
  )
}
