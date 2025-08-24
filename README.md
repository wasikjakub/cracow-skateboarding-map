# Cracow Skateboarding Map

An interactive map showcasing skateboarding spots in Krakow, Poland. Built with React, Leaflet, and modern web technologies.

## Features

- **Interactive Map**: View skateboarding spots across Krakow with Leaflet integration
- **Spot Details**: Click on markers to see detailed information and images
- **Add New Spots**: Submit your favorite skateboarding locations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Image Gallery**: Browse through multiple images for each spot

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Footer.jsx      # Common footer component
│   └── Modal.jsx       # Reusable modal component
├── constants/           # Application constants
│   └── formOptions.js  # Form options and endpoints
├── styles/              # CSS stylesheets
│   └── App.css         # Main application styles
├── utils/               # Utility functions
│   └── mapUtils.js     # Map initialization and utilities
├── App.jsx              # Main application component
├── Home.jsx             # Home page with map
├── AddSpot.jsx          # Add new spot form
├── SpotDetails.jsx      # Spot information display
└── spots.json           # Skateboarding spots data
```

## Key Improvements Made

### 🧹 **Code Cleanup**
- Removed all inline styles and moved them to dedicated CSS files
- Eliminated code duplication across components
- Created reusable utility functions for map operations

### 🏗️ **Better Organization**
- Separated concerns: components, styles, utilities, and constants
- Created reusable components for common UI elements
- Centralized map configuration and utilities

### 🎨 **Improved Styling**
- Consistent CSS classes and naming conventions
- Responsive design with proper media queries
- Hover effects and smooth transitions

### 🔧 **Maintainability**
- Easy to modify styles without touching component logic
- Centralized constants for easy updates
- Clean, readable component structure

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Technologies Used

- **React 19** - Modern React with hooks
- **Leaflet** - Interactive maps
- **Vite** - Fast build tool
- **CSS3** - Modern styling with custom properties

## Contributing

Feel free to submit new spots or contribute to the codebase. The project is now much cleaner and easier to maintain!

---

*For skaters, by skaters - made by [@kubifoczka](https://www.instagram.com/kubifoczka/)*
