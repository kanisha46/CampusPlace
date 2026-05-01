# CampusPlace Backend Architecture & API Trace

This document maps out the entire Spring Boot backend file structure. It explains exactly what knowledge and functionality each file holds, categorized by the standard **Model-View-Controller (MVC) / 3-Tier Architecture** used in Spring Boot. It also includes the specific REST API endpoints exposed by each controller.

---

## 1. ⚙️ Configuration & Security Layer (`/config`)
*These files govern how your application starts up, who is allowed to access what, and how cross-origin requests are handled.*

*   **`SecurityConfig.java`**: The "Bouncer". Defines which API endpoints are public (e.g., `/auth/login`) and which require a valid JWT token. It disables CSRF and configures the `JwtFilter`.
*   **`JwtFilter.java`**: The "Inspector". Intercepts every incoming HTTP request, extracts the `Authorization: Bearer <token>` header, verifies the signature using `JwtService`, and sets the user as "logged in" for that specific request.
*   **`CorsConfig.java`**: The "Bridge". Allows your React frontend (running on port `5173`) to talk to your Spring Boot backend (running on port `8080` or Aiven) without the browser blocking it.
*   **`OAuth2SuccessHandler.java`**: Handles the logic when a user logs in successfully using Google or another Social Login. It generates a JWT and redirects the user back to the React frontend.
*   **`AdminSeeder.java`**: Runs when the application boots up. It checks if an Admin user exists in the database; if not, it creates a default Admin account automatically.

---

## 2. 🚦 Controller Layer (`/controller`)
*Controllers act as the "Entry Points". They receive HTTP requests (GET, POST) from your React frontend and route them to the appropriate Service.*

*   **`AuthController.java`**: Handles authentication and user management.
    *   `POST /auth/login` - Authenticates user and returns JWT.
    *   `POST /auth/signup` - Registers a new user.
    *   `POST /auth/forgot-password` - Initiates password reset.
    *   `GET /auth/users` - Fetches list of all users (for Admin).

*   **`QuizController.java`**: Manages all quiz-related requests.
    *   `POST /quiz/create` - Creates a new quiz.
    *   `GET /quiz/student/list` - Lists all available quizzes.
    *   `GET /quiz/student/{quizId}` - Fetches a specific quiz to attempt.
    *   `POST /quiz/student/submit` - Submits answers for evaluation.
    *   `GET /quiz/student/{quizId}/result` - Retrieves past quiz scores.

*   **`ProfileController.java`**: Handles user profile data and file uploads.
    *   `GET /api/profile` - Fetches current user profile.
    *   `POST /api/profile` - Uploads profile details and Resume PDF (uses `multipart/form-data`).

*   **`ResumeController.java` & `AIController.java`**: The entry points for AI processing.
    *   `POST /api/resume/analyze` - Triggers the parsing and skill extraction of the uploaded resume.
    *   `POST /api/ai/generate-answer` - Connects to LLM to generate interview responses.

*   **`CompanyController.java`**: Provides endpoints for job postings.
    *   `GET /api/companies` - Fetches all companies.
    *   `GET /api/companies/{id}` - Fetches details of a specific company.
    *   `POST /api/companies` - Adds a new company.
    *   `PUT /api/companies/{id}` - Updates company details.
    *   `DELETE /api/companies/{id}` - Deletes a company.

*   **`AdminController.java`**: Protected endpoints accessible only by ADMIN.
    *   `DELETE /admin/delete/{email}` - Deletes a user account.
    *   `PUT /admin/promote/{email}` - Promotes a student to faculty/admin.

*   **`QuestionBankController.java`**: Manages pre-defined questions.
    *   `GET /api/questions/filter` - Fetches filtered questions for quizzes.

---

## 3. 🧠 Service Layer (`/service`)
*The "Brain" of your backend. Controllers pass data here, and this layer executes the actual business logic, calculations, and external API calls.*

*   **`AuthService.java`**: Handles hashing the user's password (using BCrypt) during signup and verifying it during login.
*   **`JwtService.java`**: Contains the secret key and the logic to generate, sign, and decode the JWT tokens.
*   **`QuizService.java`**: The logic that takes a student's submitted answers, compares them against the correct answers in the database, calculates the final score, and saves the `StudentResult`.
*   **`ResumeService.java`**: Contains the logic to read a PDF file, extract its text, and prepare it for analysis.
*   **`OpenAIService.java` / `AIService.java`**: Holds the knowledge of how to format prompts and communicate with an external LLM (like OpenAI/Python backend) to extract skills from the resume text.
*   **`CustomUserDetailsService.java`**: A Spring Security requirement. It tells Spring how to load a user's details and role from the database using their email.
*   **`EmailService.java`**: Handles SMTP logic for sending "Forgot Password" or "Verify Email" links.

---

## 4. 🗄️ Repository Layer (`/repository`)
*The "Data Access Layer". These interfaces extend Spring Data's `JpaRepository`. They write the SQL queries for you.*

*   **`UserRepository.java`**: Contains methods like `findByEmail(String email)` to fetch users.
*   **`QuizRepository.java`**: Fetches quizzes based on ID or Creator.
*   **`StudentResultRepository.java`**: Stores and retrieves past quiz scores for a specific student.
*   **`CompanyRepository.java`**: Handles saving and retrieving job postings.

---

## 5. 🧱 Entity Layer (`/entity`)
*The "Blueprint". These Java classes are mapped directly to your PostgreSQL database tables using `@Entity`.*

*   **`User.java`**: Maps to the `users` table. Holds email, password, and `Role` (enum: STUDENT, FACULTY, ADMIN).
*   **`StudentProfile.java`**: Maps to the student's profile table. Holds bio, GitHub links, and the file path to their uploaded resume.
*   **`Quiz.java`**: Maps to the `quiz` table. Holds the quiz title, duration, and a One-to-Many relationship with `Question.java`.
*   **`StudentResult.java`**: Maps to the table recording attempt history (score, timestamp, linked to a User and a Quiz).
*   **`ResumeAnalysis.java` / `SkillRequirement.java`**: Stores the extracted NLP entities (skills like "Java", "React") linked to a specific student so it can be queried against company requirements.
