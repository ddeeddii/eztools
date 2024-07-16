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
    syncSearchableItems,
    type ExportCard,
    type ExportData,
    type ExportItem,
    type Item
  } from '$ezitems/data/dataManager'
  import { liveQuery } from 'dexie'
  import { flyAndScale, isNumeric } from '@/utils.js'
  import { Label } from '$lib/components/ui/label/index.js'
  import { toast } from 'svelte-sonner'
  import JSZip from 'jszip'
  import { v4 as uuidv4 } from 'uuid'

  let modUploadInput: HTMLInputElement
  let files: FileList
  const jsonDataRegex = /'(.+)'/
  let importedItemData: Array<Item> = []
  let importedSprites: Record<ItemType, Record<number, File>> = {
    0: {},
    1: {},
    2: {},
    3: {},
    4: {}
  }

  function loadItemTypeFromMod(
    type: ItemType,
    data: Record<string, ExportItem> | Record<string, ExportCard>
  ) {
    for (const [id, item] of Object.entries(data)) {
      let itemSprite = null
      if (parseInt(id) in importedSprites[type]) {
        itemSprite = importedSprites[type][parseInt(id)]
      }

      const loadedItem: Item = {
        originItemId: id,
        type: type,
        name: item.name,
        description: item.description,
        sprite: itemSprite,
        uid: uuidv4(),
        useCustomOrigin: !isNumeric(id),
        open: false
      }

      importedItemData.push(loadedItem)
    }
  }

  function loadItems(rawData: string) {
    const match = rawData.match(jsonDataRegex)

    if (!match) {
      toast.error('Invalid file selected - invalid data.lua file format')
      return
    }

    const data = match[0].slice(1, -1) // this removes the quotes

    try {
      const parsedData = JSON.parse(data) as ExportData

      loadItemTypeFromMod(ItemType.Item, parsedData.items)
      loadItemTypeFromMod(ItemType.Trinket, parsedData.trinkets)
      loadItemTypeFromMod(ItemType.Pill, parsedData.pills)
      loadItemTypeFromMod(ItemType.PocketItem, parsedData.cards)
    } catch (e) {
      toast.error('Invalid file selected - failed to parse data.lua json data')
      console.log(e)
      return
    }
  }

  const spriteNameToIdRegex = /_\d{3}_/
  function getSpriteItemId(spriteName: string) {
    const match = spriteName.match(spriteNameToIdRegex)
    return match ? match[0].substring(1, 4) : null // removes the leading and trailing underscores
  }

  const spriteFolders = ['collectibles', 'trinkets']
  async function loadItemSprites(modZip: JSZip, modFolderName: string, type: ItemType) {
    const path = `${modFolderName}resources/gfx/items/${spriteFolders[type - 1]}/`

    for (const [relativePath, zipEntry] of Object.entries(modZip.files)) {
      if (!relativePath.startsWith(path) || zipEntry.dir === true) {
        continue
      }

      if (!zipEntry.name.endsWith('.png')) {
        continue
      }

      const spriteName = relativePath.replace(path, '')
      const spriteItemId = getSpriteItemId(spriteName)

      if (!spriteItemId) {
        toast.warning(`Error reading mod sprites - invalid sprite id: (${spriteName})`)
        continue
      }

      const spriteRawData = modZip.file(relativePath)
      if (!spriteRawData) {
        toast.warning(`Error reading mod sprites - failed to load file: (${spriteName})`)
        continue
      }

      const spriteData = await spriteRawData.async('arraybuffer')
      const spriteFile = new File([spriteData], spriteName)

      importedSprites[type][parseInt(spriteItemId)] = spriteFile
    }
  }

  function finishLoadingModData() {
    $ItemData = importedItemData
    syncSearchableItems($ItemData)

    importedItemData = []
    importedSprites = {
      0: {},
      1: {},
      2: {},
      3: {},
      4: {}
    }

    toast.success('Mod data loaded successfully')
  }

  async function loadDataFromMod() {
    if (!files) {
      toast.warning('No file selected')
      return
    }
    if (files.length < 1) {
      toast.warning('No file selected')
      return
    }

    const file = files[0]
    const modZip = await JSZip.loadAsync(file)
    let modFolderName = '' // already includes the leading slash
    for (const [relativePath, zipEntry] of Object.entries(modZip.files)) {
      if (zipEntry.dir === true && modFolderName === '') {
        modFolderName = relativePath
        break
      }
    }

    if (modFolderName === '') {
      toast.error('Invalid file selected - no mod folder found')
      return
    }

    const rawData = await modZip.file(modFolderName + 'data.lua')?.async('string')
    if (!rawData) {
      toast.error('Invalid file selected - failed to load data.lua file')
      return
    }

    await loadItemSprites(modZip, modFolderName, ItemType.Item)
    await loadItemSprites(modZip, modFolderName, ItemType.Trinket)
    loadItems(rawData)
    finishLoadingModData()
  }

  async function displayAlert() {
    showAlertDialog(() => {
      modUploadInput.click()
    }, 'This action will overwrite all of your current item data. After clicking "Confirm", please select a zip file containing an EzItems mod folder.')
  }

  function deleteAllItems() {
    regenerateSearchableItems([])
    $ItemData = []
  }

  function deleteAllUnsetItems() {
    $ItemData = $ItemData.filter((i) => i.type !== ItemType.Unset)
    syncSearchableItems($ItemData)
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
      console.log(e)
    }

    name = ''
    desc = ''
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
