<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import AlertDialog from '@/components/ui/global-alert-dialog/AlertDialog.svelte'
  import ItemManager from './components/ItemManager.svelte'
  import Menu from './components/Menu.svelte'
  import { ItemData, ItemType, itemTypeMatchesTemplate, SearchableItems } from './data/dataManager'
  import { Toaster } from '$lib/components/ui/sonner'
  import { Config, TemplateType } from './data/configManager'
  import { fetchTemplates, getModZip } from './data/modDownload'
  import { toast } from 'svelte-sonner'
  import { showAlertDialog } from '@/components/ui/global-alert-dialog/AlertDialog'
  import { logger } from '@/logger'
  import { onMount } from 'svelte'

  let modName = ''
  let modFolderName = ''

  async function downloadMod() {
    if (modName === '' || modFolderName === '') {
      toast.error('Mod could not be exported', {
        description: 'Mod Name and Folder Name are required to export the mod'
      })
      return
    }

    if ($ItemData.length === 0) {
      toast.error('Mod could not be exported', {
        description: 'Cannot export a mod with no items'
      })
      return
    }

    const usedItemOrigins: Array<[string, ItemType]> = []
    for (const item of $ItemData) {
      if (item.originItemId === '' || item.type === ItemType.Unset) {
        toast.warning('Some items in your mod have unset origin items. They will not be exported.')
        break
      }

      if (
        usedItemOrigins.some(
          ([originItemId, type]) => originItemId === item.originItemId && type === item.type
        )
      ) {
        toast.error('Mod could not be exported', {
          description: 'Your mod contains more than one item with the same origin item.'
        })
        return
      }

      if (!itemTypeMatchesTemplate(item.type, $Config)) {
        toast.error('Mod could not be exported', {
          description:
            'Your mod contains items that are not supported by the selected template. Please remove these items or select a different template. For more information, check the console.'
        })
        logger.warning(
          `template "${$Config.ExportTemplate}" does not support item type "${item.type}" found in item "${item.originItemId}" with custom name "${item.name}"`
        )
        return
      }

      usedItemOrigins.push([item.originItemId, item.type])
    }

    if ($Config.ExportTemplate == TemplateType.Repentogon) {
      showAlertDialog(async () => {
        await getModZip(modName, modFolderName)
      }, 'You are exporting a REPENTOGON mod.\nUsing this mod requires REPENTOGON to be installed.\n\nIf you wish to upload this mod to the Steam Workshop, please make sure to mark REPENTOGON as a dependency (for more help, check FAQ) or inform users in the mod description that it requires REPENTOGON.')

      return
    }

    await getModZip(modName, modFolderName)
  }

  onMount(async () => {
    fetchTemplates()

    const noticeViewed = localStorage.getItem('rplus-temporary-issue-notice-viewed')
    if (!noticeViewed) {
      showAlertDialog(
        () => {
          localStorage.setItem('rplus-temporary-issue-notice-viewed', 'true')
        },
        'Due to issues in the Repentance+ modding API, EzItems does not currently support it.\n\nREPENTOGON hasn\'t been updated yet for REPENTANCE+ (thus eliminating the REPENTOGON template) and the primary function EzItems\' Vanilla template relies on to display item text is currently broken with no workaround available.\nOnly thing to be done right now is to remain patient and wait for Isaac developers to fix up the modding API.\n\nUpon pressing "Confirm" this message will not show up again.',
        'Confirm',
        'ATTENTION'
      )
    }
  })
</script>

<svelte:head>
  <title>EzItems</title>
  <meta content="EzItems" property="og:title" />
  <meta content="Item rename mod generator" property="og:description" />
  <meta content="https://isaac.d3d1.xyz/" property="og:url" />
  <meta content="#242424" data-react-helmet="true" name="theme-color" />
</svelte:head>

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
