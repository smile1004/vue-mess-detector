import type { SFCScriptBlock } from '@vue/compiler-sfc'

import type { FileCheckResult, Offense } from '../../types'

const results: FileCheckResult[] = []

const checkPlainScript = (script: SFCScriptBlock | null, filePath: string) => {
  if (!script || script.setup) {
    return
  }
  results.push({ filePath, message: `<bg_warn>Plain <script> block</bg_warn> found` })
}

const reportPlainScript = () => {
  const offenses: Offense[] = []

  if (results.length > 0) {
    results.forEach((result) => {
      offenses.push({
        file: result.filePath,
        rule: `<text_info>rrd ~ Plain <script> blocks</text_info>`,
        description: `👉 <text_warn> Consider using <script setup> to leverage the new SFC <script> syntax.</text_warn> See: https://vue-mess-detector.webmania.cc/rules/rrd/plain-script.html`,
        message: `${result.message} 🚨`,
      })
    })
  }
  return offenses
}

const resetPlainScript = () => (results.length = 0)

export { checkPlainScript, reportPlainScript, resetPlainScript }
