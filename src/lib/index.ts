import type { ItemType } from "../routes/ezitems/data/dataManager.js"

export interface searchItem {
  label: string
  value: {
    type: ItemType,
    id: string,
    uid: string // Used to index the searched items
  }
}
