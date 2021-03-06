# MDMP, aka MarkDown2MindmaP

## About

You can convert markdown list to mindmap.

1. First, use [simple-markdown](https://github.com/Khan/simple-markdown) to parse markdown into a tree structure.

```typescript
type MapTree = {
  title: string
  children: MapTree[]
}
```

2. Then, recursively render the nodes and their children until children is empty.

3. Finally, we have node DOM, use ref to get the DOM element position and size, use svg to connect them.

You can

1. dynamically add/remove/update nodes

2. render multiple mindmap

3. control the connection line

- curved
- direct
- rectilinear

4. control the line if animated

## Test

run

```
yarn test
```

to test the parse function and the render function.

## About parse

on branch `feature/parse`, I wrote a custom parse function to parse markdown into a tree structure. It's simple and fast, but only works with list, not like `simple-markdown`.
