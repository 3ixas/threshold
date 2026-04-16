import { render, screen, fireEvent } from '@testing-library/react'
import ConfigPanel from './ConfigPanel'
import london from '../data/london'
import basel from '../data/basel'
import type { CalculatorInputs } from '../lib/types'

const baseInputs: CalculatorInputs = {
  districtId: 'hackney',
  propertyType: '1bed',
  occupants: 1,
  lifestyle: { phone: 0, subscriptions: 0, gym: 0, eatingOut: 0, personalCare: 0, savingsTarget: 0 },
}

describe('ConfigPanel', () => {
  it('renders all 5 property type options', () => {
    render(<ConfigPanel config={london} inputs={baseInputs} onChange={() => {}} />)
    expect(screen.getByLabelText(/property type/i).querySelectorAll('option')).toHaveLength(5)
  })

  it('renders all 5 living arrangement options', () => {
    render(<ConfigPanel config={london} inputs={baseInputs} onChange={() => {}} />)
    expect(screen.getByLabelText(/living arrangement/i).querySelectorAll('option')).toHaveLength(5)
  })

  it('calls onChange with updated propertyType on selection', () => {
    const onChange = vi.fn()
    render(<ConfigPanel config={london} inputs={baseInputs} onChange={onChange} />)
    fireEvent.change(screen.getByLabelText(/property type/i), { target: { value: 'studio' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ propertyType: 'studio' }))
  })

  it('calls onChange with occupants=2 when "With partner" is selected', () => {
    const onChange = vi.fn()
    render(<ConfigPanel config={london} inputs={baseInputs} onChange={onChange} />)
    fireEvent.change(screen.getByLabelText(/living arrangement/i), { target: { value: '2' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ occupants: 2 }))
  })

  it('renders lifestyle section collapsed by default', () => {
    render(<ConfigPanel config={london} inputs={baseInputs} onChange={() => {}} />)
    // The lifestyle fields should not be visible initially
    expect(screen.queryByLabelText(/gym/i)).not.toBeInTheDocument()
  })

  it('expands lifestyle section when the toggle is clicked', () => {
    render(<ConfigPanel config={london} inputs={baseInputs} onChange={() => {}} />)
    fireEvent.click(screen.getByText(/lifestyle costs/i))
    expect(screen.getByLabelText(/gym/i)).toBeInTheDocument()
  })

  it('does not show health insurance field for London', () => {
    render(<ConfigPanel config={london} inputs={baseInputs} onChange={() => {}} />)
    expect(screen.queryByLabelText(/krankenkasse/i)).not.toBeInTheDocument()
  })

  it('shows health insurance field for Basel', () => {
    const baselInputs: CalculatorInputs = { ...baseInputs, districtId: 'iselin' }
    render(<ConfigPanel config={basel} inputs={baselInputs} onChange={() => {}} />)
    expect(screen.getByLabelText(/krankenkasse/i)).toBeInTheDocument()
  })

  it('calls onChange with healthInsuranceOverride when health insurance input changes', () => {
    const onChange = vi.fn()
    const baselInputs: CalculatorInputs = { ...baseInputs, districtId: 'iselin' }
    render(<ConfigPanel config={basel} inputs={baselInputs} onChange={onChange} />)
    fireEvent.change(screen.getByLabelText(/krankenkasse/i), { target: { value: '380' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ healthInsuranceOverride: 380 }))
  })
})
