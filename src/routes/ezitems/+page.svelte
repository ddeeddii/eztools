<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import ItemManager from './components/ItemManager.svelte'
  import { ItemData } from './data/dataManager'
</script>

<div class="flex h-full justify-center pb-8 pt-8">
  <div
    class="flex h-4/5 w-11/12 flex-col items-center justify-start rounded-lg border shadow-sm lg:w-3/5"
  >
    <Button class="mt-2 p-6 text-xl " on:click={() => console.log($ItemData)}>Download</Button>
    <Button class="mt-2" variant="outline">Menu</Button>

    <div class="mt-12 flex w-full max-w-lg flex-col gap-1.5 px-4">
      <Label for="mod name">Mod Name</Label>
      <Input class="h-12 lg:h-10" type="text" id="mod name" placeholder="Internal mod name" />
    </div>

    <div class="mt-4 flex w-full max-w-lg flex-col gap-1.5 px-4">
      <Label for="folder name">Folder Name</Label>
      <Input
        class="h-12 lg:h-10"
        type="text"
        id="folder name"
        placeholder="Folder that the mod is in"
      />
    </div>

    <ItemManager />
  </div>
</div>
