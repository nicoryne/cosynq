# Theme Toggle Accessibility Manual Testing Checklist

This checklist helps verify that the theme toggle component meets all accessibility requirements from Task 3.2.

## Keyboard Navigation

- [ ] **Tab Navigation**: Press Tab to focus the theme toggle button
- [ ] **Enter Key**: Press Enter while focused to cycle through themes
- [ ] **Space Key**: Press Space while focused to cycle through themes
- [ ] **Focus Indicator**: Verify a visible focus ring appears when the button is focused

## Screen Reader Testing

### NVDA/JAWS (Windows) or VoiceOver (Mac)

- [ ] **Initial Focus**: When focused, screen reader announces "Toggle theme. Current theme: [Light mode/Dark mode/System theme], button"
- [ ] **Theme Change**: After clicking/activating, screen reader announces "[Theme name] activated"
- [ ] **Dynamic Label**: Verify aria-label updates to reflect current theme after each toggle

## Visual Testing

- [ ] **Focus Ring**: Verify focus-visible ring appears with proper color and offset
- [ ] **No Layout Shift**: Theme toggle should not cause layout shifts when focused
- [ ] **Icon Transitions**: Icons should transition smoothly (150ms) when theme changes

## Accessibility Attributes Verification

Use browser DevTools to inspect the button element:

- [ ] **aria-label**: Should be "Toggle theme. Current theme: [current theme]"
- [ ] **role**: Should be "button"
- [ ] **tabIndex**: Should be 0
- [ ] **className**: Should include "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

## Screen Reader Announcement Element

Inspect the div element after the button:

- [ ] **role**: Should be "status"
- [ ] **aria-live**: Should be "polite"
- [ ] **aria-atomic**: Should be "true"
- [ ] **className**: Should be "sr-only"
- [ ] **Content**: Should update to "[Theme] activated" when theme changes

## Theme Cycling Behavior

- [ ] Light mode → Dark mode → System theme → Light mode (cycles correctly)
- [ ] Each theme displays the correct icon (Sun, Moon, Star)
- [ ] Announcement updates correctly for each theme change

## Browser Compatibility

Test in the following browsers:

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

## Mobile Testing (if applicable)

- [ ] Touch activation works correctly
- [ ] Screen reader on mobile announces correctly (TalkBack/VoiceOver)

## Notes

- The sr-only class is provided by Tailwind CSS and visually hides content while keeping it accessible to screen readers
- The focus-visible pseudo-class ensures focus indicators only appear for keyboard navigation, not mouse clicks
- The aria-live="polite" ensures announcements don't interrupt the user's current screen reader activity
