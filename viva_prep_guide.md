# 🎓 CampusPlace - Comprehensive Viva & Architecture Guide

This document is your cheat sheet for your Viva. It breaks down exactly how the frontend and backend talk to each other, the libraries you used, and the logical flows behind your core features.

---

## 1. Technology Stack
If the external examiner asks what technologies you used, tell them:

* **Frontend:** Built with React.js using Vite. State is managed natively using React Context API. All styling is custom-written vanilla CSS using advanced Flexbox, Grid, and CSS Keyframe animations (no component libraries like Bootstrap/Tailwind were strictly relied on, showing deep CSS knowledge).
* **Backend:** Built with Java 17 and Spring Boot 3. 
* **Database:** Relational database mapping using Hibernate (Spring Data JPA) with a MySQL database.
* **Security:** Spring Security 6, stateless JWT (JSON Web Tokens), and OAuth2 (for Google/GitHub login).
* **AI Integration:** Groq's high-speed inference engine (Llama-3 model) via REST APIs.

---

## 2. Authentication & Authorization Flow
*One of the most common Viva questions is "How does your login system work securely?"*

* **Standard Login:**
  1. The React frontend sends a `POST` request with the email and password to `/auth/login`.
  2. Spring Security kicks in. The `CustomUserDetailsService` finds the user in MySQL.
  3. The provided password is mathematically hashed using **BCrypt** and compared against the database hash.
  4. The `JwtService` creates a JSON Web Token (JWT), signs it with a secret key, and includes the user's role.
  5. The React frontend saves this token in `localStorage`, and an Axios interceptor attaches `Authorization: Bearer <token>` to the headers of *every* subsequent request.

* **OAuth (GitHub) Login:**
  1. Spring Security redirects the browser to GitHub.
  2. Once the user approves, GitHub redirects back to the backend. `OAuth2SuccessHandler.java` intercepts the successful login.
  3. It extracts their email. If they don't exist in the database, it automatically generates a new User row.
  4. It generates a JWT and sends an HTTP 302 Redirect to `/oauth-success` on the frontend, passing the token so the frontend can store it.

* **Role-Based Access Control:**
  * **Frontend:** React uses a custom `<RoleRoute>` wrapper component. If a `STUDENT` tries to type `/faculty` in the URL, React detects their role from Context and forcefully redirects them.
  * **Backend:** Endpoints are protected. `JwtFilter` runs on every request to verify the token hasn't been tampered with before letting them fetch sensitive data.

---

## 3. Resume Intelligence Module (Star Feature)
*If asked, "How does your Resume Analysis actually parse a PDF?"*

1. **Upload & Extract:** The user uploads a `.pdf`. React sends it as a `MultipartFile` using `FormData`. In the backend, the `ResumeService` uses the **Apache PDFBox** library to strip and extract all raw text from the file bytes.
2. **AI Inference:** The raw text is passed to `OpenAIService`. We bundle it into an HTTP request via Spring's `RestTemplate` and send it to the **Groq API**. We use a very strict prompt demanding the AI return structured JSON containing an `atsScore`, `improvements` array, and `missingSkills`.
3. **Smart Database Mapping:** 
   * An overall score is saved to MySQL using a `ResumeAnalysis` entity.
   * However, to prevent database schema nightmare, the raw complex AI JSON is attached to the entity using the JPA `@Transient` annotation. This tells Hibernate "don't save this to SQL", but it successfully passes through Jackson directly back to the React UI. This powers your beautiful ATS Match Score ring and Actionable Improvements UI natively.

---

## 4. Question Bank & Mock Test Engine
*If asked about data relations and querying:*

* **JPA Relations:** The database relies heavily on Object-Relational Mapping (ORM). Entities like `Quiz`, `Questions`, and `User` are interconnected. `User` has `@OneToMany` relationships with `StudentResult`, meaning Hibernate seamlessly maps SQL Foreign Keys in the background.
* **Component Reusability:** The Question Bank and Dashboards rely heavily on React's `useEffect` for data fetching, and `useMemo` for computationally caching filtered question lists (by Company, Difficulty, Branch) so the UI doesn't stutter or freeze.

---

## 5. Potential "Gotcha" Questions

**Q: Where do you store the JWT token and why?**
*A: It is stored in Browser `localStorage`. We use Axios interceptors in `App.jsx` to gracefully delete the token and instantly log the user out if the token expires (returns a 401 Unauthorized from the backend).*

**Q: Why didn't you use simple Sessions instead of JWT?**
*A: Because JWT is stateless. Our Spring Boot backend does not need to store the user's session in memory. This makes our backend infinitely scalable!*

**Q: What happens if the AI API server goes down?**
*A: We have `try-catch` blocks wrapping the Axios requests. Our frontend captures the exception and cleanly sets the AI button back to its active state with an alert, preventing the user interface from freezing indefinitely.*
