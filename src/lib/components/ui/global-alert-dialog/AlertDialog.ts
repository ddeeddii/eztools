import { writable, type Writable } from 'svelte/store'

export interface AlertDialogData {
  title: string
  description: string
  actionText: string
  onConfirm: () => void
  state: boolean
  additionalButtons: ButtonData[]
}

// for internal use only
export const ShownDialog: Writable<AlertDialogData | null> = writable(null)

interface ButtonData {
  title: string
  onClick: () => void
}

// actual code to be used externally
export function showAlertDialog(
  onConfirm: () => void,
  description = '',
  actionText = 'Confirm',
  title = 'Are you absolutely sure?',
  additionalButtons: ButtonData[] = []
) {
  ShownDialog.update(() => {
    return {
      title,
      description,
      actionText,
      onConfirm,
      state: true,
      additionalButtons
    }
  })
}
