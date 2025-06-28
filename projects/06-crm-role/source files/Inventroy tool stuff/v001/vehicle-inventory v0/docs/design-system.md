# Vehicle Inventory Management System - Design System

## Design Principles

The Vehicle Inventory Management System design is built on four core principles:

1. **Clarity**: Information is presented clearly and directly, minimizing cognitive load
2. **Efficiency**: UI patterns prioritize speed and minimize clicks for common tasks
3. **Consistency**: Visual and interaction patterns remain consistent throughout the application
4. **Adaptability**: The interface adapts seamlessly across devices and contexts

## Color System

### Primary Colors

- **Primary Blue** (`#3b82f6`): Used for primary actions, links, and key UI elements
- **Dark Blue** (`#1e40af`): Used for hover states and emphasis
- **Light Blue** (`#bfdbfe`): Used for backgrounds, highlights, and secondary elements

### Neutral Colors

- **Dark Gray** (`#1f2937`): Primary text color
- **Medium Gray** (`#6b7280`): Secondary text, borders
- **Light Gray** (`#f3f4f6`): Backgrounds, disabled states
- **White** (`#ffffff`): Card backgrounds, primary content areas

### Semantic Colors

- **Success** (`#10b981`): Positive actions, confirmations
- **Warning** (`#f59e0b`): Alerts, warnings
- **Error** (`#ef4444`): Errors, destructive actions
- **Info** (`#3b82f6`): Informational elements

### Status Colors

- **Available** (`#10b981`): Available vehicles
- **Reserved** (`#f59e0b`): Reserved vehicles
- **In Transit** (`#6366f1`): Vehicles in transit
- **Display** (`#8b5cf6`): Display vehicles

## Typography

### Font Family

- **Primary Font**: Inter (sans-serif)
- **Fallback**: system-ui, -apple-system, sans-serif

### Type Scale

- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)

### Font Weights

- **normal**: 400
- **medium**: 500
- **semibold**: 600
- **bold**: 700

## Component Patterns

### Cards

Cards are the primary container for content, providing visual separation and hierarchy. They feature:
- Consistent padding (1rem)
- Subtle shadow for depth
- Rounded corners (0.5rem)
- White background
- Optional header with title and actions

### Buttons

Buttons follow a consistent pattern with variants:
- **Primary**: Solid blue background, white text
- **Secondary**: Gray outline, dark text
- **Destructive**: Red background, white text
- **Ghost**: No background, colored text

All buttons include:
- Consistent padding (0.5rem 1rem)
- Hover and active states
- Disabled state styling
- Optional leading/trailing icons

### Forms

Form elements maintain consistency with:
- Labeled inputs with helper text
- Validation states (error, success)
- Consistent spacing between fields
- Grouped related fields
- Clear submission buttons

### Tables

Tables are designed for clarity and efficiency:
- Sticky headers for long tables
- Zebra striping for readability
- Responsive design for mobile
- Sortable columns
- Row actions

### Navigation

Navigation elements follow these patterns:
- Clear visual hierarchy
- Active state indicators
- Consistent spacing
- Mobile-optimized variants

## Responsive Design Approach

The system uses a mobile-first approach with these breakpoints:
- **sm**: 640px and up
- **md**: 768px and up
- **lg**: 1024px and up
- **xl**: 1280px and up
- **2xl**: 1536px and up

### Mobile Adaptations

1. **Layout Shifts**:
   - Single column layouts on mobile
   - Multi-column on larger screens
   - Stacked cards on mobile

2. **Navigation**:
   - Bottom tab navigation on mobile
   - Sidebar navigation on desktop
   - Condensed header on mobile

3. **Data Presentation**:
   - Card-based lists replace tables on mobile
   - Prioritized content on small screens
   - Touch-optimized interaction targets (min 44px)

## Accessibility Considerations

The design system prioritizes accessibility through:

1. **Color Contrast**:
   - All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
   - Non-text elements maintain 3:1 contrast ratio

2. **Keyboard Navigation**:
   - All interactive elements are keyboard accessible
   - Focus states are clearly visible
   - Logical tab order

3. **Screen Readers**:
   - Semantic HTML structure
   - ARIA labels where appropriate
   - Alternative text for images
   - Announcements for dynamic content

4. **Reduced Motion**:
   - Respects user preferences for reduced motion
   - Essential animations only
   - No flashing content

## Component Documentation

Each component in the system includes:
1. Usage guidelines
2. Props and customization options
3. Accessibility considerations
4. Code examples
5. Visual examples

## Design Tokens

Design tokens are used to maintain consistency across the application:
- Spacing scale
- Border radius values
- Shadow definitions
- Transition timings
- Z-index scale

These tokens are implemented as Tailwind CSS classes and custom properties to ensure consistent application throughout the codebase.
