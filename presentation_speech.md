# 🎤 CampusPlace - Project Demonstration Speech

> **Instructions:** Read this out loud, naturally. Each section corresponds to one page/feature you will show on screen. Take a breath between each section.

---

## 🟢 OPENING (Before you start the demo)

*"Good morning/afternoon. My project is called **CampusPlace** — a full-stack, AI-powered campus placement preparation platform. The goal of this platform is to help engineering students prepare for placements in a smarter, faster, and more personalised way. It is built using **React.js** on the frontend and **Spring Boot with Java 17** on the backend, and the database is **MySQL**.*

*Let me walk you through the platform step by step."*

---

## 🔐 PAGE 1 — LOGIN PAGE
*[Open the browser at **localhost:5173/login**]*

*"The first page is the **Login and Authentication** screen. I have implemented three ways for users to log in:*
1. *Standard email and password login, which is verified using **BCrypt hashing** on the backend.*
2. ***Login with Google** using OAuth2 — the user clicks Google, approves, and is automatically registered and redirected back to the dashboard.*
3. ***Login with GitHub** — same process, perfect for developers.*

*The system also has a **Forgot Password** flow — the user enters their email, gets a reset link on their inbox, and can securely set a new password.*

*There is also a **Signup** option where new users can create an account. JWT tokens are used to keep sessions secure."*

---

## 🏠 PAGE 2 — HOME PAGE / DASHBOARD
*[After login, show the **Home Page**]*

*"After logging in, the user lands on the **Home Page**. This is the central hub of the platform. You can see a beautifully designed, animated hero section with a rotating 3D cube — this was built using pure CSS 3D transforms.*

*Below, the platform presents 6 modules in a card-based grid, each representing a feature:*
1. Student Dashboard
2. Companies & Placements
3. Question Bank
4. Resume Analysis
5. Progress Tracking
6. Mock Test Engine

*The navigation is fully **role-based**. A Faculty member sees a different set of cards than a Student. And an Admin has their own separate admin panel.*

*If a student tries to type the faculty URL manually, they are immediately redirected away — this is enforced on both the frontend using a **RoleRoute** component and on the backend using Spring Security."*

---

## 🏢 PAGE 3 — COMPANIES PAGE
*[Click on "Company & Placements"]*

*"This is the **Companies Page**. Here, students can browse all companies that are participating in campus placements — including top-tier companies like **Microsoft, Google, Infosys,** and more.*

*Each company card shows the company name, industry, and location. When a student clicks on any company card, they reach the **Company Details** page."*

*[Click on a company — e.g., Microsoft]*

*"This is the Microsoft detail page. Here, the student can see all the eligibility requirements — minimum CGPA, whether backlogs are allowed, and which branches can apply.*

*I have implemented a real-time **Eligibility Check** feature. When the student clicks 'Check Eligibility', the system animates through each criterion one by one and compares it against the student's actual profile data fetched from our database.*

*If the student is eligible, an **Apply Now** button appears. Clicking it directly redirects them to Microsoft's official careers page."*

---

## ❓ PAGE 4 — QUESTION BANK
*[Navigate to **Question Bank**]*

*"The **Question Bank** is our curated database of interview preparation questions. Students can filter questions by Company, Difficulty Level, and Branch.*

*On the frontend, I used React's **useMemo** hook so the filtering happens instantly without making a new API call every time the user types. This makes the experience extremely fast and smooth.*

*The data is fetched once from the backend and then filtered entirely in memory."*

---

## 📄 PAGE 5 — RESUME INTELLIGENCE (Most Important Feature)
*[Navigate to **Resume Analysis**]*

*"This is our **flagship and most advanced feature — Resume Intelligence**, powered by Artificial Intelligence.*

*The student uploads their resume as a PDF. Here is what happens step by step:*
1. *The PDF file is sent to our **Spring Boot backend**.*
2. *Our backend uses the **Apache PDFBox** library to strip out all the text from the file.*
3. *This text is then packaged into a request and sent to the **Groq AI API** — which uses the **Llama-3** large language model.*
4. *We send a very specific prompt asking the AI to return a structured JSON response containing an ATS Match Score, a list of missing skills, and actionable improvement suggestions.*
5. *The AI response is processed and sent back to the frontend.*

*On the UI, the student sees a beautiful circular gauge showing their **ATS Match Score** and a list of specific improvements they can make to their resume."*

*[If the demo is live, upload a sample PDF]*

*"As you can see, after uploading, within a few seconds the AI analysis appears — giving the student a concrete score and telling them exactly what to fix."*

---

## 📊 PAGE 6 — PROGRESS TRACKING
*[Navigate to **Progress Tracking**]*

*"This is the **Progress Tracking Dashboard**. It gives students a bird's-eye view of their overall performance across all the mock tests they have taken.*

*At the top, we have animated **Score Rings** — showing the student's average score and accuracy. Below, there are three tabs:*
- **Overview** — shows key stats like total tests taken, current streak, strongest and weakest topics.
- **Charts** — shows interactive Line, Bar, and Doughnut charts built using **Chart.js**, visualising the score trend over time.
- **History** — a full table of all past tests with score badges like Excellent, Good, Average."*

---

## 🎯 PAGE 7 — MOCK TEST ENGINE
*[Navigate to **Mock Test**]*

*"The **Mock Test Engine** allows students to take timed multiple choice quizzes on various subjects like Data Structures, DBMS, Operating Systems, Java, and more.*

*[Click on a quiz → Start Test]*

*Each question has exactly 30 minutes. The student selects their answers and hits Submit. The backend immediately evaluates the answers, calculates the score, and saves the result to the database.*

*An important feature: a student cannot attempt the same quiz more than **2 times** — this is enforced at the backend service level to maintain academic integrity."*

---

## 💁 CLOSING
*"To summarise, **CampusPlace** is a complete, production-ready platform with:*
- ✅ *Secure JWT + OAuth2 authentication*
- ✅ *AI-powered Resume Analysis using Groq Llama-3*
- ✅ *Real-time eligibility checking against company criteria*
- ✅ *A curated Question Bank with instant filtering*
- ✅ *A timed Mock Test Engine with attempt limiting*
- ✅ *Visual Progress Tracking with Chart.js*
- ✅ *Full Role-Based Access Control for Students, Faculty, and Admin*

*This platform was built ground-up using React.js, Spring Boot, MySQL, REST APIs, Spring Security, JPA/Hibernate, and Groq AI. Thank you for your time — I am happy to answer any questions."*

---

> **💡 Tip:** Speak slowly and confidently. Point at the screen as you describe each feature. If anything doesn't load, say "The AI API may take a moment to warm up — this is a cloud service" and move on.
