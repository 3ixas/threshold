export const AffordabilityStatus = {
  CAN_AFFORD_NOW: 'CAN_AFFORD_NOW',
  NOT_YET: 'NOT_YET',
  INCOME_INSUFFICIENT: 'INCOME_INSUFFICIENT',
} as const

export type AffordabilityStatus = typeof AffordabilityStatus[keyof typeof AffordabilityStatus]

export interface AffordabilityInputs {
  takeHome: number
  savings: number
  monthlyTotal: number
  upfrontTotal: number
}

export interface AffordabilityResult {
  status: AffordabilityStatus
  surplus: number
  /** Months of saving needed. 0 = can move now. null = income insufficient. */
  monthsToMoveIn: number | null
  /** How much more savings are needed before moving in (only set for NOT_YET). */
  upfrontShortfall?: number
}

export function calculateAffordability(inputs: AffordabilityInputs): AffordabilityResult {
  const { takeHome, savings, monthlyTotal, upfrontTotal } = inputs
  const surplus = Math.round((takeHome - monthlyTotal) * 100) / 100

  if (surplus <= 0) {
    return { status: AffordabilityStatus.INCOME_INSUFFICIENT, surplus, monthsToMoveIn: null }
  }

  if (savings >= upfrontTotal) {
    return { status: AffordabilityStatus.CAN_AFFORD_NOW, surplus, monthsToMoveIn: 0 }
  }

  const upfrontShortfall = Math.round((upfrontTotal - savings) * 100) / 100
  const monthsToMoveIn = Math.ceil(upfrontShortfall / surplus)
  return { status: AffordabilityStatus.NOT_YET, surplus, monthsToMoveIn, upfrontShortfall }
}
