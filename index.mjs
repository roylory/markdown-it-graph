export default function graph_plugin (md) {
  const defaultType = 'bar'

  md.renderer.rules.fence_custom.graph = function (tokens, idx) {
    const token = tokens[idx]
    const [, type = defaultType] = token.info.trim().split(/\s+/)

    // Parse the lines into { label, value, rawBar } entries
    const lines = token.content.trim().split('\n')
    const data = lines
      .map((line) => {
        const [labelPart, valuePart] = line.split('|').map((s) => s.trim())
        if (!labelPart || !valuePart) return null

        // Try to separate visual bars from value
        const match = valuePart.match(/^([█▉▊▋▌▍▎▏ ]*)([-+]?[\d.]+.*)$/)
        let bar = ''
        let valueRaw = valuePart

        if (match && match.length >= 3) {
          bar = match[1] ? match[1].trim() : ''
          valueRaw = match[2] ? match[2].trim() : valuePart
        }
        const value = parseFloat(valueRaw.replace(/[^0-9.-]/g, '')) // Extract numeric part

        return {
          label: labelPart,
          value,
          visualBar: bar,
          raw: valueRaw
        }
      })
      .filter(Boolean)

    const payload = {
      type,
      data
    }

    return `<graph-block type="${type}" data-graph='${JSON.stringify(
      payload
    )}'></graph-block>`
  }

  // Register 'graph' as a custom fenced block
  md.block.ruler.before(
    'fence',
    'graph_block',
    function (state, startLine, endLine, silent) {
      const startPos = state.bMarks[startLine] + state.tShift[startLine]
      const maxPos = state.eMarks[startLine]
      const marker = state.src.slice(startPos, maxPos)

      if (!marker.startsWith('```graph')) return false

      if (silent) return true // quiet test mode

      let nextLine = startLine
      while (++nextLine < endLine) {
        const lineStart = state.bMarks[nextLine] + state.tShift[nextLine]
        const lineEnd = state.eMarks[nextLine]
        if (state.src.slice(lineStart, lineEnd).startsWith('```')) break
      }

      const token = state.push('fence_custom.graph', 'code', 0)
      token.info = marker.slice(3) // `graph`, or `graph line`, etc.
      token.content = state.getLines(
        startLine + 1,
        nextLine,
        state.tShift[startLine],
        true
      )
      token.map = [startLine, nextLine + 1]
      token.markup = '```'

      state.line = nextLine + 1
      return true
    }
  )
}
