import { expect, test, describe } from 'vitest'
import { getMockItem, getPocketItemSubType, getSearchableItem, ItemType } from './dataManager.js'

describe('getPocketItemSubType', () => {
  test('custom origin assigns tarot', () => {
    const item = getMockItem({
      originItemId: 'example custom origin'
    })
    expect(getPocketItemSubType(item)).toBe('tarot')
  })

  test('the fool assigns tarot', () => {
    const item = getMockItem({
      originItemId: '1'
    })
    
    expect(getPocketItemSubType(item)).toBe('tarot')
  })

  test('2 of clubs assigns suit', () => {
    const item = getMockItem({
      originItemId: '23'
    })
    expect(getPocketItemSubType(item)).toBe('suit')
  })

  test('hagalaz assigns rune', () => {
    const item = getMockItem({
      originItemId: '32'
    })
    expect(getPocketItemSubType(item)).toBe('rune')
  })

  test('chaos card assigns special', () => {
    const item = getMockItem({
      originItemId: '42'
    })
    expect(getPocketItemSubType(item)).toBe('special')
  })

  test('dice shard assigns object', () => {
    const item = getMockItem({
      originItemId: '49'
    })
    expect(getPocketItemSubType(item)).toBe('object')
  })

  test('reverse fool assigns reverse', () => {
    const item = getMockItem({
      originItemId: '56'
    })
    expect(getPocketItemSubType(item)).toBe('tarot_reverse')
  })
})

describe('getSearchableItem', () => {
  test('custom origin returns custom label', () => {
    const item = getMockItem({
      originItemId: 'example custom origin',
      useCustomOrigin: true,
      name: 'example custom name'
    })

    expect(getSearchableItem(item)).toMatchObject({
      label: 'example custom name',
      value: {
        id: 'example custom origin',
      }
    })
  })

  test('item returns correctly', () => {
    const item = getMockItem({
      originItemId: '1',
      type: ItemType.Item,
    })

    expect(getSearchableItem(item)).toMatchObject({
      label: 'The Sad Onion',
      value: {
        id: '1',
      }
    })
  })

  test('trinket returns correctly', () => {
    const item = getMockItem({
      originItemId: '1',
      type: ItemType.Trinket,
    })

    expect(getSearchableItem(item)).toMatchObject({
      label: 'Swallowed Penny',
      value: {
        id: '1',
      }
    })
  })

  test('pocket item returns correctly', () => {
    const item = getMockItem({
      originItemId: '1',
      type: ItemType.PocketItem,
    })

    expect(getSearchableItem(item)).toMatchObject({
      label: '0 - The Fool',
      value: {
        id: '1',
      }
    })
  })

  test('pill returns correctly', () => {
    const item = getMockItem({
      originItemId: '1',
      type: ItemType.Pill,
    })

    expect(getSearchableItem(item)).toMatchObject({
      label: 'Bad Trip',
      value: {
        id: '1',
      }
    })
  })

  test('unset item returns correctly', () => {
    const item = getMockItem({
      type: ItemType.Unset,
    })

    expect(getSearchableItem(item)).toMatchObject({
      label: '',
      value: {
        id: '',
      }
    })
  })
})