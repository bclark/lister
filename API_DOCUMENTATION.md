# Lister API Documentation

This API provides endpoints for managing user lists, list items, and categories for the Lister mobile applications.

## Base URL
```
https://your-domain.com/api
```

## Authentication

All endpoints (except auth endpoints) require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "error": "Error message description"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Authentication Endpoints

### Sign Up
Create a new user account.

**POST** `/auth/signup`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2023-12-01T00:00:00Z",
    "updated_at": "2023-12-01T00:00:00Z"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 3600,
    "token_type": "Bearer"
  }
}
```

### Sign In
Authenticate an existing user.

**POST** `/auth/signin`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as Sign Up

### Sign Out
Sign out the current user.

**POST** `/auth/signout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Successfully signed out"
}
```

### Get Current User
Get the current authenticated user's information.

**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2023-12-01T00:00:00Z",
    "updated_at": "2023-12-01T00:00:00Z"
  }
}
```

---

## Categories Endpoints

### Get All Categories
Retrieve all available categories.

**GET** `/categories`

**Response:**
```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "movie",
      "display_name": "Movie",
      "description": "Your favorite films of the year",
      "icon": "🎬",
      "created_at": "2023-12-01T00:00:00Z",
      "updated_at": "2023-12-01T00:00:00Z"
    }
  ]
}
```

---

## Lists Endpoints

### Get User Lists
Retrieve all lists for the authenticated user.

**GET** `/lists`

**Query Parameters:**
- `category_id` (optional) - Filter by category ID
- `year` (optional) - Filter by year

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "lists": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "category_id": "uuid",
      "year": 2023,
      "title": "My Top Movies",
      "created_at": "2023-12-01T00:00:00Z",
      "updated_at": "2023-12-01T00:00:00Z",
      "items": [
        {
          "id": "uuid",
          "list_id": "uuid",
          "title": "The Matrix",
          "description": "A computer hacker learns about the true nature of reality",
          "image_url": "https://example.com/image.jpg",
          "position": 1,
          "created_at": "2023-12-01T00:00:00Z",
          "updated_at": "2023-12-01T00:00:00Z"
        }
      ],
      "categories": {
        "id": "uuid",
        "name": "movie",
        "display_name": "Movie",
        "icon": "🎬"
      }
    }
  ]
}
```

### Create List
Create a new list for the authenticated user.

**POST** `/lists`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "category_id": "uuid",
  "year": 2023,
  "title": "My Top Movies" // optional
}
```

**Response:**
```json
{
  "list": {
    "id": "uuid",
    "user_id": "uuid",
    "category_id": "uuid",
    "year": 2023,
    "title": "My Top Movies",
    "created_at": "2023-12-01T00:00:00Z",
    "updated_at": "2023-12-01T00:00:00Z",
    "items": []
  }
}
```

### Get Single List
Retrieve a specific list by ID.

**GET** `/lists/{list_id}`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** Same as individual list object from Get User Lists

### Update List
Update a list's metadata.

**PUT** `/lists/{list_id}`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Updated List Title"
}
```

**Response:** Same as Get Single List

### Delete List
Delete a list and all its items.

**DELETE** `/lists/{list_id}`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "List deleted successfully"
}
```

---

## List Items Endpoints

### Add Item to List
Add a new item to a list.

**POST** `/lists/{list_id}/items`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "The Matrix",
  "description": "A computer hacker learns about the true nature of reality", // optional
  "image_url": "https://example.com/image.jpg", // optional
  "position": 1 // optional, defaults to end of list
}
```

**Response:**
```json
{
  "item": {
    "id": "uuid",
    "list_id": "uuid",
    "title": "The Matrix",
    "description": "A computer hacker learns about the true nature of reality",
    "image_url": "https://example.com/image.jpg",
    "position": 1,
    "created_at": "2023-12-01T00:00:00Z",
    "updated_at": "2023-12-01T00:00:00Z"
  }
}
```

### Reorder List Items
Update the positions of all items in a list.

**PUT** `/lists/{list_id}/items`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "The Matrix",
      "description": "Description",
      "image_url": "https://example.com/image.jpg"
    },
    {
      "id": "uuid2",
      "title": "Inception",
      "description": "Description",
      "image_url": "https://example.com/image2.jpg"
    }
  ]
}
```

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "list_id": "uuid",
      "title": "The Matrix",
      "description": "Description",
      "image_url": "https://example.com/image.jpg",
      "position": 1,
      "created_at": "2023-12-01T00:00:00Z",
      "updated_at": "2023-12-01T00:00:00Z"
    }
  ]
}
```

### Update List Item
Update a specific list item.

**PUT** `/lists/{list_id}/items/{item_id}`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description", // optional
  "image_url": "https://example.com/new-image.jpg" // optional
}
```

