<script lang="ts">
  import * as Collapsible from '$lib/components/ui/collapsible'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import { Switch } from '$lib/components/ui/switch/index'
  import * as Select from '$lib/components/ui/select'
  import Autocomplete from '@/components/ui/autocomplete/Autocomplete.svelte'
  import ImageInput from '@/components/ui/image-input/ImageInput.svelte'
  import {
    SearchableDb,
    type Item,
    ItemType,
    getSearchableItem,
    ItemData,
    SearchableItems,
    getPocketItemSubType,
    ItemTypeText
  } from '../data/dataManager.js'
  import ArrowRight from 'lucide-svelte/icons/arrow-right'
  import Star from 'lucide-svelte/icons/star'
  import type { searchItem } from '@/index.js'
  import { Button } from '$lib/components/ui/button'
  import { Config, TemplateType } from '$ezitems/data/configManager.js'
  import { toast } from 'svelte-sonner'
  import { onMount } from 'svelte'

  export let item: Item
  const displayItemTypeText = ['Unset', 'Item', 'Trinket', 'Pocket Item']
  const displayItemTypeColors = ['text-neutral-300', 'text-blue-300', 'text-red-300']

  const pocketItemSubTypeText = {
    tarot: 'Card',
    suit: 'Card',
    rune: 'Rune',
    special: 'Card',
    object: 'Card',
    tarot_reverse: 'Reverse Card'
  }
  const pocketItemSubTypeColors = {
    tarot: 'text-green-300',
    suit: 'text-green-300',
    rune: 'text-purple-300',
    special: 'text-green-300',
    object: 'text-green-300',
    tarot_reverse: 'text-green-300'
  }

  let selectedItem = getSearchableItem(item)
  function onSelectedItemChange(usedItem: searchItem) {
    if (usedItem.value.type === ItemType.Unset) {
    }

    if (!itemTypeMatchesTemplate(usedItem.value.type)) {
      selectedItem = getSearchableItem(item) // reset selected item
      return
    }

    item.type = usedItem.value.type
    item.originItemId = usedItem.value.id

    removeIncorrectItemParams()
  }

  function itemTypeMatchesTemplate(type: ItemType) {
    // the strict equality operator doesn't work in the second check for reasons beyond explanation
    // as such, we use the standard equality operator
    return !(
      (type === ItemType.PocketItem || type === ItemType.Pill) &&
      $Config.ExportTemplate != TemplateType.Repentogon
    )
  }

  $: onSelectedItemChange(selectedItem)

  function deleteItem() {
    $ItemData = $ItemData.filter((i) => i.uid !== item.uid)
  }

  let removeSpriteInternal: () => void
  function removeSprite() {
    if (item.sprite !== null) {
      removeSpriteInternal()
    }
  }
  let rawItemSpriteFile = item.sprite === null ? undefined : item.sprite
  $: item.sprite = rawItemSpriteFile === undefined ? null : rawItemSpriteFile

  let searchableItem: searchItem
  onMount(() => {
    let match = $SearchableItems.find(
      (si) => si.value.id === item.originItemId && si.value.type === item.type
    )
    if (match) {
      searchableItem = match
    } else {
      toast.error(
        'Item could not be found in the searchable items - please save current data and send a bug report'
      )
    }
  })

  function onNameChange() {
    searchableItem.label = item.name
  }

  let selectedCustomType = {
    value: item.type,
    label: ItemTypeText[item.type],
    disabled: false
  }

  function removeIncorrectItemParams() {
    if (item.type === ItemType.PocketItem) {
      removeSprite()
    }

    if (item.type === ItemType.Pill) {
      removeSprite()
      item.description = ''
    }
  }

  function onCustomOriginChange(value?: { value: ItemType; label?: string; disabled?: boolean }) {
    if (!value) {
      return
    }

    item.type = value.value
    removeIncorrectItemParams()
  }

  function onToggleCustomOrigin() {
    if (item.useCustomOrigin === true) {
      // on -> off
      item.originItemId = ''
      item.type = ItemType.Unset
    } else {
      // off -> on
      selectedCustomType = {
        value: item.type,
        label: ItemTypeText[item.type],
        disabled: false
      }
      item.originItemId = selectedItem.label
      removeSprite()
    }
  }
</script>

