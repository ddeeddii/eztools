<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog'
  import { ShownDialog, type AlertDialogData } from './AlertDialog'

  // hacky temporary state that will never be shown
  let dialog: AlertDialogData = {
    title: '',
    description: '',
    actionText: '',
    onConfirm: () => {},
    state: false
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
      <AlertDialog.Description>
        {dialog.description}
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action on:click={dialog.onConfirm}>{dialog.actionText}</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
