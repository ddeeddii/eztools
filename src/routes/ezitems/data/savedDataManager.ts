import Dexie, { type Table } from 'dexie'
import type { ItemType } from './dataManager.js'

// Terminology note
// "stored" - data that is saved in the browser

export interface StoredItem {
  originItemId: string
  type: ItemType
  name: string
  description: string

  sprite: FileList | null
  uid: number
  open: boolean
}

export interface StoredData {
  id?: number
  name: string
  description: string
  date: Date
  items: Array<StoredItem>
}

export class StoredItemDb extends Dexie {
  SavedItems!: Table<StoredData>

  constructor() {
    super('myDatabase')
    this.version(1).stores({
      SavedItems: '++id, name, description, date, items'
    })
  }
}

export const db = new StoredItemDb()
