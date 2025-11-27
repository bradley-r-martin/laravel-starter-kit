# Cast Component

A React component collection for formatting and displaying values in Laravel applications using Inertia.js. Provides consistent formatting for currency, percentages, dates, and addresses.

## Overview

The Cast component provides a declarative way to format and display various data types in your application. It consists of four specialized sub-components that handle currency, percentage, datetime, and address formatting with consistent error handling and customizable display options.

## Installation

The component is available in the components directory. Import it:

```tsx
import Cast from '@/Components/Cast';
```

## Component Variants

The Cast component provides four formatting variants:

### 1. `Cast.Currency`

Formats numeric values as currency. Automatically divides by 100 (assumes values are stored in cents).

### 2. `Cast.Percentage`

Formats numeric values as percentages.

### 3. `Cast.Datetime`

Formats date/time strings using dayjs.

### 4. `Cast.Address`

Formats address objects as strings or envelope-style multi-line addresses.

## Props

### Cast.Currency Props

| Prop          | Type                    | Default      | Description                                                                 |
| ------------- | ----------------------- | ------------ | --------------------------------------------------------------------------- |
| `children`    | `number \| null`        | required     | The numeric value to format (stored in cents, will be divided by 100)       |
| `format`      | `string`                | `'$0,0.00'`  | Numbro format string for currency display                                   |
| `fallback`    | `ReactNode`             | `'Err'`      | Content to display when formatting fails or value is invalid                |
| `leftSection` | `ReactNode`             | optional     | Content to display before the formatted value                               |
| `rightSection`| `ReactNode`             | optional     | Content to display after the formatted value                                |

### Cast.Percentage Props

| Prop          | Type                    | Default      | Description                                                                 |
| ------------- | ----------------------- | ------------ | --------------------------------------------------------------------------- |
| `children`    | `number \| null`        | required     | The numeric value to format as a percentage                                |
| `format`      | `string`                | `'0.00%'`    | Numbro format string for percentage display                                 |
| `fallback`    | `ReactNode`             | `'Err'`      | Content to display when formatting fails or value is invalid                |
| `leftSection` | `ReactNode`             | optional     | Content to display before the formatted value                               |
| `rightSection`| `ReactNode`             | optional     | Content to display after the formatted value                                |

### Cast.Datetime Props

| Prop          | Type                    | Default      | Description                                                                 |
| ------------- | ----------------------- | ------------ | --------------------------------------------------------------------------- |
| `children`    | `string \| null`        | required     | The date/time string to format                                              |
| `format`      | `string`                | `'DD/MM/YYYY'`| Dayjs format string for date display                                        |
| `fallback`    | `ReactNode`             | `'Err'`      | Content to display when formatting fails or value is null/invalid          |
| `leftSection` | `ReactNode`             | optional     | Content to display before the formatted value                               |
| `rightSection`| `ReactNode`             | optional     | Content to display after the formatted value                                |

### Cast.Address Props

| Prop          | Type                    | Default      | Description                                                                 |
| ------------- | ----------------------- | ------------ | --------------------------------------------------------------------------- |
| `children`    | `Domain.Address \| null`| required     | The address object to format                                                |
| `format`      | `'envelope' \| 'string'`| `'string'`   | Format style: 'string' for single-line, 'envelope' for multi-line          |
| `fallback`    | `ReactNode`             | `'Err'`      | Content to display when formatting fails or value is null/invalid          |
| `leftSection` | `ReactNode`             | optional     | Content to display before the formatted value                               |
| `rightSection`| `ReactNode`             | optional     | Content to display after the formatted value                                |

## Usage Examples

### Currency Formatting

#### Basic Usage

```tsx
// Display currency value (assumes value is stored in cents)
<Cast.Currency>{product.price}</Cast.Currency>
// Output: $1,234.56 (if product.price = 123456)

// With fallback for null values
<Cast.Currency fallback="—">{product.cost}</Cast.Currency>
```

#### Custom Format

```tsx
// Custom currency format
<Cast.Currency format="$0.00">{product.price}</Cast.Currency>
// Output: $1234.56 (no thousands separator)

// Different currency symbol
<Cast.Currency format="€0,0.00">{product.price}</Cast.Currency>
```

#### With Sections

```tsx
// Add text after the currency value
<Cast.Currency rightSection=" lost revenue">
    {site.__shrinkage_value}
</Cast.Currency>
// Output: $1,234.56 lost revenue

// Add icon before the currency value
<Cast.Currency leftSection={<DollarIcon />}>
    {expense.__cost}
</Cast.Currency>
```

#### In Tables

```tsx
{
    header: 'Price',
    accessor: 'price',
    render: (product) => (
        <Text size="sm" c="dimmed">
            <Cast.Currency children={product.price} fallback="—" />
        </Text>
    ),
}
```

