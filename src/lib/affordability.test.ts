import { describe, it, expect } from 'vitest'
import { calculateAffordability, AffordabilityStatus } from './affordability'

describe('calculateAffordability', () => {
  describe('NOT_YET — positive surplus, savings insufficient', () => {
    it('returns NOT_YET when savings < upfront', () => {
      const r = calculateAffordability({ takeHome: 3000, savings: 1000, monthlyTotal: 2000, upfrontTotal: 5000 })
      expect(r.status).toBe(AffordabilityStatus.NOT_YET)
    })

    it('calculates surplus as takeHome minus monthlyTotal', () => {
      const r = calculateAffordability({ takeHome: 3000, savings: 1000, monthlyTotal: 2000, upfrontTotal: 5000 })
      expect(r.surplus).toBe(1000)
    })

    it('calculates monthsToMoveIn as ceiling of (upfront - savings) / surplus', () => {
      // (5000 - 1000) / 1000 = 4.0 → ceil = 4
      const r = calculateAffordability({ takeHome: 3000, savings: 1000, monthlyTotal: 2000, upfrontTotal: 5000 })
      expect(r.monthsToMoveIn).toBe(4)
    })

    it('applies ceiling when months is not a whole number', () => {
      // (5000 - 1000) / 1500 = 2.67 → ceil = 3
      const r = calculateAffordability({ takeHome: 3500, savings: 1000, monthlyTotal: 2000, upfrontTotal: 5000 })
      expect(r.monthsToMoveIn).toBe(3)
    })
  })

  describe('CAN_AFFORD_NOW — savings meet or exceed upfront', () => {
    it('returns CAN_AFFORD_NOW when savings === upfront', () => {
      const r = calculateAffordability({ takeHome: 3000, savings: 5000, monthlyTotal: 2000, upfrontTotal: 5000 })
      expect(r.status).toBe(AffordabilityStatus.CAN_AFFORD_NOW)
    })

    it('returns CAN_AFFORD_NOW when savings > upfront', () => {
      const r = calculateAffordability({ takeHome: 3000, savings: 8000, monthlyTotal: 2000, upfrontTotal: 5000 })
      expect(r.status).toBe(AffordabilityStatus.CAN_AFFORD_NOW)
    })

    it('sets monthsToMoveIn to 0 when savings cover upfront', () => {
      const r = calculateAffordability({ takeHome: 3000, savings: 5000, monthlyTotal: 2000, upfrontTotal: 5000 })
      expect(r.monthsToMoveIn).toBe(0)
    })

    it('still calculates surplus correctly when savings cover upfront', () => {
      const r = calculateAffordability({ takeHome: 3000, savings: 5000, monthlyTotal: 2000, upfrontTotal: 5000 })
      expect(r.surplus).toBe(1000)
    })
  })

  describe('INCOME_INSUFFICIENT — surplus ≤ 0', () => {
    it('returns INCOME_INSUFFICIENT when takeHome equals monthlyTotal', () => {
      const r = calculateAffordability({ takeHome: 2000, savings: 0, monthlyTotal: 2000, upfrontTotal: 5000 })
      expect(r.status).toBe(AffordabilityStatus.INCOME_INSUFFICIENT)
    })

    it('returns INCOME_INSUFFICIENT when takeHome is less than monthlyTotal', () => {
      const r = calculateAffordability({ takeHome: 1500, savings: 1000, monthlyTotal: 2000, upfrontTotal: 5000 })
      expect(r.status).toBe(AffordabilityStatus.INCOME_INSUFFICIENT)
    })

    it('sets monthsToMoveIn to null when income is insufficient', () => {
      const r = calculateAffordability({ takeHome: 1500, savings: 0, monthlyTotal: 2000, upfrontTotal: 5000 })
      expect(r.monthsToMoveIn).toBeNull()
    })

    it('reports the correct (negative) surplus', () => {
      const r = calculateAffordability({ takeHome: 1500, savings: 0, monthlyTotal: 2000, upfrontTotal: 5000 })
      expect(r.surplus).toBe(-500)
    })
  })
})
