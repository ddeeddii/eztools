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
  import EnableDevMode from './menu/settings/EnableDevMode.svelte'

  let menuState = false
</script>

<Dialog.Root bind:open={menuState}>
  <Dialog.Trigger>
    <Button class="mt-2" variant="outline">Menu</Button>
  </Dialog.Trigger>
  <Dialog.Content class="h-5/6 max-w-[90%] p-6 xl:w-4/6">
    <Tabs.Root value="config" class="flex h-fit flex-col overflow-y-hidden">
      <Dialog.Header>
        <Dialog.Title>Menu</Dialog.Title>
        <Tabs.List class="mt-2 grid w-full grid-cols-3">
          <Tabs.Trigger value="config">Config</Tabs.Trigger>
          <Tabs.Trigger value="data">Data</Tabs.Trigger>
          <Tabs.Trigger value="info">Information</Tabs.Trigger>
        </Tabs.List>
      </Dialog.Header>
      <ScrollArea class="h-full">
        <Tabs.Content value="config">
          <div class="flex flex-col gap-4 pr-3">
            <ModTemplateSetting />
            <MinifyModSetting />
            <ThresholdSetting />
            <MaxSuggestionsSetting />
            <AllowInvalidSpriteSetting />
            <EnableDevMode />
            <div class="flex justify-center">
              <ResetSettingsButton bind:menuState />
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="data" class="overflow-y-hidden">
          <DataPage />
        </Tabs.Content>

        <Tabs.Content value="info" class="pb-2 pr-3">
          <InfoPage />
        </Tabs.Content>
      </ScrollArea>
    </Tabs.Root>
  </Dialog.Content>
</Dialog.Root>
