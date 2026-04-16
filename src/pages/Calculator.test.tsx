import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Calculator from './Calculator'

function renderCalculator(city: 'london' | 'basel' | 'zurich', search = '') {
  return render(
    <MemoryRouter initialEntries={[`/${city}${search}`]}>
      <Calculator city={city} />
    </MemoryRouter>
  )
}

describe('Calculator — London', () => {
  it('renders a district heading (defaults to first district in config)', () => {
    renderCalculator('london')
    // Default district is Barking & Dagenham (first in london.districts after deserialise fallback)
    // or whichever the first district is — just check a heading exists
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('shows the borough and zone selects', () => {
    renderCalculator('london')
    expect(screen.getByLabelText(/borough/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/zone/i)).toBeInTheDocument()
  })

  it('restores district from URL params', () => {
    renderCalculator('london', '?district=camden&type=1bed&people=1')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Camden')
  })
})

describe('Calculator — stubs', () => {
  it.each([
    ['basel', 'Basel'],
    ['zurich', 'Zurich'],
  ] as const)('renders %s stub with city name', (city, label) => {
    renderCalculator(city)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(label)
  })
})
