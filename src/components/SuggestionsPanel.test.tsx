import { render, screen, fireEvent } from '@testing-library/react'
import SuggestionsPanel from './SuggestionsPanel'
import type { Suggestion } from '../lib/suggestions'
import type { CalculatorInputs } from '../lib/types'

const baseInputs: CalculatorInputs = {
  districtId: 'hackney',
  propertyType: '2bed',
  occupants: 1,
  lifestyle: { phone: 0, subscriptions: 0, gym: 0, eatingOut: 0, personalCare: 0, savingsTarget: 0 },
}

const suggestions: Suggestion[] = [
  { label: 'Add a flatmate', saving: 750, updatedInputs: { ...baseInputs, occupants: 2 } },
  { label: 'Downsize to a 1bed', saving: 400, updatedInputs: { ...baseInputs, propertyType: '1bed' } },
  { label: 'Move to Lewisham', saving: 120, updatedInputs: { ...baseInputs, districtId: 'lewisham' } },
]

describe('SuggestionsPanel', () => {
  it('renders nothing when suggestions array is empty', () => {
    const { container } = render(
      <SuggestionsPanel suggestions={[]} currency="GBP" onApply={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders a chip for each suggestion', () => {
    render(<SuggestionsPanel suggestions={suggestions} currency="GBP" onApply={() => {}} />)
    expect(screen.getByText('Add a flatmate')).toBeInTheDocument()
    expect(screen.getByText('Downsize to a 1bed')).toBeInTheDocument()
    expect(screen.getByText('Move to Lewisham')).toBeInTheDocument()
  })

  it('displays the monthly saving amount on each chip', () => {
    render(<SuggestionsPanel suggestions={suggestions} currency="GBP" onApply={() => {}} />)
    // Saving is now rendered as a headline number "−£750" with a separate "/mo" label
    expect(screen.getByText('−£750')).toBeInTheDocument()
    expect(screen.getByText('−£400')).toBeInTheDocument()
  })

  it('calls onApply with the updated inputs when a chip is clicked', () => {
    const onApply = vi.fn()
    render(<SuggestionsPanel suggestions={suggestions} currency="GBP" onApply={onApply} />)
    fireEvent.click(screen.getByText('Add a flatmate').closest('button')!)
    expect(onApply).toHaveBeenCalledWith(suggestions[0].updatedInputs)
  })

  it('uses CHF prefix for Swiss currency', () => {
    render(<SuggestionsPanel suggestions={[suggestions[0]]} currency="CHF" onApply={() => {}} />)
    expect(screen.getByText('−CHF 750')).toBeInTheDocument()
  })
})
