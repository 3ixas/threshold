import { render, screen } from '@testing-library/react'
import ComparisonResults from './ComparisonResults'
import type { MonthlyCosts, UpfrontCosts } from '../lib/types'

const monthlyA: MonthlyCosts = {
  rent: 2000, transport: 150, utilities: 77, broadband: 35,
  councilTax: 75, healthInsurance: 0, mediaFee: 0, tvLicence: 15,
  food: 300, contentsInsurance: 15, lifestyle: 85, total: 2752,
}
const monthlyB: MonthlyCosts = {
  rent: 1450, transport: 150, utilities: 70, broadband: 35,
  councilTax: 80, healthInsurance: 0, mediaFee: 0, tvLicence: 15,
  food: 300, contentsInsurance: 15, lifestyle: 85, total: 2200,
}
const upfrontA: UpfrontCosts = { securityDeposit: 4615, firstMonthRent: 2000, movingCosts: 1000, furnitureBudget: 2500, total: 10115 }
const upfrontB: UpfrontCosts = { securityDeposit: 3346, firstMonthRent: 1450, movingCosts: 1000, furnitureBudget: 2500, total: 8296 }

describe('ComparisonResults', () => {
  it('renders scenario A and B monthly totals', () => {
    render(<ComparisonResults monthlyA={monthlyA} monthlyB={monthlyB} upfrontA={upfrontA} upfrontB={upfrontB} currency="GBP" />)
    expect(screen.getByTestId('total-a-monthly')).toHaveTextContent('2,752')
    expect(screen.getByTestId('total-b-monthly')).toHaveTextContent('2,200')
  })

  it('renders the monthly total diff', () => {
    render(<ComparisonResults monthlyA={monthlyA} monthlyB={monthlyB} upfrontA={upfrontA} upfrontB={upfrontB} currency="GBP" />)
    // B - A = 2200 - 2752 = -552 (B is cheaper)
    expect(screen.getByTestId('diff-monthly-total')).toHaveTextContent('552')
  })

  it('renders scenario A and B upfront totals', () => {
    render(<ComparisonResults monthlyA={monthlyA} monthlyB={monthlyB} upfrontA={upfrontA} upfrontB={upfrontB} currency="GBP" />)
    expect(screen.getByTestId('total-a-upfront')).toHaveTextContent('10,115')
    expect(screen.getByTestId('total-b-upfront')).toHaveTextContent('8,296')
  })

  it('shows rent for both scenarios', () => {
    render(<ComparisonResults monthlyA={monthlyA} monthlyB={monthlyB} upfrontA={upfrontA} upfrontB={upfrontB} currency="GBP" />)
    expect(screen.getByTestId('rent-a')).toHaveTextContent('2,000')
    expect(screen.getByTestId('rent-b')).toHaveTextContent('1,450')
  })
})
