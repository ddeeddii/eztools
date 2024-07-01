import { writable, type Writable } from 'svelte/store'

export const uid = writable(0)
export const ItemData: Writable<Array<Item>> = writable([])

export enum ItemType {
  Unset = 0,
  Item = 1,
  Trinket = 2,
  PocketItem = 3,
  Pill = 4
}
export const ItemTypeText = ['Unset', 'Item', 'Trinket', 'Pocket Item', 'Pill']

export interface Item {
  originItemId: string
  type: ItemType
  name: string
  description: string

  sprite: FileList | null
  uid: number
  useCustomOrigin: boolean
  open: boolean
}

import items from './items.json'
import trinkets from './trinkets.json'
import pocketitems from './pocketitems.json'
import pills from './pills.json'
import type { searchItem } from '@/index.js'

export const ItemDb = items
export const TrinketDb = trinkets
export const PocketItemDb = pocketitems
export const PillDb = pills

export const SearchableItems: Writable<Array<searchItem>> = writable([])
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

for (const [id, data] of Object.entries(pocketitems)) {
  const item: searchItem = {
    label: data.name,
    value: {
      type: ItemType.PocketItem,
      id: id,
      uid: `p${id}`
    }
  }
  SearchableDb.push(item)
}

for (const [id, data] of Object.entries(pills)) {
  const item: searchItem = {
    label: data.name,
    value: {
      type: ItemType.Pill,
      id: id,
      uid: `pi${id}`
    }
  }
  SearchableDb.push(item)
}

function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}

export type PocketItemSubType = 'tarot' | 'suit' | 'rune' | 'special' | 'object' | 'tarot_reverse'
export function getPocketItemSubType(item: Item): PocketItemSubType {
  if(!isNumeric(item.originItemId as never)) {
    return 'tarot'
  }
  return PocketItemDb[item.originItemId as keyof typeof PocketItemDb].type as PocketItemSubType
}

export function getSearchableItem(item: Item): searchItem {
  if (!isNumeric(item.originItemId as never)) { // item is using custom origin
    return {
      label: item.name,
      value: {
        type: item.type,
        id: item.originItemId,
        uid: `co-${item.name}` // note: could potentially collide with other items but its not a big deal
      }
    }
  }
  
  let baseItemName = ''
  let uidPrefix = ''
  if (item.type === ItemType.Item) {
    baseItemName = ItemDb[item.originItemId as keyof typeof ItemDb].name
    uidPrefix = 'i'
  } else if (item.type === ItemType.Trinket) {
    baseItemName = TrinketDb[item.originItemId as keyof typeof TrinketDb].name
    uidPrefix = 't'
  } else if (item.type === ItemType.PocketItem) {
    baseItemName = PocketItemDb[item.originItemId as keyof typeof PocketItemDb].name
    uidPrefix = "p"
  } else if (item.type === ItemType.Pill) {
    baseItemName = PillDb[item.originItemId as keyof typeof PillDb].name
    uidPrefix = "pi"
  } else if (item.type === ItemType.Unset) {
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
      uid: `${uidPrefix}${item.originItemId}`
    }
  }
}

export function syncSearchableItems(items: Array<Item>) {
  SearchableItems.set([])
  for (const item of items) {
    const searchableItem = getSearchableItem(item)
    SearchableItems.update((items) => {
      items.push(searchableItem)
      return items
    })
  }
}
