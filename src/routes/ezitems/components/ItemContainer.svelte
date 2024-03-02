<script lang="ts">
  import * as Collapsible from '$lib/components/ui/collapsible'
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
</script>

<Collapsible.Root class="my-4 w-full rounded-sm border shadow-sm">
  <Collapsible.Trigger class="mx-4 flex h-16 w-full items-center justify-start">
    <div class="text-2xl">[Item] Unset -> Unset</div>
  </Collapsible.Trigger>
  <Collapsible.Content class="mx-4 mb-4">
    <div class="grid grid-cols-2 grid-rows-2">
      <div class="mb-4 flex w-full max-w-lg flex-col gap-1.5">
        <Label for="email">Item Name</Label>
        <Input class="h-12 lg:h-10" type="email" id="email" placeholder="New name " />
      </div>

      <div class="flex w-full max-w-lg flex-col gap-1.5">
        <Label for="email">Item Description</Label>
        <Input class="h-12 lg:h-10" type="email" id="email" placeholder="New description" />
      </div>

      <!-- TODO: autocomplete -->
      <div class="flex w-full max-w-lg flex-col gap-1.5">
        <Label for="email">Origin Item</Label>
        <Input
          class="h-12 lg:h-10"
          type="email"
          id="email"
          placeholder="Item whose name you want to change"
        />
      </div>

      <!-- TODO: sprite name shown -->
      <!-- TODO: sprite preview -->
      <div class="flex w-full max-w-lg flex-col gap-1.5">
        <Label for="picture">Sprite</Label>
        <Input id="picture" type="file" />
      </div>
    </div>
  </Collapsible.Content>
</Collapsible.Root>
