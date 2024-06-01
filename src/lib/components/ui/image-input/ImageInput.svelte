<script lang="ts">
  import { onMount } from 'svelte'
  import { Trash } from 'lucide-svelte'
  import { Label } from '$lib/components/ui/label'
  import Button from '../button/button.svelte'

  export let files: FileList | undefined
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
  })

  function getImage() {
    if (!files) return
    if (files.length < 1) return
    inputText = files[0].name

    const reader = new FileReader()
    reader.readAsDataURL(files[0])
    reader.onload = () => {
      imgElement.setAttribute('src', reader.result as string)
      imageUrl = reader.result as string
    }
  }

  function removeImage() {
    inputElement.value = ''
    imageUrl = ''
    inputText = defaultText
    files = undefined
  }

  // remove sprite url if the user open file dialogue but doesnt select anything
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
    {#if files && files.length > 0}
      <span class="flex-shrink-0 pr-3">
        <img bind:this={imgElement} alt="Item sprite" width="32" height="32" />
      </span>
    {/if}

    <span class:text-muted-foreground={inputText === defaultText || disabled}>
      {disabled ? 'Sprite selection is disabled for this item type' : inputText}
    </span>
  </Label>

  {#if files && files.length > 0}
    <Button variant="outline" size="icon" class={'ml-1 ' + className} on:click={removeImage}>
      <Trash class="w-8" />
    </Button>
  {/if}
</div>
