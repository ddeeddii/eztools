<script lang="ts">
  import * as Collapsible from '$lib/components/ui/collapsible'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import Autocomplete from '@/components/ui/autocomplete/Autocomplete.svelte'
  import ImageInput from '@/components/ui/image-input/ImageInput.svelte'

  let selectedItem: any
</script>

<Collapsible.Root class="my-4 w-full rounded-sm border shadow-sm">
  <Collapsible.Trigger class="mx-4 flex h-16 w-full items-center justify-start">
    <div class="text-2xl">[Item] Unset -> Unset</div>
  </Collapsible.Trigger>
  <Collapsible.Content class="mx-4 mb-4">
    <div class="grid grid-cols-1 grid-rows-4 sm:grid-cols-2 sm:grid-rows-2">
      <div class="mb-4 flex w-full max-w-lg flex-col gap-1.5 sm:px-4">
        <Label for="item name">Item Name</Label>
        <Input class="h-12 lg:h-10" type="text" id="item name" placeholder="New name " />
      </div>

      <div class="flex w-full max-w-lg flex-col gap-1.5">
        <Label for="item description">Item Description</Label>
        <Input
          class="h-12 lg:h-10"
          type="text"
          id="item description"
          placeholder="New description"
        />
      </div>

      <div class="w-full max-w-lg sm:px-4">
        <div class="flex flex-col gap-1.5">
          <Label for="email">Origin Item</Label>
          <Autocomplete data={[]} {selectedItem} />
        </div>
      </div>

      <div class="flex w-full max-w-lg flex-col gap-1.5">
        <Label for="picture">Sprite</Label>
        <ImageInput uid="1" imageUrl={'preview'} class="h-12 lg:h-10" />
      </div>
    </div>
  </Collapsible.Content>
</Collapsible.Root>
