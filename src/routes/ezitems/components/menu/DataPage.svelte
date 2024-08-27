<script lang="ts">
  import * as Card from '$lib/components/ui/card'
  import { Button } from '$lib/components/ui/button'
  import FolderUp from 'lucide-svelte/icons/folder-up'
  import Trash from 'lucide-svelte/icons/trash'
  import Input from '@/components/ui/input/input.svelte'
  import ScrollArea from '@/components/ui/scroll-area/scroll-area.svelte'
  import SaveDataCard from './SaveDataCard.svelte'
  import { showAlertDialog } from '@/components/ui/global-alert-dialog/AlertDialog'
  import { db, type StoredItem } from '$ezitems/data/savedDataManager'
  import {
    ItemData,
    ItemType,
    regenerateSearchableItems,
    syncSearchableItems
  } from '$ezitems/data/dataManager'
  import { liveQuery } from 'dexie'
  import { flyAndScale, isNumeric } from '@/utils.js'
  import { Label } from '$lib/components/ui/label/index.js'
  import { toast } from 'svelte-sonner'
  import { loadModData } from './DataPage'
  import { logger } from '@/logger'

  let modUploadInput: HTMLInputElement
  let files: FileList
  let version: 'default' | 'legacy' = 'default'

  async function loadDataFromMod() {
    if (!files) {
      toast.warning('No file selected')
      return
    }
    if (files.length < 1) {
      toast.warning('No file selected')
      return
    }

    logger.debug('loading data from mod', version)
    loadModData(files, version)
  }

  async function displayAlert() {
    showAlertDialog(
      () => {
        version = 'default'
        modUploadInput.click()
      },
      'This action will overwrite all of your current item data. Please select which type of mod you wish to import. After clicking either button select a zip file containing the mod folder.\nDefault - this version of EzItems\nLegacy - the old version of EzItems (ezitems-web)',
      'Default',
      'Are you absolutely sure?',
      [
        {
          title: 'Legacy',
          onClick: () => {
            version = 'legacy'
            modUploadInput.click()
          }
        }
      ]
    )
  }

  function deleteAllItems() {
    regenerateSearchableItems([])
    $ItemData = []
    logger.debug('deleted all items')
  }

  function deleteAllUnsetItems() {
    $ItemData = $ItemData.filter((i) => i.type !== ItemType.Unset)
    syncSearchableItems($ItemData)
    logger.debug('deleted all unset items')
  }

  let name = ''
  let desc = ''
  async function saveData() {
    if (name === '') {
      toast.error('You must provide a name for the data')
      return
    }

    if ($ItemData.length === 0) {
      toast.error('You must have at least one item to save item data')
      return
    }

    try {
      await db.SavedItems.add({
        name,
        description: desc || '',
        date: new Date(),
        items: $ItemData satisfies Array<StoredItem>
      })
    } catch (e) {
      logger.error('undefined error', e)
    }

    name = ''
    desc = ''

    logger.debug('saved data', $ItemData)
  }

  let storedData = liveQuery(() => db.SavedItems.toArray())
</script>

<div class="grid h-full grid-rows-1 gap-2 pb-10 sm:grid-cols-2 sm:grid-rows-1 sm:pb-0">
  <Card.Root class="h-full">
    <Card.Header>
      <Card.Title class="text-center">Load Data</Card.Title>
      <Card.Description class="flex flex-col text-center">
        Load your item data from a mod or a local save
      </Card.Description>
    </Card.Header>
    <Card.Content class="flex flex-col items-center gap-12">
      <Button variant="destructive" class="w-48" on:click={displayAlert}>
        <FolderUp class="mr-2 h-6 w-6" />
        Load data from mod
      </Button>
      <input
        accept=".zip"
        bind:files
        on:change={loadDataFromMod}
        bind:this={modUploadInput}
        type="file"
        class="hidden"
      />

      <ScrollArea class="h-96 w-full max-w-md rounded-md border">
        <div class="flex flex-col gap-2 p-3">
          {#if $storedData}
            {#each $storedData as data (data.id)}
              <div transition:flyAndScale>
                <SaveDataCard {data} />
              </div>
            {/each}
          {/if}
        </div>
      </ScrollArea>
    </Card.Content>
  </Card.Root>

  <div class="grid grid-rows-2 gap-2">
    <Card.Root>
      <Card.Header>
        <Card.Title class="text-center">Save Data</Card.Title>
        <Card.Description class="flex flex-col text-center">
          Save your current item data to a local save
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="flex w-full flex-col items-center gap-4">
          <div class="flex w-full max-w-96 flex-col gap-1">
            <Label for="saveName">Name</Label>
            <Input
              id="saveName"
              type="text"
              placeholder="Name of the save data"
              bind:value={name}
            />
          </div>

          <div class="flex w-full max-w-96 flex-col gap-1">
            <Label for="saveDesc">Description</Label>
            <Input
              id="saveDesc"
              type="text"
              placeholder="Description of what that data contains (optional)"
              bind:value={desc}
            />
          </div>

          <Button variant="outline" class="w-48" on:click={saveData}>Save</Button>
        </div>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header>
        <Card.Title class="text-center">Data Management</Card.Title>
        <Card.Description class="flex flex-col text-center">
          Manage current item data
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="flex w-full flex-col items-center gap-4">
          <Button
            variant="destructive"
            class="w-full max-w-64"
            on:click={() => {
              showAlertDialog(
                deleteAllUnsetItems,
                'This action will delete all current items that have an "unset" origin item.'
              )
            }}
          >
            <Trash class="mr-2 h-6 w-6" />
            Delete all unset items
          </Button>

          <Button
            variant="destructive"
            class="w-full max-w-64"
            on:click={() => {
              showAlertDialog(deleteAllItems, 'This action will delete current items.')
            }}
          >
            <Trash class="mr-2 h-6 w-6" />
            Delete all items
          </Button>
        </div>
      </Card.Content>
    </Card.Root>
  </div>
</div>
