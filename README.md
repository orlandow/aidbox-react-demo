# Aidbox React Demo

An application built with React and TypeScript that connects to an Aidbox FHIR server for healthcare data management.

> **Note**: This proof-of-concept was developed with assistance from Claude AI to demonstrate rapid healthcare application prototyping with Aidbox.

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose

### 1. Start the Aidbox FHIR Server

```bash
docker-compose up -d
```

This starts:
- **Aidbox**: FHIR server at http://localhost:8080
- **PostgreSQL**: Database on port 54321

### 2. Configure Aidbox Access

To allow the application to access Aidbox without authentication:

1. Open Aidbox at http://localhost:8080
2. Navigate to IAM: http://localhost:8080/ui/console#/iam
3. Select **AccessPolicy**
4. Create new AccessPolicy: http://localhost:8080/ui/console#/iam/auth/AccessPolicy/new?tab=raw&create=true

Paste this JSON configuration:

```json
{
  "engine": "allow",
  "description": "full access to anonymous requests",
  "id": "open",
  "resourceType": "AccessPolicy"
}
```

⚠️ **Security Note**: This allows anonymous access to all endpoints. Use only for development.

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at http://localhost:5173

### 5. Generate Sample Data (Optional)

```bash
node scripts/generate-fake-data.js
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run check-types` - TypeScript type checking

## Application Features

- **Dashboard**: Overview with statistics and today's appointments
- **Patient Management**: Create, read, update, and delete patients
- **Patient Search**: Find patients by name, MRN, or other identifiers
- **Calendar**: View and manage appointments
- **Encounter Management**: Track patient visits and clinical encounters

## Architecture

### Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v7
- **FHIR Server**: Aidbox (HealthSamurai)
- **Database**: PostgreSQL
- **Build Tool**: Vite

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── calendar/        # Calendar-specific components
│   └── ...
├── contexts/            # React contexts (Toast notifications)
├── hooks/
│   ├── api/            # API hooks using TanStack Query
│   └── ...
├── pages/              # Route components
├── services/           # External service integrations
│   ├── aidbox.ts       # FHIR client for Aidbox
│   └── encounter.ts    # Encounter management
├── types/
│   └── fhir/          # Auto-generated FHIR R4 types
└── utils/             # Utility functions
```

### Key Architecture Decisions

#### FHIR Integration (ADR-001)

- **Type-safe FHIR client**: Generic API with automatic type inference
- **Auto-generated types**: Complete FHIR R4 TypeScript definitions
- **Resource type mapping**: Single client handles all FHIR resource types

```typescript
// Type inferred as Bundle<Patient>
const patients = await aidbox.search('Patient', { name: 'John' });

// Type inferred as Patient
const patient = await aidbox.read('Patient', '123');
```

#### FHIR Terminology Integration (ADR-002)

- **Hybrid terminology engine**: Local + external terminology server
- **ValueSet operations**: Code validation and expansion
- **Performance optimized**: Caches terminology lookups

### Data Flow

1. **UI Components** trigger actions via custom hooks
2. **API Hooks** manage server state with TanStack Query
3. **Aidbox Service** provides type-safe FHIR client
4. **Aidbox Server** handles FHIR operations and data persistence

### State Management

- **Server State**: TanStack Query for API data, caching, and synchronization
- **Client State**: React hooks and context for UI state
- **Form State**: Controlled components with validation

## FHIR Resources

The application primarily works with these FHIR resources:

- **Patient**: Demographics and identifiers
- **Appointment**: Scheduled visits
- **Encounter**: Clinical visits and status
- **Observation**: Clinical measurements and findings

All FHIR types are auto-generated and located in `src/types/fhir/`.
