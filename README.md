# Multi-Branch Academic Calendar Harmonizer

A full-stack application for managing and harmonizing academic calendars across multiple institutional branches. Built with Spring Boot (backend) and React (frontend).

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Framework | Spring Boot 3.3.0 |
| Language | Java 17 |
| Database | MySQL 8 + Spring Data JPA / Hibernate |
| Security | Spring Security + JWT (jjwt 0.12.5) |
| API Docs | SpringDoc OpenAPI (Swagger UI) |
| Testing | TestNG 7.8.0 + Mockito |
| Build | Maven |

### Frontend (`academic-calendar-pro/`)
| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS |
| Calendar UI | FullCalendar 6 |
| HTTP Client | Axios |
| Animations | Framer Motion |

---

## Project Structure

```
├── src/
│   ├── main/java/com/example/demo/
│   │   ├── config/               # SecurityConfig, OpenApiConfig
│   │   ├── controller/           # REST controllers (6)
│   │   ├── dto/                  # Request/Response DTOs
│   │   ├── entity/               # JPA entities (6)
│   │   ├── exception/            # GlobalExceptionHandler, custom exceptions
│   │   ├── repository/           # Spring Data JPA repositories (6)
│   │   ├── security/             # JwtUtil, JwtAuthenticationFilter, CustomUserDetailsService
│   │   ├── service/              # Service interfaces + impl/ (6 services)
│   │   ├── servlet/              # SimpleStatusServlet
│   │   └── DemoApplication.java
│   └── test/java/com/example/demo/
│       ├── MultiBranchAcademicCalendarHarmonizerTest.java
│       ├── TestResultListener.java
│       └── TestRunner.java
│
└── academic-calendar-pro/        # React frontend
    └── src/
        ├── components/           # Layout, Sidebar, TopBar, EventModal, etc.
        ├── context/              # AuthContext
        ├── pages/                # Dashboard, BranchManagement, ConflictPage, etc.
        └── utils/                # api.js, conflictDetection.js
```

---

## Domain Model

| Entity | Description |
|---|---|
| `UserAccount` | Users with role-based access (`ADMIN` / `REVIEWER`) |
| `BranchProfile` | Academic branch/department |
| `AcademicEvent` | Events (exams, holidays, etc.) belonging to a branch |
| `ClashRecord` | Detected scheduling conflicts between two events |
| `EventMergeRecord` | Record of merged/harmonized events |
| `HarmonizedCalendar` | Unified calendar view with effective date window |

---

## API Endpoints

| Resource | Base Path |
|---|---|
| Authentication | `/api/auth/*` |
| Users | `/api/users/*` |
| Branches | `/api/branches/*` |
| Events | `/api/events/*` |
| Harmonized Calendars | `/api/harmonized-calendars/*` |
| Clash Records | `/api/clashes/*` |
| Merge Records | `/api/merge-records/*` |

Interactive API docs available at: `http://localhost:8080/swagger-ui.html`

---

## Setup & Run

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8
- Node.js 18+ (for frontend)

### 1. Database
The database `calendar_db` is created automatically on first run (`createDatabaseIfNotExist=true`).

Update credentials in `src/main/resources/application.properties` if needed:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/calendar_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
```

### 2. Backend
```bash
# Build
mvn clean compile

# Run application (port 8080)
mvn spring-boot:run
```

### 3. Frontend
```bash
cd academic-calendar-pro
npm install
npm run dev
```

---

## Running Tests

65 TestNG tests covering all layers, executed via Mockito (no live DB required):

| Group | Tests | Coverage |
|---|---|---|
| Servlet | 7 | Servlet behavior, DTO mapping, path patterns |
| CRUD | 10 | User & branch registration, event creation, validation |
| DI / IoC | 5 | Service and repository injection verification |
| Hibernate / JPA | 8 | `@PrePersist` defaults, repository mock operations |
| JPA Mapping | 5 | Entity relationship concepts |
| Associations | 5 | Branch–event, event–clash, merge record concepts |
| Security & JWT | 15 | Token generation, validation, role claims, password rules |
| Advanced Querying | 10 | Service-level queries, clash resolution, calendar range |

```bash
# Run all tests
mvn test

# Run via custom TestRunner
mvn exec:java -Dexec.mainClass="com.example.demo.TestRunner" -Dexec.classpathScope=test
```

Test reports are generated in `test-output/`.

---

## Author

Karthikeyan C — Cybersecurity Engineering Student
