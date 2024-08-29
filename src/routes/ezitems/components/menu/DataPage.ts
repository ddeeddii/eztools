import {
  type Item,
  ItemType,
  type ExportItem,
  type ExportCard,
  type ExportData,
  syncSearchableItems,
  ItemData
} from '$ezitems/data/dataManager'
import { isNumeric } from '@/utils'
import { toast } from 'svelte-sonner'
import { v4 as uuidv4 } from 'uuid'
import JSZip from 'jszip'
import { get } from 'svelte/store'
import { logger } from '@/logger'

const jsonDataRegex = /'(.+)'/

export async function loadModData(files: FileList, version: 'default' | 'legacy') {
  const zip = files[0]
  const modZip = await JSZip.loadAsync(zip)
  let modFolderName = '' // already includes the leading slash
  for (const [relativePath, zipEntry] of Object.entries(modZip.files)) {
    if (zipEntry.dir === true && modFolderName === '') {
      modFolderName = relativePath
      break
    }
  }

  if (modFolderName === '') {
    toast.error('Invalid file selected - no mod folder found')
    logger.error('no mod folder found', files)
    return
  }

  const importedItemData: Array<Item> = []
  const importedSprites: Record<ItemType, Record<number, File>> = {
    0: {},
    1: {},
    2: {},
    3: {},
    4: {}
  }

  await loadItemSprites(modZip, modFolderName, ItemType.Item, importedSprites)
  await loadItemSprites(modZip, modFolderName, ItemType.Trinket, importedSprites)

  if (version === 'legacy') {
    await loadLegacyData(modFolderName, modZip, importedItemData, importedSprites)
  } else if (version === 'default') {
    await loadDefaultData(modFolderName, modZip, importedItemData, importedSprites)
  }

  finishLoadingModData(importedItemData)
}

async function loadDefaultData(
  modFolderName: string,
  modZip: JSZip,
  importedItemData: Array<Item> = [],
  importedSprites: Record<ItemType, Record<number, File>>
) {
  const rawData = await modZip.file(modFolderName + 'data.lua')?.async('string')
  if (!rawData) {
    toast.error('Invalid file selected - failed to load data.lua file')
    logger.error('failed to load data.lua file', modFolderName, modZip)
    return
  }

  loadItems(rawData, importedItemData, importedSprites)
}

async function loadLegacyData(
  modFolderName: string,
  modZip: JSZip,
  importedItemData: Array<Item> = [],
  importedSprites: Record<ItemType, Record<number, File>>
) {
  const rawData = await modZip.file(modFolderName + 'main.lua')?.async('string')
  if (!rawData) {
    toast.error('Invalid file selected - [LEGACY] failed to load main.lua file')
    logger.error('failed to load legacy main.lua file', modFolderName, modZip)
    return
  }

  loadLegacyItems(rawData, importedItemData, importedSprites)
}

const legacyItemRegex = /\{(\d+), ("[^"]*"), ("[^"]*")\}/g

function loadLegacyItems(
  rawData: string,
  importedItemData: Array<Item>,
  importedSprites: Record<ItemType, Record<number, File>>
) {
  const trinketLine = rawData.indexOf('trinkets = {')
  // hacky but as long as end user didn't modify the file, this should be fine
  
  if (trinketLine === -1) {
    toast.error('Invalid file selected - [LEGACY] failed to index trinkets table')
    logger.error('failed to index trinkets table', rawData)
    return
  }
  
  let match
  while ((match = legacyItemRegex.exec(rawData)) !== null) {
    let type: ItemType
    if (match.index > trinketLine) {
      type = ItemType.Trinket
    } else {
      type = ItemType.Item
    }

    const itemId = match[1]
    const itemName = match[2].slice(1, -1)
    const itemDescription = match[3].slice(1, -1)

    let itemSprite = null
    if (parseInt(itemId) in importedSprites[type]) {
      itemSprite = importedSprites[type][parseInt(itemId)]
    }

    const loadedItem: Item = {
      originItemId: itemId,
      type: type,
      name: itemName,
      description: itemDescription,
      sprite: itemSprite,
      uid: uuidv4(),
      useCustomOrigin: false,
      open: false
    }

    importedItemData.push(loadedItem)
  }
}

