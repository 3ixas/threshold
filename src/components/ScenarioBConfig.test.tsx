import { render, screen, fireEvent } from '@testing-library/react'
import ScenarioBConfig from './ScenarioBConfig'
import london from '../data/london'
import type { CalculatorInputs } from '../lib/types'

const baseInputs: CalculatorInputs = {
  districtId: 'hackney',
  propertyType: '1bed',
  occupants: 1,
  lifestyle: { phone: 0, subscriptions: 0, gym: 0, eatingOut: 0, personalCare: 0, savingsTarget: 0 },
}

describe('ScenarioBConfig', () => {
  it('renders a borough dropdown', () => {
    render(<ScenarioBConfig config={london} inputs={baseInputs} onChange={() => {}} onExit={() => {}} />)
    expect(screen.getByLabelText(/scenario b.*borough/i)).toBeInTheDocument()
  })

  it('renders a property type dropdown', () => {
    render(<ScenarioBConfig config={london} inputs={baseInputs} onChange={() => {}} onExit={() => {}} />)
    expect(screen.getByLabelText(/scenario b.*property/i)).toBeInTheDocument()
  })

  it('renders a living arrangement dropdown', () => {
    render(<ScenarioBConfig config={london} inputs={baseInputs} onChange={() => {}} onExit={() => {}} />)
    expect(screen.getByLabelText(/scenario b.*living/i)).toBeInTheDocument()
  })

  it('calls onChange when borough changes', () => {
    const onChange = vi.fn()
    render(<ScenarioBConfig config={london} inputs={baseInputs} onChange={onChange} onExit={() => {}} />)
    fireEvent.change(screen.getByLabelText(/scenario b.*borough/i), { target: { value: 'camden' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ districtId: 'camden' }))
  })

  it('calls onChange when property type changes', () => {
    const onChange = vi.fn()
    render(<ScenarioBConfig config={london} inputs={baseInputs} onChange={onChange} onExit={() => {}} />)
    fireEvent.change(screen.getByLabelText(/scenario b.*property/i), { target: { value: '2bed' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ propertyType: '2bed' }))
  })

  it('calls onExit when exit button is clicked', () => {
    const onExit = vi.fn()
    render(<ScenarioBConfig config={london} inputs={baseInputs} onChange={() => {}} onExit={onExit} />)
    fireEvent.click(screen.getByRole('button', { name: /exit/i }))
    expect(onExit).toHaveBeenCalled()
  })
})
