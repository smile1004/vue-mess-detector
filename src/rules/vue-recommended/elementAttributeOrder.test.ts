import { beforeEach, describe, expect, it } from 'vitest'
import type { SFCTemplateBlock } from '@vue/compiler-sfc'


import { checkElementAttributeOrder, reportElementAttributeOrder, resetElementAttributeOrder } from './elementAttributeOrder'

describe('checkElementAttributeOrder', () => {
  beforeEach(() => {
    resetElementAttributeOrder()
  })

  it('should not report files where elements attribute order is correct', () => {
    const template = {
      content: `
                <template>
                    <div v-if="isVisible" id="app" ref="myDiv" v-on:click="handleClick"></div>
                </template>
            `,
    } as SFCTemplateBlock
    const filename = 'element-attribute-order.vue'
    checkElementAttributeOrder(template, filename)
    expect(reportElementAttributeOrder().length).toBe(0)
    expect(reportElementAttributeOrder()).toStrictEqual([])
  })

  it('should report files where elements attribute order are incorrect', () => {
    const template = {
      content: `
                <template>
                    <input v-on:input="handleInput" v-model="inputValue">
                </template>
            `,
    } as SFCTemplateBlock
    const filename = 'element-attribute-order-incorrect.vue'
    checkElementAttributeOrder(template, filename)
    expect(reportElementAttributeOrder().length).toBe(1)
    expect(reportElementAttributeOrder()).toStrictEqual([{
      file: filename,
      rule: `<text_info>vue-recommended ~ element attribute order</text_info>`,
      description: `👉 <text_warn>The attributes of elements (including components) should be ordered consistently.</text_warn> See: https://vue-mess-detector.webmania.cc/rules/vue-recommended/element-attribute-order.html`,
      message: `tag has attributes out of order <bg_warn>(input)</bg_warn> 🚨`,
    }])
  })

  it('should not report files where elements attribute order is incorrect 2', () => {
    const template = {
      content: `
                <template>
                    <div id="app" v-if="isVisible" ref="myDiv" v-on:click="handleClick"></div>
                </template>
            `,
    } as SFCTemplateBlock
    const filename = 'element-attribute-order-incorrect-2.vue'
    checkElementAttributeOrder(template, filename)
    expect(reportElementAttributeOrder().length).toBe(1)
    expect(reportElementAttributeOrder()).toStrictEqual([{
      file: filename,
      rule: `<text_info>vue-recommended ~ element attribute order</text_info>`,
      description: `👉 <text_warn>The attributes of elements (including components) should be ordered consistently.</text_warn> See: https://vue-mess-detector.webmania.cc/rules/vue-recommended/element-attribute-order.html`,
      message: `tag has attributes out of order <bg_warn>(div)</bg_warn> 🚨`,
    }])
  })
})
