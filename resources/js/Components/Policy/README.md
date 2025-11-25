# Policy Component

A React component for conditionally rendering UI elements based on user permissions in Laravel applications using Inertia.js.

## Overview

The Policy component provides a declarative way to control UI visibility based on Laravel policies. It automatically accesses the user's policies from Inertia's shared props and renders children only when permission conditions are met.

## Installation

The user's policies are automatically available via Inertia's global middleware. Import the component:

```tsx
import { Policy } from '@/Components/Policy';
```

## Component Variants

The Policy component provides three usage patterns:

### 1. `Policy.Allowed`

Renders children only if the user **has** the specified policy/policies.

### 2. `Policy.Disallowed`

Renders children only if the user **does not have** the specified policy/policies.

### 3. `Policy` (Main Component)

Supports complex conditions with both `allowed` and `disallowed` props.

## Props

### PolicyAllowed Props

| Prop       | Type                 | Default  | Description                                                                             |
| ---------- | -------------------- | -------- | --------------------------------------------------------------------------------------- |
| `policy`   | `string \| string[]` | required | Policy or array of policies to check                                                    |
| `matchAll` | `boolean`            | `false`  | If true, all policies must match (AND logic). If false, any policy can match (OR logic) |
| `children` | `ReactNode`          | required | Content to render when condition is met                                                 |

### PolicyDisallowed Props

| Prop       | Type                 | Default  | Description                                                                                |
| ---------- | -------------------- | -------- | ------------------------------------------------------------------------------------------ |
| `policy`   | `string \| string[]` | required | Policy or array of policies to check                                                       |
| `matchAll` | `boolean`            | `false`  | If true, none of the policies should match. If false, at least one policy should not match |
| `children` | `ReactNode`          | required | Content to render when condition is met                                                    |

### Policy Props

| Prop         | Type                 | Default  | Description                                          |
| ------------ | -------------------- | -------- | ---------------------------------------------------- |
| `allowed`    | `string \| string[]` | optional | Policy or array of policies that must be allowed     |
| `disallowed` | `string \| string[]` | optional | Policy or array of policies that must not be allowed |
| `matchAll`   | `boolean`            | `true`   | Controls matching logic for arrays                   |
| `children`   | `ReactNode`          | required | Content to render when all conditions are met        |

## Usage Examples

### Basic Usage - Single Policy

```tsx
// Show button only if user can view roles
<Policy.Allowed policy="App\\Policies\\RolePolicy@viewAny">
    <button>View Roles</button>
</Policy.Allowed>

// Show message only if user cannot delete
<Policy.Disallowed policy="App\\Policies\\RolePolicy@delete">
    <div>You don't have delete permissions</div>
</Policy.Disallowed>
```

### Multiple Policies - OR Logic

```tsx
// Show if user has ANY of the specified policies (default behavior)
<Policy.Allowed policy={['App\\Policies\\RolePolicy@viewAny', 'App\\Policies\\RolePolicy@create']}>
    <button>Manage Roles</button>
</Policy.Allowed>
```

### Multiple Policies - AND Logic

```tsx
// Show only if user has ALL of the specified policies
<Policy.Allowed
    policy={['App\\Policies\\RolePolicy@viewAny', 'App\\Policies\\RolePolicy@create']}
    matchAll
>
    <button>Advanced Role Management</button>
</Policy.Allowed>
```

### Complex Conditions

```tsx
// Show only if user can view BUT cannot delete
<Policy
    allowed="App\\Policies\\RolePolicy@viewAny"
    disallowed="App\\Policies\\RolePolicy@delete"
>
    <button>View Roles (Read Only)</button>
</Policy>

// Show if user has viewAny AND create, but NOT delete
<Policy
    allowed={['App\\Policies\\RolePolicy@viewAny', 'App\\Policies\\RolePolicy@create']}
    disallowed="App\\Policies\\RolePolicy@delete"
    matchAll
>
    <button>Create & View (No Delete)</button>
</Policy>
```

### Conditional Action Lists

```tsx
const actions = [
    { label: 'View', policy: 'App\\Policies\\RolePolicy@view' },
    { label: 'Create', policy: 'App\\Policies\\RolePolicy@create' },
    { label: 'Update', policy: 'App\\Policies\\RolePolicy@update' },
    { label: 'Delete', policy: 'App\\Policies\\RolePolicy@delete' },
];

return (
    <div>
        {actions.map((action) => (
            <Policy.Allowed key={action.label} policy={action.policy}>
                <button>{action.label}</button>
            </Policy.Allowed>
        ))}
    </div>
);
```

### Nested Policy Checks

```tsx
<Policy.Allowed policy="App\\Policies\\RolePolicy@viewAny">
    <div>
        <h2>Roles Management</h2>

        <Policy.Allowed policy="App\\Policies\\RolePolicy@create">
            <button>Create New Role</button>
        </Policy.Allowed>

        <Policy.Allowed policy="App\\Policies\\RolePolicy@update">
            <button>Edit Roles</button>
        </Policy.Allowed>

        <Policy.Allowed policy="App\\Policies\\RolePolicy@delete">
            <button>Delete Roles</button>
        </Policy.Allowed>
    </div>
</Policy.Allowed>

<Policy.Disallowed policy="App\\Policies\\RolePolicy@viewAny">
    <div>Access denied to roles management</div>
</Policy.Disallowed>
```

## Policy Format

Policies should be formatted as: `PolicyClass@abilityName`

Example: `App\\Policies\\RolePolicy@viewAny`

This matches the format returned by Laravel and stored in the `policies` table.

## How It Works

1. The backend `HandleInertiaRequests` middleware shares the user's policies on every page load
2. Policies are available in Inertia props as an array of strings
3. The Policy component checks if the user's policies include the required permissions
4. Children are rendered or hidden based on the permission check

## Technical Details

### Matching Logic

- **OR Logic (default)**: When `matchAll={false}`, the user needs at least ONE of the specified policies
- **AND Logic**: When `matchAll={true}`, the user needs ALL of the specified policies

### Performance

- Policies are loaded once per page via Inertia's shared data
- No additional API calls are made
- Permission checks happen in-memory on the client side
- Suitable for controlling UI visibility (not security enforcement)

## Security Note

⚠️ **Important**: This component controls UI visibility only. Always enforce permissions on the backend using Laravel's authorization features. Never rely solely on frontend permission checks for security.

## TypeScript Support

The component is fully typed. The `policies` prop is typed as `string[]` in the Inertia PageProps.

```typescript
import { usePage } from '@inertiajs/react';

const { policies } = usePage<{ policies?: string[] }>().props;
```

## Related Files

- `Policy.tsx` - Main component with composition
- `PolicyAllowed.tsx` - Sub-component for allowed checks
- `PolicyDisallowed.tsx` - Sub-component for disallowed checks
- `utils.ts` - Shared helper functions
- `app/Http/Middleware/HandleInertiaRequests.php` - Backend middleware that shares policies
