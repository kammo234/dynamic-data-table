# Dynamic Data Table Manager

A **Dynamic Data Table Manager** built with **Next.js**, **Redux Toolkit**, and **Material UI (MUI)**.  
It supports dynamic columns, CSV import/export, inline editing, dark/light mode, drag-and-drop column reordering, and client-side pagination.

---

## Features

### Core Features
- Display table with default columns: **Name, Email, Age, Role**
- Sorting on column headers (ASC/DESC toggle)
- Global search (searches all fields)
- Client-side pagination (10 rows per page)
- Dynamic columns:
  - Show/hide existing columns
  - Add new fields dynamically
- Persist column visibility (via Redux state)
- CSV Import & Export (only visible columns)

### Bonus Features
- Inline row editing (double-click to edit, validation, save/cancel all)
- Row actions: Edit, Delete (with confirmation)
- Theme toggle (Dark/Light mode)
- Column reordering via drag-and-drop
- Fully responsive design

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router)  
- **UI Library:** Material UI v5  
- **State Management:** Redux Toolkit + Redux Persist  
- **Forms:** React Hook Form  
- **CSV Parsing:** PapaParse  
- **File Export:** FileSaver.js  
- **Drag & Drop:** @hello-pangea/dnd  
- **TypeScript**  

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/kammo234/dynamic-data-table.git
cd dynamic-data-table
