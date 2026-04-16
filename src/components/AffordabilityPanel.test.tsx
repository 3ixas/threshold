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
  onTakeHomeChange: () => {},
  onSavingsChange: () => {},
}

describe('AffordabilityPanel', () => {
  it('renders income and savings inputs', () => {
    render(<AffordabilityPanel {...baseProps} />)
    expect(screen.getByLabelText(/monthly take-home/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/current savings/i)).toBeInTheDocument()
  })

  it('shows no affordability result when result is null', () => {
    render(<AffordabilityPanel {...baseProps} />)
    expect(screen.queryByTestId('affordability-status')).not.toBeInTheDocument()
  })

  it('shows CAN_AFFORD_NOW status with surplus', () => {
    render(<AffordabilityPanel {...baseProps} result={canAffordNow} />)
    expect(screen.getByTestId('affordability-status')).toHaveTextContent(/surplus/i)
  })

  it('shows NOT_YET status with months', () => {
    render(<AffordabilityPanel {...baseProps} result={notYet} />)
    expect(screen.getByTestId('affordability-status')).toHaveTextContent(/not quite yet/i)
    expect(screen.getByTestId('months-to-move-in')).toHaveTextContent('8')
  })

  it('shows INCOME_INSUFFICIENT status with shortfall', () => {
    render(<AffordabilityPanel {...baseProps} result={insufficient} />)
    expect(screen.getByTestId('affordability-status')).toHaveTextContent(/shortfall/i)
  })

  it('does not show months-to-move-in when income is insufficient', () => {
    render(<AffordabilityPanel {...baseProps} result={insufficient} />)
    expect(screen.queryByTestId('months-to-move-in')).not.toBeInTheDocument()
  })

  it('shows Swiss health insurance note for CHF currency', () => {
    render(<AffordabilityPanel {...baseProps} currency="CHF" />)
    expect(screen.getByText(/health insurance/i)).toBeInTheDocument()
  })

  it('does not show Swiss health insurance note for GBP currency', () => {
    render(<AffordabilityPanel {...baseProps} currency="GBP" />)
    expect(screen.queryByText(/health insurance/i)).not.toBeInTheDocument()
  })

  it('calls onTakeHomeChange when income input changes', () => {
    const onTakeHomeChange = vi.fn()
    render(<AffordabilityPanel {...baseProps} onTakeHomeChange={onTakeHomeChange} />)
    fireEvent.change(screen.getByLabelText(/monthly take-home/i), { target: { value: '3000' } })
    expect(onTakeHomeChange).toHaveBeenCalledWith(3000)
  })

  it('calls onSavingsChange when savings input changes', () => {
    const onSavingsChange = vi.fn()
    render(<AffordabilityPanel {...baseProps} onSavingsChange={onSavingsChange} />)
    fireEvent.change(screen.getByLabelText(/current savings/i), { target: { value: '5000' } })
    expect(onSavingsChange).toHaveBeenCalledWith(5000)
  })
})