**Response:**
```json
{
  "item": {
    "id": "uuid",
    "list_id": "uuid",
    "title": "Updated Title",
    "description": "Updated description",
    "image_url": "https://example.com/new-image.jpg",
    "position": 1,
    "created_at": "2023-12-01T00:00:00Z",
    "updated_at": "2023-12-01T00:00:00Z"
  }
}
```

### Delete List Item
Remove an item from a list.

**DELETE** `/lists/{list_id}/items/{item_id}`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "message": "Item deleted successfully"
}
```

---

## Business Rules

### Lists
- Each user can have only one list per category per year
- Lists can have a maximum of 10 items
- Lists are automatically ordered by creation date (newest first)

### List Items
- Items are ordered by position (1-10)
- When adding an item at a specific position, other items are automatically adjusted
- When deleting an item, remaining items are automatically repositioned
- All items must have a title
- Description and image_url are optional

### Categories
- Categories are predefined and cannot be created by users
- Available categories: Movie, Song, Comic Book, TV Show, Book, Video Game

---

## Error Handling

### Common Errors

**401 Unauthorized:**
```json
{
  "error": "Authorization header required"
}
```

**404 Not Found:**
```json
{
  "error": "List not found"
}
```

**409 Conflict:**
```json
{
  "error": "List already exists for this category and year"
}
```

**400 Bad Request:**
```json
{
  "error": "List is full (maximum 10 items)"
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per minute per IP address
- 1000 requests per hour per authenticated user

When rate limits are exceeded, the API returns a `429 Too Many Requests` status code.

---

## Development Mode

When Supabase is not configured, the API runs in development mode with:
- Mock authentication (any email/password combination works)
- In-memory data storage
- Mock user ID: `mock-user-id`
- Mock access token: `mock-access-token`

This allows for easy testing and development without requiring a full Supabase setup.

---

## Mobile Integration Examples

### Swift (iOS) Example

```swift
import Foundation

class ListerAPI {
    private let baseURL = "https://your-domain.com/api"
    private var accessToken: String?
    
    func signIn(email: String, password: String) async throws {
        let url = URL(string: "\(baseURL)/auth/signin")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body = ["email": email, "password": password]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        
        let (data, _) = try await URLSession.shared.data(for: request)
        let response = try JSONDecoder().decode(AuthResponse.self, from: data)
        
        self.accessToken = response.session.access_token
    }
    
    func getLists() async throws -> [List] {
        let url = URL(string: "\(baseURL)/lists")!
        var request = URLRequest(url: url)
        request.setValue("Bearer \(accessToken ?? "")", forHTTPHeaderField: "Authorization")
        
        let (data, _) = try await URLSession.shared.data(for: request)
        let response = try JSONDecoder().decode(ListsResponse.self, from: data)
        
        return response.lists
    }
}
```

### Kotlin (Android) Example

```kotlin
import retrofit2.http.*

interface ListerAPI {
    @POST("auth/signin")
    suspend fun signIn(@Body request: SignInRequest): AuthResponse
    
    @GET("lists")
    suspend fun getLists(@Header("Authorization") token: String): ListsResponse
    
    @POST("lists")
    suspend fun createList(
        @Header("Authorization") token: String,
        @Body request: CreateListRequest
    ): ListResponse
    
    @POST("lists/{listId}/items")
    suspend fun addItem(
        @Path("listId") listId: String,
        @Header("Authorization") token: String,
        @Body request: AddItemRequest
    ): ItemResponse
}
```

---

## Support

For API support and questions:
- Email: api-support@lister.com
- Documentation: https://docs.lister.com
- Status Page: https://status.lister.com
