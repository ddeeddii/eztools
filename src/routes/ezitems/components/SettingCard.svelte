<script lang="ts">
  import * as Card from '$lib/components/ui/card'
</script>

<Card.Root class="my-4 sm:grid sm:grid-cols-2">
  <Card.Header>
    <Card.Title><slot name="title" /></Card.Title>
    <Card.Description><slot name="description" /></Card.Description>
  </Card.Header>
  <Card.Content class="flex items-center justify-center sm:justify-end sm:pt-6">
    <slot name="input" />
  </Card.Content>
</Card.Root>