### Percentage Formatting

#### Basic Usage

```tsx
// Display percentage
<Cast.Percentage>{site.__shrinkage_percentage}</Cast.Percentage>
// Output: 12.34%

// With fallback
<Cast.Percentage fallback="N/A">{discount}</Cast.Percentage>
```

#### Custom Format

```tsx
// No decimal places
<Cast.Percentage format="0%">{value}</Cast.Percentage>
// Output: 12%

// With one decimal place
<Cast.Percentage format="0.0%">{value}</Cast.Percentage>
// Output: 12.3%
```

#### In Tooltips

```tsx
<Tooltip
    label={
        <Cast.Currency rightSection=" lost revenue">
            {site.__shrinkage_value}
        </Cast.Currency>
    }
>
    <span>
        <Cast.Percentage>{site.__shrinkage_percentage}</Cast.Percentage>
    </span>
</Tooltip>
```

### Datetime Formatting

#### Basic Usage

```tsx
// Display date with default format
<Cast.Datetime>{user.created_at}</Cast.Datetime>
// Output: 15/03/2024

// With fallback
<Cast.Datetime format="DD/MM/YYYY" fallback="—">
    {user.created_at}
</Cast.Datetime>
```

#### Custom Formats

```tsx
// Full date and time
<Cast.Datetime format="DD/MM/YYYY HH:mm">
    {expense.invoice_date}
</Cast.Datetime>
// Output: 15/03/2024 14:30

// Month and year only
<Cast.Datetime format="MMMM YYYY">
    {product.created_at}
</Cast.Datetime>
// Output: March 2024

// ISO format
<Cast.Datetime format="YYYY-MM-DD">
    {route.created_at}
</Cast.Datetime>
// Output: 2024-03-15
```

#### In Tables

```tsx
{
    header: 'Created',
    accessor: 'created_at',
    render: (user) => (
        <Cast.Datetime format="DD/MM/YYYY" children={user.created_at} fallback="—" />
    ),
}
```

### Address Formatting

#### String Format (Single Line)

```tsx
// Default string format (single line)
<Cast.Address>{site.address}</Cast.Address>
// Output: 123 Main Street, Suburb, State 1234, Country
```

#### Envelope Format (Multi-Line)

```tsx
// Envelope format (multi-line, uppercase)
<Cast.Address format="envelope">
    {site.address}
</Cast.Address>
// Output:
// BUILDING NAME, Level 2
// 123 MAIN STREET
// SUBURB STATE 1234
// COUNTRY
```

#### With Fallback

```tsx
<Cast.Address fallback="No address provided">
    {customer.address}
</Cast.Address>
```

#### In Description Lists

```tsx
<DescriptionList.Item>
    <DescriptionList.Item.Label>Address</DescriptionList.Item.Label>
    <DescriptionList.Item.Value className="whitespace-pre-wrap">
        <Cast.Address format="envelope">
            {site.address}
        </Cast.Address>
    </DescriptionList.Item.Value>
</DescriptionList.Item>
```

## Real-World Examples

### Product List Table

```tsx
const columns = [
    {
        header: 'Cost',
        accessor: 'cost',
        render: (product) => (
            <Text size="sm" c="dimmed">
                <Cast.Currency children={product.cost} fallback="—" />
            </Text>
        ),
    },
    {
        header: 'Price',
        accessor: 'price',
        render: (product) => (
            <Text size="sm" c="dimmed">
                <Cast.Currency children={product.price} fallback="—" />
            </Text>
        ),
    },
    {
        header: 'Rebate',
        accessor: 'rebate',
        render: (product) => (
            <Text size="sm" c="dimmed">
                <Cast.Currency children={product.rebate} fallback="—" />
            </Text>
        ),
    },
];
```

### Expense Details Worksheet

```tsx
<Table.Tbody.Td data-title="RRP">
    {item.product_id ? (
        <Cast.Currency>{item.price}</Cast.Currency>
    ) : (
        ''
    )}
</Table.Tbody.Td>
<Table.Tbody.Td data-title="Royalty">
    {item.product_id ? (
        <Cast.Currency>{item.royalty}</Cast.Currency>
    ) : (
        ''
    )}
</Table.Tbody.Td>
```

### Site Detail Page

```tsx
<DescriptionList.Item>
    <DescriptionList.Item.Label>Shrinkage</DescriptionList.Item.Label>
    <DescriptionList.Item.Value>
        <Tooltip
            label={
                <Cast.Currency rightSection=" lost revenue">
                    {site.__shrinkage_value}
                </Cast.Currency>
            }
        >
            <span>
                <Cast.Percentage>
                    {site.__shrinkage_percentage}
                </Cast.Percentage>
            </span>
        </Tooltip>
    </DescriptionList.Item.Value>
</DescriptionList.Item>

<DescriptionList.Item>
    <DescriptionList.Item.Label>Address</DescriptionList.Item.Label>
    <DescriptionList.Item.Value className="whitespace-pre-wrap">
        <Cast.Address format="envelope">
            {site.address}
        </Cast.Address>
    </DescriptionList.Item.Value>
</DescriptionList.Item>
```

