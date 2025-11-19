# ICP Definition Tool

A multi-step form application for defining your Ideal Customer Profile (ICP) for B2B SaaS businesses.

## Overview

This tool guides you through a comprehensive 7-step process to clearly define and document your ideal customer profile. The form saves progress automatically and exports a complete JSON file with all your ICP data.

## Features

- **7-Step Workflow**: Structured process covering all aspects of ICP definition
- **Auto-Save**: Form data automatically saved to localStorage
- **Progress Tracking**: Visual progress bar and step indicators
- **Form Validation**: Required field validation before proceeding
- **Export Functionality**: Download your complete ICP as a JSON file
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Clean UI**: Matches the BrandMap design system with black header and purple accents

## The 7 Steps

### 1. Company Profile
Define the basic characteristics of your target companies:
- Company size (number of employees)
- Industry vertical
- Annual revenue range
- Geographic location

### 2. Business Model
Understand their business structure:
- Business type (B2B, B2C, etc.)
- Target market
- Maturity stage
- Technology stack

### 3. Pain Points & Challenges
Identify the problems they're facing:
- Primary pain point
- Secondary pain points
- Current solutions/workarounds
- Pain severity level

### 4. Goals & Objectives
Define what they want to achieve:
- Primary goal
- Success metrics and KPIs
- Desired outcomes
- Timeline expectations

### 5. Decision Making
Map out the buying process:
- Primary decision maker
- Key influencers
- Buying committee size
- Decision criteria
- Sales cycle length

### 6. Budget & Readiness
Assess financial capacity and timing:
- Budget range
- Budget approval status
- Purchase timeframe
- Competitor usage
- Switching barriers

### 7. Review & Summary
Review all collected information and export your ICP definition.

## Usage

### Getting Started

1. Open `index.html` in a web browser
2. Fill out each step of the form
3. Use "Next Step" to proceed (validation ensures all required fields are completed)
4. Use "Previous" to go back and edit earlier steps
5. Click on completed step numbers to jump back to that step
6. On the final step, review your complete ICP
7. Click "Export ICP" to download a JSON file

### Data Persistence

Your form data is automatically saved to your browser's localStorage as you type. If you close the browser and return later, your progress will be preserved.

### Exporting Your ICP

On the final review step, click the "Export ICP" button in the header. This will download a JSON file named `icp-definition-YYYY-MM-DD.json` containing all your ICP data.

## Design System

This application uses the same design system as the BrandMap project:

- **Colors**:
  - Primary: `#667eea` (Purple/Indigo)
  - Black Header: `#000000`
  - Text: `#1a1a1a`
  - Secondary Text: `#6b7280`
  - Background: `#fafafa`
  - Error: `#ef4444`
  - Success: `#059669`

- **Typography**:
  - System font stack (San Francisco, Segoe UI, Roboto, etc.)
  - Headers: 700 weight
  - Body: 400 weight

- **Layout**:
  - Card-based design
  - Consistent spacing and padding
  - Responsive breakpoints at 768px and 480px

## Technical Details

- **Pure HTML/CSS/JavaScript** - No frameworks or build tools required
- **LocalStorage API** - For data persistence
- **Vanilla JavaScript** - Class-based architecture for form management
- **CSS Animations** - Smooth transitions between steps
- **Responsive Design** - Mobile-first approach

## Browser Support

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## File Structure

```
brandmap-icp/
├── index.html      # Main HTML structure
├── styles.css      # All styling (matches BrandMap design)
├── script.js       # Form logic and interactivity
└── README.md       # This file
```

## Use Cases

This tool is perfect for:
- **Marketing Teams** - Define target audience for campaigns
- **Sales Teams** - Align on ideal customer characteristics
- **Product Teams** - Understand who you're building for
- **Founders** - Clarify and document your target market
- **Agencies** - Help clients define their ICP

## Future Enhancements

Potential additions:
- Import existing ICP JSON files
- Multiple ICP profiles management
- Share/collaborate features
- PDF export option
- Pre-filled templates for common verticals
- Analytics on completion time

## License

This project is part of the BrandMap project suite. Open source and free to use.

## Support

For issues or questions, please refer to the main BrandMap project documentation.

