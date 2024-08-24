<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import AlertDialog from '@/components/ui/global-alert-dialog/AlertDialog.svelte'
  import ItemManager from './components/ItemManager.svelte'
  import Menu from './components/Menu.svelte'
  import { ItemData, SearchableItems } from './data/dataManager'
  import { Toaster } from '$lib/components/ui/sonner'
  import { Config, TemplateType } from './data/configManager'
  import { getModZip } from './data/modDownload'
  import { toast } from 'svelte-sonner'
  import { showAlertDialog } from '@/components/ui/global-alert-dialog/AlertDialog'

  let modName = ''
  let modFolderName = ''

  async function downloadMod() {
    if ($Config.DevMode.Enabled) {
      console.log($ItemData, $SearchableItems)
    }

    if (modName === '' || modFolderName === '') {
      toast.error('Mod Name and Folder Name are required to export the mod')
      return
    }

    if ($ItemData.length === 0) {
      toast.error('Cannot export a mod with no items')
      return
    }

    if ($Config.ExportTemplate == TemplateType.Repentogon) {
      showAlertDialog(async () => {
        await getModZip(modName, modFolderName)
      }, 'You are exporting a REPENTOGON mod.\nUsing this mod requires REPENTOGON to be installed.\n\nIf you wish to upload this mod to the Steam Workshop, please make sure to mark REPENTOGON as a dependency (for more help, check FAQ) or inform users in the mod description that it requires REPENTOGON.')

      return
    }

    await getModZip(modName, modFolderName)
  }
</script>

<Toaster />

<div class="flex h-full justify-center pb-8 pt-8">
  <div
    class="flex h-4/5 w-11/12 flex-col items-center justify-start rounded-lg border shadow-sm lg:w-3/5"
  >
    <Button class="mt-2 p-6 text-xl " on:click={downloadMod}>Download</Button>
    <Menu />

    <div class="mt-12 flex w-full max-w-lg flex-col gap-1.5 px-4">
      <Label for="mod name">Mod Name</Label>
      <Input
        bind:value={modName}
        class="h-12 lg:h-10"
        type="text"
        id="mod name"
        placeholder="Internal mod name"
      />
    </div>

    <div class="mt-4 flex w-full max-w-lg flex-col gap-1.5 px-4">
      <Label for="folder name">Folder Name</Label>
      <Input
        bind:value={modFolderName}
        class="h-12 lg:h-10"
        type="text"
        id="folder name"
        placeholder="Folder that the mod is in"
      />
    </div>

    <ItemManager />
  </div>
</div>

<!-- singleton, allows for showAlertDialog -->
<AlertDialog />
