<script lang="ts">
  import { Button } from '$lib/components/ui/button'
  import * as Card from '$lib/components/ui/card'
</script>

<div class="flex justify-center pt-32">
  <Card.Root class="w-80">
    <Card.Header>
      <Card.Title class="text-center text-3xl">EzTools</Card.Title>
      <Card.Description class="text-center">Development Preview</Card.Description>
    </Card.Header>
    <Card.Content class="flex justify-center">
      <Button href="/ezitems" variant="outline">EzItems</Button>
    </Card.Content>
  </Card.Root>
</div>
