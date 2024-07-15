import { describe, expect, it, vi } from 'vitest'
import { SFCTemplateBlock } from '@vue/compiler-sfc'
import { BG_ERR, BG_RESET, BG_WARN } from '../asceeCodes'
import { checkTemplateSimpleExpression, reportTemplateSimpleExpression } from './templateSimpleExpression'

const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})

describe('checkTemplateSimpleExpression', () => {
  it('should not report files where template expression is simple', () => {
    const script = {
      content: `<template>
      {{ normalizedFullName }}
      {{ chantGauranga }}
    </template>`,
    } as SFCTemplateBlock
    const fileName = 'simple-expression.vue'
    checkTemplateSimpleExpression(script, fileName)
    expect(reportTemplateSimpleExpression()).toBe(0)
    expect(mockConsoleLog).not.toHaveBeenCalled()
  })

  it('should report files where template expression is not simple', () => {
    const script = {
      content: `<template>
      {{
        fullName.split(' ').map((word) => {
            return word[0].toUpperCase() + word.slice(1)
        }).join(' ')
      }}
    </template>`,
    } as SFCTemplateBlock
    const fileName = 'not-simple-expression.vue'
    checkTemplateSimpleExpression(script, fileName)
    expect(reportTemplateSimpleExpression()).toBe(1)
    expect(mockConsoleLog).toHaveBeenCalled()
    expect(mockConsoleLog).toHaveBeenLastCalledWith(
      `- ${fileName}#5 ${BG_WARN}fullName.split(' ').map((word) => {${BG_RESET} 🚨`
    )
  })
})
