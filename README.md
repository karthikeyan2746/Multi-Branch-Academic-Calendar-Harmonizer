# Multi-branch Academic Calendar Harmonizer

A Spring Boot application for managing and harmonizing academic calendars across multiple branches.

## Features

- **Branch Management**: Create and manage academic branches
- **Event Management**: Create and manage academic events
- **Calendar Harmonization**: Merge and harmonize calendars across branches
- **Conflict Detection**: Detect and resolve scheduling conflicts
- **User Authentication**: JWT-based authentication and authorization
- **RESTful APIs**: Complete REST API for all operations

## Technology Stack

- **Framework**: Spring Boot 3.3.0
- **Database**: MySQL with JPA/Hibernate
- **Security**: Spring Security with JWT
- **Testing**: TestNG with Mockito
- **Build Tool**: Maven
- **Java Version**: 17

## Project Structure

```
src/
├── main/java/com/example/demo/
│   ├── config/          # Configuration classes
│   ├── controller/      # REST controllers
│   ├── dto/            # Data Transfer Objects
│   ├── entity/         # JPA entities
│   ├── exception/      # Custom exceptions
│   ├── repository/     # JPA repositories
│   ├── security/       # Security configuration and JWT utilities
│   ├── service/        # Service interfaces and implementations
│   ├── servlet/        # Custom servlets
│   └── DemoApplication.java
└── test/java/com/example/demo/
    ├── MultiBranchAcademicCalendarHarmonizerTest.java
    ├── TestResultListener.java
    └── TestRunner.java
```

## Key Components

### Entities
- **UserAccount**: User management with role-based access
- **BranchProfile**: Academic branch information
- **AcademicEvent**: Academic events and activities
- **EventMergeRecord**: Records of merged events
- **ClashRecord**: Conflict detection records
- **HarmonizedCalendar**: Unified calendar view

### Services
- **UserAccountService**: User registration and management
- **BranchProfileService**: Branch operations
- **AcademicEventService**: Event management
- **EventMergeService**: Event merging logic
- **ClashDetectionService**: Conflict detection and resolution
- **HarmonizedCalendarService**: Calendar harmonization

## Running Tests

The project includes comprehensive TestNG tests covering:
- Servlet functionality (7 tests)
- CRUD operations (10 tests)
- Dependency Injection (5 tests)
- Hibernate/JPA features (8 tests)
- JPA mapping concepts (5 tests)
- Association concepts (5 tests)
- Security & JWT (15 tests)
- Advanced querying (10 tests)

**Total: 65 tests**

To run tests:
```bash
mvn exec:java -Dexec.mainClass="com.example.demo.TestRunner" -Dexec.classpathScope=test
```

## Build and Run

1. **Prerequisites**:
   - Java 17+
   - Maven 3.6+
   - MySQL database

2. **Build**:
   ```bash
   mvn clean compile
   ```

3. **Run Tests**:
   ```bash
   mvn exec:java -Dexec.mainClass="com.example.demo.TestRunner" -Dexec.classpathScope=test
   ```

4. **Run Application**:
   ```bash
   mvn spring-boot:run
   ```

## Configuration

Update `application.properties` with your database configuration:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_database
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## API Endpoints

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Branches**: `/api/branches/*`
- **Events**: `/api/events/*`
- **Calendars**: `/api/harmonized-calendars/*`
- **Conflicts**: `/api/clashes/*`
- **Merges**: `/api/merge-records/*`

## Author

- Karthikeyan C (Cyber security Engineering Student)