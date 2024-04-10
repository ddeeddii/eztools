<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import * as Dialog from '$lib/components/ui/dialog/index.js'
  import * as Tabs from '$lib/components/ui/tabs/index.js'
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js'

  import ModTemplateSetting from './settings/ModTemplateSetting.svelte'
  import ThresholdSetting from './settings/ThresholdSetting.svelte'
  import AllowInvalidSpriteSetting from './settings/AllowInvalidSpriteSetting.svelte'
  import AllowCustomOriginSetting from './settings/AllowCustomOriginSetting.svelte'
  import MaxSuggestionsSetting from './settings/MaxSuggestionsSetting.svelte'
  import MinifyModSetting from './settings/MinifyModSetting.svelte'
  import ResetSettingsButton from './settings/ResetSettingsButton.svelte'

  let menuState = false
</script>

<Dialog.Root bind:open={menuState}>
  <Dialog.Trigger>
    <Button class="mt-2" variant="outline">Menu</Button>
  </Dialog.Trigger>
  <Dialog.Content class="h-5/6 max-w-[90%] overflow-hidden p-6 xl:w-4/6">
    <Dialog.Header>
      <Dialog.Title>Menu</Dialog.Title>
    </Dialog.Header>
    <Tabs.Root value="config">
      <Tabs.List class="mt-2 grid w-full grid-cols-3">
        <Tabs.Trigger value="config">Config</Tabs.Trigger>
        <Tabs.Trigger value="data">Data</Tabs.Trigger>
        <Tabs.Trigger value="info">Information</Tabs.Trigger>
      </Tabs.List>
      <ScrollArea class="h-[70vh] sm:pr-4">
        <Tabs.Content value="config">
          <ModTemplateSetting />
          <MinifyModSetting />
          <ThresholdSetting />
          <MaxSuggestionsSetting />
          <AllowCustomOriginSetting />
          <AllowInvalidSpriteSetting />
          <div class="flex justify-center">
            <ResetSettingsButton bind:menuState />
          </div>
        </Tabs.Content>
        <Tabs.Content value="data">Lorem Ipsum</Tabs.Content>
        <Tabs.Content value="info">Lorem Ipsum</Tabs.Content>
      </ScrollArea>
    </Tabs.Root>
  </Dialog.Content>
</Dialog.Root>
