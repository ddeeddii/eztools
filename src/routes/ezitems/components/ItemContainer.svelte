<script lang="ts">
  import * as Collapsible from '$lib/components/ui/collapsible'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import Autocomplete from '@/components/ui/autocomplete/Autocomplete.svelte'
  import ImageInput from '@/components/ui/image-input/ImageInput.svelte'
  import {
    SearchableDb,
    type Item,
    ItemType,
    getSearchableItem,
    ItemData
  } from '../data/dataManager.js'
  import { ArrowRight, Trash } from 'lucide-svelte/icons'
  import type { searchItem } from '@/index.js'
  import { Button } from '$lib/components/ui/button'

  export let item: Item
  const itemTypeText = ['Unset', 'Item', 'Trinket', 'Pocket Item']
  const itemTypeColors = ['text-neutral-300', 'text-blue-300', 'text-red-300']

  let selectedItem = getSearchableItem(item)
  function onSelectedItemChange(usedItem: searchItem) {
    if (usedItem.value.type === ItemType.Unset) {
      return
    }

    item.type = usedItem.value.type
    item.originItemId = usedItem.value.id
  }

  $: onSelectedItemChange(selectedItem)

  function deleteItem() {
    $ItemData = $ItemData.filter((i) => i.uid !== item.uid)
  }

  let rawFileList = item.sprite === null ? undefined : item.sprite
  $: item.sprite = rawFileList === undefined ? null : rawFileList
</script>

<Collapsible.Root class="my-4 w-full rounded-sm border shadow-sm" bind:open={item.open}>
  <Collapsible.Trigger class="flex h-16 w-full items-center justify-start px-4">
    <div class="text-xl sm:text-2xl">
      <span class={'font-semibold ' + itemTypeColors[item.type]}>{itemTypeText[item.type]}</span>
      <span
        >{selectedItem ? selectedItem.label : 'Unset'}
        <ArrowRight class="inline" />
        {item.name === '' ? 'Unnamed' : item.name}</span
      >
    </div>
  </Collapsible.Trigger>
  <Collapsible.Content class="mx-4 mb-4">
    <div class="grid grid-cols-1 grid-rows-4 sm:grid-cols-2 sm:grid-rows-2">
      <div class="max-w-xxl mb-4 mr-4 flex w-full flex-col gap-1.5 sm:px-4">
        <Label for="item name">Item Name</Label>
        <Input
          bind:value={item.name}
          class="h-12 lg:h-10"
          type="text"
          id="item name"
          placeholder="New name "
        />
      </div>

      <div class="max-w-xxl flex w-full flex-col gap-1.5">
        <Label for="item description">Item Description</Label>
        <Input
          bind:value={item.description}
          class="h-12 lg:h-10"
          type="text"
          id="item description"
          placeholder="New description"
        />
      </div>

      <div class="max-w-xxl w-full sm:px-4">
        <div class="flex flex-col gap-1.5">
          <Label for="origin">Origin Item</Label>
          <Autocomplete class="h-12 lg:h-10" data={SearchableDb} bind:selected={selectedItem} />
        </div>
      </div>

      <div class="max-w-xxl flex w-full flex-col gap-1.5">
        <Label for="picture">Sprite</Label>
        <ImageInput id="picture" bind:files={rawFileList} class="h-12 lg:h-10" />
      </div>
    </div>

    <div class="flex justify-center sm:justify-end">
      <Button on:click={deleteItem} variant="destructive" class="h-12 lg:h-10">Delete Item</Button>
    </div>
  </Collapsible.Content>
</Collapsible.Root>
