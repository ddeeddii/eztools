import faq from '$lib/assets/ezitems/faq.md?raw'
import { marked } from 'marked'

export function getParsedFaq(){
  const tokens = marked.lexer(faq)
  const sections = getSections(tokens)
  const parsedSections = parseSections(sections)

  return parsedSections
}

export function getSections(tokens: Array<marked.Token>): Array<Array<marked.Token>> {
  const sections: Array<Array<marked.Token>> = []
  
  let lastSectionStartIndex = 0
  for (const [index, token] of tokens.entries()) {
    if ((token.type === 'heading' && token.depth === 1 && index !== 0) || index === tokens.length - 1) {
      let adjustedIndex = index
      if (index === tokens.length - 1) {
        adjustedIndex = index + 1
      } // this is because array.slice() doesn't include the last element
      
      const article = tokens.slice(lastSectionStartIndex, adjustedIndex)
      sections.push(article)
      lastSectionStartIndex = index
    }
  }

  return sections
}

export interface Article {
  title: string,
  content: Array<marked.Token>
}

export interface Section {
  title: string,
  content: Array<Article>
}

export function parseSections(sections: Array<Array<marked.Token>>) {
  const parsedSections: Array<Section> = []

  for (const section of sections) {
    const heading = section[0] as marked.Tokens.Heading
    const title = heading.text

    const content: Array<Article> = []
 
    const currentSection = section.slice(1)
    
    let currentArticle: Article = {
      title: '',
      content: []
    }

    for (const [index, token] of currentSection.entries()) {
      if (token.type === 'heading' || index === currentSection.length - 1)  {
        const heading = token as marked.Tokens.Heading
        const title = heading.text

        if (index === 0) { // start collecting
          currentArticle.title = title
          continue
        }

        if (index === currentSection.length - 1) {
          if (token.type !== 'space') {
            currentArticle.content.push(token)
          }

          content.push(currentArticle)
          continue
        } // push

        // push
        content.push(currentArticle)

        // start collecting
        currentArticle = {
          title: title,
          content: []
        }

      } else if (token.type !== 'space') {
        currentArticle.content.push(token)
      }
    }

    if (currentArticle.content.length === 0) {
      continue
    }

    parsedSections.push({
      title,
      content
    })
  }

  return parsedSections
}
