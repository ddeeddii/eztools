<script lang="ts">
  // Dialog element that mimics basic features of the
  // shad-ui dialog without being rendered conditionally

  import { cn } from '@/utils.js'
  import { Button } from '$lib/components/ui/button'
  import { X } from 'lucide-svelte'
  import { fade } from 'svelte/transition'
  export let open: boolean

  let className = ''
  export { className as class }

  let animation = ''
  let dialog: HTMLElement
  $: if (dialog && open) {
    animation = 'animOpen'
    open = true
  }

  function closeDialog() {
    animation = 'animClose'
    setTimeout(() => {
      open = false
      animation = ''
    }, 100)
  }
</script>

{#if dialog && open}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div
    transition:fade={{ duration: 150 }}
    on:click={closeDialog}
    class="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
  ></div>
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:this={dialog}
  class={cn(
    'fixed z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full',
    open ? '' : 'hidden',
    className,
    animation
  )}
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="h-full w-full">
    <div class="flex flex-col space-y-1.5 text-center sm:text-left">
      <slot name="header" />
    </div>

    <slot />

    <Button
      on:click={closeDialog}
      variant="ghost"
      size="icon"
      class="absolute right-4 top-4 h-8 w-8 rounded-sm opacity-70 ring-offset-background transition-opacity hover:bg-inherit hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      <X class="h-8 w-8" />
      <span class="sr-only">Close</span>
    </Button>
  </div>
</div>

<style lang="postcss">
  .animOpen {
    animation: zoomIn 0.15s ease-out;
  }
  @keyframes zoomIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 100;
    }
  }

  .animClose {
    animation: zoomOut 0.15s ease-out;
  }
  @keyframes zoomOut {
    from {
      transform: scale(1);
      opacity: 100;
    }
    to {
      transform: scale(0.9);
      opcaity: 0;
    }
  }
</style>
