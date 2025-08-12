# Session-based Authentication

---

## **1️⃣ Logging in**

When you log in (email + password):

1. **Backend checks credentials** against DB (`users` table).
2. **If valid**:

   - **Generate an `accessToken`** (JWT) — short lifespan (e.g., 15 min).
   - **Generate a `refreshToken`** (random string or JWT) — longer lifespan (e.g., 7 days or 30 days).
   - Save a **session record** in the DB (`sessions` table) with:

     - `user_id`
     - `refresh_token` (hashed if you want more security)
     - `ip_address`, `user_agent` (optional)
     - `expires_at`

   - Send both tokens to the frontend:

     - `accessToken` → usually returned in JSON response body.
     - `refreshToken` → usually stored in **HttpOnly cookie** (so JavaScript can’t read it).

---

## **2️⃣ Using the app normally**

- Every request to a **protected API route** includes the **`accessToken`** (in Authorization header: `Bearer <token>`).
- Backend **verifies** `accessToken`:

  - If valid → request passes.
  - If expired → request fails with `401 Unauthorized`.

---

## **3️⃣ When `accessToken` expires**

- This is **where the refreshToken comes in**.
- On frontend:

  - Detects `401 Unauthorized` (expired token).
  - Automatically sends a **`refresh` request** to backend with **`refreshToken`** from the HttpOnly cookie.

- Backend:

  1. Looks up the session in the DB by `refreshToken`.
  2. Checks if:

     - Session exists.
     - `expires_at` is still in the future.

  3. If valid:

     - Generate a new **`accessToken`**.
     - Optionally also rotate the `refreshToken` (extra security).
     - Send back the new `accessToken` to frontend.

---

## **4️⃣ Auto-login when reopening the app**

- When you open the app (without logging out):

  - Frontend sends a **silent refresh request** on page load.
  - Backend checks refreshToken in the cookie:

    - If valid session → return a new `accessToken` + user info.
    - If invalid or expired → force user to log in again.

---

## **5️⃣ Logging out**

- Frontend sends a **logout request** to backend.
- Backend:

  - Deletes the session from DB (or marks it invalid).
  - Clears the refreshToken cookie.

- This ensures the refreshToken can’t be used to generate new accessTokens anymore.

---

### 📊 **Token Lifetimes**

| Token            | Lifetime         | Stored in            | Purpose                |
| ---------------- | ---------------- | -------------------- | ---------------------- |
| **AccessToken**  | Short (15 min)   | Memory/local storage | Auth for each API call |
| **RefreshToken** | Long (7–30 days) | HttpOnly cookie / DB | Get new accessTokens   |

---

### 🔄 **Flow Diagram**

```bash
Login → Generate AccessToken + RefreshToken → Store RefreshToken in DB & Cookie
     ↓
Use AccessToken until it expires
     ↓
AccessToken expired → Use RefreshToken to get new AccessToken
     ↓
If RefreshToken expired → Must log in again
```