<Collapsible.Root class="w-full rounded-sm border shadow-sm" bind:open={item.open}>
  <Collapsible.Trigger class="flex h-20 w-full items-center justify-start px-4 sm:h-16">
    <div class="inline-flex flex-wrap items-center gap-2 text-xl sm:text-2xl">
      {#if item.useCustomOrigin === true}
        <Star class="inline" />
      {/if}

      {#if item.type === ItemType.PocketItem}
        <span class={'font-semibold ' + pocketItemSubTypeColors[getPocketItemSubType(item)]}>
          {pocketItemSubTypeText[getPocketItemSubType(item)]}
        </span>
      {:else if item.type === ItemType.Pill}
        <span class={'font-semibold text-yellow-300'}> Pill </span>
      {:else}
        <span class={'font-semibold ' + displayItemTypeColors[item.type]}
          >{displayItemTypeText[item.type]}</span
        >
      {/if}

      {#if item.useCustomOrigin === true}
        {item.originItemId !== '' ? item.originItemId : 'Unset'}
      {:else}
        {selectedItem.label !== '' ? selectedItem.label : 'Unset'}
      {/if}

      <ArrowRight class="inline" />

      {item.name === '' ? 'Unnamed' : item.name}
    </div>
  </Collapsible.Trigger>
  <Collapsible.Content class="mx-4 mb-4">
    <div class="grid grid-cols-1 grid-rows-4 sm:grid-cols-2 sm:grid-rows-2">
      <div class="max-w-xxl mb-4 mr-4 flex w-full flex-col gap-1.5 sm:px-4">
        <Label for="item name">Item Name</Label>
        <Input
          bind:value={item.name}
          on:change={onNameChange}
          class="h-12 sm:h-10"
          type="text"
          id="item name"
          placeholder="New name "
        />
      </div>

      <div class="max-w-xxl flex w-full flex-col gap-1.5">
        <Label for="item description">Item Description</Label>
        <Input
          bind:value={item.description}
          class="h-12 sm:h-10"
          type="text"
          id="item description"
          disabled={item.type === ItemType.Pill}
          placeholder={item.type === ItemType.Pill
            ? 'Description is disabled for this item type'
            : 'New description'}
        />
      </div>

      <div class="max-w-xxl w-full sm:px-4">
        {#if item.useCustomOrigin === true}
          <div class="grid grid-cols-2 gap-1.5">
            <Label for="origin-type-select">Origin Item Type</Label>
            <Label for="origin-name-input">Origin Item Name</Label>

            <Select.Root onSelectedChange={onCustomOriginChange} bind:selected={selectedCustomType}>
              <Select.Trigger class="h-12 sm:h-10" id="origin-type-select">
                <Select.Value placeholder="Item Type" />
              </Select.Trigger>
              <Select.Content>
                {#each ItemTypeText as type, index}
                  <Select.Item value={index} disabled={!itemTypeMatchesTemplate(index)}
                    >{type}</Select.Item
                  >
                {/each}
              </Select.Content>
            </Select.Root>

            <Input bind:value={item.originItemId} id="origin-name-input" class="h-12 sm:h-10" />
          </div>
        {:else}
          <div class="flex flex-col gap-1.5">
            <Label>Origin Item</Label>
            <Autocomplete
              name="origin-autocomplete"
              class="h-12 sm:h-10"
              data={SearchableDb}
              bind:selected={selectedItem}
            />
          </div>
        {/if}
      </div>

      <div class="max-w-xxl flex w-full flex-col gap-1.5">
        <Label for="picture">Sprite</Label>
        <ImageInput
          disabled={item.type === ItemType.PocketItem ||
            item.type === ItemType.Pill ||
            item.useCustomOrigin}
          bind:removeImage={removeSpriteInternal}
          id="picture"
          bind:file={rawItemSpriteFile}
          class="h-12 sm:h-10"
        />
      </div>
    </div>
    <div class="flex flex-col items-center justify-evenly gap-1.5 sm:flex-row">
      <span class="flex items-center gap-1.5">
        <Label for="custom-origin-switch">Custom Item Origin</Label>
        <Switch
          name="custom origin switch"
          onCheckedChange={onToggleCustomOrigin}
          bind:checked={item.useCustomOrigin}
          id="custom-origin-switch"
        />
      </span>
      <Button on:click={deleteItem} variant="destructive" class="h-12 sm:h-10">Delete Item</Button>
    </div>
  </Collapsible.Content>
</Collapsible.Root>
