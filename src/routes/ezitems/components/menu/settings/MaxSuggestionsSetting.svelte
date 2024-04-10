<script lang="ts">
  import { Input } from '$lib/components/ui/input'
  import SettingCard from '$ezitems/components/SettingCard.svelte'
  import { Config } from '$ezitems/data/configManager.js'
  import { clamp } from '@/utils.js'

  let displayedMaxResults = $Config.AutocompleteMaxResults
  $: $Config.AutocompleteMaxResults = clamp(Math.round(displayedMaxResults), 1, 20)
</script>

<SettingCard>
  <span slot="title">Autocomplete max suggestions shown</span>
  <span slot="description"
    >Amount of suggestions that can be shown at once in the autocomplete.
    <br />Range: <code>1</code> - <code>20</code></span
  >
  <Input
    bind:value={displayedMaxResults}
    slot="input"
    type="number"
    step="1"
    max="20"
    min="1"
    class="max-w-48"
  />
</SettingCard>
