<script lang="ts">
  import SettingCard from '$ezitems/components/SettingCard.svelte'
  import { Switch } from '$lib/components/ui/switch'
  import { Label } from '$lib/components/ui/label/index.js'
  import { Config } from '$ezitems/data/configManager.js'
</script>

<SettingCard>
  <span slot="title">Minify mod template</span>
  <span slot="description">
    Minifying reduces the template file size (by about 45%) but makes it very hard to read.
  </span>

  <div slot="input" class="flex w-48 justify-around">
    <Switch name="template-minify-switch" bind:checked={$Config.Minify.Template} />
  </div>
</SettingCard>
