/** @typedef {import('./index')} */

export default function graph_plugin (md) {
  const defaultType = 'bar'

  // Add renderer override for "graph" fences
  const originalFence = md.renderer.rules.fence || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.fence = function (tokens, idx, options, env, self) {
    const token = tokens[idx]
    const info = token.info.trim()
    const [typeKeyword, graphType = defaultType] = info.split(/\s+/)

    if (typeKeyword !== 'graph') {
      return originalFence(tokens, idx, options, env, self)
    }

    const lines = token.content.trim().split('\n')
    const data = lines
      .map((line) => {
        const [labelPart, valuePart] = line.split('|').map((s) => s.trim())
        if (!labelPart || !valuePart) return null

        const match = valuePart.match(/^([█▉▊▋▌▍▎▏ ]*)([-+]?[\d.]+.*)$/)
        let valueRaw = valuePart

        if (match && match.length >= 3) {
          valueRaw = match[2] ? match[2].trim() : valuePart
        }

        const value = parseFloat(valueRaw.replace(/[^0-9.-]/g, ''))

        return {
          label: labelPart,
          value
        }
      })
      .filter(Boolean)

    const payload = {
      type: graphType,
      data
    }

    return `<graph-block type="${graphType}" data-graph='${JSON.stringify(payload)}'></graph-block>`
  }

  // Add custom block rule to detect ```graph blocks
  md.block.ruler.before('fence', 'graph_block', function (state, startLine, endLine, silent) {
    const startPos = state.bMarks[startLine] + state.tShift[startLine]
    const maxPos = state.eMarks[startLine]
    const marker = state.src.slice(startPos, maxPos).trim()

    if (!marker.startsWith('```graph')) return false
    if (silent) return true

    let nextLine = startLine
    while (++nextLine < endLine) {
      const lineStart = state.bMarks[nextLine] + state.tShift[nextLine]
      const lineEnd = state.eMarks[nextLine]
      const lineText = state.src.slice(lineStart, lineEnd).trim()
      if (lineText.startsWith('```')) break
    }

    const token = state.push('fence', 'code', 0)
    token.info = marker.slice(3).trim() // e.g., "graph bar"
    token.content = state.getLines(startLine + 1, nextLine, state.tShift[startLine], true)
    token.map = [startLine, nextLine + 1]
    token.markup = '```'

    state.line = nextLine + 1
    return true
  })
}