function loadItemTypeFromMod(
  type: ItemType,
  data: Record<string, ExportItem> | Record<string, ExportCard>,
  importedItemData: Array<Item> = [],
  importedSprites: Record<ItemType, Record<number, File>>
) {
  for (const [id, item] of Object.entries(data)) {
    let itemSprite = null
    if (parseInt(id) in importedSprites[type]) {
      itemSprite = importedSprites[type][parseInt(id)]
    }

    const loadedItem: Item = {
      originItemId: id,
      type: type,
      name: item.name,
      description: item.description,
      sprite: itemSprite,
      uid: uuidv4(),
      useCustomOrigin: !isNumeric(id),
      open: false
    }

    importedItemData.push(loadedItem)
  }
}

function loadItems(
  rawData: string,
  importedItemData: Array<Item>,
  importedSprites: Record<ItemType, Record<number, File>>
) {
  const match = rawData.match(jsonDataRegex)

  if (!match) {
    toast.error('Invalid file selected - invalid data.lua file format')
    logger.error('invalid data.lua format', rawData)
    return
  }

  const data = match[0].slice(1, -1) // this removes the quotes

  try {
    const parsedData = JSON.parse(data) as ExportData

    loadItemTypeFromMod(ItemType.Item, parsedData.items, importedItemData, importedSprites)
    loadItemTypeFromMod(ItemType.Trinket, parsedData.trinkets, importedItemData, importedSprites)
    loadItemTypeFromMod(ItemType.Pill, parsedData.pills, importedItemData, importedSprites)
    loadItemTypeFromMod(ItemType.PocketItem, parsedData.cards, importedItemData, importedSprites)
  } catch (e) {
    toast.error('Invalid file selected - failed to parse data.lua json data')
    logger.error('failed to parse data.lua json data', e)
    return
  }
}

const spriteNameToIdRegex = /_\d{3}_/
function getSpriteItemId(spriteName: string) {
  const match = spriteName.match(spriteNameToIdRegex)
  return match ? match[0].substring(1, 4) : null // removes the leading and trailing underscores
}

const spriteFolders = ['collectibles', 'trinkets']
export async function loadItemSprites(modZip: JSZip, modFolderName: string, type: ItemType, importedSprites: Record<ItemType, Record<number, File>>) {
  const path = `${modFolderName}resources/gfx/items/${spriteFolders[type - 1]}/`

  for (const [relativePath, zipEntry] of Object.entries(modZip.files)) {
    if (!relativePath.startsWith(path) || zipEntry.dir === true) {
      continue
    }

    if (!zipEntry.name.endsWith('.png')) {
      continue
    }

    const spriteName = relativePath.replace(path, '')
    const spriteItemId = getSpriteItemId(spriteName)

    if (!spriteItemId) {
      toast.warning(`Error reading mod sprites - invalid sprite id: (${spriteName})`)
      logger.warning(`invalid sprite id: (${spriteName})`)
      continue
    }

    const spriteRawData = modZip.file(relativePath)
    if (!spriteRawData) {
      toast.warning(`Error reading mod sprites - failed to load file: (${spriteName})`)
      logger.warning(`failed to read raw file: (${spriteName})`)
      continue
    }

    const spriteData = await spriteRawData.async('arraybuffer')
    const spriteFile = new File([spriteData], spriteName)

    importedSprites[type][parseInt(spriteItemId)] = spriteFile
  }
}

export function finishLoadingModData(importedItemData: Array<Item>) {
  ItemData.set(importedItemData)
  syncSearchableItems(get(ItemData))

  toast.success(`Loaded ${importedItemData.length} item(s) from mod successfully!`)
  logger.debug('imported mod item data', importedItemData)
}
