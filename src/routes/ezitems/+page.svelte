<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import * as Dialog from '$lib/components/ui/dialog'

  function downloadFile() {
    console.log('hi')
  }
</script>

<div class="flex h-full justify-center pb-8 pt-8">
  <div
    class="flex h-4/5 w-11/12 flex-col items-center justify-start rounded-lg border shadow-sm lg:w-3/5"
  >
    <Button class="mt-2 p-6 text-xl ">Download</Button>
    <Button class="mt-2" variant="outline">Menu</Button>

    <div class="mt-12 flex w-full max-w-lg flex-col gap-1.5 px-4">
      <Label for="email">Mod Name</Label>
      <Input class="h-12 lg:h-10" type="email" id="email" placeholder="Internal mod name" />
    </div>

    <div class="mt-4 flex w-full max-w-lg flex-col gap-1.5 px-4">
      <Label for="email">Folder Name</Label>
      <Input class="h-12 lg:h-10" type="email" id="email" placeholder="Folder that the mod is in" />
    </div>

    <Dialog.Root>
      <Dialog.Trigger class="mt-12">
        <Button variant="outline">Manage Items</Button>
      </Dialog.Trigger>
      <Dialog.Content class="h-[90%] max-w-[90%] xl:w-3/4">
        <Dialog.Header>
          <Dialog.Title>Item Management</Dialog.Title>
        </Dialog.Header>
      </Dialog.Content>
    </Dialog.Root>
  </div>
</div>

<!-- <main data-theme="main">
  <div class="body-container mt-2">
    <div class="download-grid flex justify-evenly">
      <button
        class="btn-primary h-[4.5rem] btn btn-lg rounded-xl text-white normal-case font-normal text-xl"
        on:click={downloadFile}
      >
        Download
      </button>
    </div>

    <div class="button-array-grid button-array-grid-container mt-2">
      <label
        for="menu-modal"
        class="btn btn-accent text-white 
        h-12 btn-lg rounded-xl text-xl normal-case font-normal">Menu</label
      >
      <input type="checkbox" id="menu-modal" class="modal-toggle" />
    </div>

    <div class="input-array-grid">
      <div>
        <label for="FolderName" class="label label-text text-xl pb-2">Folder Name</label>
        <input
          type="text"
          id="FolderName"
          name="FolderName"
          class={'input input-lg rounded-xl h-[4.5rem] input-bordered text-2xl font-normal input-primary w-full'}
          placeholder="my cool mod"
        />
      </div>
      <div>
        <label for="ModName" class="label label-text text-xl pb-2">Mod Name</label>
        <input
          type="text"
          id="ModName"
          name="ModName"
          class={'input input-lg rounded-xl h-[4.5rem] input-bordered text-2xl font-normal input-primary w-full'}
          placeholder="My Cool Mod"
        />
      </div>
    </div>

    <div class="modal-button-grid grid mt-6">
      <label
        for="item-mngr-modal"
        class="btn btn-lg rounded-xl text-xl btn-secondary normal-case h-[4.5rem] font-normal"
        >Manage Items</label
      >
      <input type="checkbox" id="item-mngr-modal" class="modal-toggle" />
    </div>
  </div>
-->
<!-- <Sidebar/> -->
<!-- </main> -->
