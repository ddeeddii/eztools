<script lang="ts">
  import SettingCard from '../SettingCard.svelte'
  import { Switch } from '$lib/components/ui/switch'
  import { Label } from '$lib/components/ui/label/index.js'
  import { Config } from '../../data/configManager.js'
</script>

<SettingCard>
  <span slot="title">Minify mod</span>
  <span slot="description">
    Which parts of the mod are minified before exporting.
    <br />
    Minifying reduces the file size but makes it very hard to read.
  </span>

  <div slot="input" class="flex w-48 justify-around">
    <span class="flex flex-col items-center gap-1.5">
      <Label for="template-min-switch">Template</Label>
      <Switch id="template-min-switch" bind:checked={$Config.Minify.Template} />
    </span>
    <span class="flex flex-col items-center gap-1.5">
      <Label for="data-min-switch">Data</Label>
      <Switch id="data-min-switch" bind:checked={$Config.Minify.Data} />
    </span>
  </div>
</SettingCard>
