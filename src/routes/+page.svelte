<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import * as Card from '$lib/components/ui/card'
  import Code from 'lucide-svelte/icons/code'
  import Bug from 'lucide-svelte/icons/bug'
</script>

<div class="flex justify-center">
  <Card.Root class="h- mt-12 w-4/5 sm:w-1/3">
    <Card.Header>
      <Card.Title class="text-center text-6xl">EzTools</Card.Title>
      <Card.Description class="text-center">
        Collection of Isaac mod tools

        <div class="mt-2 flex flex-wrap justify-evenly">
          <Button
            href="https://github.com/ddeeddii/eztools"
            target="_blank"
            class="mt-2"
            variant="ghost"
          >
            <Code class="mr-2 h-6 w-6" />
            Source code
          </Button>
          <Button
            href="https://github.com/ddeeddii/eztools/issues"
            target="_blank"
            class="mt-2"
            variant="ghost"
          >
            <Bug class="mr-2 h-6 w-6" />
            Report bugs
          </Button>
        </div>
      </Card.Description>
    </Card.Header>
    <Card.Content class="mt-6 flex flex-col justify-center gap-4">
      <a href="/ezitems" class="btn flex h-24 w-full items-center justify-center">
        <div class="flex flex-col items-center justify-center gap-1">
          <p class="btn-text text-2xl font-medium">EzItems</p>
          <p class="btn-text text-muted-foreground">Item rename mod generator</p>
        </div>
      </a>
    </Card.Content>
  </Card.Root>
</div>

<style lang="postcss">
  .btn {
    @apply skew-x-6 rounded-md border;
  }
  .btn-text {
    @apply -skew-x-6;
  }
</style>
