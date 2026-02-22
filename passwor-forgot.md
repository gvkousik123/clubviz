# ClubWiz Auth API — Password Reset Flow

Base URL: `https://clubwiz.in`

---

## 1. POST /users/auth/forgot-password

Sends an OTP to the user's registered email address to initiate the password reset flow.

### Request

**Method:** `POST`  
**URL:** `https://clubwiz.in/users/auth/forgot-password`  
**Headers:**
- `Content-Type: application/json`
- `accept: */*`

**Body (JSON):**
```json
{
  "email": "user@example.com"
}
```

| Field   | Type   | Required | Description                          |
|---------|--------|----------|--------------------------------------|
| `email` | string | Yes      | The registered email of the user     |

### Response

**Status:** `200 OK`

**Body (JSON):**
```json
{
  "success": true,
  "message": "OTP sent successfully to your registered email",
  "email": "user@example.com",
  "expiresIn": 599,
  "timestamp": 1771774341230
}
```

| Field       | Type    | Description                                         |
|-------------|---------|-----------------------------------------------------|
| `success`   | boolean | `true` if OTP was sent successfully                 |
| `message`   | string  | Human-readable confirmation message                 |
| `email`     | string  | The email address where OTP was sent                |
| `expiresIn` | number  | Seconds until the OTP expires (e.g., 599 ≈ 10 min) |
| `timestamp` | number  | Unix timestamp (milliseconds) when OTP was issued   |

---

## 2. POST /users/auth/reset-password

Resets the user's password using the OTP received via email.

### Request

**Method:** `POST`  
**URL:** `https://clubwiz.in/users/auth/reset-password`  
**Headers:**
- `Content-Type: application/json`
- `accept: */*`

**Body (JSON):**
```json
{
  "email": "user@example.com",
  "otp": "192016",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

| Field             | Type   | Required | Description                                      |
|-------------------|--------|----------|--------------------------------------------------|
| `email`           | string | Yes      | The registered email of the user                 |
| `otp`             | string | Yes      | The OTP received via email                       |
| `newPassword`     | string | Yes      | The new password to set                          |
| `confirmPassword` | string | Yes      | Must match `newPassword`                         |

### Response

**Status:** `200 OK`

**Body (JSON):**
```json
{
  "message": "Password reset successfully. You can now login with your new password."
}
```

| Field     | Type   | Description                          |
|-----------|--------|--------------------------------------|
| `message` | string | Confirmation that password was reset |

---

## Full Flow Summary

1. Call **forgot-password** with the user's email → OTP is sent to email, valid for ~10 minutes.
2. User reads the OTP from their email.
3. Call **reset-password** with the email, OTP, and the new password (confirmed) → password is updated.
4. User can now log in with the new password.