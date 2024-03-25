<script lang="ts">
  import { Plus } from 'lucide-svelte'
  import { Button } from '$lib/components/ui/button'
  import ItemContainer from './ItemContainer.svelte'
  import { randAnimal, randTextRange } from '@ngneat/falso'
  import { ItemType, type Item, uid, ItemData, SearchableItems } from '../data/dataManager'
  import { flyAndScale } from '@/utils.js'
  import PersistentDialog from '@/components/ui/persistent-dialog/persistent-dialog.svelte'
  import Autocomplete from '@/components/ui/autocomplete/Autocomplete.svelte'
  import type { searchItem } from '@/index.js'
  import Fuse from 'fuse.js'

  function createItem() {
    if (import.meta.env.DEV) {
      for (let i = 0; i < 100; i++) {
        const item: Item = {
          originItemId: '',
          type: ItemType.Unset,
          name: randAnimal(),
          description: randTextRange({ min: 10, max: 100 }),
          sprite: null,
          uid: $uid,
          open: false
        }

        $ItemData = [...$ItemData, item]
        SearchableItems.push({
          label: item.name,
          value: {
            type: ItemType.Unset,
            id: '',
            uid: $uid.toString()
          }
        })
        $uid++
      }
    } else {
      const item: Item = {
        originItemId: '',
        type: ItemType.Unset,
        name: '',
        description: '',
        sprite: null,
        uid: $uid,
        open: false
      }

      $ItemData = [...$ItemData, item]
      SearchableItems.push({
        label: item.name,
        value: {
          type: ItemType.Unset,
          id: '',
          uid: $uid.toString()
        }
      })
      $uid++
    }
  }

  let dialogOpen = false
  function handleButtonClick() {
    dialogOpen = !dialogOpen
  }

  let input = ''
  // TODO customize treshold
  function searchItems() {
    const fuse = new Fuse($ItemData, {
      keys: ['name'],
      threshold: 0.3
    })

    return fuse.search(input)
  }

  function getSearchedItems() {
    return searchItems().map((res) => res.item)
  }

  $: filteredItems = input ? getSearchedItems() : $ItemData
</script>

<Button variant="outline" class="mt-12" on:click={handleButtonClick}>Manage Items</Button>

<PersistentDialog bind:open={dialogOpen} class="h-[90%] max-w-[90%] overflow-y-scroll xl:w-4/6">
  <span slot="header" class="mb-8 text-center text-lg font-semibold leading-none tracking-tight">
    <div class="max-w-md pr-20">
      <Autocomplete
        class="h-12 lg:h-10"
        data={SearchableItems}
        bind:inputValue={input}
        defaultText="Search for an item"
      />
    </div>
  </span>
  <div>
    {#each filteredItems as item, index (item.uid)}
      <div transition:flyAndScale>
        <ItemContainer {item} />
      </div>
    {/each}

    <Button
      on:click={createItem}
      variant="ghost"
      size="icon"
      class="absolute right-14 top-4 h-8 w-8 rounded-sm opacity-70 ring-offset-background transition-opacity hover:bg-inherit hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      <Plus class="h-8 w-8 " />
    </Button>
  </div>
</PersistentDialog>
