# appsheet-api

A TypeScript client for the AppSheet API that makes it easy to interact with your AppSheet applications through a typed and user-friendly SDK.

## Installation

```bash
npm install appsheet-api
# or
pnpm add appsheet-api
# or
yarn add appsheet-api
```

## Quick Start

```typescript
import { AppsheetClient } from 'appsheet-api'
import type { ObjectData } from 'appsheet-api'

// Initialize the client
const client = new AppsheetClient({
  appId: 'your-app-id',
  apiKey: 'your-access-key'
})

// Define your table schema
const userSchema: ObjectData = {
  id: {
    type: 'string',
    primary: true
  },
  name: {
    type: 'string'
  },
  email: {
    type: 'string'
  },
  age: {
    type: 'number'
  },
  isActive: {
    type: 'boolean'
  }
}

// Create a schema instance
const users = client.createSchema('Users', userSchema)
```

## Usage

### Find by ID

```typescript
// Find a user by their ID
const user = await users.findById('123')
console.log(user)
```

### Find multiple records

The `find()` method supports three search methods according to the [official AppSheet documentation](https://support.google.com/appsheet/answer/10105770):

#### 1. Get all records

```typescript
// No parameters: returns all rows
const allUsers = await users.find()
```

#### 2. Filter with AppSheet expressions (Recommended)

Use the `Selector` property to filter records with AppSheet expressions. **This is the correct way to filter by any field:**

```typescript
// Filter users older than 21
const adults = await users.find({
  Selector: 'Filter(Users, [age] >= 21)'
})

// Filter by multiple conditions
const activeAdults = await users.find({
  Selector: 'Filter(Users, And([age] >= 21, [isActive] = true))'
})

// Combine filters and sorting
const topUsers = await users.find({
  Selector: 'Top(OrderBy(Filter(Users, [isActive] = true), [name], true), 10)'
})

// Using SELECT to get specific keys
const selected = await users.find({
  Selector: 'Select(Users[id], And([age] >= 21, [isActive] = true), true)'
})
```

**Common expressions for `Selector`:**

- `Filter(table, condition)` - Filters rows by condition
- `And(condition1, condition2, ...)` - Combines multiple conditions (all must be met)
- `Or(condition1, condition2, ...)` - At least one condition must be met
- `OrderBy(list, column, ascending)` - Sorts results
- `Top(list, count)` - Limits number of results
- `Select(list, condition, unique)` - Selects specific keys

#### 3. Find specific rows by primary key

Only when you need to get specific records by their primary key:

```typescript
// Find users by their IDs (primary keys)
const specificUsers = await users.find({}, [{ id: '123' }, { id: '456' }, { id: '789' }])
```

**Important note:** This method requires including the primary key field (`primary: true` in the schema). To filter by other fields, use method 2 with `Selector`.

### Create a new record

```typescript
const newUser = await users.create({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  isActive: true
})
console.log('User created:', newUser)
```

### Create multiple records

```typescript
// Create multiple records in a single call (more efficient)
const newUsers = await users.createMany([
  {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    isActive: true
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 25,
    isActive: true
  },
  {
    name: 'Bob Johnson',
    email: 'bob@example.com',
    age: 35,
    isActive: false
  }
])
console.log('Users created:', newUsers)
```

**Benefits of `createMany`:**

- More efficient than multiple individual calls
- Sends all records in a single API request
- Reduces calls to the data provider
- If the primary key has an initial value (like `UNIQUEID()` or `RANDBETWEEN()`), you can omit the primary key field

### Update a record

```typescript
// The object must include the primary key of the record to update
const updatedUser = await users.update({
  id: '123', // Primary key required
  name: 'John Doe Updated',
  age: 31
})
console.log('User updated:', updatedUser)
```

**Important note:** The data object must include the primary key (the field marked with `primary: true` in the schema). The library automatically validates that the primary key exists before sending the request.

### Update multiple records

```typescript
// Update multiple records in a single call (more efficient)
const updatedUsers = await users.updateMany([
  { id: '123', isActive: false },
  { id: '456', age: 25 },
  { id: '789', name: 'Jane Smith', email: 'jane@example.com' }
])
console.log('Users updated:', updatedUsers)
```

**Benefits of `updateMany`:**

- More efficient than multiple individual calls
- Sends all records in a single API request
- Each object must include its primary key
- Only the specified fields in each object are updated

### Delete a record

```typescript
// The object must include the primary key of the record to delete
const deletedUser = await users.delete({
  id: '123' // Primary key required
})
console.log('User deleted:', deletedUser)
```

**Important note:** You only need to provide the primary key of the record to delete. The library automatically validates that the primary key exists before sending the request.

### Delete multiple records

```typescript
// Delete multiple records in a single call (more efficient)
const deletedUsers = await users.deleteMany([{ id: '123' }, { id: '456' }, { id: '789' }])
console.log('Users deleted:', deletedUsers)
```

**Benefits of `deleteMany`:**

- More efficient than multiple individual calls
- Sends all records in a single API request
- Reduces calls to the data provider
- Each object should include only its primary key
- Automations are invoked separately for each deleted row

## Advanced Configuration

### Client Configuration

You can customize the client's behavior using the `SystemContext` object:

```typescript
const client = new AppsheetClient(
  {
    appId: 'your-app-id',
    apiKey: 'your-access-key'
  },
  {
    config: {
      timezone: 'America/New_York', // Timezone for dates
      returnRawData: false, // Return unprocessed data
      sendRawData: false, // Send unprocessed data
      maxRetriesOnRateLimit: 3, // Maximum retry attempts on rate limit errors
      retryDelay: 1000 // Base delay in ms between retries (uses exponential backoff)
    },
    client: {
      url: 'https://www.appsheet.com', // AppSheet API base URL
      locale: 'en-US', // Regional settings
      timezone: 'America/New_York', // Client timezone
      userSettings: {
        option1: 'option1',
        option2: 'option2'
      }
    }
  }
)
```

#### Configuration Options

##### `Credentials` (required)

- **`appId`** (string): Your AppSheet application ID
- **`apiKey`** (string): Your AppSheet API access key

##### `SystemContext.config` (optional)

- **`timezone`** (string): Timezone for date handling. Example: `'America/New_York'`, `'UTC'`, `'Europe/London'`. Default: `'UTC'`
- **`returnRawData`** (boolean): If `true`, returns data as received from the API without processing. Useful for debugging. Default: `false`
- **`sendRawData`** (boolean): If `true`, sends data without transformation to AppSheet format. Default: `false`
- **`maxRetriesOnRateLimit`** (number): Maximum number of automatic retry attempts when receiving HTTP 429 (rate limit) errors. Default: `3`
- **`retryDelay`** (number): Base delay in milliseconds between retry attempts. Uses exponential backoff (delay × attempt number). Default: `1000`

##### `SystemContext.client` (optional)

- **`url`** (string): AppSheet API base URL. Default: `'https://www.appsheet.com'`
- **`locale`** (string): Regional configuration for data formatting. Options: `'en-US'`, `'en-GB'`. Default: `'en-GB'`
- **`timezone`** (string): Client timezone. Default: `TZ` environment variable or `'UTC'`
- **`userSettings`** (object): User-specific settings that can be accessed in AppSheet expressions using `USERSETTINGS()`. See [UserSettings documentation](https://support.google.com/appsheet/answer/10104797)

### Schema Definition

#### Supported Data Types

- `string` - Text
- `number` - Decimal numbers
- `integer` - Integer numbers
- `boolean` - True/False
- `date` - Dates and times
- `array` - Lists of values
- `object` - Nested objects

#### Schema Properties

Each field in the schema (`Data`) can have the following properties:

- **`type`** (required): Field data type. Values: `'string'`, `'number'`, `'integer'`, `'boolean'`, `'date'`, `'array'`, `'object'`
- **`primary`** (optional, boolean): Marks the field as primary key. Default: `false`
- **`default`** (optional, unknown | function): Default value if the field is not provided. Can be a static value or a function that returns a value
- **`key`** (optional, string): Custom key for the field in AppSheet (if different from property name)
- **`itemType`** (optional, for arrays): Type of array elements. Values: `'string'`, `'number'`, `'integer'`, `'datetime'`
- **`properties`** (optional, for objects): Definition of nested object properties

### Dynamic Default Values

You can use functions to generate dynamic default values. This is useful for:

- Generating unique IDs
- Setting current timestamps
- Computing values based on runtime conditions
- Creating random values

**Static defaults:**

```typescript
const schema: ObjectData = {
  status: {
    type: 'string',
    default: 'active' // Always 'active'
  },
  count: {
    type: 'integer',
    default: 0 // Always 0
  }
}
```

**Dynamic defaults with functions:**

```typescript
const schema: ObjectData = {
  id: {
    type: 'string',
    primary: true,
    default: () => `USER-${Date.now()}` // Unique ID each time
  },
  createdAt: {
    type: 'date',
    default: () => new Date() // Current date/time when created
  },
  randomScore: {
    type: 'number',
    default: () => Math.random() * 100 // Random number between 0-100
  },
  code: {
    type: 'string',
    default: () => Math.random().toString(36).substring(2, 8).toUpperCase() // Random code
  }
}

// When you create a record without providing these fields:
const user = await users.create({
  name: 'John Doe'
  // id, createdAt, randomScore, and code will be generated automatically
})
```

**Important notes:**

- Functions are called each time a default value is needed
- Functions must be synchronous (no async/await)
- The function's return value must match the field's type
- Works with all data types: string, number, integer, boolean, date, array

#### Complete Schema Example

```typescript
const productSchema: ObjectData = {
  id: {
    type: 'string',
    primary: true,
    default: () => `PROD-${Date.now()}` // Auto-generate unique ID
  },
  name: {
    type: 'string'
  },
  description: {
    type: 'string',
    default: 'No description' // Static default value
  },
  price: {
    type: 'number'
  },
  stock: {
    type: 'integer',
    default: 0
  },
  available: {
    type: 'boolean',
    default: true
  },
  createdAt: {
    type: 'date',
    default: () => new Date() // Current timestamp when created
  },
  tags: {
    type: 'array',
    itemType: 'string', // Type of array elements
    default: []
  },
  metadata: {
    type: 'object',
    properties: {
      weight: {
        key: 'metadata_weight',
        type: 'number'
      },
      dimensions: {
        key: 'metadata_dimensions',
        type: 'string'
      },
      manufacturer: {
        key: 'metadata_manufacturer',
        type: 'string',
        default: 'Unknown'
      }
    }
  }
}
```

### Working with Dates

Dates are handled automatically with timezone support. The client performs bidirectional conversions:

**Sending to AppSheet (JS → AppSheet):**

- Converts JavaScript `Date` objects to `YYYY-MM-DD HH:mm:ss` format
- If you send a string, it's passed as-is to AppSheet

**Reading from AppSheet (AppSheet → JS):**

- Reads dates in `MM/DD/YYYY HH:mm:ss` format from AppSheet
- Automatically converts to JavaScript `Date` objects

```typescript
// Create with Date object (automatically converts to YYYY-MM-DD HH:mm:ss)
const order = await orders.create({
  orderId: '001',
  orderDate: new Date(), // Example: 2025-12-08 14:30:45
  deliveryDate: new Date('2025-12-25')
})

// When reading, AppSheet returns MM/DD/YYYY and the client converts it to Date
const fetchedOrder = await orders.findById('001')
console.log(fetchedOrder.orderDate) // Date object
```

**Supported formats:**

When **sending** to AppSheet:

- `Date` object → converts to `YYYY-MM-DD HH:mm:ss`
- String → sent without modification

When **reading** from AppSheet:

- `MM/DD/YYYY HH:mm:ss` → converts to `Date` object
- `MM/DD/YYYY HH:mm` → converts to `Date` object
- `MM/DD/YYYY` → converts to `Date` object

**Note about timezones:** Conversion respects the timezone configured in `SystemContext.config.timezone`.

### Custom Column Names with `key`

The `key` property allows you to map JavaScript property names to different column names in AppSheet. This is useful when:

- AppSheet columns have special characters or spaces
- You want cleaner property names in your code
- Working with legacy databases with different naming conventions

```typescript
const productSchema: ObjectData = {
  id: {
    type: 'string',
    primary: true
  },
  productName: {
    type: 'string',
    key: 'Product Name' // Maps to "Product Name" column in AppSheet
  },
  sku: {
    type: 'string',
    key: 'Product_SKU' // Maps to "Product_SKU" column in AppSheet
  },
  price: {
    type: 'number',
    key: 'Unit Price' // Maps to "Unit Price" column in AppSheet
  }
}

// Use clean property names in your code
const product = await products.create({
  productName: 'Laptop', // Sent as "Product Name" to AppSheet
  sku: 'LAP-001', // Sent as "Product_SKU" to AppSheet
  price: 999.99 // Sent as "Unit Price" to AppSheet
})
```

**With nested objects:**

```typescript
const orderSchema: ObjectData = {
  id: { type: 'string', primary: true },
  customer: {
    type: 'object',
    properties: {
      fullName: {
        type: 'string',
        key: 'customer_full_name' // Maps to "customer_full_name" in AppSheet
      },
      email: {
        type: 'string',
        key: 'customer_email' // Maps to "customer_email" in AppSheet
      }
    }
  }
}
```

### Working with Arrays

Arrays can contain elements of type `string`, `number`, `integer`, or `datetime`. The separator used is comma with spaces (`,`):

```typescript
const product = await products.create({
  name: 'Laptop',
  tags: ['electronics', 'computers', 'gaming'], // Array of strings
  ratings: [4.5, 4.8, 5.0] // Array of numbers
})
```

### Working with Nested Objects

Nested objects allow you to group related data. You must define the structure using the `properties` property in the schema:

```typescript
// Schema definition with nested object
const employeeSchema: ObjectData = {
  id: { type: 'string', primary: true },
  name: { type: 'string' },
  contact: {
    type: 'object',
    properties: {
      email: { type: 'string' },
      phone: { type: 'string' },
      address: { type: 'string' }
    }
  },
  salary: {
    type: 'object',
    properties: {
      base: { type: 'number' },
      bonus: { type: 'number', default: 0 },
      currency: { type: 'string', default: 'USD' }
    }
  }
}

// Create record with nested objects
const employee = await employees.create({
  id: 'EMP001',
  name: 'Jane Smith',
  contact: {
    email: 'jane@example.com',
    phone: '+1 555 123 4567',
    address: '123 Main St'
  },
  salary: {
    base: 50000,
    bonus: 5000,
    currency: 'USD'
  }
})
```

## Additional Properties

You can pass additional properties to operations via the `Properties` parameter. These properties are sent directly to the AppSheet API:

```typescript
// Example with custom properties
const results = await users.find({
  Selector: 'Filter(Users, [Status] = "active")', // AppSheet filter expression
  UserEmail: 'admin@example.com', // Email of user making the request
  Location: 'Mobile', // Location where the request is made from
  Timezone: 'America/New_York' // Specific timezone for this operation
})

// Create with additional properties
const newUser = await users.create(
  {
    name: 'Peter Johnson',
    email: 'peter@example.com'
  },
  {
    UserEmail: 'admin@example.com',
    RunAsUserEmail: 'system@example.com' // Execute as another user
  }
)
```

### Common Properties

- **`Selector`**: AppSheet filter expression to filter results
- **`UserEmail`**: Email of user performing the operation
- **`RunAsUserEmail`**: Execute the operation as another user
- **`Location`**: Location where the operation is performed from
- **`Timezone`**: Specific timezone for this operation (overrides client configuration)

## TypeScript Types

The package includes complete type definitions:

```typescript
import type { AppsheetClient, Credentials, SystemContext, ObjectData, Data, Types } from 'appsheet-api'
```

## Features

- ✅ Full TypeScript support with strict types
- ✅ Automatic data type conversion
- ✅ Smart date handling with timezones
- ✅ Support for nested data and arrays
- ✅ Promise-based API (async/await)
- ✅ Flexible client configuration
- ✅ Built-in data validation

## License

MIT © [johan12361](https://github.com/johan12361)

## Report Issues

If you find any issues, please report them at: [GitHub Issues](https://github.com/johan12361/appsheet-api/issues)

## Resources

- [AppSheet API Documentation](https://support.google.com/appsheet/answer/10105769)
- [GitHub Repository](https://github.com/johan12361/appsheet-api)
