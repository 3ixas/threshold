import { render, screen } from '@testing-library/react'
import ResultsPanel from './ResultsPanel'
import type { MonthlyCosts, UpfrontCosts } from '../lib/types'

const monthly: MonthlyCosts = {
  rent: 1000,
  transport: 150,
  utilities: 77,
  broadband: 17.5,
  councilTax: 75,
  healthInsurance: 0,
  mediaFee: 0,
  tvLicence: 15,
  food: 300,
  contentsInsurance: 15,
  lifestyle: 135,
  total: 1784.5,
}

const upfront: UpfrontCosts = {
  securityDeposit: 2308,
  firstMonthRent: 2000,
  movingCosts: 1000,
  furnitureBudget: 2500,
  total: 7808,
}

describe('ResultsPanel', () => {
  it('displays the total monthly cost as a hero number', () => {
    render(<ResultsPanel monthly={monthly} upfront={upfront} currency="GBP" lastUpdated="April 2026" />)
    expect(screen.getByTestId('monthly-total')).toHaveTextContent('1,785')
  })

  it('displays the total upfront cost as a hero number', () => {
    render(<ResultsPanel monthly={monthly} upfront={upfront} currency="GBP" lastUpdated="April 2026" />)
    expect(screen.getByTestId('upfront-total')).toHaveTextContent('7,808')
  })

  it('shows a line item for rent', () => {
    render(<ResultsPanel monthly={monthly} upfront={upfront} currency="GBP" lastUpdated="April 2026" />)
    expect(screen.getByTestId('line-rent')).toHaveTextContent('1,000')
  })

  it('shows a line item for council tax', () => {
    render(<ResultsPanel monthly={monthly} upfront={upfront} currency="GBP" lastUpdated="April 2026" />)
    expect(screen.getByTestId('line-councilTax')).toHaveTextContent('75')
  })

  it('shows a line item for security deposit in upfront section', () => {
    render(<ResultsPanel monthly={monthly} upfront={upfront} currency="GBP" lastUpdated="April 2026" />)
    expect(screen.getByTestId('line-securityDeposit')).toHaveTextContent('2,308')
  })

  it('displays the lastUpdated label', () => {
    render(<ResultsPanel monthly={monthly} upfront={upfront} currency="GBP" lastUpdated="April 2026" />)
    expect(screen.getByText(/april 2026/i)).toBeInTheDocument()
  })
})
