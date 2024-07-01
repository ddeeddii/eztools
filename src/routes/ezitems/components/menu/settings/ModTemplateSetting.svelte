<script lang="ts">
  import * as Select from '$lib/components/ui/select'
  import SettingCard from '$ezitems/components/SettingCard.svelte'
  import { Config, TemplateType } from '$ezitems/data/configManager'

  const templateDescription = {
    0: 'Default template for exporting mods',
    1: 'Supercharged template with extra features, requires REPENTOGON installed'
  }

  const templateOptionString = {
    0: 'Vanilla',
    1: 'REPENTOGON'
  }

  let selected = {
    value: $Config.ExportTemplate,
    label: templateOptionString[$Config.ExportTemplate],
    disabled: false
  }
  function onTemplateChange(value?: { value: TemplateType; label?: string; disabled?: boolean }) {
    if (!value) {
      return
    }

    $Config.ExportTemplate = value.value
  }
</script>

<SettingCard>
  <span slot="title">Mod template</span>
  <span slot="description"
    >The template used for exporting the mod.
    <br />
    <span class="font-semibold">{templateDescription[$Config.ExportTemplate]}</span>
  </span>
  <Select.Root slot="input" onSelectedChange={onTemplateChange} bind:selected>
    <Select.Trigger class="max-w-48">
      <Select.Value placeholder="vanilla" />
    </Select.Trigger>
    <Select.Content>
      <Select.Item value="0">Vanilla</Select.Item>
      <Select.Item value="1">REPENTOGON</Select.Item>
    </Select.Content>
  </Select.Root>
</SettingCard>
