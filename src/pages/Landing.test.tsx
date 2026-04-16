import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Landing from './Landing'

function renderLanding() {
  return render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>
  )
}

describe('Landing page', () => {
  it('renders the headline', () => {
    renderLanding()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'The real cost of moving out'
    )
  })

  it('shows all three city cards', () => {
    renderLanding()
    expect(screen.getByText('London')).toBeInTheDocument()
    expect(screen.getByText('Basel')).toBeInTheDocument()
    expect(screen.getByText('Zurich')).toBeInTheDocument()
  })

  it('city cards link to correct routes', () => {
    renderLanding()
    expect(screen.getByRole('link', { name: /london/i })).toHaveAttribute('href', '/london')
    expect(screen.getByRole('link', { name: /basel/i })).toHaveAttribute('href', '/basel')
    expect(screen.getByRole('link', { name: /zurich/i })).toHaveAttribute('href', '/zurich')
  })
})
