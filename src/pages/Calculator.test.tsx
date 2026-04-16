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
  it('renders a district heading', () => {
    renderCalculator('london')
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('shows the borough and TfL zone selects', () => {
    renderCalculator('london')
    expect(screen.getByLabelText(/borough/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/zone/i)).toBeInTheDocument()
  })

  it('restores district from URL params', () => {
    renderCalculator('london', '?district=camden&type=1bed&people=1')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Camden')
  })

  it('does not show health insurance input', () => {
    renderCalculator('london')
    expect(screen.queryByLabelText(/krankenkasse/i)).not.toBeInTheDocument()
  })
})

describe('Calculator — Basel', () => {
  it('renders a district heading', () => {
    renderCalculator('basel')
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('shows the district dropdown (labelled District for Swiss cities)', () => {
    renderCalculator('basel')
    expect(screen.getByLabelText(/district/i)).toBeInTheDocument()
  })

  it('does not show TfL zone select', () => {
    renderCalculator('basel')
    expect(screen.queryByLabelText(/zone/i)).not.toBeInTheDocument()
  })

  it('shows health insurance (Krankenkasse) input', () => {
    renderCalculator('basel')
    expect(screen.getByLabelText(/krankenkasse/i)).toBeInTheDocument()
  })

  it('restores district from URL params', () => {
    renderCalculator('basel', '?district=bruderholz&type=1bed&people=1')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Bruderholz')
  })
})

describe('Calculator — Zurich', () => {
  it('renders a district heading', () => {
    renderCalculator('zurich')
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('shows health insurance input', () => {
    renderCalculator('zurich')
    expect(screen.getByLabelText(/krankenkasse/i)).toBeInTheDocument()
  })

  it('does not show TfL zone select', () => {
    renderCalculator('zurich')
    expect(screen.queryByLabelText(/zone/i)).not.toBeInTheDocument()
  })

  it('restores Kreis from URL params', () => {
    renderCalculator('zurich', '?district=kreis-8&type=1bed&people=1')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Kreis 8')
  })
})
