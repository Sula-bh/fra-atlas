# Forest Rights Act Atlas

A comprehensive digital platform for managing and visualizing Forest Rights Act (FRA) claims, satellite mapping, and decision support systems for tribal affairs.

## Overview

The Forest Rights Act Atlas is a geospatial web application designed to digitize and streamline the management of forest rights claims in India. It provides role-based access for administrators and gram sabha members to manage claims, verify documents, analyze data, and visualize forest rights information on interactive maps.

## Key Features

- **Interactive Mapping**: Real-time visualization of forest rights claims, watershed data, land use, and forest cover using Leaflet
- **Claims Management**: Digital repository for Individual Forest Rights (IFR), Community Rights (CR), and Community Forest Rights (CFR)
- **Verification System**: Streamlined approval workflow for claims verification
- **Geospatial Analysis**: Satellite imagery integration and spatial analytics
- **Patta Digitalizer**: Digital conversion of land ownership documents
- **Role-Based Access**: Separate dashboards and permissions for administrators and gram sabha members
- **Search & Filter**: Advanced search functionality with claim type filtering

## Project Info

**URL**: https://lovable.dev/projects/ceceb477-1b94-47bb-9e3f-a7017b788f45

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/ceceb477-1b94-47bb-9e3f-a7017b788f45) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library

### Mapping & Geospatial
- **Leaflet** - Interactive mapping library
- **@types/leaflet** - TypeScript definitions for Leaflet

### State Management & Data
- **TanStack Query (React Query)** - Server state management
- **React Router v6** - Client-side routing
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### UI Components & Libraries
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Icon library
- **Recharts** - Data visualization
- **Sonner** - Toast notifications
- **date-fns** - Date utilities

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Class Variance Authority** - Component variant management
- **clsx & tailwind-merge** - Conditional styling utilities

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ceceb477-1b94-47bb-9e3f-a7017b788f45) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
