# Patient API Integration

This project now includes API integration with the backend PatientController.

## Features Added

### 1. API Service (`src/services/api.ts`)
- Axios configuration with base URL: `http://localhost:8000/api`
- Automatic token injection from localStorage
- Error handling for 401 responses (redirects to login)
- Patient API endpoints:
  - `getAllPatients()` - GET /patients
  - `getPatientById(id)` - GET /patients/{id}
  - `createPatient(data)` - POST /patients
  - `updatePatient(id, data)` - PUT /patients/{id}
  - `deletePatient(id)` - DELETE /patients/{id}

### 2. Updated Dashboard Component (`src/pages/Dashboard.tsx`)
- Added state management for patients, loading, and error states
- Integrated API calls to fetch patients when "patients" view is selected
- Added delete functionality with confirmation dialog
- Loading spinner and error handling

### 3. Updated PatientsInfo Component (`src/components/PatientsInfo.tsx`)
- Added delete confirmation dialog
- Integrated with parent component delete handler
- Proper TypeScript interfaces for backend patient data

### 4. Backend API Routes (`backend/backend/routes/api.php`)
- Added missing patient routes:
  - GET /patients/{id} - Get individual patient
  - POST /patients - Create new patient
  - PUT /patients/{id} - Update patient

## How to Use

1. **Start the backend server:**
   ```bash
   cd backend/backend
   php artisan serve
   ```

2. **Start the frontend development server:**
   ```bash
   cd zdravstveni_karton_frontend/zdravstveni-karton
   npm run dev
   ```

3. **Login to get authentication token:**
   - The token will be automatically stored in localStorage
   - API calls will include the token in Authorization header

4. **Navigate to Patients section:**
   - Click on "Patients" in the sidebar
   - The component will automatically fetch patients from the API
   - You can delete patients using the delete button (with confirmation)

## API Endpoints Available

- `GET /api/patients` - Get all patients (with role-based filtering)
- `GET /api/patients/{id}` - Get specific patient
- `POST /api/patients` - Create new patient (admin only)
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient (admin only)

## Error Handling

- Network errors are displayed as alerts
- 401 errors automatically redirect to login
- Loading states are shown during API calls
- Delete operations require confirmation

## Data Structure

The API returns patient data in this format:
```typescript
interface BackendPatient {
  id: number;
  jmbg: string;
  gender: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  medical_record?: {
    id: number;
    blood_type: string;
  };
}
```
