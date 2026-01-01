# ⚠️ IMPORTANT: RESET & REBUILD NOTICE (READ FIRST)

THIS PROJECT IS A **FULL RESET**.

❗ DELETE THE ENTIRE EXISTING BACKEND CODEBASE  
❗ DO NOT REUSE ANY OLD LOGIC, FILES, OR PATTERNS  
❗ START A NEW BACKEND FROM SCRATCH USING THIS DOCUMENT ONLY  

Any previous implementation is considered **invalid** and must be ignored.

GitHub Copilot must treat this README as the **single source of truth**.

---

# Media Fetch Platform – Controlled Public Service (Free + Premium)

This project is a **controlled, queue-based media processing platform**.

It allows users to submit a **single public media URL**, processes it **server-side**, and provides a **temporary download link**.

This is NOT a scraping tool, NOT a bot-evasion system, and NOT a bulk downloader.

---

## 1. CORE OBJECTIVE (WHAT TO BUILD)

Build a backend system that:

1. Accepts ONE public media URL from a user
2. Validates user permissions and limits
3. Places the request into a queue
4. Processes the request slowly and predictably
5. Fetches publicly accessible media streams
6. Stores the result temporarily
7. Provides a short-lived download link
8. Deletes all files automatically after delivery

All steps must be controlled by the backend.
The client must never interact directly with third-party media servers.

---

## 2. ABSOLUTE NON-NEGOTIABLE RULES (DO NOT VIOLATE)

The backend must NEVER:

- Reuse any previous backend logic
- Perform bulk downloads
- Support playlists or batch URLs
- Retry failed downloads automatically
- Use browser automation (Puppeteer, Playwright, Selenium)
- Use CAPTCHA solvers
- Use cookies or logged-in sessions
- Spoof browsers or fingerprints
- Rotate identities or user agents
- Promise unlimited usage
- Cache stream URLs
- Store media permanently

If any of the above are implemented, the system is considered **incorrect**.

---

## 3. DESIGN PHILOSOPHY (HOW TO THINK)

Copilot must follow these principles:

1. **Control > Speed**
2. **Predictability > Clever tricks**
3. **Graceful failure > Forced success**
4. **Limits > Scale**
5. **Temporary access > Storage**

The goal is longevity, not maximum throughput.

---

## 4. HIGH-LEVEL SYSTEM FLOW (MANDATORY)

User submits URL  
→ Backend validates request  
→ Request enters a queue  
→ Worker processes ONE job only  
→ Media is fetched sequentially  
→ File stored temporarily  
→ Short-lived download link generated  
→ File auto-deleted after expiry  

No step may be skipped.

---

## 5. USER TYPES & HARD LIMITS

### Free Users
- Max requests per hour: 2
- Max media duration: 15 minutes
- Max quality: 720p or audio-only
- Enforced queue delay
- Lowest processing priority

### Premium Users
- Max requests per hour: 10
- Max media duration: 60 minutes
- Higher quality options
- Priority queue
- Faster processing (still rate-limited)

Unlimited plans are explicitly forbidden.

---

## 6. JOB LIFECYCLE (EXACT BEHAVIOR)

1. User submits ONE URL
2. Backend validates:
   - URL format
   - User rate limits
   - Media duration (metadata only)
3. If validation fails → return error immediately
4. If validation passes → create a job
5. Job is placed into a queue
6. A worker picks ONE job at a time
7. Worker performs:
   - Metadata resolution (public data only)
   - Stream URL resolution (public configuration only)
   - Sequential media fetching
8. Media is written to temporary storage
9. A signed, time-limited download link is generated
10. User downloads the file
11. Cleanup process deletes all files and job data

NO automatic retries at any stage.

---

## 7. FETCH ENGINE RULES (CRITICAL)

The fetch engine must:

- Operate server-side only
- Use standard HTTP requests
- Fetch streams sequentially (no parallel chunks)
- Use strict timeouts
- Fail safely with clear errors

The fetch engine must NEVER:

- Use cookies
- Use login sessions
- Use headless browsers
- Solve CAPTCHAs
- Mimic human behavior
- Rotate IPs or identities

The engine must behave like a **slow, well-behaved client**.

---

## 8. METADATA & STREAM RESOLUTION

- Metadata must be extracted from publicly accessible page data
- Stream URLs must be derived from publicly exposed configuration
- Stream URLs are short-lived and must NOT be cached
- Resolution logic must be modular and replaceable
- Breakage is expected and acceptable

If resolution fails, return a clear error and stop.

---

## 9. STORAGE RULES (STRICT)

- All media files are temporary
- Files must auto-delete after a short TTL (e.g. 10 minutes)
- Each job must use isolated storage
- No permanent storage
- No shared files between users
- No public directory access

---

## 10. DOWNLOAD DELIVERY

- Downloads must use signed, short-lived URLs
- Links must expire quickly
- One link per job
- Links must be invalidated after expiry or use

---

## 11. ABUSE PREVENTION (MANDATORY)

The backend must enforce:

- IP-based rate limiting
- Per-user job caps
- Cooldowns after failures
- Automatic blocking of abusive patterns

Blocking users is preferred over scaling infrastructure.

---

## 12. ERROR HANDLING POLICY

Errors are normal and expected.

Errors must:
- Be human-readable
- Be non-technical for users
- Never expose stack traces
- Never trigger retries automatically

---

## 13. MONETIZATION RULES

Premium access may provide:
- Priority
- Convenience
- Reduced waiting

Premium access must NEVER provide:
- Unlimited usage
- Guaranteed success
- Permanent access

---

## 14. DEPLOYMENT EXPECTATIONS

- Backend must support separate API and worker processes
- Workers must be rate-controlled
- Scaling must be conservative
- Stability is more important than speed

---

## 15. LEGAL & ETHICAL BOUNDARY

This platform:
- Does not guarantee availability
- Does not guarantee permanence
- Does not bypass protections
- Does not impersonate users

Users are responsible for ensuring they have the right to download requested media.

---

## 16. MAINTENANCE REALITY

The system will:
- Break occasionally
- Require updates
- Need features disabled temporarily

This is expected and acceptable.

---

## 17. FINAL INSTRUCTION TO COPILOT

GitHub Copilot must:

- Ignore all previous code
- Generate new code strictly following this README
- Prefer clarity over cleverness
- Prefer limits over speed
- Prefer failure over unsafe behavior

This document overrides all previous assumptions.

END OF INSTRUCTIONS.
