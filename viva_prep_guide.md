# 🎓 CampusPlace - The Ultimate Viva & Architecture Guide

This comprehensive document contains everything you need to know to defend and present your project. It includes the general technology overview, the logical flows, potential "Gotcha" examiner questions, and a detailed mapping of exactly which frontend files communicate with which backend controllers.

---

## 1. Project Overview & Technology Stack
*If the external examiner asks what technologies you used, tell them:*

* **Frontend:** Built with **React.js** (bootstrapped with Vite for high-speed compilation). State is managed via React Context API. All styling is custom-written vanilla CSS using modern CSS Grid, Flexbox, and CSS Keyframe animations (demonstrating deep CSS knowledge without relying on templates like Tailwind or Bootstrap).
* **Backend:** Built with **Java 17** and **Spring Boot 3**, providing a highly scalable RESTful API.
* **Database:** Relational database mapping using **Hibernate (Spring Data JPA)** with a **MySQL** database.
* **Security:** Secured using **Spring Security 6**, stateless **JWT** (JSON Web Tokens), and **OAuth2** (for Google/GitHub login).
* **AI Integration:** Uses **Groq's Llama-3** high-speed inference engine via REST APIs.

---

## 2. Authentication & Security Flow

### How Security Works Logically (The "Why")
* **Standard Login:** The frontend sends a password to the backend, which hashes it using **BCrypt** and compares it to MySQL. A JSON Web Token (JWT) is generated, signed with a secret key, and stored in the browser's `localStorage`.
* **OAuth Login:** Spring Security redirects the browser to GitHub/Google. After approval, the backend intercepts the success, auto-registers the user if they are new, generates a JWT, and redirects them to the frontend with the token.
* **Statelessness:** Instead of storing active sessions in server memory, we use JWT. This makes the backend "stateless" and infinitely scalable!

### Exact File & API Mapping (The "Where")
* **`src/pages/LoginPage.jsx`**: Handles both Login and Signup forms. Uses `axios.post()` to call `http://localhost:8082/auth/login` and `/auth/signup`.
* **`src/App.jsx`**: Uses an Axios Interceptor to automatically attach the `Authorization: Bearer <token>` to the headers of *every* subsequent request.
* **`src/main/java/.../controller/AuthController.java`**: Exposes the `/auth/**` REST endpoints.
* **`src/main/java/.../config/SecurityConfig.java`**: Marks `/auth/**` as `permitAll()` so users can login, but protects all other API routes.
* **`src/main/java/.../config/JwtFilter.java`**: The absolute core of security. Every API request passes through here first. It reads the token header, verifies the cryptographic signature, and sets the user context (`SecurityContextHolder`).

---

## 3. Resume Intelligence Module (Star Feature)

### How It Works Logically (The "Why")
1. **Extraction:** A `.pdf` uploaded by the user is passed to the backend, where **Apache PDFBox** strips the raw text.
2. **AI Inference:** The text is bundled into an HTTP JSON request using `RestTemplate` and sent to the **Groq Llama-3 API**. We demand strict JSON containing an ATS Score, missing skills, and an actionable improvements array.
3. **Delivery:** The overall score is saved to MySQL. To prevent complex schema nightmares, we use JPA's `@Transient` annotation to attach the raw AI output securely to the entity without saving it to SQL. Jackson serializes it straight to React for the user to view.

### Exact File & API Mapping (The "Where")
* **`src/pages/ResumeAnalysis.jsx`**: The UI the user sees. It reads `data.detailedAnalysis.atsScore` and `data.detailedAnalysis.improvements` natively from the JSON output to drive the beautifully customized interactive charts.
* **`src/main/java/.../controller/ResumeController.java`**: Has a `@PostMapping("/analyze")` that receives the `MultipartFile`.
* **`src/main/java/.../service/ResumeService.java`**: Extracts text via PDFBox, maps data to the `ResumeAnalysis` entity, saves it, and manually binds the AI output using a `HashMap` (bypassing JPA cleanup).
* **`src/main/java/.../service/OpenAIService.java`**: Connects via HTTP POST to the Groq cloud.

---

## 4. Question Bank, Dashboards & Database ORM

### How the Database Works Logically (The "Why")
* **JPA Relations:** The database relies entirely on Object-Relational Mapping (ORM). Java entities like `Quiz`, `Questions`, and `User` are interconnected using annotations like `@OneToMany`. This allows Hibernate to automatically construct complex SQL `JOIN` statements and maintain Foreign Keys in MySQL without us needing to hand-write raw SQL statements.

### Exact File & API Mapping (The "Where")
* **`src/pages/ProgressTracking.jsx`**: Calls `axios.get('/api/progress')` via `useEffect()` to populate the dashboard metrics. Relies on `Chart.js` (`<Line>`, `<Doughnut>`) internally mapped via `ProgressCharts.jsx`.
* **`src/pages/MockTest.jsx` & `QuestionBank.jsx`**: Uses React's `useMemo` specifically to filter lists instantly on the frontend when typing in the search bar, ensuring a lightning-fast experience without re-pinging the server.
* **`src/main/java/.../controller/QuizController.java`**: Provides role-restricted API endpoints for creating, fetching, and submitting quizzes.
* **`src/main/java/.../service/QuizService.java`**: Validates user answers directly on the server to prevent cheating, calculates accuracy, and saves results to `StudentResult` tables.

---

## 5. Typical "Gotcha" Viva Questions

**Q: Where do you store the JWT token and why?**
*A: It is stored in Browser `localStorage`. We use Axios interceptors in `App.jsx` to gracefully delete the token and instantly log the user out if the token expires (returns a 401 Unauthorized from the backend).*

**Q: Why didn't you use simple Sessions instead of JWT?**
*A: Because JWT is stateless. Our Spring Boot backend does not need to store the user's session in server memory. This uses dramatically less RAM and makes our backend infinitely scalable!*

**Q: What happens if the Groq AI API server goes down?**
*A: We have `try-catch` blocks wrapping the Axios requests and Backend controllers. Our frontend successfully captures the exception and cleanly sets the AI button back to its active state with an error alert, preventing the User Interface from crashing or freezing indefinitely.*

**Q: How did you implement security testing between pages?**
*A: On the Frontend, we built a React Higher-Order Component called `<RoleRoute>`. Even if a basic STUDENT attempts to type `/faculty` in the URL bar manually, React evaluates their role from the global Context and forcefully redirects them away safely.*
