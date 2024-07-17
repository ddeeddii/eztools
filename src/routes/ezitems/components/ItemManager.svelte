<script lang="ts">
  import { Plus } from 'lucide-svelte'
  import { Button } from '$lib/components/ui/button'
  import ItemContainer from './ItemContainer.svelte'
  import { randAnimal, randTextRange } from '@ngneat/falso'
  import { ItemType, type Item, ItemData, SearchableItems, SearchableDb } from '../data/dataManager'
  import { flyAndScale } from '@/utils.js'
  import PersistentDialog from '@/components/ui/persistent-dialog/persistent-dialog.svelte'
  import Autocomplete from '@/components/ui/autocomplete/Autocomplete.svelte'
  import Fuse from 'fuse.js'
  import { Config } from '../data/configManager.js'
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js'
  import { v4 as uuidv4 } from 'uuid'

  function generateItem() {
    const item: Item = {
      originItemId: '',
      type: ItemType.Unset,
      name: '',
      description: '',
      sprite: null,
      useCustomOrigin: false,
      uid: uuidv4(),
      open: false
    }

    if ($Config.DevMode.Enabled && $Config.DevMode.UseDummyItems) {
      item.name = randAnimal()
      item.description = randTextRange({ min: 10, max: 100 })
      const randomSearchableItem = SearchableDb[Math.floor(Math.random() * SearchableDb.length)]
      item.originItemId = randomSearchableItem.value.id
      item.type = randomSearchableItem.value.type
    }

    return item
  }

  function addItemToData(item: Item) {
    $ItemData = [...$ItemData, item]
    $SearchableItems.push({
      label: item.name,
      value: {
        type: item.type,
        id: item.originItemId,
        idx: uuidv4()
      }
    })
  }

  function createItem() {
    if ($Config.DevMode.Enabled) {
      for (let i = 0; i < $Config.DevMode.ItemsToGenerate; i++) {
        const item = generateItem()
        addItemToData(item)
      }
    } else {
      const item = generateItem()
      addItemToData(item)
    }
  }

  let dialogOpen = false
  function handleButtonClick() {
    dialogOpen = !dialogOpen
  }

  let input = ''
  function searchItems() {
    const fuse = new Fuse($ItemData, {
      keys: ['name'],
      threshold: $Config.AutocompleteThreshold
    })

    return fuse.search(input)
  }

  function getSearchedItems() {
    return searchItems().map((res) => res.item)
  }

  $: filteredItems = input ? getSearchedItems() : $ItemData
</script>

<Button variant="outline" class="mt-12" on:click={handleButtonClick}>Manage Items</Button>

<PersistentDialog bind:open={dialogOpen} class="h-[90%] max-w-[90%] overflow-hidden xl:w-4/6">
  <span slot="header" class="mb-4 text-left text-lg font-semibold leading-none tracking-tight">
    Item Manager

    <div class="mt-4 flex justify-center">
      <span class="w-full max-w-sm">
        <Autocomplete
          class="h-12 lg:h-10"
          data={$SearchableItems}
          bind:inputValue={input}
          defaultText="Search for an item"
        />
      </span>
    </div>
  </span>

  <Button
    on:click={createItem}
    variant="ghost"
    size="icon"
    class="absolute right-14 top-4 h-8 w-8 rounded-sm opacity-70 ring-offset-background transition-opacity hover:bg-inherit hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  >
    <Plus class="h-8 w-8 " />
  </Button>
  <ScrollArea class="h-[77vh] sm:pr-4">
    <div class="flex flex-col gap-4">
      {#each filteredItems as item, index (item.uid)}
        <div transition:flyAndScale>
          <ItemContainer {item} />
        </div>
      {/each}
    </div>
  </ScrollArea>
</PersistentDialog>
