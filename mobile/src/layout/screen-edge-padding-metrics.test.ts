import { describe, expect, it } from 'vitest'
import { getHorizontalEdgePadding, getScreenEdgePadding } from './screen-edge-padding-metrics'
import { spacing } from '../theme/mobile-theme'

// Insets modelled on an iPhone with a Dynamic Island: the housing reports a top
// inset in portrait and symmetric side insets once the device is rotated.
const PORTRAIT = { top: 59, left: 0, right: 0 }
const LANDSCAPE = { top: 0, left: 59, right: 59 }

describe('screen edge padding metrics', () => {
  it('keeps the sides flush in portrait', () => {
    expect(getScreenEdgePadding(PORTRAIT)).toEqual({
      paddingTop: 59 + spacing.sm,
      paddingLeft: 0,
      paddingRight: 0
    })
  })

  it('insets both sides in landscape so the housing cannot cover content', () => {
    expect(getScreenEdgePadding(LANDSCAPE)).toEqual({
      paddingTop: spacing.sm,
      paddingLeft: 59,
      paddingRight: 59
    })
  })

  it('pads only the side the housing is on when the window is offset', () => {
    expect(getHorizontalEdgePadding({ top: 0, left: 59, right: 0 })).toEqual({
      paddingLeft: 59,
      paddingRight: 0
    })
  })
})
