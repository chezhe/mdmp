import { parseBySimpleMarkdown } from './parser'

test('parser', () => {
  const input1 = `- list`
  expect(parseBySimpleMarkdown(input1)).toEqual([
    { title: 'list', children: [] },
  ])

  const input2 = `- list
    - item1
    - item2
  `
  expect(parseBySimpleMarkdown(input2)).toEqual([
    {
      title: 'list',
      children: [
        { title: 'item1', children: [] },
        { title: 'item2', children: [] },
      ],
    },
  ])

  const input3 = `- list
    - item1

    - item2
  `
  expect(parseBySimpleMarkdown(input3)).toEqual([
    {
      title: 'list',
      children: [
        { title: 'item1', children: [] },
        { title: 'item2', children: [] },
      ],
    },
  ])

  const input4 = `- list
    - item1
  # heading  
    - item2
  `
  expect(parseBySimpleMarkdown(input4)).toEqual([
    {
      title: 'list',
      children: [
        { title: 'item1# heading', children: [] },
        { title: 'item2', children: [] },
      ],
    },
  ])

  const input5 = `- list1
    - item1 
    - item2
- list2
    - item1
      - subitem1
      - subitem2
  `
  expect(parseBySimpleMarkdown(input5)).toEqual([
    {
      title: 'list1',
      children: [
        { title: 'item1', children: [] },
        { title: 'item2', children: [] },
      ],
    },
    {
      title: 'list2',
      children: [
        {
          title: 'item1',
          children: [
            { title: 'subitem1', children: [] },
            { title: 'subitem2', children: [] },
          ],
        },
      ],
    },
  ])

  const input6 = `
  - list1
    - item1 
    - item2
  - list2
    - item1
      - subitem1
      - subitem2
  `
  expect(parseBySimpleMarkdown(input6)).toEqual([
    {
      title: 'list1',
      children: [
        { title: 'item1', children: [] },
        { title: 'item2', children: [{ title: 'list2', children: [] }] },
        {
          title: 'item1',
          children: [
            { title: 'subitem1', children: [] },
            { title: 'subitem2', children: [] },
          ],
        },
      ],
    },
  ])
})