## Format Strings

### Currency Format (Numbro)

The currency component uses [Numbro](https://numbrojs.com/) for formatting. Common format strings:

- `'$0,0.00'` - Default: $1,234.56
- `'$0.00'` - No thousands separator: $1234.56
- `'$0,0'` - No decimals: $1,235
- `'€0,0.00'` - Euro symbol: €1,234.56
- `'£0,0.00'` - Pound symbol: £1,234.56

### Percentage Format (Numbro)

- `'0.00%'` - Default: 12.34%
- `'0%'` - No decimals: 12%
- `'0.0%'` - One decimal: 12.3%
- `'0.000%'` - Three decimals: 12.345%

### Datetime Format (Dayjs)

The datetime component uses [Day.js](https://day.js.org/) for formatting. Common format strings:

- `'DD/MM/YYYY'` - Default: 15/03/2024
- `'MM/DD/YYYY'` - US format: 03/15/2024
- `'YYYY-MM-DD'` - ISO format: 2024-03-15
- `'DD/MM/YYYY HH:mm'` - With time: 15/03/2024 14:30
- `'MMMM YYYY'` - Month and year: March 2024
- `'dddd, MMMM D, YYYY'` - Full date: Friday, March 15, 2024

See [Day.js format documentation](https://day.js.org/docs/en/display/format) for all available tokens.

### Address Formats

- `'string'` - Single-line format: "123 Main Street, Suburb, State 1234, Country"
- `'envelope'` - Multi-line format (uppercase, postal style):
  ```
  BUILDING NAME, Level 2
  123 MAIN STREET
  SUBURB STATE 1234
  COUNTRY
  ```

## Technical Details

### Currency Value Handling

The `Cast.Currency` component automatically divides the input value by 100, assuming values are stored in cents:

```tsx
// If product.price = 123456 (cents)
<Cast.Currency>{product.price}</Cast.Currency>
// Output: $1,234.56
```

This matches Laravel's common pattern of storing monetary values as integers (cents) in the database.

### Error Handling

All Cast components include error handling:

- If formatting fails, the `fallback` prop is used (defaults to `'Err'`)
- Null values are handled gracefully:
  - Currency/Percentage: Uses `0` if null
  - Datetime: Returns `fallback` if null
  - Address: Returns `fallback` if null

### Section Props

The `leftSection` and `rightSection` props allow you to add content before or after the formatted value:

```tsx
<Cast.Currency 
    leftSection={<Icon />}
    rightSection=" per unit"
>
    {product.price}
</Cast.Currency>
```

### Address Format Details

- **String format**: Single-line address suitable for inline display
- **Envelope format**: Multi-line, uppercase format suitable for postal addresses and print layouts
- Both formats handle missing address components gracefully

## Common Use Cases

1. **Displaying Monetary Values**: Format prices, costs, revenue, and other currency values
2. **Showing Percentages**: Display discounts, rates, ratios, and other percentage values
3. **Date Display**: Format timestamps, created dates, invoice dates, etc.
4. **Address Display**: Show customer addresses, site locations, and other address data
5. **Table Columns**: Consistent formatting across data tables
6. **Tooltips**: Display detailed formatted values in tooltips
7. **Description Lists**: Format values in detail views

## Backend Integration

Ensure your Laravel models and controllers provide data in the expected formats:

- **Currency**: Store as integers (cents) in the database
- **Percentage**: Store as numeric values (e.g., 12.34 for 12.34%)
- **Datetime**: Store as date/time strings or timestamps (Laravel will serialize appropriately)
- **Address**: Store as JSON or use Laravel casts to convert to `Domain.Address` objects

Example model cast:

```php
// In your Laravel model
protected $casts = [
    'price' => 'integer', // Stored in cents
    'discount' => 'decimal:2', // Percentage as decimal
    'created_at' => 'datetime',
    'address' => AddressCast::class, // Custom cast to Domain.Address
];
```

## Related Files

- `Cast.tsx` - Main component with composition
- `CastCurrency.tsx` - Currency formatting component
- `CastPercentage.tsx` - Percentage formatting component
- `CastDatetime.tsx` - Datetime formatting component
- `CastAddress.tsx` - Address formatting component
- `@/Utilities/Transformers.ts` - Address transformation utilities
- `numbro` - Number formatting library
- `dayjs` - Date/time formatting library

