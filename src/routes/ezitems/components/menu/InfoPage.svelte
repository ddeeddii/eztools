<script lang="ts">
  import * as Accordion from '$lib/components/ui/accordion/index.js'
  import Button from '@/components/ui/button/button.svelte'
  import * as Card from '@/components/ui/card'
  import Bug from 'lucide-svelte/icons/bug'
  import Code from 'lucide-svelte/icons/code'
  import InfoAccordion from './InfoAccordion.svelte'

  import { getParsedFaq } from './InfoPage.js'

  const faqData = getParsedFaq()
</script>

<div class="flex justify-around pb-4">
  <Button
    href="https://github.com/ddeeddii/eztools/issues"
    target="_blank"
    class="mt-2"
    variant="ghost"
  >
    <Bug class="mr-2 h-6 w-6" />
    Report bugs
  </Button>
  <Button href="https://github.com/ddeeddii/eztools" target="_blank" class="mt-2" variant="ghost">
    <Code class="mr-2 h-6 w-6" />
    Source code
  </Button>
</div>

<div class="flex flex-col gap-4">
  <span class="flex justify-center text-2xl font-semibold">Frequently Asked Questions</span>

  {#each faqData as section}
    <Card.Root>
      <Card.Header class="flex items-center">
        <Card.Title class="text-xl">{section.title}</Card.Title>
      </Card.Header>
      <Card.Content>
        <Accordion.Root>
          {#each section.content as article}
            <InfoAccordion source={article} id={article.title} />
          {/each}
        </Accordion.Root>
      </Card.Content>
    </Card.Root>
  {/each}
</div>
