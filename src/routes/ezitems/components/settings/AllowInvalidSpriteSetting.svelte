<script lang="ts">
  import SettingCard from '../SettingCard.svelte'
  import { Switch } from '$lib/components/ui/switch'
  import { Config } from '../../data/configManager.js'
</script>

<SettingCard>
  <span slot="title">Allow invalid item sprites</span>
  <span slot="description">
    Disables sprite validation when selecting a sprite, allowing any sprite to be used.
  </span>

  <div slot="input" class="flex w-48 justify-around">
    <Switch bind:checked={$Config.AllowInvalidSprite} id="custom-name-switch" />
  </div>
</SettingCard>
