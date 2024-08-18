import { describe, expect, test } from 'vitest'
import { getSections, parseSections } from './InfoPage.js'
import { marked } from 'marked'

describe('getSections', () => {
  test('sections are separated by heading of depth 1', () => {
    const tokens = [
      {
        type: 'heading',
        raw: '# main heading',
        depth: 1,
        text: 'main heading',
        tokens: []
      },
      { type: 'space', raw: '\n' },
      {
        type: 'heading',
        raw: '## article heading',
        depth: 2,
        text: 'article heading',
        tokens: []
      },
      {
        type: 'space',
        raw: '\n'
      },
      {
        type: 'space',
        raw: '\n'
      },
      {
        type: 'paragraph',
        raw: 'article text',
        text: 'article text',
        tokens: []
      },
      {
        type: 'heading',
        raw: '# main heading 2',
        depth: 1,
        text: 'main heading 2',
        tokens: []
      },
      {
        type: 'heading',
        raw: '## article heading 2',
        depth: 2,
        text: 'article heading 2',
        tokens: []
      },
      {
        type: 'space',
        raw: '\n'
      },
      {
        type: 'space',
        raw: '\n'
      },
      {
        type: 'paragraph 2',
        raw: 'article text 2',
        text: 'article text 2',
        tokens: []
      }
    ]

    const sections = getSections(tokens as Array<marked.Token>)

    expect(sections).toStrictEqual([
      [
        {
          type: 'heading',
          raw: '# main heading',
          depth: 1,
          text: 'main heading',
          tokens: []
        },
        { type: 'space', raw: '\n' },
        {
          type: 'heading',
          raw: '## article heading',
          depth: 2,
          text: 'article heading',
          tokens: []
        },
        { type: 'space', raw: '\n' },
        { type: 'space', raw: '\n' },
        {
          type: 'paragraph',
          raw: 'article text',
          text: 'article text',
          tokens: []
        }
      ],
      [
        {
          type: 'heading',
          raw: '# main heading 2',
          depth: 1,
          text: 'main heading 2',
          tokens: []
        },
        {
          type: 'heading',
          raw: '## article heading 2',
          depth: 2,
          text: 'article heading 2',
          tokens: []
        },
        { type: 'space', raw: '\n' },
        { type: 'space', raw: '\n' },
        {
          type: 'paragraph 2',
          raw: 'article text 2',
          text: 'article text 2',
          tokens: []
        }
      ]
    ])
  })
})

describe('parseSections', () => {
  test('leading and trailing spaces are trimmed', () => {
    const tokens = [
      { type: 'space', raw: '\n' },
      {
        type: 'heading',
        raw: '# main heading',
        depth: 1,
        text: 'main heading',
        tokens: []
      },
      {
        type: 'heading',
        raw: '## article heading',
        depth: 2,
        text: 'article heading',
        tokens: []
      },
      {
        type: 'paragraph',
        raw: 'article text',
        text: 'article text',
        tokens: []
      },
      { type: 'space', raw: '\n' }
    ]

    const sections = getSections(tokens as Array<marked.Token>)
    const parsedSections = parseSections(sections)

    expect(parsedSections).toStrictEqual([
      {
        title: 'main heading',
        content: [
          {
            title: 'article heading',
            content: [{ type: 'paragraph', raw: 'article text', text: 'article text', tokens: [] }]
          }
        ]
      }
    ])
  })

  test('complex sections ae separated correctly', () => {
    const tokens = [
      {
        type: 'space',
        raw: '\n'
      },
      {
        type: 'heading',
        raw: '# main heading',
        depth: 1,
        text: 'main heading',
        tokens: []
      },
      { type: 'space', raw: '\n' },
      {
        type: 'heading',
        raw: '## article heading',
        depth: 2,
        text: 'article heading',
        tokens: []
      },
      {
        type: 'space',
        raw: '\n'
      },
      {
        type: 'space',
        raw: '\n'
      },
      {
        type: 'paragraph',
        raw: 'article text',
        text: 'article text',
        tokens: []
      },
      {
        type: 'heading',
        raw: '# main heading 2',
        depth: 1,
        text: 'main heading 2',
        tokens: []
      },
      {
        type: 'heading',
        raw: '## article heading 2',
        depth: 2,
        text: 'article heading 2',
        tokens: []
      },
      {
        type: 'space',
        raw: '\n'
      },
      {
        type: 'paragraph 2.1',
        raw: 'article text 2.1',
        text: 'article text 2.1',
        tokens: []
      },
      {
        type: 'paragraph 2.1.1',
        raw: 'article text 2.1.1',
        text: 'article text 2.1.1',
        tokens: []
      },
      {
        type: 'space',
        raw: '\n'
      },
      {
        type: 'heading',
        raw: '## article heading 2.2',
        depth: 2,
        text: 'article heading 2.2',
        tokens: []
      },
      {
        type: 'space',
        raw: '\n'
      },
      {
        type: 'paragraph 2.2',
        raw: 'article text 2.2',
        text: 'article text 2.2',
        tokens: []
      },
      {
        type: 'heading',
        raw: '# main heading 3',
        depth: 1,
        text: 'main heading 3',
        tokens: []
      },
      {
        type: 'space',
        raw: '\n'
      },
      {
        type: 'heading',
        raw: '## article heading 3',
        depth: 2,
        text: 'article heading 3',
        tokens: []
      },
      {
        type: 'space',
        raw: '\n'
      },
      {
        type: 'paragraph 3',
        raw: 'article text 3',
        text: 'article text 3',
        tokens: []
      },
      {
        type: 'space',
        raw: '\n'
      }
    ]

    const sections = getSections(tokens as Array<marked.Token>)
    const parsedSections = parseSections(sections)

    expect(parsedSections).toStrictEqual([
      {
        title: 'main heading',
        content: [
          { title: '', content: [] },
          {
            title: 'article heading',
            content: [{ type: 'paragraph', raw: 'article text', text: 'article text', tokens: [] }]
          }
        ]
      },
      {
        title: 'main heading 2',
        content: [
          {
            title: 'article heading 2',
            content: [
              {
                type: 'paragraph 2.1',
                raw: 'article text 2.1',
                text: 'article text 2.1',
                tokens: []
              },
              {
                type: 'paragraph 2.1.1',
                raw: 'article text 2.1.1',
                text: 'article text 2.1.1',
                tokens: []
              }
            ]
          },
          {
            title: 'article heading 2.2',
            content: [
              {
                type: 'paragraph 2.2',
                raw: 'article text 2.2',
                text: 'article text 2.2',
                tokens: []
              }
            ]
          }
        ]
      },
      {
        title: 'main heading 3',
        content: [
          { title: '', content: [] },
          {
            title: 'article heading 3',
            content: [
              { type: 'paragraph 3', raw: 'article text 3', text: 'article text 3', tokens: [] }
            ]
          }
        ]
      }
    ])
  })
})
