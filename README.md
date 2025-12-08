# appsheet-api

A TypeScript client for the AppSheet API that makes it easy to interact with your AppSheet applications through a typed and user-friendly SDK.

## 📦 Installation

```bash
npm install appsheet-api
# or
pnpm add appsheet-api
# or
yarn add appsheet-api
```

## 🚀 Quick Start

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

## 📖 Usage

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

## 🔧 Advanced Configuration

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
      sendRawData: false // Send unprocessed data
    },
    client: {
      url: 'https://www.appsheet.com', // AppSheet API base URL
      locale: 'en-US', // Regional settings
      timezone: 'America/New_York' // Client timezone
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

##### `SystemContext.client` (optional)

- **`url`** (string): AppSheet API base URL. Default: `'https://www.appsheet.com'`
- **`locale`** (string): Regional configuration for data formatting. Options: `'en-US'`, `'en-GB'`. Default: `'en-GB'`
- **`timezone`** (string): Client timezone. Default: `TZ` environment variable or `'UTC'`

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
- **`default`** (optional, unknown): Default value if the field is not provided
- **`key`** (optional, string): Custom key for the field in AppSheet (if different from property name)
- **`itemType`** (optional, for arrays): Type of array elements. Values: `'string'`, `'number'`, `'integer'`, `'datetime'`
- **`properties`** (optional, for objects): Definition of nested object properties

#### Complete Schema Example

```typescript
const productSchema: ObjectData = {
  id: {
    type: 'string',
    primary: true // Marks this field as primary key
  },
  name: {
    type: 'string'
  },
  description: {
    type: 'string',
    default: 'No description' // Default value
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
    type: 'date'
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
        type: 'number'
      },
      dimensions: {
        type: 'string'
      },
      manufacturer: {
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

## 🔑 Additional Properties

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

## 📝 TypeScript Types

The package includes complete type definitions:

```typescript
import type { AppsheetClient, Credentials, SystemContext, ObjectData, Data, Types } from 'appsheet-api'
```

## 🎯 Features

- ✅ Full TypeScript support with strict types
- ✅ Automatic data type conversion
- ✅ Smart date handling with timezones
- ✅ Support for nested data and arrays
- ✅ Promise-based API (async/await)
- ✅ Flexible client configuration
- ✅ Built-in data validation

## 📄 License

MIT © [johan12361](https://github.com/johan12361)

## 🐛 Report Issues

If you find any issues, please report them at: [GitHub Issues](https://github.com/johan12361/appsheet-api/issues)

## 📚 Resources

- [AppSheet API Documentation](https://support.google.com/appsheet/answer/10105769)
- [GitHub Repository](https://github.com/johan12361/appsheet-api)
