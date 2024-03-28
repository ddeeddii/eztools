<script lang="ts">
  import { Input } from '$lib/components/ui/input'
  import SettingCard from '../SettingCard.svelte'
  import { Config } from '../../data/configManager.js'
  import { clamp } from '@/utils.js'

  let displayedTreshold = $Config.AutocompleteTreshold
  $: $Config.AutocompleteTreshold = clamp(displayedTreshold, 0, 1)
</script>

<SettingCard>
  <span slot="title">Autocomplete search treshold</span>
  <span slot="description"
    >How strict the item searching algorith is.
    <br />
    Range:
    <code>0.0</code> (requiring a perfect match) -
    <code>1.0</code> (matching anything)
  </span>
  <Input
    bind:value={displayedTreshold}
    slot="input"
    type="number"
    step="0.1"
    max="1"
    min="0"
    class="max-w-48"
  />
</SettingCard>
