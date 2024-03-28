<script lang="ts">
  import { Input } from '$lib/components/ui/input'
  import SettingCard from '../SettingCard.svelte'
  import { Config } from '../../data/configManager.js'
  import { clamp } from '@/utils.js'

  let displayedThreshold = $Config.AutocompleteThreshold
  $: $Config.AutocompleteThreshold = clamp(displayedThreshold, 0, 1)
</script>

<SettingCard>
  <span slot="title">Autocomplete search threshold</span>
  <span slot="description"
    >How strict the item searching algorithm is.
    <br />
    Range:
    <code>0.0</code> (requiring a perfect match) -
    <code>1.0</code> (matching anything)
  </span>
  <Input
    bind:value={displayedThreshold}
    slot="input"
    type="number"
    step="0.1"
    max="1"
    min="0"
    class="max-w-48"
  />
</SettingCard>
