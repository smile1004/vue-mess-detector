import type { SFCTemplateBlock } from '@vue/compiler-sfc'
import type { FileCheckResult, Offense } from '../../types'
import getLineNumber from '../getLineNumber'

const results: FileCheckResult[] = []

const resetResults = () => (results.length = 0)

const checkBigVif = (template: SFCTemplateBlock | null, filePath: string) => {
  if (!template) {
    return
  }

  const MAX_VIF_LINES = 10

  resetResults()

  // eslint-disable-next-line regexp/no-super-linear-backtracking, regexp/optimal-quantifier-concatenation
  const vifRegex = /<([a-z0-9-]+)[^>]*v-if[^>]*>[\s\S]*?<\/\1>|<[^>]*v-if[^>]*\/>/gi
  const vifMatches = template.content.match(vifRegex) || []

  vifMatches.forEach((vifMatch) => {
    const lineCount = vifMatch.split('\n').length

    const lineNumber = getLineNumber(template.content, vifMatch)
    if (lineCount > MAX_VIF_LINES * 2) {
      results.push({
        filePath,
        message: `line #${lineNumber} <bg_err>has a v-if with ${lineCount} lines</bg_err>`,
      })
      return
    }
    if (lineCount > MAX_VIF_LINES) {
      results.push({
        filePath,
        message: `line #${lineNumber} <bg_warn>has a v-if with ${lineCount} lines</bg_warn>`,
      })
    }
  })
}

const reportBigVif = () => {
  const offenses: Offense[] = []

  if (results.length > 0) {
    results.forEach((result) => {
      offenses.push({
        file: result.filePath,
        rule: `<text_info>rrd ~ big v-if</text_info>`,
        description: `👉 <text_warn>Big v-if can be moved out to its own component.</text_warn> See: https://vue-mess-detector.webmania.cc/rules/rrd/big-vif.html`,
        message: `${result.message} 🚨`,
      })
    })
  }
  return offenses
}

export { checkBigVif, reportBigVif }
