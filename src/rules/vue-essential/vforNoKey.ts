import type { SFCTemplateBlock } from '@vue/compiler-sfc'
import { caseInsensitive, charNotIn, createRegExp, global, oneOrMore } from 'magic-regexp'
import { BG_RESET, BG_WARN, TEXT_INFO, TEXT_RESET, TEXT_WARN } from '../asceeCodes'
import type { FileCheckResult, Offense } from '../../types'

const results: FileCheckResult[] = []

const checkVforNoKey = (template: SFCTemplateBlock | null, filePath: string) => {
  if (!template) {
    return
  }
  const regex = createRegExp('<', oneOrMore(charNotIn('>')), ' v-for', oneOrMore(charNotIn('>')), '>', [
    global,
    caseInsensitive,
  ])
  const matches = template.content.match(regex)

  if (matches?.length) {
    const hasKey = matches.some(match => match.includes(':key'))
    if (!hasKey) {
      results.push({ filePath, message: `v-for used ${BG_WARN}without a key${BG_RESET}` })
    }
  }
}

const reportVforNoKey = () => {
  const offenses: Offense[] = []

  if (results.length > 0) {
    results.forEach((result) => {
      offenses.push({
        file: result.filePath,
        rule: `${TEXT_INFO}vue-essential ~ v-for has no key${TEXT_RESET}`,
        description: `👉 ${TEXT_WARN}Add a \`:key\` property to all v-for.${TEXT_RESET} See: https://vuejs.org/style-guide/rules-essential.html#use-keyed-v-for`,
        message: `${result.message} 🚨`,
      })
    })
  }
  return offenses
}

const resetReportVForNoKey = () => (results.length = 0)

export { checkVforNoKey, reportVforNoKey, resetReportVForNoKey }
