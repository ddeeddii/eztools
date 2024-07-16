<script lang="ts">
  import { onMount } from 'svelte'
  import { Trash } from 'lucide-svelte'
  import { Label } from '$lib/components/ui/label'
  import Button from '../button/button.svelte'
  import { toast } from 'svelte-sonner'
  import { Config } from '$ezitems/data/configManager.js'

  let files: FileList | undefined
  export let file: File | undefined
  export let imageUrl = ''
  export let defaultText = 'No image selected'
  export let id = ''
  export let disabled = false

  let className = ''
  export { className as class }

  let inputText = defaultText
  let inputElement: HTMLInputElement
  let imgElement: HTMLElement

  onMount(() => {
    getImage()
    readSavedImage()
  })

  function readSavedImage() {
    if (!file) return
    inputText = file.name

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      imgElement.setAttribute('src', reader.result as string)
      imageUrl = reader.result as string
    }
  }

  async function getImage() {
    if (!files) return
    if (files.length < 1) return
    file = files[0]

    if ($Config.AllowInvalidSprite === false) {
      if (file.type !== 'image/png') {
        toast.error('Only PNG images (with transparent backgrounds) are supported')
        removeImage()
        return
      }

      const img = new Image()
      img.src = URL.createObjectURL(file)
      await img.decode()

      if (img.width !== 32 || img.height !== 32) {
        toast.error('Only 32x32 images are supported')
        removeImage()
        return
      }
    }

    readSavedImage()
  }

  export let removeImage: () => void = () => {
    if (inputElement) {
      inputElement.value = ''
    }

    imageUrl = ''
    inputText = defaultText
    files = undefined
    file = undefined
  }

  // remove sprite url if the user open file dialogue but doesn't select anything
  $: if (files && files.length === 0) {
    imageUrl = ''
    inputText = defaultText
  }
</script>

{#if !disabled}
  <input
    {id}
    type="file"
    accept="image/png"
    bind:this={inputElement}
    bind:files
    on:change={getImage}
    hidden
  />
{/if}

<div class={`flex ${disabled ? 'opacity-50' : ''}`}>
  <Label
    for={id}
    class={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} flex h-10 w-full items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-md border border-input bg-background px-3 py-2 text-sm font-normal ${className}`}
  >
    {#if file}
      <span class="flex-shrink-0 pr-3">
        <img bind:this={imgElement} alt="Item sprite" width="32" height="32" />
      </span>
    {/if}

    <span class:text-muted-foreground={inputText === defaultText || disabled}>
      {disabled ? 'Sprite selection is disabled' : inputText}
    </span>
  </Label>

  {#if file}
    <Button variant="outline" size="icon" class={'ml-1 ' + className} on:click={removeImage}>
      <Trash class="w-8" />
    </Button>
  {/if}
</div>
