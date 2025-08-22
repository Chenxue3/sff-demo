# SFF Demo - Consumer Demand Analysis & Beef Interactive Project

## Project Overview

This project is a React-based frontend application that implements two core features:
1. **Consumer Demand Analysis Page** - Based on existing word frequency data, displays consumer demand statistics with support for brand, region, and consumption habit categorization
2. **Beef Interactive Page** - Draws a cow shape where users can click different parts to view characteristics and navigate to purchase pages

## Features

### Consumer Demand Analysis
- Display consumer demand data visualization charts
- Support filtering by categories (brands, regions, consumption habits)
- Automatic translation of Chinese words to English
- Responsive design supporting multiple devices

### Beef Interactive Experience
- Interactive cow shape graphic
- Click on different parts to display corresponding information
- Show meat characteristics and nutritional value
- Provide purchase links

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`

## Project Structure

```
sff-demo/
├── src/
│   ├── components/
│   │   ├── ConsumerAnalysis/     # Consumer demand analysis components
│   │   ├── BeefInteractive/      # Beef interactive components
│   │   └── common/               # Shared components
│   ├── pages/                    # Page components
│   ├── data/                     # Data processing
│   ├── utils/                    # Utility functions
│   ├── types/                    # TypeScript definitions
│   ├── hooks/                    # Custom hooks
│   └── styles/                   # Global styles
├── public/                       # Static assets
└── docs/                         # Documentation
```

## Data Sources

- Consumer demand data from `word_frequency/json/` directory
- Beef parts information and characteristics
- Translation data for Chinese to English conversion
