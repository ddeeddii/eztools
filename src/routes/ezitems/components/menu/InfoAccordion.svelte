<script lang="ts">
  import * as Accordion from '$lib/components/ui/accordion/index.js'
  import SvelteMarkdown from 'svelte-markdown'
  import type { Article } from './InfoPage.js'

  export let source: Article
  export let id: string
</script>

<Accordion.Item value={`item-${id}`}>
  <Accordion.Trigger>{source.title}</Accordion.Trigger>
  <Accordion.Content>
    <div class="highlight-links gap-2 whitespace-pre-line pt-1">
      <SvelteMarkdown source={source.content} />
    </div>
  </Accordion.Content>
</Accordion.Item>
