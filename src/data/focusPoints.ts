// Timeline focus anchors: one per resume entry (Resume.tsx). The list is the
// single source of truth for entry count / camera stops — Scene.tsx and
// Resume.tsx both read it. The camera is procedural in this adaptation, so
// these are DOM anchor slugs, not GLB empties.
export const FOCUS_POINTS = ['focus-1', 'focus-2', 'focus-3', 'focus-4', 'focus-5'] as const

// Frames each timeline node occupies on the shared scroll timeline.
export const FRAMES_PER_NODE = 50
