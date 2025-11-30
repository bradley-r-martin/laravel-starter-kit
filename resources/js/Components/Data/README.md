# Data Component

A React component for extracting and transforming data from Inertia page props or modal props and passing it to child components in Laravel applications using Inertia.js.

## Overview

The Data component provides a declarative way to access data from Inertia's page props or modal props, optionally transform it, and pass it to child components. It automatically handles data extraction from both full-page views and modal contexts, making it ideal for populating form inputs, dropdowns, and other data-driven UI elements.

## Installation

The component is available in the components directory. Import it:

```tsx
import Data from '@/Components/Data/Data';
```

## Props

| Prop        | Type                  | Default  | Description                                                            |
| ----------- | --------------------- | -------- | ---------------------------------------------------------------------- |
| `parameter` | `string`              | required | The name of the prop to extract from Inertia page props or modal props |
| `property`  | `string`              | `'data'` | The property name to pass the data to child components                 |
| `map`       | `(value: any) => any` | optional | Transformation function to map each item in the data array             |
| `fallback`  | `any`                 | optional | Value to use when data is not available or is empty                    |
| `children`  | `ReactNode`           | required | Child component(s) that will receive the data as a prop                |

## How It Works

1. The component first checks for data in modal props (if within a modal context)
2. Falls back to page props if modal props are not available
3. Optionally transforms the data using the `map` function
4. Passes the transformed data to child components via the Slot component
5. Uses the specified `property` name (defaults to `'data'`) to pass data to children

## Usage Examples

### Basic Usage - Passing Data to Select Input

```tsx
<Field name="product_type_id" type="select">
    <Data parameter="product_types">
        <Select label="Product Type" name="product_type_id" />
    </Data>
</Field>
```

### Transforming Data with Map Function

Transform data to match the expected format of child components (e.g., `{ value, label }` for Select inputs):

```tsx
<Field name="product_type_id" type="select">
    <Data
        parameter="product_types"
        map={(item: Models.ProductType) => ({
            value: item.id,
            label: item.name,
        })}
    >
        <Select label="Product Type" name="product_type_id" searchable />
    </Data>
</Field>
```

### Using Custom Property Name

Pass data with a custom property name (useful for components that expect different prop names):

```tsx
<Field name="policies" type="transfer">
    <Data parameter="availablePolicies" property="items">
        <TransferInput
            label="Policies"
            className="max-h-[300px]"
            renderItem={(item) => (
                <span className="flex flex-col items-start space-x-2">
                    <span>{item.label}</span>
                    <span className="text-xs text-zinc-500">{item.group}</span>
                </span>
            )}
        />
    </Data>
</Field>
```

### Multiple Data Sources

The component automatically handles both page props and modal props:

```tsx
// Works in both full-page views and modals
<Data parameter="manufacturers">
    <Select label="Manufacturer" name="manufacturer_id" />
</Data>
```

### Using Fallback Values

Provide a fallback when data might not be available:

```tsx
<Data parameter="products" fallback={[]}>
    <Select label="Product" name="product_id" />
</Data>
```

### Complex Data Transformation

Transform complex data structures:

```tsx
<Data
    parameter="availableProducts"
    map={(product: Models.Product) => ({
        value: product.id,
        label: product.name,
        group: product.manufacturer?.name || 'Other',
        disabled: product.discontinued,
    })}
    property="items"
>
    <TransferInput label="Products" />
</Data>
```

### Real-World Example - Product Creation Form

```tsx
<Form form={form} action={{ url: route('products.store'), method: 'post' }}>
    <Stack>
        <Field name="product_type_id" type="select">
            <Data
                parameter="product_types"
                map={(i: Models.ProductType) => ({
                    value: i.id,
                    label: i.name,
                })}
            >
                <Select label="Product Type" name="product_type_id" searchable />
            </Data>
        </Field>

        <Field name="manufacturer_id" type="select">
            <Data
                parameter="manufacturers"
                map={(i: Models.Manufacturer) => ({
                    value: i.id,
                    label: i.name,
                })}
            >
                <Select label="Manufacturer" name="manufacturer_id" searchable />
            </Data>
        </Field>
    </Stack>
</Form>
```

### Real-World Example - Expense Item Selection

```tsx
<Field name="product_id" type="select" live>
    <Data parameter="products" map={(d: any) => ({ value: d.id, label: d.name })}>
        <Select variant="transparent" placeholder="Select a product" searchable clearable />
    </Data>
</Field>
```

## Data Source Priority

The component checks for data in the following order:

1. **Modal Props** (if within a modal context): `useModal()?.props?.[parameter]`
2. **Page Props**: `page.props[parameter]`

This allows the same component to work seamlessly in both full-page views and modal contexts.

## Technical Details

### Slot Component Integration

The Data component uses the Slot component to pass props to its children. The Slot component merges props with child component props, allowing the data to be seamlessly passed down.

### Data Transformation

The `map` function is applied to each item in the data array. If no `map` function is provided, the data is passed through unchanged:

```tsx
// Without map - passes raw data
<Data parameter="products">
    <CustomComponent />
</Data>

// With map - transforms each item
<Data
    parameter="products"
    map={(product) => ({ id: product.id, name: product.name })}
>
    <CustomComponent />
</Data>
```

### Type Safety

The component accepts `any` types for flexibility, but you can type the data in your map function:

```tsx
<Data
    parameter="product_types"
    map={(item: Models.ProductType) => ({
        value: item.id,
        label: item.name,
    })}
>
    <Select />
</Data>
```

## Common Use Cases

1. **Populating Select/Dropdown Inputs**: Transform model data into `{ value, label }` format
2. **Populating Transfer Lists**: Transform data into the format expected by TransferInput components
3. **Passing Data to Custom Components**: Extract and pass data to any component that needs it
4. **Modal Context Support**: Automatically handle data from both page and modal contexts

## Backend Integration

Ensure your Laravel controllers pass the required data in Inertia responses:

```php
// In a controller
return inertia()->render('Product/Create', [
    'product_types' => ProductType::all(),
    'manufacturers' => Manufacturer::all(),
]);

// Or in a modal
return inertia()->modal('Product/Create')->baseRoute('products.index')->with([
    'product_types' => ProductType::all(),
    'manufacturers' => Manufacturer::all(),
]);
```

## Related Files

- `Data.tsx` - Main component implementation
- `../Slot/Slot.tsx` - Slot component used for prop passing
- `@inertiajs/react` - Inertia React integration
- `@inertiaui/modal-react` - Modal context provider
