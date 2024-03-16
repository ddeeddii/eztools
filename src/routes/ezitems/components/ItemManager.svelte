<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import * as Dialog from '$lib/components/ui/dialog'
  import ItemContainer from './ItemContainer.svelte'
  import { randAnimal, randTextRange } from '@ngneat/falso'
  import { ItemType, type Item, uid, ItemData } from '../data/dataManager'
  import { onMount } from 'svelte'

  const items: Array<Item> = []
  onMount(() => {
    if (import.meta.env.DEV) {
      for (let i = 0; i < 10; i++) {
        const item: Item = {
          originItemId: '',
          type: ItemType.Unset,
          name: randAnimal(),
          description: randTextRange({ min: 10, max: 100 }),
          sprite: null,
          uid: $uid,
          open: false
        }

        $ItemData.push(item)
        $uid++
      }
    }

    console.log(items)
  })
</script>

<Dialog.Root>
  <Dialog.Trigger class="mt-12">
    <!-- TODO: item create button -->
    <!-- TODO: autocomplete search -->
    <Button variant="outline">Manage Items</Button>
  </Dialog.Trigger>
  <Dialog.Content class="h-[90%] max-w-[90%] overflow-y-scroll xl:w-4/6">
    <div>
      <Dialog.Header class="mb-8">
        <Dialog.Title>Item Management</Dialog.Title>
      </Dialog.Header>

      {#each $ItemData as item, index (item.uid)}
        <ItemContainer {item} />
      {/each}
    </div>
  </Dialog.Content>
</Dialog.Root>
