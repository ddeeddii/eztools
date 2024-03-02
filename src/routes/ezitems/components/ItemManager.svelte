<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import * as Dialog from '$lib/components/ui/dialog'
  import ItemContainer from './ItemContainer.svelte'
</script>

<Dialog.Root>
  <Dialog.Trigger class="mt-12">
    <!-- TODO: item create button -->
    <!-- TODO: autocomplete search -->
    <Button variant="outline">Manage Items</Button>
  </Dialog.Trigger>
  <Dialog.Content class="h-[90%] max-w-[90%] xl:w-3/4">
    <div>
      <Dialog.Header class="mb-8">
        <Dialog.Title>Item Management</Dialog.Title>
      </Dialog.Header>

      <ItemContainer />
    </div>
  </Dialog.Content>
</Dialog.Root>
