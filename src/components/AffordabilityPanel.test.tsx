import { render, screen, fireEvent } from '@testing-library/react'
import AffordabilityPanel from './AffordabilityPanel'
import type { AffordabilityResult } from '../lib/affordability'
import { AffordabilityStatus } from '../lib/affordability'

const canAffordNow: AffordabilityResult = {
  status: AffordabilityStatus.CAN_AFFORD_NOW,
  surplus: 1000,
  monthsToMoveIn: 0,
}
const notYet: AffordabilityResult = {
  status: AffordabilityStatus.NOT_YET,
  surplus: 500,
  monthsToMoveIn: 8,
}
const insufficient: AffordabilityResult = {
  status: AffordabilityStatus.INCOME_INSUFFICIENT,
  surplus: -200,
  monthsToMoveIn: null,
}

const baseProps = {
  takeHome: 0,
  savings: 0,
  result: null as AffordabilityResult | null,
  currency: 'GBP' as const,
  cityId: 'london' as const,
  onTakeHomeChange: () => {},
  onSavingsChange: () => {},
}

describe('AffordabilityPanel', () => {
  it('renders income and savings inputs', () => {
    render(<AffordabilityPanel {...baseProps} />)
    expect(screen.getByLabelText(/take-home/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/savings/i)).toBeInTheDocument()
  })

  it('calls onTakeHomeChange when income input changes', () => {
    const onTakeHomeChange = vi.fn()
    render(<AffordabilityPanel {...baseProps} onTakeHomeChange={onTakeHomeChange} />)
    fireEvent.change(screen.getByLabelText(/take-home/i), { target: { value: '3000' } })
    expect(onTakeHomeChange).toHaveBeenCalledWith(3000)
  })

  it('calls onSavingsChange when savings input changes', () => {
    const onSavingsChange = vi.fn()
    render(<AffordabilityPanel {...baseProps} onSavingsChange={onSavingsChange} />)
    fireEvent.change(screen.getByLabelText(/savings/i), { target: { value: '5000' } })
    expect(onSavingsChange).toHaveBeenCalledWith(5000)
  })

  it('shows no result when result is null', () => {
    render(<AffordabilityPanel {...baseProps} result={null} />)
    expect(screen.queryByTestId('affordability-status')).not.toBeInTheDocument()
  })

  it('shows CAN_AFFORD_NOW message when savings cover upfront', () => {
    render(<AffordabilityPanel {...baseProps} result={canAffordNow} />)
    // CAN_AFFORD_NOW renders a "You can move in now" label + surplus hero number
    expect(screen.getByTestId('affordability-status')).toBeInTheDocument()
    expect(screen.getByText(/can move in now/i)).toBeInTheDocument()
  })

  it('shows months-to-move-in when status is NOT_YET', () => {
    render(<AffordabilityPanel {...baseProps} result={notYet} />)
    expect(screen.getByTestId('months-to-move-in')).toHaveTextContent('8')
  })

  it('shows surplus amount for NOT_YET status', () => {
    render(<AffordabilityPanel {...baseProps} result={notYet} />)
    expect(screen.getByTestId('surplus-amount')).toHaveTextContent('500')
  })

  it('shows INCOME_INSUFFICIENT message when surplus ≤ 0', () => {
    render(<AffordabilityPanel {...baseProps} result={insufficient} />)
    // INCOME_INSUFFICIENT renders a shortfall label + hero number
    expect(screen.getByTestId('affordability-status')).toBeInTheDocument()
    expect(screen.getByText(/income insufficient/i)).toBeInTheDocument()
  })

  it('does not show months-to-move-in when income is insufficient', () => {
    render(<AffordabilityPanel {...baseProps} result={insufficient} />)
    expect(screen.queryByTestId('months-to-move-in')).not.toBeInTheDocument()
  })

  it('shows Swiss health insurance note for Basel', () => {
    render(<AffordabilityPanel {...baseProps} cityId="basel" />)
    expect(screen.getByText(/health insurance/i)).toBeInTheDocument()
  })

  it('shows Swiss health insurance note for Zurich', () => {
    render(<AffordabilityPanel {...baseProps} cityId="zurich" />)
    expect(screen.getByText(/health insurance/i)).toBeInTheDocument()
  })

  it('does not show Swiss health insurance note for London', () => {
    render(<AffordabilityPanel {...baseProps} cityId="london" />)
    expect(screen.queryByText(/health insurance/i)).not.toBeInTheDocument()
  })
})
