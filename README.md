# Peachme Frontend

A modern web application built with Next.js for the Peachme platform.

## Project Overview

Peachme is a platform that helps users create and share content. This repository contains the frontend codebase built with Next.js, React, and Tailwind CSS.

## Directory Structure

The project follows a standard Next.js structure:

```
peachme/
├── app/                  # Next.js app directory (pages, layouts)
├── components/           # Reusable React components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and libraries
├── public/               # Static assets
├── styles/               # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Peachme-Frontend.git
cd Peachme-Frontend
```

2. Navigate to the peachme directory:
```bash
cd peachme
```

3. Install dependencies:
```bash
npm install
```

> **Note:** If you encounter dependency conflicts, the project includes a `.npmrc` file that automatically uses the `legacy-peer-deps` flag to resolve these issues.

### Running the Development Server

```bash
npm run dev
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
npm run build
```

### Starting Production Server

```bash
npm start
```

## Key Features

- Modern UI with Tailwind CSS
- Component-based architecture
- Responsive design
- Animations and transitions

## Dependencies

The project uses several key dependencies:

- **Next.js**: React framework for production
- **React**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible components
- **Framer Motion**: Animation library
- **date-fns**: Date utility library

## Troubleshooting

### Dependency Issues

If you encounter dependency conflicts when installing packages, try:

```bash
npm install --legacy-peer-deps
```

The project includes a `.npmrc` file that should handle this automatically.

### App Directory Not Found

If you encounter an error about the app directory not being found, ensure you're in the correct directory:

```bash
cd Peachme-Frontend/peachme
```

## License

[MIT License](LICENSE)

## Contact

For questions or support, please open an issue in the repository.