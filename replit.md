# Baynunah HR Portal - Landing Page

## Overview
A clean HR portal landing page for Baynunah Group featuring a circular 2x2 quadrant menu with glassmorphism/liquid glass styling. Migrated from Streamlit to React + Express + TypeScript.

## Current State
- **Status**: Landing Page Complete
- **Last Updated**: December 30, 2025
- **Custom Domain**: hr.baynunah.ae (configured separately)

## Architecture
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS v4
- **Backend**: Express.js with Vite middleware
- **Ports**: 
  - Streamlit wrapper on port 5000 (for Replit workflow)
  - React/Express server on port 5001 (embedded via iframe)

## Features

### Landing Page
- **Header**: Baynunah logo with portal title
- **4 Category Buttons**: 
  - Employees (Coming Soon)
  - Onboarding (Coming Soon)
  - External Users (Coming Soon)
  - Admin (Coming Soon)

### Menu Design
- 2x2 quadrant grid with rounded corners forming circular shape
- Each quadrant has unique corner radius (top-left, top-right, bottom-left, bottom-right)
- 160px quarter-circle buttons with glassmorphism/liquid glass effect
- SVG outline icons in fluorescent green (#39FF14)
- Hover animations using React state + inline styles

### Button Styling (Glassmorphism)
- Light gray background (#e8e8e8) with soft shadows
- Backdrop-filter blur with semi-transparent gradients
- Multi-layer shadows for depth
- Hover animations:
  - TranslateY lift (-0.8em)
  - Background change to dark (#171717)
  - Text and icon color change to white

### Footer
- "Conceptualised by Baynunah|HR|IS"

## Technical Details
- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4 with @tailwindcss/postcss
- **Build Tool**: Vite
- **Design**: Glassmorphism theme with dotted grid background
- **Font**: Poppins (Google Fonts)

## Project Structure
```
/
├── app.py                    # Streamlit wrapper (port 5000, embeds iframe)
├── client/
│   ├── src/
│   │   ├── App.tsx           # Main React component with landing page
│   │   ├── index.css         # Tailwind imports + custom styles
│   │   └── main.tsx          # React entry point
│   └── index.html            # HTML template
├── server/
│   └── index.ts              # Express server with Vite middleware
├── attached_assets/
│   └── logo_*.png            # Baynunah logo
├── vite.config.js            # Vite configuration (port 5001)
├── postcss.config.js         # PostCSS with @tailwindcss/postcss
├── tailwind.config.js        # Tailwind configuration
├── package.json              # Node dependencies
└── replit.md                 # This documentation
```

## Running the Application
```bash
streamlit run app.py --server.port 5000
```
This starts Streamlit which in turn launches the Express/Vite server on port 5001.

## Customization Notes
This is a clean landing page template. To add functionality:
1. **Employees Section**: Add employee data source and login
2. **Onboarding Section**: Add onboarding workflow content
3. **External Users**: Add partner/contractor portal features
4. **Admin Portal**: Add password protection and admin features
