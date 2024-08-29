<script lang="ts">
  import * as Card from '$lib/components/ui/card'
  import { Button } from '$lib/components/ui/button'
  import Trash from 'lucide-svelte/icons/trash'
  import { db, type StoredData } from '$ezitems/data/savedDataManager.js'
  import { showAlertDialog } from '@/components/ui/global-alert-dialog/AlertDialog.js'
  import { ItemData, syncSearchableItems } from '$ezitems/data/dataManager.js'
  import { logger } from '@/logger'
  import { toast } from 'svelte-sonner'
  export let data: StoredData

  async function deleteData() {
    await db.SavedItems.delete(data.id)
  }

  function loadData() {
    // ItemData and SearchableItems must be kept in sync
    syncSearchableItems(data.items)
    $ItemData = data.items

    toast.success(`Loaded ${data.items.length} item(s) from saved data successfully!`)
    logger.debug('loaded data from saved data', data)
  }
</script>

<Card.Root class="sm:grid sm:grid-cols-2">
  <Card.Header>
    <Card.Title>{data.name}</Card.Title>
    <Card.Description class="flex flex-col">
      {#if data.description.length > 0}
        <span>
          {data.description}
        </span>
      {/if}
      <span>
        {data.items.length} item{data.items.length === 1 ? '' : 's'}
      </span>
      <span>
        {data.date.toLocaleDateString([], { hour: 'numeric', minute: 'numeric' })}
      </span>
    </Card.Description>
  </Card.Header>
  <Card.Content class="flex items-center justify-center gap-2 sm:justify-end sm:pt-6">
    <Button
      variant="destructive"
      on:click={() => {
        showAlertDialog(loadData, 'This action will overwrite all of your current item data.')
      }}>Load data</Button
    >
    <Button
      variant="destructive"
      size="icon"
      on:click={() => {
        showAlertDialog(deleteData, 'This action will delete this save data.')
      }}
    >
      <Trash />
    </Button>
  </Card.Content>
</Card.Root>
