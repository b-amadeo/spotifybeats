[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=15255690&assignment_repo_type=AssignmentRepo)
# Individual Project Phase 2

## Endpoints :

List of available endpoints:

- `POST /google-login`
- `GET /login`
- `GET /callback`
- `GET /generate-recommendations`
- `GET /logout`
- `GET /profile/:id`
- `PUT /profile/:id`
- `GET /library/:id`
- `POST /add-to-library`
- `DELETE remove-from-library/:id`

&nbsp;

## 1. POST /google-login

Request:
- headers:
```json
"token": "string"
```

_Response (200 - OK)_

```json
{
  "access_token": "string",
  "profile": {
    "id": "integer",
    "email": "string",
    "name": "string",
    "status": "string"
  }
}
```

## 2. GET /login

_Response (302 - Found)_

```json
Redirects to Spotify authorization URL
```

&nbsp;

## 3. GET /callback

_Response (302 - Found)_

```json
Redirects to /home with access_token and refresh_token in the URL hash
```

_Response (400 - Bad Request)_

```json
{
  "error": "state_mismatch"
}
```

&nbsp;

## 4. GET /generate-recommendations

_Response (200 - OK)_

```json
[
  "string",
  "string",
  "string",
  "string",
  "string",
  "string",
  "string",
  "string"
]
```

&nbsp;

## 5. GET /logout

_Response (200 - OK)_

```json
{
  "message": "Logged out successfully"
}
```

&nbsp;

## 6. GET /profile/:id

Request:
- params:
```json
{
  "id": "integer"
}
```

- body:
```json
{
  "name": "string",
  "status": "string"
}
```

_Response (200 - OK)_

```json
{
  "message": "Success edit profile"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Error not found"
}
```

&nbsp;

## 7. PUT /profile/:id

Request:
- params:
```json
{
  "id": "integer"
}
```

- body:
```json
{
  "name": "string",
  "status": "string"
}
```

_Response (200 - OK)_

```json
{
  "message": "Success edit profile"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Error not found"
}
```

&nbsp;

## 8. GET /library/:id

Request:
- params:
```json
{
  "id": "integer"
}
```

_Response (200 - OK)_

```json
{
  "message": "Success read library",
  "library": [
    {
      "id": "integer",
      "UserId": "integer",
      "SongId": "integer",
      "Song": {
        "id": "integer",
        "title": "string",
        "artist": "string",
        "album": "string",
        "duration": "integer"
      }
    }
  ]
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Error not found"
}
```

&nbsp;

## 9. POST /add-to-library

Request:
- body:
```json
{
  "UserId": "integer",
  "SongId": "integer"
}
```

_Response (201 - Created)_

```json
{
  "message": "Add Song to Library Success",
  "library": {
    "id": "integer",
    "UserId": "integer",
    "SongId": "integer"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Song is already in your library"
}
```

&nbsp;

## 10. DELETE /remove-from-library/:id

Request:
- params:
```json
{
  "id": "integer"
}
```

_Response (200 - OK)_

```json
{
  "message": "Success delete song from library"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Error not found"
}
```