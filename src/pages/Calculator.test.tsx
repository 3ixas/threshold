import { render, screen } from '@testing-library/react'
import Calculator from './Calculator'

describe('Calculator stub', () => {
  it.each([
    ['london', 'London'],
    ['basel', 'Basel'],
    ['zurich', 'Zurich'],
  ] as const)('renders city name for %s route', (city, label) => {
    render(<Calculator city={city} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(label)
  })
})
