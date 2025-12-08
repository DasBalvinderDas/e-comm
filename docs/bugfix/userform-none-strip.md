# Bug Fix: AttributeError in User Form Submission

## Repository
- **URL:** https://github.com/DasBalvinderDas/e-comm
- **Base Branch:** test-bug-adk
- **Fix Branch:** bugfix/userform-none-strip

## Error Message
```
AttributeError: 'NoneType' object has no attribute 'strip'
```
The error occurs when submitting the user form (`/userform`).

## Root Cause Analysis
The `selected_shipping_method` variable, obtained from user form input, could be `None` under certain conditions (e.g., if no method was explicitly selected or default handling was absent). Attempting to call `.strip()` directly on a `NoneType` object resulted in an `AttributeError`.

## Fix Summary
Modified the `app.py` file to include a check for `selected_shipping_method` being `None` before attempting to call `.strip()` on it. If `selected_shipping_method` is `None`, it defaults to an empty string.

## Code Changes
The following change was made in `app.py`:

```diff
--- a/app.py
+++ b/app.py
@@ -107,7 +107,7 @@
 
         # BUG 2: NULL POINTER TYPE BUG
         # selected_shipping_method may be None → calling .strip() causes:
         # AttributeError: 'NoneType' object has no attribute 'strip'
-        selected_shipping_method = selected_shipping_method.strip()  # BUG 2 intentionally added
+        selected_shipping_method = selected_shipping_method.strip() if selected_shipping_method else "" # Fix for BUG 2
 
         # Insert user details and selected shipping option into the database
         conn = get_db()
```

---

### Internal Changelog
- Fixed an `AttributeError` (`'NoneType' object has no attribute 'strip'`) occurring during user form submission when `selected_shipping_method` was `None`.
- Modified `app.py` to include a `None` check for `selected_shipping_method`.
- If `selected_shipping_method` is `None`, it now defaults to an empty string before string operations are performed.

---

### Release Note
We've resolved an issue that occasionally caused errors during user form submissions, particularly when processing shipping method selections. This update enhances the stability and reliability of our forms, ensuring a smoother experience for all users.

---

### Technical Note
- **Cause:** The `selected_shipping_method` variable, obtained from user form input, could be `None` under certain conditions (e.g., if no method was explicitly selected or default handling was absent). Attempting to call `.strip()` directly on a `NoneType` object resulted in an `AttributeError`.
- **Fix:** A null check (`if selected_shipping_method is None:`) was introduced in `app.py` before the `.strip()` method was called.
- **Fix:** If `selected_shipping_method` is found to be `None`, it is now explicitly assigned an empty string (`""`) to prevent the `AttributeError` and ensure consistent string processing.
- **Prevention:** Always validate or sanitize user input and variable states before performing operations that assume a specific data type (e.g., string methods). Implement explicit `None` checks or use guard clauses.
- **Prevention:** Consider using more robust form validation libraries or frameworks that automatically handle default values or type conversions for potentially missing or `None` inputs.
