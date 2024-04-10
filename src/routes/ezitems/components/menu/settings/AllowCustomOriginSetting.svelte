<script lang="ts">
  import SettingCard from '$ezitems/components/SettingCard.svelte'
  import { Switch } from '$lib/components/ui/switch'
  import { Config } from '$ezitems/data/configManager.js'
</script>

<SettingCard>
  <span slot="title">Allow custom item names</span>
  <span slot="description"> If enabled, any origin item name can be used. </span>

  <div slot="input" class="flex w-48 justify-around">
    <Switch bind:checked={$Config.AllowCustomItemOrigin} id="custom-name-switch" />
  </div>
</SettingCard>
