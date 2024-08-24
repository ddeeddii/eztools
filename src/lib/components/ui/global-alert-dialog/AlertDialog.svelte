<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog'
  import { ShownDialog, type AlertDialogData } from './AlertDialog'

  // hacky temporary state that will never be shown
  let dialog: AlertDialogData = {
    title: '',
    description: '',
    actionText: '',
    onConfirm: () => {},
    state: false,
    additionalButtons: []
  }

  ShownDialog.subscribe((data) => {
    if (data === null) {
      return
    }

    dialog = data
  })

  $: if (dialog.state === false) {
    ShownDialog.set(null)
  }
</script>

<AlertDialog.Root bind:open={dialog.state}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{dialog.title}</AlertDialog.Title>
      <AlertDialog.Description class="whitespace-pre-line">
        {dialog.description}
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action on:click={dialog.onConfirm}>{dialog.actionText}</AlertDialog.Action>
      {#if dialog.additionalButtons.length > 0}
        {#each dialog.additionalButtons as button}
          <AlertDialog.Action on:click={button.onClick}>
            {button.title}
          </AlertDialog.Action>
        {/each}
      {/if}
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
