import { test, expect, describe } from 'vitest'
import { DefaultConfig, TemplateType } from './configManager.js'
import {
  dataVersion,
  getExportPocketItemSubType,
  processData,
  processTemplate,
  templateVersion,
  webVersion
} from './modDownload.js'
import { getMockItem, ItemType } from './dataManager.js'
import { replaceTemporaryCharacters } from './modDownload.js'

import vanilla from '$lib/assets/ezitems/templates/vanilla.lua?raw'
import repentogon from '$lib/assets/ezitems/templates/repentogon.lua?raw'

describe('processTemplate', () => {
  test('vanilla template renames modname', () => {
    const template = processTemplate(DefaultConfig, 'example mod name', vanilla)
    expect(template).toContain('example mod name')
  })

  test('repentogon template renames modname', () => {
    const template = processTemplate(
      {
        ...DefaultConfig,
        ExportTemplate: TemplateType.Repentogon
      },
      'example mod name',
      repentogon
    )
    expect(template).toContain('example mod name')
  })

  test('template minifies correctly', () => {
    const defaultTemplate = processTemplate(DefaultConfig, 'example mod name', vanilla)
    const minifiedTemplate = processTemplate(
      {
        ...DefaultConfig,
        Minify: {
          Template: true
        }
      },
      'example mod name',
      vanilla
    )

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
      }
    })
  })

  test('pocket items process correctly', () => {
    const items = [
      getMockItem({
        type: ItemType.PocketItem,
        originItemId: '1',
        name: 'example',
        description: 'lorem ipsum'
      })
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
      })
    ]

    const data = processData(DefaultConfig, items)

    expect(data).toMatchObject({
      items: {
        '1': {
          name: 'example item',
          description: 'lorem ipsum'
        }
      },

      trinkets: {
        '1': {
          name: 'example trinket',
          description: 'lorem ipsum'
        }
      },

      pills: {
        '1': {
          name: 'example pill',
          description: 'Bad Trip'
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
      })
    ]

    const data = processData(DefaultConfig, items)

    expect(data).toMatchObject({
      items: {
        'example custom origin': {
          name: 'example item',
          description: 'lorem ipsum'
        }
      }
    })
  })

  describe('replaceTemporaryCharacters', () => {
    test("replaces single occurrence of µ (0xC2 0xB5) with \\'", () => {
      // "aµb" in UTF-8: [97, 0xC2, 0xB5, 98]
      const input = new Uint8Array([97, 0xc2, 0xb5, 98])
      const output = replaceTemporaryCharacters(input)
      // "a\'b" in UTF-8: [97, 92, 39, 98]
      expect(Array.from(output)).toEqual([97, 92, 39, 98])
    })

    test('replaces multiple occurrences of µ', () => {
      // "µµ" in UTF-8: [0xC2, 0xB5, 0xC2, 0xB5]
      const input = new Uint8Array([0xc2, 0xb5, 0xc2, 0xb5])
      const output = replaceTemporaryCharacters(input)
      // "\'\'" in UTF-8: [92, 39, 92, 39]
      expect(Array.from(output)).toEqual([92, 39, 92, 39])
    })

    test('returns unchanged array if no µ present', () => {
      const input = new Uint8Array([65, 66, 67])
      const output = replaceTemporaryCharacters(input)
      expect(Array.from(output)).toEqual([65, 66, 67])
    })

    test('handles µ at start and end', () => {
      // "µAµ" in UTF-8: [0xC2, 0xB5, 65, 0xC2, 0xB5]
      const input = new Uint8Array([0xc2, 0xb5, 65, 0xc2, 0xb5])
      const output = replaceTemporaryCharacters(input)
      // "\'A\'" in UTF-8: [92, 39, 65, 92, 39]
      expect(Array.from(output)).toEqual([92, 39, 65, 92, 39])
    })

    test('handles empty input', () => {
      const input = new Uint8Array([])
      const output = replaceTemporaryCharacters(input)
      expect(Array.from(output)).toEqual([])
    })
  })
})
