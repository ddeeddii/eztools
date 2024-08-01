<script lang="ts">
  import type { searchItem } from '@/index.js'
  import { flyAndScale } from '@/utils.js'
  import { Combobox } from 'bits-ui'
  import Fuse from 'fuse.js'
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down'
  import { ItemType } from '../../../../routes/ezitems/data/dataManager.js'
  import { Config } from '../../../../routes/ezitems/data/configManager.js'

  export let selected: searchItem = {
    label: '',
    value: {
      type: ItemType.Unset,
      id: '',
      idx: ''
    }
  }

  export let name = 'autocomplete'
  export let defaultText = 'Select an item'
  export let emptyText = 'No items found'
  export let data: Array<searchItem> = []

  let className = ''
  export { className as class }
  export let inputValue = ''

  const defaultItems = data.slice(0, $Config.AutocompleteMaxResults)
  let filteredItems: Array<searchItem> = data.slice(0, $Config.AutocompleteMaxResults)

  function searchItems() {
    const fuse = new Fuse(data, {
      keys: ['label'],
      threshold: $Config.AutocompleteThreshold
    })

    return fuse.search(inputValue)
  }

  function getSearchedItems() {
    return searchItems()
      .map((res) => res.item)
      .slice(0, $Config.AutocompleteMaxResults)
  }

  $: filteredItems = inputValue ? getSearchedItems() : defaultItems
</script>

<Combobox.Root items={filteredItems} bind:inputValue bind:selected>
  <div class="relative">
    <Combobox.Input
      class={'flex h-10 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ' +
        className}
      placeholder={defaultText}
    />
    <ChevronsUpDown
      class="absolute end-3 top-1/2 size-6 h-4 w-4 shrink-0 -translate-y-1/2 opacity-50"
    />
  </div>

  <Combobox.Content
    class="z-50 w-full rounded-md border border-muted bg-background px-2 py-3 shadow-popover outline-none "
    transition={flyAndScale}
    sideOffset={8}
  >
    {#each filteredItems as item (item.value.idx)}
      <Combobox.Item
        class="rounded-button flex h-8 w-full select-none items-center py-3 pl-5 pr-1.5 text-sm capitalize outline-none transition-all duration-75 data-[highlighted]:rounded-md data-[highlighted]:bg-muted"
        value={item.value}
        label={item.label}
      >
        {item.label}
      </Combobox.Item>
    {:else}
      <span class="block px-5 py-2 text-sm text-muted-foreground"> {emptyText} </span>
    {/each}
  </Combobox.Content>
  <Combobox.HiddenInput {name} />
</Combobox.Root>
