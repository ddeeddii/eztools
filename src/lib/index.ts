import type { ItemType } from "../routes/ezitems/data/dataManager.js"

export interface searchItem {
  label: string
  value: {
    type: ItemType,
    id: string,
    idx: string // Used to index the searched items, uuidv4 is used for this
  }
}
