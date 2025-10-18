import { Row } from '../features/table/types'
import { v4 as uuidv4 } from 'uuid'

const sample: Row[] = Array.from({ length: 20 }).map((_, i) => ({
  id: uuidv4(),
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  age: 20 + i,
  role: ['Admin', 'Editor', 'Viewer'][i % 3],
}))

export default sample
