<script lang="ts">
  import SettingCard from '$ezitems/components/SettingCard.svelte'
  import { Switch } from '$lib/components/ui/switch'
  import { Config } from '$ezitems/data/configManager.js'
  import { Input } from '$lib/components/ui/input'
  import Button from '@/components/ui/button/button.svelte'
  import { logger } from '@/logger'
  import { ItemData, SearchableItems } from '$ezitems/data/dataManager'

  function printDebug() {
    logger.debug(
      'debug data requested (itemdata, searchableitems, config)',
      $ItemData,
      $SearchableItems,
      $Config
    )
  }
</script>

<SettingCard>
  <span slot="title">Enable dev mode</span>
  <span slot="description">
    Displays extra debug information in the console and adds testing features.
    <br />
    Note that dev mode should only be used for debugging purposes.
  </span>

  <div slot="input" class="flex w-48 justify-around">
    <Switch name="dev-mode-switch" bind:checked={$Config.DevMode.Enabled} />
  </div>
</SettingCard>

{#if $Config.DevMode.Enabled}
  <SettingCard>
    <span slot="title" class="text-red-200">Amount of items to generate</span>
    <span slot="description">
      How many items to generate when clicking the "+" button in the item manager.
      <br />
      Range: <code>1</code> - <code>100</code>
    </span>

    <div slot="input" class="flex w-48 justify-around">
      <Input
        bind:value={$Config.DevMode.ItemsToGenerate}
        name="dev-mode-items-to-generate"
        slot="input"
        type="number"
        step="1"
        max="100"
        min="1"
        class="max-w-48"
      />
    </div>
  </SettingCard>

  <SettingCard>
    <span slot="title" class="text-red-200">Use dummy items</span>
    <span slot="description">
      If enabled, dummy items with random data will be generated instead of blank items.
    </span>

    <div slot="input" class="flex w-48 justify-around">
      <Switch name="dev-mode-use-dummy-items" bind:checked={$Config.DevMode.UseDummyItems} />
    </div></SettingCard
  >

  <SettingCard>
    <span slot="title" class="text-red-200">Print debug information</span>
    <span slot="description"> Prints various useful debug information to the console. </span>

    <div slot="input" class="flex w-48 justify-around">
      <Button name="dev-mode-print-debug" variant="outline" on:click={printDebug}
        >Print debug</Button
      >
    </div>
  </SettingCard>
{/if}
