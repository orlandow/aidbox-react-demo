# Task: Setup Project

## Description
Set up the foundation for a patient intake application that will connect to an Aidbox FHIR server. This includes initializing the ReactJS project with the required tech stack, creating a Docker Compose setup for Aidbox, and establishing the basic project skeleton.

## Acceptance Criteria
- [x] Initialize ReactJS project with TypeScript
- [x] Configure Tailwind CSS and Tailwind UI
- [x] Create Docker Compose file for Aidbox instance
- [x] Set up basic project structure (components, pages, services, types)
- [x] Configure basic routing structure
- [x] Set up development tooling (linting, formatting)
- [x] Add Playwright for testing setup
- [x] Create tmux dev server setup
- [x] Verify dev server runs successfully
- [x] Create basic app skeleton with navigation

## Implementation Plan
1. **Project Initialization**
   - Create React app with TypeScript template
   - Install and configure Tailwind CSS + Tailwind UI
   
2. **Docker Setup** ✓
   - Create docker-compose.yml for Aidbox instance
   - Configure environment variables
   
3. **Project Structure**
   - Create folders: `src/components`, `src/pages`, `src/services`, `src/types`
   - Set up basic routing with React Router
   
4. **Development Setup**
   - Configure ESLint, Prettier
   - Set up Playwright testing framework
   - Create dev scripts and tmux configuration
   
5. **App Skeleton**
   - Create basic layout component
   - Set up navigation structure
   - Create placeholder pages for intake workflow

## Notes
- Authentication will be handled later (assuming open access for now)
- Focus on project skeleton rather than full FHIR integration initially
- Use Tailwind UI components where possible
- Aidbox will be available at http://localhost:8080 with admin password: Tc4ClhHAac
- Database credentials: aidbox/4bpBvM4fPL

## Completion Status
✅ **COMPLETED** - All acceptance criteria have been met:
- ReactJS project with TypeScript initialized and working
- Tailwind CSS v3.4.0 properly configured with TailwindUI styling
- Docker Compose file created for Aidbox instance
- Project structure established with components, pages, services, types folders
- React Router configured with basic routing (Dashboard, Patients, Calendar)
- Development tooling set up (ESLint, Prettier, Playwright)
- Tmux dev server configuration working
- Dev server running successfully on http://localhost:5173
- Basic app skeleton with TailwindUI-style navigation and Aidbox branding

