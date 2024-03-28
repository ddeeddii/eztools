<script>
  import { Button } from '@/components/ui/button'
  import { Config, DefaultConfig } from '../../data/configManager'
  import * as AlertDialog from '$lib/components/ui/alert-dialog'

  function resetSettings() {
    // HACK: `$Config = DefaultConfig` works only once?
    // ^ fixes itself after re-rendering the component
    // workaround is used instead, hacky
    $Config.AllowCustomItemOrigin = DefaultConfig.AllowCustomItemOrigin
    $Config.AllowInvalidSprite = DefaultConfig.AllowInvalidSprite
    $Config.AutocompleteMaxResults = DefaultConfig.AutocompleteMaxResults
    $Config.AutocompleteTreshold = DefaultConfig.AutocompleteTreshold
    $Config.ExportTemplate = DefaultConfig.ExportTemplate
    $Config.Minify = DefaultConfig.Minify
  }
</script>

<AlertDialog.Root>
  <AlertDialog.Trigger asChild let:builder>
    <Button builders={[builder]} variant="destructive">Reset Settings</Button>
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will reset all settings to their default values. <br
        />Enter the menu again to see changes.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action on:click={resetSettings}>Reset</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
