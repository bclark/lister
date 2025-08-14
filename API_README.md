# Lister API

A RESTful API for managing user lists, built with Next.js App Router and Supabase.

## Quick Start

### 1. Start the Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

### 2. Test the API

```bash
npm run test-api
```

This runs a comprehensive test of all API endpoints.

### 3. Check API Health

Visit `http://localhost:3000/api/health` to see the API status and available endpoints.

## Features

- ✅ **Authentication**: Sign up, sign in, sign out with JWT tokens
- ✅ **Categories**: Predefined categories (Movies, Songs, Books, etc.)
- ✅ **Lists**: Create, read, update, delete user lists
- ✅ **List Items**: Add, update, delete, and reorder list items
- ✅ **Authorization**: User-scoped data access
- ✅ **Mock Mode**: Works without Supabase for development
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Error Handling**: Comprehensive error responses
- ✅ **API Documentation**: Complete endpoint documentation

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Authenticate user
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/me` - Get current user

### Categories
- `GET /api/categories` - Get all categories

### Lists
- `GET /api/lists` - Get user's lists
- `POST /api/lists` - Create new list
- `GET /api/lists/{id}` - Get specific list
- `PUT /api/lists/{id}` - Update list
- `DELETE /api/lists/{id}` - Delete list

### List Items
- `POST /api/lists/{id}/items` - Add item to list
- `PUT /api/lists/{id}/items` - Reorder all items
- `PUT /api/lists/{id}/items/{itemId}` - Update specific item
- `DELETE /api/lists/{id}/items/{itemId}` - Delete item

### Utility
- `GET /api/health` - API health check

## Development Mode

The API automatically detects if Supabase is configured. Without Supabase credentials, it runs in mock mode:

- Uses in-memory storage
- Mock authentication (any email/password works)
- Pre-defined categories
- Perfect for development and testing

## Production Setup

1. Set up Supabase project
2. Add environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Run database migrations from `supabase/schema.sql`

## Mobile Integration

This API is designed for mobile apps. See `API_DOCUMENTATION.md` for:

- Complete endpoint documentation
- Request/response examples
- iOS Swift code examples
- Android Kotlin code examples
- Error handling patterns

## Business Rules

- **Lists**: One per user per category per year, max 10 items
- **Items**: Auto-positioned, required title, optional description/image
- **Categories**: Pre-defined, cannot be modified by users
- **Authentication**: JWT-based, required for all data endpoints

## Testing

The API includes a comprehensive test script that covers:

- Health check
- Authentication flow
- Category retrieval
- List CRUD operations
- Item management
- Error scenarios

Run tests with:
```bash
npm run test-api
```

## Architecture

```
src/app/api/
├── auth/
│   ├── signin/route.ts
│   ├── signup/route.ts
│   ├── signout/route.ts
│   └── me/route.ts
├── categories/
│   └── route.ts
├── lists/
│   ├── route.ts
│   └── [id]/
│       ├── route.ts
│       └── items/
│           ├── route.ts
│           └── [itemId]/route.ts
├── health/
│   └── route.ts
└── README.md
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Security

- JWT-based authentication
- Row Level Security (RLS) in Supabase
- User-scoped data access
- Input validation and sanitization
- Rate limiting ready

## Next Steps for Mobile Development

1. **iOS Development**:
   - Use URLSession or Alamofire for HTTP requests
   - Implement JWT token storage in Keychain
   - Handle offline caching with Core Data

2. **Android Development**:
   - Use Retrofit for API communication
   - Store tokens securely with EncryptedSharedPreferences
   - Implement Room database for offline support

3. **Cross-Platform**:
   - React Native with AsyncStorage
   - Flutter with secure_storage package
   - Xamarin with secure storage solutions

## Support

For questions and support:
- Check `API_DOCUMENTATION.md` for detailed API reference
- Review `scripts/test-api.js` for usage examples
- Open issues in the project repository
