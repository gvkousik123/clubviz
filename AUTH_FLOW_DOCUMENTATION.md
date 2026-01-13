// OTP Service
// Used for sending and validating OTPs
// Base URL: https://clubwiz.in/notification/api/otp/

// Endpoints:
// POST /send - Sends OTP
// Params: email, mobile
// Returns: Success message

// POST /validate - Validates OTP
// Params: email, otp (integer)
// Returns: jwtToken (Pre-Auth Token)

// Auth Service
// Used for User Management (Login, Signup, Roles)
// Base URL: https://clubwiz.in/users/auth/

// Endpoints:
// POST /signin - Login
// Body: usernameOrEmail, password
// Headers: Authorization: Bearer <Pre-Auth Token> (from OTP validate)
// Returns: accessToken, refreshToken, user details (Session Token)

// POST /signup - Register
// Body: fullName, email, password, mobileNumber
// Headers: Authorization: Bearer <Pre-Auth Token> (from OTP validate)
// Returns: accessToken, refreshToken, user details (Session Token)

// Token Flow:
// 1. OTP Validate -> Pre-Auth Token
// 2. Pre-Auth Token -> Used as Bearer token for Signin/Signup
// 3. Signin/Signup Success -> Returns Session Token
// 4. Session Token -> Used for all platform APIs (clubs, events, etc)
