# Pareto JSON

A TypeScript library for building JSON values in Pareto-style functional programming, with type safety and immutable data structures.

[![npm version](https://img.shields.io/npm/v/pareto-json?color=blue&style=flat-square)](https://www.npmjs.com/package/pareto-json)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Apache%202.0-green?style=flat-square)](LICENSE)

## Overview

Pareto JSON provides a functional approach to building and manipulating JSON data structures with full type safety. It offers immutable data types, composable operations, and seamless JSON serialization while maintaining the principles of functional programming.

## Installation

```bash
npm install pareto-json
```

## Key Features

- **🎯 Type Safety**: Full TypeScript integration with compile-time validation
- **🔒 Immutability**: All data structures are immutable by default
- **⚡ Functional API**: Composable functions for building complex JSON structures
- **🚀 JSON Serialization**: Direct serialization to standard JSON format
- **🛠️ Builder Pattern**: Fluent API for constructing nested structures
- **📊 Schema Validation**: Optional schema validation for JSON structures

## Core Concepts

### JSON Value Types
Pareto JSON supports all standard JSON types with functional wrappers:

```typescript
import * as json from 'pareto-json'

// Primitive values
const stringValue = json.string("hello")
const numberValue = json.number(42)
const booleanValue = json.boolean(true)
const nullValue = json.null()

// Complex values
const arrayValue = json.array([
    json.string("item1"),
    json.number(123),
    json.boolean(false)
])

const objectValue = json.object({
    'name': json.string("John"),
    'age': json.number(30),
    'active': json.boolean(true)
})
```

### Immutable Operations
All operations return new instances without modifying the original:

```typescript
const originalArray = json.array([json.string("a"), json.string("b")])

// Add item (returns new array)
const extendedArray = json.operations.array.append(
    originalArray, 
    json.string("c")
)

// Original array unchanged
console.log(originalArray)  // ["a", "b"]
console.log(extendedArray)  // ["a", "b", "c"]
```

## Usage Examples

### Basic JSON Construction

```typescript
import * as json from 'pareto-json'

// Build a user object
const user = json.object({
    'id': json.string("user_123"),
    'profile': json.object({
        'name': json.string("Alice Smith"),
        'email': json.string("alice@example.com"),
        'age': json.number(28)
    }),
    'preferences': json.object({
        'theme': json.string("dark"),
        'notifications': json.boolean(true)
    }),
    'tags': json.array([
        json.string("developer"),
        json.string("typescript"),
        json.string("functional")
    ])
})

// Serialize to standard JSON
const jsonString = json.serialize(user)
```

### Functional Transformations

```typescript
// Transform array elements
const numbers = json.array([
    json.number(1),
    json.number(2), 
    json.number(3)
])

const doubled = json.operations.array.map(
    numbers,
    (value) => json.number(json.toNumber(value) * 2)
)

// Filter array elements
const evenNumbers = json.operations.array.filter(
    numbers,
    (value) => json.toNumber(value) % 2 === 0
)
```

### Object Manipulation

```typescript
// Add property to object
const baseConfig = json.object({
    'version': json.string("1.0.0"),
    'enabled': json.boolean(true)
})

const extendedConfig = json.operations.object.set(
    baseConfig,
    'debug',
    json.boolean(false)
)

// Update existing property
const updatedConfig = json.operations.object.update(
    extendedConfig,
    'version',
    (current) => json.string("1.0.1")
)

// Remove property
const finalConfig = json.operations.object.remove(
    updatedConfig,
    'debug'
)
```

### Nested Data Structures

```typescript
// Build complex nested structure
const buildApiResponse = (data: any[], total: number, page: number) => {
    return json.object({
        'success': json.boolean(true),
        'metadata': json.object({
            'total': json.number(total),
            'page': json.number(page),
            'timestamp': json.string(new Date().toISOString())
        }),
        'data': json.array(
            data.map(item => json.object({
                'id': json.string(item.id),
                'name': json.string(item.name),
                'attributes': json.object(
                    Object.entries(item.attributes).reduce((acc, [key, value]) => ({
                        ...acc,
                        [key]: typeof value === 'string' 
                            ? json.string(value)
                            : json.number(value)
                    }), {})
                )
            }))
        )
    })
}
```

### Optional Values and Error Handling

```typescript
import * as result from 'pareto-json/result'

// Handle optional values safely
const buildUserProfile = (userData: UserData) => {
    return json.object({
        'name': json.string(userData.name),
        'email': userData.email 
            ? json.string(userData.email)
            : json.null(),
        'avatar': userData.avatarUrl
            ? json.string(userData.avatarUrl)
            : json.null(),
        'preferences': userData.preferences
            ? buildPreferences(userData.preferences)
            : json.object({})
    })
}

// Validate JSON structure
const validateUserJson = (jsonValue: json.Value): result.Result<User, ValidationError> => {
    return result.chain(
        json.operations.object.get(jsonValue, 'name'),
        (nameValue) => result.chain(
            json.operations.object.get(jsonValue, 'email'),
            (emailValue) => result.success({
                name: json.toString(nameValue),
                email: json.toString(emailValue)
            })
        )
    )
}
```

## Advanced Features

### Custom Serializers

```typescript
// Create custom serialization for special types
const customSerializer = {
    'date': (date: Date) => json.string(date.toISOString()),
    'bigint': (bigint: bigint) => json.string(bigint.toString()),
    'map': (map: Map<string, any>) => json.object(
        Object.fromEntries(map.entries())
    )
}

const serializeCustom = (value: any): json.Value => {
    if (value instanceof Date) {
        return customSerializer.date(value)
    }
    if (typeof value === 'bigint') {
        return customSerializer.bigint(value)
    }
    if (value instanceof Map) {
        return customSerializer.map(value)
    }
    // Fall back to standard serialization
    return json.fromJS(value)
}
```

### Schema Definition and Validation

```typescript
// Define JSON schema
const userSchema = json.schema.object({
    'id': json.schema.string(),
    'name': json.schema.string(),
    'age': json.schema.number(),
    'email': json.schema.optional(json.schema.string()),
    'roles': json.schema.array(json.schema.string())
})

// Validate JSON against schema
const validateUser = (jsonValue: json.Value) => {
    return json.validate(jsonValue, userSchema)
}

// Use validation
const userData = json.parse(`{"id": "123", "name": "John", "age": 30}`)
const validationResult = validateUser(userData)

if (validationResult.success) {
    console.log("Valid user:", validationResult.data)
} else {
    console.error("Validation errors:", validationResult.errors)
}
```

### Functional Composition

```typescript
// Compose operations for complex transformations
const transformApiData = (apiResponse: json.Value) => {
    return json.operations.pipe(apiResponse)
        .through(json.operations.object.get('data'))
        .through(json.operations.array.map((item) =>
            json.operations.object.update(item, 'timestamp', 
                (ts) => json.string(formatTimestamp(json.toString(ts)))
            )
        ))
        .through(json.operations.array.filter((item) =>
            json.toBoolean(json.operations.object.get(item, 'active'))
        ))
        .value()
}

// Create reusable transformations
const addMetadata = (metadata: Record<string, any>) => (jsonValue: json.Value) => {
    return json.operations.object.set(
        jsonValue,
        'metadata',
        json.fromJS(metadata)
    )
}

const addTimestamp = addMetadata({ timestamp: new Date().toISOString() })
```

## API Reference

### Core Functions

- `json.string(value: string): json.StringValue`
- `json.number(value: number): json.NumberValue`
- `json.boolean(value: boolean): json.BooleanValue`
- `json.null(): json.NullValue`
- `json.array(items: json.Value[]): json.ArrayValue`
- `json.object(properties: Record<string, json.Value>): json.ObjectValue`

### Operations

- `json.operations.array.*`: Array manipulation functions
- `json.operations.object.*`: Object manipulation functions
- `json.operations.pipe(value)`: Functional composition utilities

### Serialization

- `json.serialize(value: json.Value): string`
- `json.parse(jsonString: string): json.Value`
- `json.fromJS(value: any): json.Value`
- `json.toJS(jsonValue: json.Value): any`

### Type Conversion

- `json.toString(value: json.Value): string`
- `json.toNumber(value: json.Value): number`
- `json.toBoolean(value: json.Value): boolean`
- `json.toArray(value: json.Value): json.Value[]`
- `json.toObject(value: json.Value): Record<string, json.Value>`

## Integration with Other Libraries

### ASTN Integration
```typescript
import * as astn from 'astn'
import * as json from 'pareto-json'

// Convert ASTN to JSON
const astData = astn.parse(source)
const jsonData = json.fromAST(astData)
const jsonString = json.serialize(jsonData)
```

### Pareto Fountain Pen Integration
```typescript
import * as fountainPen from 'pareto-fountain-pen'
import * as json from 'pareto-json'

// Generate JSON output with proper formatting
const generateJsonFile = (data: json.Value) => {
    return fountainPen.block([
        fountainPen.line(json.serialize(data, { indent: 2 }))
    ])
}
```

## TypeScript Integration

Full TypeScript support:

```typescript
// Type-safe JSON construction
interface UserData {
    id: string
    name: string
    email?: string
}

const buildUserJson = (user: UserData): json.ObjectValue => {
    return json.object({
        'id': json.string(user.id),
        'name': json.string(user.name),
        'email': user.email ? json.string(user.email) : json.null()
    })
}

// Type inference
const userData = json.object({
    'count': json.number(42),
    'items': json.array([json.string('a'), json.string('b')])
})
// Type is automatically inferred as json.ObjectValue
```

## Performance Considerations

- **Structural sharing**: Efficient immutable operations
- **Lazy evaluation**: Computations performed only when needed
- **Memory efficiency**: Minimal object allocation for common operations
- **Serialization optimization**: Fast JSON string generation

## Contributing

Contributions welcome! Please:

1. Maintain functional programming principles
2. Ensure type safety throughout
3. Include comprehensive tests
4. Follow established patterns
5. Update documentation

## Dependencies

- `exupery-core-alg`: Core algorithms and functional utilities
- `exupery-core-bin`: Binary operations
- `exupery-core-data`: Data type definitions
- `pareto-fountain-pen`: Text generation utilities
- `pareto-standard-operations`: Standard functional operations

## License

Apache 2.0 License - see [LICENSE](LICENSE) file for details.

## Version

Current version: **0.1.12**

---

*Functional JSON manipulation for TypeScript applications*