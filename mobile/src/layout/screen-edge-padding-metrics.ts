import { spacing } from '../theme/mobile-theme'

export type ScreenEdgeInsets = {
  top: number
  left: number
  right: number
}

export type HorizontalEdgePadding = {
  paddingLeft: number
  paddingRight: number
}

export type ScreenEdgePadding = HorizontalEdgePadding & {
  paddingTop: number
}

// Why: left/right insets are non-zero only in landscape on notched and Dynamic
// Island iPhones, where the sensor housing overlaps one side of the window. A
// screen that pads the top alone draws its content underneath it.
export function getHorizontalEdgePadding(insets: ScreenEdgeInsets): HorizontalEdgePadding {
  return { paddingLeft: insets.left, paddingRight: insets.right }
}

export function getScreenEdgePadding(insets: ScreenEdgeInsets): ScreenEdgePadding {
  return { paddingTop: insets.top + spacing.sm, ...getHorizontalEdgePadding(insets) }
}
