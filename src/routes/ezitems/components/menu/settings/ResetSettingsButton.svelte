<script>
  import { Button } from '@/components/ui/button'
  import { Config, DefaultConfig } from '$ezitems/data/configManager'
  import { showAlertDialog } from '@/components/ui/global-alert-dialog/AlertDialog'
  export let menuState = false

  function resetSettings() {
    menuState = false

    // HACK: `$Config = DefaultConfig` works only once?
    // ^ fixes itself after re-rendering the component
    // workaround is used instead, hacky
    $Config.AllowInvalidSprite = DefaultConfig.AllowInvalidSprite
    $Config.AutocompleteMaxResults = DefaultConfig.AutocompleteMaxResults
    $Config.AutocompleteThreshold = DefaultConfig.AutocompleteThreshold
    $Config.ExportTemplate = DefaultConfig.ExportTemplate
    $Config.Minify = DefaultConfig.Minify
    $Config.DevMode = DefaultConfig.DevMode
  }

  function showResetSettingsDialog() {
    showAlertDialog(
      resetSettings,
      'This action cannot be undone.\nThis will reset all settings to their default values.\nThe menu will close after this action.',
      'Reset'
    )
  }
</script>

<Button variant="destructive" on:click={showResetSettingsDialog}>Reset Settings</Button>
