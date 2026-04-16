import { render, screen, fireEvent } from '@testing-library/react'
import DistrictSelect from './DistrictSelect'
import london from '../data/london'

const defaultProps = {
  config: london,
  districtId: 'hackney',
  tflZone: 2,
  onDistrictChange: () => {},
  onZoneChange: () => {},
}

describe('DistrictSelect', () => {
  it('renders a select with all 33 borough options', () => {
    render(<DistrictSelect {...defaultProps} />)
    const select = screen.getByLabelText(/borough/i)
    const options = select.querySelectorAll('option')
    expect(options).toHaveLength(33)
  })

  it('shows the currently selected district', () => {
    render(<DistrictSelect {...defaultProps} />)
    const select = screen.getByLabelText(/borough/i) as HTMLSelectElement
    expect(select.value).toBe('hackney')
  })

  it('calls onDistrictChange with the new district id on change', () => {
    const onDistrictChange = vi.fn()
    render(<DistrictSelect {...defaultProps} onDistrictChange={onDistrictChange} />)
    fireEvent.change(screen.getByLabelText(/borough/i), {
      target: { value: 'camden' },
    })
    expect(onDistrictChange).toHaveBeenCalledWith('camden')
  })

  it('renders a zone override select with zones 1–6', () => {
    render(<DistrictSelect {...defaultProps} />)
    const zoneSelect = screen.getByLabelText(/zone/i)
    const options = zoneSelect.querySelectorAll('option')
    // 6 zone options
    expect(options).toHaveLength(6)
  })

  it('shows the currently active tfl zone', () => {
    render(<DistrictSelect {...defaultProps} tflZone={3} />)
    const zoneSelect = screen.getByLabelText(/zone/i) as HTMLSelectElement
    expect(zoneSelect.value).toBe('3')
  })

  it('calls onZoneChange with the new zone number on change', () => {
    const onZoneChange = vi.fn()
    render(<DistrictSelect {...defaultProps} onZoneChange={onZoneChange} />)
    fireEvent.change(screen.getByLabelText(/zone/i), {
      target: { value: '4' },
    })
    expect(onZoneChange).toHaveBeenCalledWith(4)
  })

  it('hides the zone select when showZone is false', () => {
    render(<DistrictSelect {...defaultProps} showZone={false} />)
    expect(screen.queryByLabelText(/zone/i)).not.toBeInTheDocument()
  })

  it('shows the zone select by default', () => {
    render(<DistrictSelect {...defaultProps} />)
    expect(screen.getByLabelText(/zone/i)).toBeInTheDocument()
  })
})
