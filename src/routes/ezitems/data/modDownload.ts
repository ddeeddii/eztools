const templateVersion = '1.0.0'
const dataVersion = '1.0.0'
const webVersion = '1.0.0'

import vanilla from '$lib/assets/ezitems/templates/vanilla.lua?raw'
import repentogon from '$lib/assets/ezitems/templates/repentogon.lua?raw'

// note - there is nothing that can be done to avoid magic numbers
// or at least if there is, i could not find a way to do it
const Template: Record<TemplateType, string> = {
  0: vanilla,
  1: repentogon
}

import JSZip from 'jszip'
import { Config, TemplateType } from './configManager'
import { get } from 'svelte/store'
import {
  getPocketItemSubType,
  ItemData,
  ItemDb,
  ItemType,
  TrinketDb,
  type ExportCard,
  type ExportData,
  type ExportItem,
  type Item
} from './dataManager.js'
import luamin from 'luamin'
import { isNumeric } from '@/utils.js'

export async function getModZip(modName: string, modFolderName: string) {
  const config = get(Config)
  const mainZip = new JSZip()

  mainZip.file(`${modFolderName}/main.lua`, processTemplate(config, modName))
  mainZip.file(`${modFolderName}/data.lua`, `return '${JSON.stringify(processData(config))}'`)
  await saveSprites(get(ItemData), mainZip, modFolderName)

  saveBlob(await mainZip.generateAsync({ type: 'blob' }), `${modName}.zip`)
}

function processTemplate(config: Config, modName: string) {
  let template = Template[config.ExportTemplate]
  template = template.replace('%modname%', modName)

  if (config.Minify.Template) {
    template = luamin.minify(template)
  }

  console.log(template)
  return template
}

// note - also can't avoid magic numbers
const ItemTypeToExportType: Record<ItemType, string> = {
  0: 'Unset',
  1: 'items',
  2: 'trinkets',
  3: 'cards',
  4: 'pills'
}

const TemplateTypeToExportType: Record<TemplateType, 'vanilla' | 'repentogon'> = {
  0: 'vanilla',
  1: 'repentogon'
}

function getExportPocketItemSubType(item: Item): 'card' | 'rune' | 'soul' {
  if (item.name.startsWith('Soul of ')) {
    return 'soul'
  }

  if (getPocketItemSubType(item) === 'rune') {
    return 'rune'
  }

  return 'card'
}

function processData(config: Config) {
  const exportData: ExportData = {
    metadata: {
      templateType: TemplateTypeToExportType[config.ExportTemplate],
      templateVersion,
      dataVersion,
      webVersion
    },

    items: {},
    trinkets: {},
    cards: {},
    pills: {}
  }

  const itemData = get(ItemData)
  console.log(itemData)
  console.log('hi')

  for (const [, item] of Object.entries(itemData)) {
    if (item.type === ItemType.Unset) {
      continue
    }

    let exportItem = {} as ExportItem | ExportCard

    if (item.type === ItemType.PocketItem) {
      exportItem = {
        name: item.name,
        description: item.description,
        type: getExportPocketItemSubType(item)
      }
    } else {
      exportItem = {
        name: item.name,
        description: item.description
      }
    }

    const key = ItemTypeToExportType[item.type] as 'items' | 'trinkets' | 'cards' | 'pills'
    exportData[key][item.originItemId] = exportItem
  }

  return exportData
}

async function saveSprites(itemData: Array<Item>, zip: JSZip, modFolderName: string) {
  for (const item of itemData) {
    if (!isNumeric(item.originItemId)){
      continue
    } // ensure item doesn't use custom origin
    
    if (item.sprite === null) {
      continue
    }

    let itemGfxFileName = ''
    let itemGfxPath = ''
    if (item.type === ItemType.Item) {
      itemGfxFileName = ItemDb[item.originItemId as keyof typeof ItemDb].gfx
      itemGfxPath = `resources/gfx/items/collectibles`
    } else if (item.type === ItemType.Trinket) {
      itemGfxFileName = TrinketDb[item.originItemId as keyof typeof TrinketDb].gfx
      itemGfxPath = `resources/gfx/items/trinkets`
    }

    const fileArrayBuffer = await item.sprite.arrayBuffer()
    zip.file(`${modFolderName}/${itemGfxPath}/${itemGfxFileName}`, fileArrayBuffer)
  }
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()

  setTimeout(() => {
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }, 0)
}
