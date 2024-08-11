import { test, expect, describe } from 'vitest'
import { DefaultConfig, TemplateType } from './configManager.js'
import { dataVersion, getExportPocketItemSubType, processData, processTemplate, templateVersion, webVersion } from './modDownload.js'
import { getMockItem, ItemType } from './dataManager.js'

describe('processTemplate', () => {
  test('vanilla template renames modname', () => {
    const template = processTemplate(DefaultConfig, 'example mod name')
    expect(template).toContain('example mod name')
  })

  test('repentogon template renames modname', () => {
    const template = processTemplate({
      ...DefaultConfig,
      ExportTemplate: TemplateType.Repentogon
    }, 'example mod name')
    expect(template).toContain('example mod name')
  })

  test('template minifies correctly', () => {
    const defaultTemplate = processTemplate(DefaultConfig, 'example mod name')
    const minifiedTemplate = processTemplate({
      ...DefaultConfig,
      Minify: {
        Template: true
      }
    }, 'example mod name')

    expect(defaultTemplate).length.greaterThan(minifiedTemplate.length)
  })
})

describe('getExportPocketItemSubType', () => {
  test('souls return correctly', () => {
    const item = getMockItem({
      name: 'Soul of Isaac'
    })

    expect(getExportPocketItemSubType(item)).toBe('soul')
  })

  test('runes return correctly', () => {
    const item = getMockItem({
      originItemId: '32',
      name: 'Hagalaz'
    })

    expect(getExportPocketItemSubType(item)).toBe('rune')
  })

  test('default card return', () => {
    const item = getMockItem({
      name: 'The Fool'
    })

    expect(getExportPocketItemSubType(item)).toBe('card')
  })
}) 

describe('processData', () => {
  test('metadata is correct', () => {
    const data = processData(DefaultConfig, [])
    expect(data).toMatchObject({
      metadata: {
        templateType: 'vanilla',
        templateVersion: templateVersion,
        dataVersion: dataVersion,
        webVersion: webVersion
      },
    })
  })

  test('pocket items process correctly', () => {
    const items = [
      getMockItem({
        type: ItemType.PocketItem,
        originItemId: '1',
        name: 'example',
        description: 'lorem ipsum'
      }),
    ]

    const data = processData(DefaultConfig, items)

    expect(data).toMatchObject({
      cards: {
        '1': {
          name: 'example',
          description: 'lorem ipsum',
          type: 'card'
        }
      }
    })
  })

  test('other item types process correctly', () => {
    const items = [
      getMockItem({
        originItemId: '1',
        name: 'example item',
        description: 'lorem ipsum',
        type: ItemType.Item
      }),

      getMockItem({
        originItemId: '1',
        name: 'example trinket',
        description: 'lorem ipsum',
        type: ItemType.Trinket
      }),

      getMockItem({
        originItemId: '1',
        name: 'example pill',
        description: 'lorem ipsum',
        type: ItemType.Pill
      }),
    ]

    const data = processData(DefaultConfig, items)

    expect(data).toMatchObject({
      items: {
        '1': {
          name: 'example item',
          description: 'lorem ipsum',
        }
      },

      trinkets: {
        '1': {
          name: 'example trinket',
          description: 'lorem ipsum',
        }
      },

      pills: {
        '1': {
          name: 'example pill',
          description: 'lorem ipsum',
        }
      }
    })
  })

  test('custom item origin processes correctly', () => {
    const items = [
      getMockItem({
        originItemId: 'example custom origin',
        name: 'example item',
        description: 'lorem ipsum',
        type: ItemType.Item,
        useCustomOrigin: true
      }),
    ]

    const data = processData(DefaultConfig, items)

    expect(data).toMatchObject({
      items: {
        'example custom origin': {
          name: 'example item',
          description: 'lorem ipsum',
        }
      }
    })
  })
})