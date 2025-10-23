# Gulf News Color Scheme

This document outlines the standardized color palette used in the Gulf News application for maintaining consistency across frontend and backend implementations, including email templates.

## Primary Brand Colors

### Main Brand Colors
- **Background Color**: `#EBF1E7` (Light sage green)
- **Primary Color**: `#DBE2CD` (Soft sage green)
- **Secondary Color**: `#224442` (Dark teal green)
- **Tertiary Color**: `#000000` (Black)
- **White Color**: `#FFFFFF` (Pure white)
- **Card Color**: `#E7FB7A` (Light lime green)
- **Border Color**: `#00000040` (Black with 25% opacity)

## Color Usage Guidelines

### Background Colors
- **Main Background**: Use `#EBF1E7` for page backgrounds
- **Card Backgrounds**: Use `#E7FB7A` for highlight cards and call-to-action sections
- **Navbar Background**: Use `#DBE2CD` for navigation elements

### Text Colors
- **Primary Text**: Use `#224442` for main headings and important text
- **Secondary Text**: Use `#000000` for body text and descriptions
- **White Text**: Use `#FFFFFF` for text on dark backgrounds

### Interactive Elements
- **Hover States**: Use `#224442` for hover effects on links and buttons
- **Borders**: Use `#00000040` for subtle borders and separators

## Email Template Color Implementation

### HTML Email Colors
```html
<!-- Background colors -->
<div style="background-color: #EBF1E7;">Main background</div>
<div style="background-color: #DBE2CD;">Navbar/header background</div>
<div style="background-color: #E7FB7A;">Highlight card background</div>

<!-- Text colors -->
<h1 style="color: #224442;">Primary heading</h1>
<p style="color: #000000;">Body text</p>
<span style="color: #FFFFFF;">White text on dark background</span>

<!-- Border colors -->
<div style="border: 1px solid #00000040;">Subtle border</div>
```

### CSS Variables for Email Templates
```css
:root {
  --gulf-background: #EBF1E7;
  --gulf-primary: #DBE2CD;
  --gulf-secondary: #224442;
  --gulf-tertiary: #000000;
  --gulf-white: #FFFFFF;
  --gulf-card: #E7FB7A;
  --gulf-border: #00000040;
}
```

## Color Accessibility

### Contrast Ratios
- **#224442 on #EBF1E7**: High contrast (meets WCAG AA standards)
- **#000000 on #EBF1E7**: High contrast (meets WCAG AA standards)
- **#224442 on #DBE2CD**: Good contrast for interactive elements

### Usage Recommendations
- Always test color combinations for accessibility
- Use the secondary color (#224442) for primary actions and important text
- Use the card color (#E7FB7A) sparingly for highlights and call-to-action elements
- Maintain sufficient contrast ratios for readability

## Implementation Notes

- These colors are defined as CSS custom properties in the main stylesheet
- The color scheme supports both light and dark modes
- Colors are optimized for digital displays and print media
- All colors are web-safe and email-client compatible

## File References

- **CSS Variables**: `src/style.css` (lines 16-22)
- **Tailwind Config**: `tailwind.config.js` (lines 7-15)
- **Component Usage**: Various components in `src/components/`

---

*Last updated: Generated for backend email template integration*
