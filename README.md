# markdown-it-graph

> A `markdown-it` plugin that adds support for `graph` code blocks to represent charts using human-friendly plain text.

With `markdown-it-graph`, you can write bar, line, pie, and dot (scatter) charts directly inside Markdown like this:

````markdown
```graph bar
Jan | █████ 5
Feb | █████████ 8
Mar | █████████████ 12
```
````
The square bar characters (e.g. `█████`) are optional and purely visual. The actual chart uses the numeric values.

And this will be transformed into:

```html
<graph-block type="bar" data-graph='{"type":"bar","data":[{"label":"Jan","value":5},...]}'>
</graph-block>
```

---

## ✨ Features

- Custom syntax that feels natural inside Markdown
- Supports `bar`, `line`, `pie`, and `dot` chart types
- Converts data into structured JSON for rendering
- Pairs perfectly with React (or any framework) for dynamic charts

---

## 📦 Installation

```bash
npm install markdown-it-graph
```

---

## 🚀 Usage

### Basic setup

```js
import MarkdownIt from 'markdown-it'
import markdownItGraph from 'markdown-it-graph'

const md = new MarkdownIt()
md.use(markdownItGraph)

const html = md.render(\`
\`\`\`graph line
Mon | 2
Tue | 5
Wed | 8
\`\`\`
\`)
```

---

## 📐 Syntax

Each graph block follows this format:

````markdown
```graph [type]
Label | Value
```
````

- `type` is optional. Defaults to `bar`.
- Supported types: `bar`, `line`, `pie`, `dot`
- Each line is a label-value pair, separated by `|`

---

## 🎨 Rendering the Chart

This plugin only **injects `<graph-block>` elements** with structured data.

You render them however you like! Here's an example using [react-chartjs-2](https://github.com/reactchartjs/react-chartjs-2):

```tsx
import { Bar } from 'react-chartjs-2'

<GraphBlock type="bar" data={[{ label: 'Jan', value: 5 }, { label: 'Feb', value: 8 }]} />
```

You can mount `<graph-block>` elements dynamically using `ReactDOM.createRoot`.

---

## 🧪 Example Input

````markdown
```graph pie
Chrome  | 65
Safari  | 20
Firefox | 10
Edge    | 5
```
````

---

## 📄 License

MIT

---

## 💡 Inspiration

This plugin was created to fill a gap between readable Markdown and easy data visualization — think of it like Markdown tables, but for charts.
