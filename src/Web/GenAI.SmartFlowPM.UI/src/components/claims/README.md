# Claims Module

The Claims module provides a complete frontend implementation for managing system claims and permissions, following the same design patterns as the User and Role modules.

## Components

### 1. Claims (Main Component)
The main orchestrator component that handles navigation between different views.

```tsx
import { Claims } from '@/components/claims';

// Usage
<Claims onBack={() => navigate('/dashboard')} />
```

### 2. ClaimCockpit
Card-based listing view with search, filtering, pagination, and CRUD operations.

**Features:**
- Card-based layout with claim details
- Search by name, type, or description
- Filter by status (Active/Inactive)
- Pagination support
- Export to CSV functionality
- Inline actions (View, Edit, Delete, Toggle Status)
- Toast notifications for all operations

### 3. NewClaim
Form component for creating new claims.

**Features:**
- Comprehensive form validation
- Claim type suggestions (datalist)
- Character count for description
- Status toggle
- Toast notifications
- Error handling

### 4. EditClaim
Form component for editing existing claims.

**Features:**
- Pre-populated form with existing data
- Same validation as NewClaim
- Metadata display (Created/Updated dates)
- Toast notifications
- Error handling

### 5. ViewClaim
Read-only view component (uses EditClaim with readOnly flag).

**Features:**
- Non-editable form fields
- Metadata display
- Clean read-only styling

## Service Layer

### ClaimService
Complete API integration service with all CRUD operations:

```typescript
import { claimService } from '@/services/claim.service';

// Get paginated claims
const claims = await claimService.getClaims(1, 10, 'permission');

// Get all active claims
const activeClaims = await claimService.getActiveClaims();

// CRUD operations
const newClaim = await claimService.createClaim(createDto);
const updatedClaim = await claimService.updateClaim(id, updateDto);
await claimService.deleteClaim(id);

// Toggle status
const toggledClaim = await claimService.toggleClaimStatus(id, true);
```

## Data Types

### ClaimDto
```typescript
interface ClaimDto {
  id: string;
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
```

### CreateClaimDto
```typescript
interface CreateClaimDto {
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
}
```

### UpdateClaimDto
```typescript
interface UpdateClaimDto {
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
}
```

## Design Patterns

### UI/UX Consistency
- **Card-based Layout**: Consistent with User and Role modules
- **Color Scheme**: Primary-600 theme throughout
- **Icons**: Lucide React icons with Shield as primary icon
- **Typography**: Consistent font weights and sizes
- **Spacing**: Standard Tailwind spacing classes

### State Management
- **Service-based**: No complex state management, uses service calls
- **Toast Notifications**: Consistent success/error messaging
- **Error Handling**: Comprehensive error boundaries and user feedback

### Form Patterns
- **Validation**: Client-side validation with server-side error handling
- **Loading States**: Loading indicators during API calls
- **Accessibility**: Proper labels, ARIA attributes, keyboard navigation

### Navigation
- **Parent-controlled**: Navigation handled by parent components
- **Callback-based**: Uses callback props for navigation events
- **State preservation**: Maintains view state during navigation

## Backend Integration

The frontend integrates with a complete backend API:

- **GET** `/api/claims` - Paginated list
- **GET** `/api/claims/{id}` - Get by ID
- **GET** `/api/claims/by-name/{name}` - Get by name
- **GET** `/api/claims/active` - Get active claims
- **POST** `/api/claims` - Create new claim (Admin only)
- **PUT** `/api/claims/{id}` - Update claim (Admin only)
- **DELETE** `/api/claims/{id}` - Delete claim (Admin only)

## Common Claim Types

The system suggests common claim types:
- `permission` - General permissions
- `feature` - Feature access
- `resource` - Resource access
- `action` - Specific actions
- `view`, `edit`, `delete`, `create` - CRUD operations
- `manage` - Management permissions

## Usage Examples

### Basic Integration
```tsx
import { Claims } from '@/components/claims';

function ManagePage() {
  return (
    <div className="h-screen">
      <Claims onBack={() => router.push('/dashboard')} />
    </div>
  );
}
```

### Individual Components
```tsx
import { ClaimCockpit, NewClaim } from '@/components/claims';

// Just the listing
<ClaimCockpit 
  onEdit={handleEdit}
  onView={handleView}
  onAddNew={handleAddNew}
/>

// Just the form
<NewClaim 
  onClaimCreated={handleCreated}
  onCancel={handleCancel}
/>
```

## Features Included

✅ **Complete CRUD Operations**
✅ **Search and Filtering**
✅ **Pagination Support**
✅ **Export Functionality**
✅ **Toast Notifications**
✅ **Error Handling**
✅ **Loading States**
✅ **Responsive Design**
✅ **Accessibility Features**
✅ **Form Validation**
✅ **Type Safety (TypeScript)**
✅ **Service Layer Integration**
✅ **Consistent UI/UX with Role/User modules**

The Claims module is now ready for production use and follows all established patterns from the User and Role modules!
