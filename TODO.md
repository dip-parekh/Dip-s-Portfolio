# Responsive Optimization - Progress Tracker

## Phase A — Mobile Navigation
- [x] Add hamburger menu + overlay to all 4 inner pages (home/about/work/contact)
- [x] Add JS for open/close, outside-click, Escape, prevent body scroll, keyboard nav
- [x] Add CSS for animated menu, large touch targets

## Phase B — Global Layout / Overflow Fixes
- [ ] Change `.landing-grid` aside to `minmax(0, 0.9fr)` to prevent overflow
- [ ] Refactor `.skill-row` to flexible sizing
- [ ] Refactor `.image-modal-stage` to responsive `min-height`
- [ ] Add `overflow-wrap`/`hyphens` and `max-width:100%` guards
- [ ] Normalize `.landing-card` tilt on mobile

## Phase C — Breakpoints & Grids
- [ ] Add breakpoints at 1024px, 768px, 640px, 480px, 375px
- [ ] Ensure grids collapse: hero → 1 col, project-grid → 1 col, values-grid → 1 col

## Phase D — Typography
- [ ] Convert remaining fixed font sizes to responsive `clamp()`
- [ ] Ensure headings scale smoothly, no clipping

## Phase E — Images & Cards
- [ ] Ensure all images `max-width:100%`, `object-fit`, aspect ratio preserved
- [ ] Cards equal heights, responsive padding

## Phase F — Forms, Buttons, Modals
- [ ] Full-width inputs, stacked buttons, min 44px touch targets
- [ ] Responsive modal (centered, scrollable, max-height)

## Phase G — Accessibility & Performance
- [ ] Preserve existing a11y widget, focus states, semantic HTML
- [ ] Respect `prefers-reduced-motion`
- [ ] No changes to business logic, branding, or desktop layout

## Final Verification
- [ ] Test at 375px, 768px, 1440px widths

