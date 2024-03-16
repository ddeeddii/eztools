import { writable, type Writable } from "svelte/store"

export const uid = writable(0)
export const ItemData: Writable<Array<Item>> = writable([])

export enum ItemType {
  Unset = 0,
  Item = 1,
  Trinket = 2,
  PocketItem = 3,
}

export interface Item {
  originItemId: string
  type: ItemType
  name: string
  description: string

  sprite: FileList | null
  uid: number
  open: boolean
}

import items from './items.json'
import trinkets from './trinkets.json'
import type { searchItem } from "@/index.js"
export const ItemDb = items
export const TrinketDb = trinkets

export const SearchableDb: Array<searchItem> = []
for (const [id, data] of Object.entries(items)) {
  const item: searchItem = {
    label: data.name,
    value: {
      type: ItemType.Item,
      id: id,
      uid: `i${id}`
    }
  }
  SearchableDb.push(item)
}

for (const [id, data] of Object.entries(trinkets)) {
  const item: searchItem = {
    label: data.name,
    value: {
      type: ItemType.Trinket,
      id: id,
      uid: `t${id}`
    }
  }
  SearchableDb.push(item)
}

export function getSearchableItem(item: Item): searchItem {
  let baseItemName = ''
  if(item.type === ItemType.Item){
    baseItemName = ItemDb[item.originItemId as keyof typeof ItemDb].name
  } else if(item.type === ItemType.Trinket){
    baseItemName = TrinketDb[item.originItemId as keyof typeof TrinketDb].name
  } else if(item.type === ItemType.Unset){
    return {
      label: '',
      value: {
        type: ItemType.Unset,
        id: '',
        uid: ''
      }
    }
  }

  return {
    label: baseItemName,
    value: {
      type: item.type,
      id: item.originItemId,
      uid: `i${item.originItemId}`
    }
  }
}