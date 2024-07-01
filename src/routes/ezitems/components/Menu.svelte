<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import * as Dialog from '$lib/components/ui/dialog/index.js'
  import * as Tabs from '$lib/components/ui/tabs/index.js'
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js'

  import ModTemplateSetting from './menu/settings/ModTemplateSetting.svelte'
  import ThresholdSetting from './menu/settings/ThresholdSetting.svelte'
  import AllowInvalidSpriteSetting from './menu/settings/AllowInvalidSpriteSetting.svelte'
  import MaxSuggestionsSetting from './menu/settings/MaxSuggestionsSetting.svelte'
  import MinifyModSetting from './menu/settings/MinifyModSetting.svelte'
  import ResetSettingsButton from './menu/settings/ResetSettingsButton.svelte'
  import InfoPage from './menu/InfoPage.svelte'
  import DataPage from './menu/DataPage.svelte'

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
    <Tabs.Root value="config" class="h-full">
      <Tabs.List class="mt-2 grid w-full grid-cols-3">
        <Tabs.Trigger value="config">Config</Tabs.Trigger>
        <Tabs.Trigger value="data">Data</Tabs.Trigger>
        <Tabs.Trigger value="info">Information</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="config">
        <ScrollArea class="h-[70vh] sm:pr-4">
          <div class="flex flex-col gap-4 pb-10 sm:pb-2">
            <ModTemplateSetting />
            <MinifyModSetting />
            <ThresholdSetting />
            <MaxSuggestionsSetting />
            <AllowInvalidSpriteSetting />
            <div class="flex justify-center">
              <ResetSettingsButton bind:menuState />
            </div>
          </div>
        </ScrollArea>
      </Tabs.Content>
      <Tabs.Content value="data" class="h-full">
        <ScrollArea class="h-[70vh]">
          <DataPage />
        </ScrollArea>
      </Tabs.Content>
      <Tabs.Content value="info">
        <ScrollArea class="h-[69vh]">
          <InfoPage />
        </ScrollArea>
      </Tabs.Content>
    </Tabs.Root>
  </Dialog.Content>
</Dialog.Root>
