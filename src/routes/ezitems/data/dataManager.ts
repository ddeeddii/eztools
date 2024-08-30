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

  sprite: File | null
  uid: string
  useCustomOrigin: boolean
  open: boolean
}

import items from '@/assets/ezitems/items.json'
import trinkets from '@/assets/ezitems/trinkets.json'
import pocketitems from '@/assets/ezitems/pocketitems.json'
import pills from '@/assets/ezitems/pills.json'
import type { searchItem } from '@/index.js'
import { v4 as uuidv4, v4 } from 'uuid'
import { isNumeric } from '@/utils.js'
import { Config, TemplateType } from './configManager'

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
      idx: uuidv4()
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
      idx: uuidv4()
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
      idx: uuidv4()
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
      idx: uuidv4()
    }
  }
  SearchableDb.push(item)
}

export type PocketItemSubType = 'tarot' | 'suit' | 'rune' | 'special' | 'object' | 'tarot_reverse'
export function getPocketItemSubType(item: Item): PocketItemSubType {
  if(!isNumeric(item.originItemId as never)) {
    return 'tarot'
  }
  return PocketItemDb[item.originItemId as keyof typeof PocketItemDb].type as PocketItemSubType
}

export function getSearchableItem(item: Item): searchItem {
  if (item.useCustomOrigin) {
    return {
      label: item.name,
      value: {
        type: item.type,
        id: item.originItemId,
        idx: uuidv4()
      }
    }
  }
  
  let baseItemName = ''
  if (item.type === ItemType.Item) {
    baseItemName = ItemDb[item.originItemId as keyof typeof ItemDb].name
  } else if (item.type === ItemType.Trinket) {
    baseItemName = TrinketDb[item.originItemId as keyof typeof TrinketDb].name
  } else if (item.type === ItemType.PocketItem) {
    baseItemName = PocketItemDb[item.originItemId as keyof typeof PocketItemDb].name
  } else if (item.type === ItemType.Pill) {
    baseItemName = PillDb[item.originItemId as keyof typeof PillDb].name
  } else if (item.type === ItemType.Unset) {
    return {
      label: '',
      value: {
        type: ItemType.Unset,
        id: '',
        idx: uuidv4()
      }
    }
  }

  return {
    label: baseItemName,
    value: {
      type: item.type,
      id: item.originItemId,
      idx: uuidv4()
    }
  }
}
export function syncSearchableItems(items: Array<Item>) {
  SearchableItems.set([])
  for (const item of items) {
    const searchableItem = {
      label: item.name,
      value: {
        type: item.type,
        id: item.originItemId,
        idx: uuidv4()
      }
    }

    SearchableItems.update((items) => {
      items.push(searchableItem)
      return items
    })
  }
}

export function regenerateSearchableItems(items: Array<Item>) {
  SearchableItems.set([])
  for (const item of items) {
    const searchableItem = getSearchableItem(item)
    SearchableItems.update((items) => {
      items.push(searchableItem)
      return items
    })
  }
}

export interface ExportItem {
  name: string,
  description: string,
}

export interface ExportCard extends ExportItem {
  type: 'card' | 'rune' | 'soul'
}

export interface ExportData {
  metadata: {
    templateType: 'vanilla' | 'repentogon',
    templateVersion: string,
    dataVersion: string,
    webVersion: string
  },

  // the key is the origin item id (number) OR a custom name (string)
  items: Record<string, ExportItem>
  trinkets: Record<string, ExportItem>
  pills: Record<string, ExportItem>
  cards: Record<string, ExportCard>
}

export function itemTypeMatchesTemplate(type: ItemType, config: Config) {
  // the strict equality operator doesn't work in the second check for reasons beyond explanation
  // as such, we use the standard equality operator
  return !(
    (type === ItemType.PocketItem || type === ItemType.Pill) &&
    config.ExportTemplate != TemplateType.Repentogon
  )
}

export function getMockItem(params?: Partial<Item>): Item {
  if (!params) {
    params = {}
  }
  
  return {
    originItemId: params.originItemId ?? '',
    type: params.type ?? ItemType.Unset,
    name: params.name ?? '',
    description: params.description ?? '',
  
    sprite: params.sprite ?? null,
    uid: params.uid ?? v4(),
    useCustomOrigin: params.useCustomOrigin ?? false,
    open: params.open ?? false
  }
}