<script lang="ts">
  import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down'
  import * as Command from '$lib/components/ui/command'
  import * as Popover from '$lib/components/ui/popover'
  import { Button } from '$lib/components/ui/button'
  import { tick } from 'svelte'
  import Fuse from 'fuse.js'
  import type { searchItem } from '@/index.js'

  export let defaultText = 'Select an item'
  export let searchText = 'Search items'
  export let emptyText = 'No items found'
  export let data: Array<searchItem> = []

  // TODO fix repeating items (?)
  // TODO search algorithm config
  // -> fuzzy search
  // -> default basic search
  let itemsShown: Array<searchItem> = data.slice(0, 10)

  let open = false
  let value = ''

  function closeAndFocusTrigger(triggerId: string) {
    open = false
    tick().then(() => {
      document.getElementById(triggerId)?.focus()
    })
  }

  $: if (value) {
    console.log(value)
  }

  let rawValue = ''
  function searchItems() {
    const fuse = new Fuse(data, {
      keys: ['label']
    })

    return fuse.search(rawValue)
  }

  function handleInput() {
    itemsShown = searchItems()
      .map((res) => res.item)
      .slice(0, 10)
  }
</script>

<Popover.Root bind:open let:ids>
  <Popover.Trigger asChild let:builder>
    <Button
      builders={[builder]}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      class="w-[200px] justify-between"
    >
      {rawValue === '' ? defaultText : rawValue}
      <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root shouldFilter={false}>
      <Command.Input placeholder={searchText} bind:value={rawValue} on:input={handleInput} />
      <Command.Empty>{emptyText}</Command.Empty>
      <Command.Group>
        {#each itemsShown as item}
          <Command.Item
            value={item.label}
            onSelect={(currentValue) => {
              value = currentValue
              closeAndFocusTrigger(ids.trigger)
            }}
          >
            {item.label}
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
