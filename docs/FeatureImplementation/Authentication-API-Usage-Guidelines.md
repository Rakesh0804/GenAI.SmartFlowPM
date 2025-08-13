# Authentication API Usage Guidelines

## 📋 When to Call `/auth/me`

### ✅ **SHOULD Call `/auth/me`**

1. **App Initialization** 🚀
   - When app starts and we have a stored token
   - Purpose: Validate token and get current user data
   - Location: `useAuth` hook's `useEffect`

2. **Profile Updates** 👤
   - After user updates their profile information
   - Purpose: Get fresh user data with latest changes
   - Location: `refreshUser()` function

3. **Token Refresh** 🔄
   - After successfully refreshing an expired token
   - Purpose: Ensure user data is still current
   - Location: Token refresh interceptor (if needed)

4. **Permission Changes** 🔐
   - When user roles or permissions might have changed
   - Purpose: Get updated user permissions
   - Location: Admin actions or role updates

### ❌ **SHOULD NOT Call `/auth/me`**

1. **After Login** 🚫
   - `/auth/login` already returns complete user data
   - Purpose: Avoid redundant API calls
   - Use: `response.user` from login response

2. **Every Route Change** 🚫
   - Don't validate on every navigation
   - Purpose: Avoid performance overhead
   - Use: Stored user state instead

3. **Every API Call** 🚫
   - Don't validate user on every request
   - Purpose: Avoid excessive server load
   - Use: JWT token validation instead

## 🔄 Optimal Authentication Flow

```typescript
// ✅ GOOD: Login Flow
const login = async (credentials) => {
  const response = await authApi.login(credentials);
  setUser(response.user); // Use data from login response
  // No need to call /auth/me here!
};

// ✅ GOOD: App Initialization
useEffect(() => {
  if (token && tokenManager.isTokenValid()) {
    const user = await authApi.getCurrentUser(); // Validate stored token
    setUser(user);
  }
}, []);

// ✅ GOOD: Profile Refresh
const refreshUserProfile = async () => {
  const user = await authApi.getCurrentUser(); // Get fresh data
  setUser(user);
};
```

## 📊 Performance Impact

| Scenario | API Calls | Performance |
|----------|-----------|-------------|
| **Current Optimized** | Login: 1 call | ✅ Excellent |
| **Previous (redundant)** | Login: 2 calls | ❌ Unnecessary overhead |
| **App Startup** | 1 call (if token exists) | ✅ Necessary validation |

## 🎯 Benefits of This Approach

1. **Reduced API Calls** - 50% fewer calls during login flow
2. **Faster Login** - Immediate user data availability
3. **Better UX** - No loading states between login and dashboard
4. **Server Efficiency** - Less load on `/auth/me` endpoint
5. **Network Efficiency** - Reduced bandwidth usage

## 🐛 Common Anti-Patterns to Avoid

```typescript
// ❌ BAD: Calling /auth/me after login
const login = async (credentials) => {
  await authApi.login(credentials);
  const user = await authApi.getCurrentUser(); // Redundant!
  setUser(user);
};

// ❌ BAD: Calling on every route
const SomeComponent = () => {
  useEffect(() => {
    authApi.getCurrentUser(); // Don't do this!
  }, []);
};

// ❌ BAD: Excessive validation
const makeApiCall = async () => {
  await authApi.getCurrentUser(); // Validate user first? No!
  await api.get('/some-endpoint');
};
```

This optimized approach ensures efficient authentication while maintaining security and user experience.
