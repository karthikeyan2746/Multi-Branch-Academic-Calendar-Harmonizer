package com.example.demo;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.*;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.ValidationException;
import com.example.demo.repository.*;
import com.example.demo.security.CustomUserDetailsService;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.impl.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.mockito.*;
import org.mockito.stubbing.Answer;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.testng.Assert;
import org.testng.annotations.*;

import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@Listeners(TestResultListener.class)
public class MultiBranchAcademicCalendarHarmonizerTest {

    // Repositories
    @Mock
    private BranchProfileRepository branchProfileRepository;
    @Mock
    private AcademicEventRepository academicEventRepository;
    @Mock
    private EventMergeRecordRepository eventMergeRecordRepository;
    @Mock
    private ClashRecordRepository clashRecordRepository;
    @Mock
    private HarmonizedCalendarRepository harmonizedCalendarRepository;
    @Mock
    private UserAccountRepository userAccountRepository;

    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;

    // Service implementations
    @InjectMocks
    private BranchProfileServiceImpl branchProfileService;
    @InjectMocks
    private AcademicEventServiceImpl academicEventService;
    @InjectMocks
    private EventMergeServiceImpl eventMergeService;
    @InjectMocks
    private ClashDetectionServiceImpl clashDetectionService;
    @InjectMocks
    private HarmonizedCalendarServiceImpl harmonizedCalendarService;
    @InjectMocks
    private UserAccountServiceImpl userAccountService;

    // Security
    private JwtUtil jwtUtil;
    private CustomUserDetailsService userDetailsService;

    @BeforeClass
    public void setup() {
        MockitoAnnotations.openMocks(this);
        jwtUtil = new JwtUtil();
        jwtUtil.initKey();
        userDetailsService = new CustomUserDetailsService(userAccountRepository);
        when(passwordEncoder.encode(anyString())).thenAnswer((Answer<String>) inv -> "ENC_" + inv.getArgument(0));
    }

    // region 1. Simple Servlet / Controller-like behavior (7 tests) priority 1-7

    @Test(priority = 1, groups = "servlet")
    public void t01_simpleServlet_statusAlive() throws Exception {
        com.example.demo.servlet.SimpleStatusServlet servlet =
                new com.example.demo.servlet.SimpleStatusServlet();

        HttpServletRequest request = mock(HttpServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        PrintWriter writer = mock(PrintWriter.class);

        when(response.getWriter()).thenReturn(writer);

        servlet.doGet(request, response);

        verify(response).setStatus(200);
        verify(writer).write("Servlet Alive");
    }

    @Test(priority = 2, groups = "servlet")
    public void t02_simpleControllerPathBuilding() {
        Long id = 10L;
        String path = "/api/branches/" + id;
        Assert.assertTrue(path.contains("/api/branches/10"));
    }

    @Test(priority = 3, groups = "servlet")
    public void t03_queryParamSimulation() {
        String url = "/api/merge-records/range?start=2024-01-01&end=2024-03-31";
        Assert.assertTrue(url.contains("start=2024-01-01"));
        Assert.assertTrue(url.contains("end=2024-03-31"));
    }

    @Test(priority = 4, groups = "servlet")
    public void t04_registerRequestDtoMapping() {
        RegisterRequest req = new RegisterRequest("User X", "x@example.com", "password123", "ADMIN", "IT");
        Assert.assertEquals(req.getEmail(), "x@example.com");
        Assert.assertEquals(req.getRole(), "ADMIN");
    }

    @Test(priority = 5, groups = "servlet")
    public void t05_loginRequestDtoMapping() {
        LoginRequest req = new LoginRequest("login@example.com", "pass");
        Assert.assertEquals(req.getEmail(), "login@example.com");
    }

    @Test(priority = 6, groups = "servlet")
    public void t06_pathPatternMatch() {
        String path = "/api/harmonized-calendars/15";
        Assert.assertTrue(path.matches(".*/api/harmonized-calendars/\\d+"));
    }

    @Test(priority = 7, groups = "servlet")
    public void t07_statusCodeOrdering() {
        int ok = 200;
        int unauthorized = 401;
        Assert.assertTrue(ok < unauthorized);
    }

    // endregion

    // region 2. CRUD operations using Spring Boot + REST (10 tests) priority 10-19

    @Test(priority = 10, groups = "crud")
    public void t10_registerUser_success() {
        UserAccount user = new UserAccount(null, "User A", "a@example.com", "password123",
                "ADMIN", "IT", null);
        when(userAccountRepository.existsByEmail("a@example.com")).thenReturn(false);
        when(userAccountRepository.save(any(UserAccount.class))).thenAnswer(inv -> {
            UserAccount u = inv.getArgument(0);
            u.setId(1L);
            return u;
        });

        UserAccount created = userAccountService.register(user);
        Assert.assertNotNull(created.getId());
        Assert.assertEquals(created.getEmail(), "a@example.com");
        verify(userAccountRepository).save(any(UserAccount.class));
    }

    @Test(priority = 11, groups = "crud")
    public void t11_registerUser_duplicateEmail() {
        UserAccount user = new UserAccount(null, "User B", "dup@example.com", "password123",
                "REVIEWER", "Science", null);
        when(userAccountRepository.existsByEmail("dup@example.com")).thenReturn(true);

        try {
            userAccountService.register(user);
            Assert.fail("Expected ValidationException");
        } catch (ValidationException ex) {
            Assert.assertTrue(ex.getMessage().contains("Email already in use"));
        }
    }

    @Test(priority = 12, groups = "crud")
    public void t12_getUserById_success() {
        UserAccount user = new UserAccount(2L, "User C", "c@example.com", "ENC_pwd",
                "REVIEWER", "Maths", LocalDateTime.now());
        when(userAccountRepository.findById(2L)).thenReturn(Optional.of(user));

        UserAccount result = userAccountService.getUser(2L);
        Assert.assertEquals(result.getId(), Long.valueOf(2L));
    }

    @Test(priority = 13, groups = "crud")
    public void t13_getUserById_notFound() {
        when(userAccountRepository.findById(99L)).thenReturn(Optional.empty());
        try {
            userAccountService.getUser(99L);
            Assert.fail("Expected ResourceNotFoundException");
        } catch (ResourceNotFoundException ex) {
            Assert.assertTrue(ex.getMessage().contains("User not found"));
        }
    }

    @Test(priority = 14, groups = "crud")
    public void t14_createBranch_success() {
        BranchProfile bp = new BranchProfile(null, "CSE01", "CSE Dept",
                "cse@example.com", null, true);
        when(branchProfileRepository.save(any(BranchProfile.class))).thenAnswer(inv -> {
            BranchProfile b = inv.getArgument(0);
            b.setId(10L);
            return b;
        });

        BranchProfile created = branchProfileService.createBranch(bp);
        Assert.assertNotNull(created.getId());
        Assert.assertEquals(created.getBranchCode(), "CSE01");
    }

    @Test(priority = 15, groups = "crud")
    public void t15_updateBranchStatus_success() {
        BranchProfile bp = new BranchProfile(11L, "EEE01", "EEE", "eee@example.com",
                LocalDateTime.now(), true);
        when(branchProfileRepository.findById(11L)).thenReturn(Optional.of(bp));
        when(branchProfileRepository.save(any(BranchProfile.class))).thenAnswer(inv -> inv.getArgument(0));

        BranchProfile updated = branchProfileService.updateBranchStatus(11L, false);
        Assert.assertFalse(updated.getActive());
    }

    @Test(priority = 16, groups = "crud")
    public void t16_getAllBranches_empty() {
        when(branchProfileRepository.findAll()).thenReturn(Collections.emptyList());
        List<BranchProfile> list = branchProfileService.getAllBranches();
        Assert.assertTrue(list.isEmpty());
    }

    @Test(priority = 17, groups = "crud")
    public void t17_getAllBranches_nonEmpty() {
        BranchProfile b1 = new BranchProfile(1L, "BR1", "Branch 1",
                "b1@example.com", LocalDateTime.now(), true);
        when(branchProfileRepository.findAll()).thenReturn(List.of(b1));
        List<BranchProfile> list = branchProfileService.getAllBranches();
        Assert.assertEquals(list.size(), 1);
    }

    @Test(priority = 18, groups = "crud")
    public void t18_createAcademicEvent_success() {
        AcademicEvent ev = new AcademicEvent(null, 1L, "Exam 1", "EXAM",
                LocalDate.of(2024, 1, 10), LocalDate.of(2024, 1, 12),
                "Hall 1", "Midterm", null);
        when(academicEventRepository.save(any(AcademicEvent.class)))
                .thenAnswer(inv -> {
                    AcademicEvent e = inv.getArgument(0);
                    e.setId(100L);
                    return e;
                });

        AcademicEvent created = academicEventService.createEvent(ev);
        Assert.assertNotNull(created.getId());
    }

    @Test(priority = 19, groups = "crud")
    public void t19_createAcademicEvent_invalidDates() {
        AcademicEvent ev = new AcademicEvent(null, 1L, "Invalid", "EXAM",
                LocalDate.of(2024, 2, 10), LocalDate.of(2024, 1, 10),
                null, null, null);

        try {
            academicEventService.createEvent(ev);
            Assert.fail("Expected ValidationException");
        } catch (ValidationException ex) {
            Assert.assertTrue(ex.getMessage().contains("startDate cannot be after endDate"));
        }
    }

    // endregion

    // region 3. DI & IoC (5 tests) priority 20-24

    @Test(priority = 20, groups = "di")
    public void t20_branchProfileServiceInjected() {
        Assert.assertNotNull(branchProfileService);
        Assert.assertNotNull(branchProfileRepository);
    }

    @Test(priority = 21, groups = "di")
    public void t21_academicEventServiceInjected() {
        Assert.assertNotNull(academicEventService);
        Assert.assertNotNull(academicEventRepository);
    }

    @Test(priority = 22, groups = "di")
    public void t22_mergeServiceInjectedMultipleRepositories() {
        Assert.assertNotNull(eventMergeService);
        Assert.assertNotNull(academicEventRepository);
        Assert.assertNotNull(eventMergeRecordRepository);
    }

    @Test(priority = 23, groups = "di")
    public void t23_clashServiceInjectedRepository() {
        Assert.assertNotNull(clashDetectionService);
        Assert.assertNotNull(clashRecordRepository);
    }

    @Test(priority = 24, groups = "di")
    public void t24_userAccountServiceInjectedPasswordEncoder() {
        Assert.assertNotNull(userAccountService);
        Assert.assertNotNull(passwordEncoder);
    }

    // endregion

    // region 4. Hibernate configs, annotations, CRUD (8 tests) priority 30-37

    @Test(priority = 30, groups = "hibernate")
    public void t30_branchProfilePrePersistSetsDefaults() {
        BranchProfile bp = new BranchProfile();
        bp.setBranchCode("BRX");
        bp.setBranchName("Branch X");
        bp.setContactEmail("brx@example.com");
        bp.prePersist();
        Assert.assertNotNull(bp.getLastSyncAt());
        Assert.assertTrue(bp.getActive());
    }

    @Test(priority = 31, groups = "hibernate")
    public void t31_academicEventPrePersistSubmittedAt() {
        AcademicEvent ev = new AcademicEvent();
        ev.setBranchId(1L);
        ev.setTitle("Event");
        ev.setEventType("EXAM");
        ev.setStartDate(LocalDate.now());
        ev.setEndDate(LocalDate.now());
        ev.prePersist();
        Assert.assertNotNull(ev.getSubmittedAt());
    }

    @Test(priority = 32, groups = "hibernate")
    public void t32_eventMergeRecordPrePersistCreatedAt() {
        EventMergeRecord mr = new EventMergeRecord();
        mr.setSourceEventIds("1,2");
        mr.setMergedTitle("Merged Title");
        mr.setMergedStartDate(LocalDate.now());
        mr.setMergedEndDate(LocalDate.now());
        mr.setMergeReason("CONFLICT_RESOLUTION");
        mr.prePersist();
        Assert.assertNotNull(mr.getCreatedAt());
    }

    @Test(priority = 33, groups = "hibernate")
    public void t33_clashRecordPrePersistDefaults() {
        ClashRecord cr = new ClashRecord();
        cr.setEventAId(1L);
        cr.setEventBId(2L);
        cr.setClashType("DATE_OVERLAP");
        cr.setSeverity("HIGH");
        cr.prePersist();
        Assert.assertNotNull(cr.getDetectedAt());
        Assert.assertFalse(cr.getResolved());
    }

    @Test(priority = 34, groups = "hibernate")
    public void t34_harmonizedCalendarPrePersistGeneratedAt() {
        HarmonizedCalendar cal = new HarmonizedCalendar();
        cal.setGeneratedBy("SYSTEM");
        cal.setEffectiveFrom(LocalDate.now());
        cal.setEffectiveTo(LocalDate.now().plusDays(10));
        cal.prePersist();
        Assert.assertNotNull(cal.getGeneratedAt());
    }

    @Test(priority = 35, groups = "hibernate")
    public void t35_crudSaveBranch_viaRepositoryMock() {
        BranchProfile bp = new BranchProfile(null, "BR2", "Branch 2",
                "br2@example.com", null, true);
        when(branchProfileRepository.save(any(BranchProfile.class)))
                .thenAnswer(inv -> {
                    BranchProfile b = inv.getArgument(0);
                    b.setId(20L);
                    return b;
                });
        BranchProfile saved = branchProfileRepository.save(bp);
        Assert.assertEquals(saved.getId(), Long.valueOf(20L));
    }

    @Test(priority = 36, groups = "hibernate")
    public void t36_userAccountPrePersistDefaultsRole() {
        UserAccount ua = new UserAccount();
        ua.setEmail("ua@example.com");
        ua.setPassword("password123");
        ua.setDepartment("Dept");
        ua.prePersist();
        Assert.assertNotNull(ua.getCreatedAt());
        Assert.assertEquals(ua.getRole(), "REVIEWER");
    }

    @Test(priority = 37, groups = "hibernate")
    public void t37_repositoryFindUserByEmail_optional() {
        UserAccount ua = new UserAccount(5L, "X", "x@example.com",
                "ENC_pwd", "ADMIN", "Dept", LocalDateTime.now());
        when(userAccountRepository.findByEmail("x@example.com")).thenReturn(Optional.of(ua));
        Optional<UserAccount> opt = userAccountRepository.findByEmail("x@example.com");
        Assert.assertTrue(opt.isPresent());
    }

    // endregion

    // region 5. JPA mapping / normalization concepts (5 tests) priority 40-44

    @Test(priority = 40, groups = "jpa")
    public void t40_branchProfileUniquenessConcept() {
        BranchProfile b1 = new BranchProfile(1L, "BR1", "Name1",
                "b1@example.com", LocalDateTime.now(), true);
        BranchProfile b2 = new BranchProfile(2L, "BR2", "Name2",
                "b2@example.com", LocalDateTime.now(), true);
        Assert.assertNotEquals(b1.getBranchCode(), b2.getBranchCode());
    }

    @Test(priority = 41, groups = "jpa")
    public void t41_academicEventBelongsToBranchConcept() {
        AcademicEvent ev = new AcademicEvent(1L, 1L, "Exam",
                "EXAM", LocalDate.now(), LocalDate.now(), null, null,
                LocalDateTime.now());
        Assert.assertEquals(ev.getBranchId(), Long.valueOf(1L));
    }

    @Test(priority = 42, groups = "jpa")
    public void t42_clashRecordReferencesTwoEventsConcept() {
        ClashRecord cr = new ClashRecord(1L, 10L, 11L,
                "DATE_OVERLAP", "HIGH", "Overlap",
                LocalDateTime.now(), false);
        Assert.assertNotEquals(cr.getEventAId(), cr.getEventBId());
    }

    @Test(priority = 43, groups = "jpa")
    public void t43_mergeRecordHasSourceEventsConcept() {
        EventMergeRecord mr = new EventMergeRecord(1L, "1,2,3",
                "Merged", LocalDate.now(), LocalDate.now().plusDays(2),
                "OVERLAP_ALIGNMENT", LocalDateTime.now());
        Assert.assertTrue(mr.getSourceEventIds().contains("2"));
    }

    @Test(priority = 44, groups = "jpa")
    public void t44_harmonizedCalendarEffectiveWindowConcept() {
        HarmonizedCalendar cal = new HarmonizedCalendar(1L, "Calendar",
                "System", LocalDateTime.now(),
                LocalDate.of(2024, 1, 1),
                LocalDate.of(2024, 3, 31), "[]");
        Assert.assertTrue(cal.getEffectiveFrom().isBefore(cal.getEffectiveTo()));
    }

    // endregion

    // region 6. Many-to-many / association concepts (5 tests) priority 50-54

    @Test(priority = 50, groups = "associations")
    public void t50_branchWithMultipleEventsConcept() {
        Long branchId = 1L;
        AcademicEvent e1 = new AcademicEvent(1L, branchId, "Exam1", "EXAM",
                LocalDate.now(), LocalDate.now(), null, null, LocalDateTime.now());
        AcademicEvent e2 = new AcademicEvent(2L, branchId, "Exam2", "EXAM",
                LocalDate.now().plusDays(1), LocalDate.now().plusDays(1),
                null, null, LocalDateTime.now());
        List<AcademicEvent> events = List.of(e1, e2);
        Assert.assertEquals(events.size(), 2);
        Assert.assertTrue(events.stream().allMatch(e -> e.getBranchId().equals(branchId)));
    }

    @Test(priority = 51, groups = "associations")
    public void t51_eventParticipatesInMultipleClashesConcept() {
        Long eventId = 5L;
        ClashRecord c1 = new ClashRecord(1L, eventId, 6L, "DATE_OVERLAP",
                "HIGH", "", LocalDateTime.now(), false);
        ClashRecord c2 = new ClashRecord(2L, 7L, eventId, "DATE_OVERLAP",
                "MEDIUM", "", LocalDateTime.now(), false);
        List<ClashRecord> list = List.of(c1, c2);
        Assert.assertEquals(list.size(), 2);
    }

    @Test(priority = 52, groups = "associations")
    public void t52_eventsMergedConcept() {
        EventMergeRecord mr = new EventMergeRecord(1L, "10,11",
                "Merged Exams", LocalDate.now(), LocalDate.now().plusDays(2),
                "CONFLICT_RESOLUTION", LocalDateTime.now());
        String[] ids = mr.getSourceEventIds().split(",");
        Set<String> uniqueIds = new HashSet<>(Arrays.asList(ids));
        Assert.assertEquals(uniqueIds.size(), 2);
    }

    @Test(priority = 53, groups = "associations")
    public void t53_calendarContainsEventsJsonConcept() {
        HarmonizedCalendar cal = new HarmonizedCalendar(1L, "Main",
                "System", LocalDateTime.now(),
                LocalDate.now(), LocalDate.now().plusDays(30),
                "[{\"id\":1},{\"id\":2}]");
        Assert.assertTrue(cal.getEventsJson().contains("\"id\":1"));
    }

    @Test(priority = 54, groups = "associations")
    public void t54_branchAndCalendarIndirectRelationConcept() {
        BranchProfile bp = new BranchProfile(1L, "BR3", "Branch3",
                "br3@example.com", LocalDateTime.now(), true);
        HarmonizedCalendar cal = new HarmonizedCalendar(1L, "BR3 Calendar",
                "System", LocalDateTime.now(),
                LocalDate.now(), LocalDate.now().plusDays(10),
                "[]");
        Assert.assertTrue(cal.getTitle().contains("BR3"));
    }

    // endregion

    // region 7. Security & JWT (15 tests) priority 60-74

    @Test(priority = 60, groups = "security")
    public void t60_generateJwtToken_containsSubject() {
        Map<String, Object> claims = Map.of("key", "value");
        String token = jwtUtil.generateToken(claims, "subject@example.com");
        String username = jwtUtil.extractUsername(token);
        Assert.assertEquals(username, "subject@example.com");
    }

    @Test(priority = 61, groups = "security")
    public void t61_generateTokenForUser_containsClaims() {
        UserAccount ua = new UserAccount(10L, "T", "token@example.com",
                "ENC_pwd", "ADMIN", "IT", LocalDateTime.now());
        String token = jwtUtil.generateTokenForUser(ua);
        String username = jwtUtil.extractUsername(token);
        String role = jwtUtil.extractRole(token);
        Long userId = jwtUtil.extractUserId(token);

        Assert.assertEquals(username, "token@example.com");
        Assert.assertEquals(role, "ADMIN");
        Assert.assertEquals(userId, Long.valueOf(10L));
    }

    @Test(priority = 62, groups = "security")
    public void t62_tokenValidation_success() {
        UserAccount ua = new UserAccount(11L, "U", "u@example.com",
                "ENC_pwd", "REVIEWER", "Dept", LocalDateTime.now());
        String token = jwtUtil.generateTokenForUser(ua);
        boolean valid = jwtUtil.isTokenValid(token, "u@example.com");
        Assert.assertTrue(valid);
    }

    @Test(priority = 63, groups = "security")
    public void t63_tokenValidation_wrongUser() {
        UserAccount ua = new UserAccount(11L, "U", "u@example.com",
                "ENC_pwd", "REVIEWER", "Dept", LocalDateTime.now());
        String token = jwtUtil.generateTokenForUser(ua);
        boolean valid = jwtUtil.isTokenValid(token, "other@example.com");
        Assert.assertFalse(valid);
    }

    @Test(priority = 64, groups = "security")
    public void t64_customUserDetailsService_loadByEmail() {
        UserAccount ua = new UserAccount(5L, "User", "user@example.com",
                "ENC_pwd", "ADMIN", "Dept", LocalDateTime.now());
        when(userAccountRepository.findByEmail("user@example.com"))
                .thenReturn(Optional.of(ua));

        UserDetails details = userDetailsService.loadUserByUsername("user@example.com");
        Assert.assertEquals(details.getUsername(), "user@example.com");
        Assert.assertTrue(details.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
    }

    @Test(priority = 65, groups = "security")
    public void t65_customUserDetailsService_userNotFound() {
        when(userAccountRepository.findByEmail("no@example.com")).thenReturn(Optional.empty());
        try {
            userDetailsService.loadUserByUsername("no@example.com");
            Assert.fail("Expected UsernameNotFoundException");
        } catch (Exception ex) {
            Assert.assertTrue(ex.getMessage().contains("User not found"));
        }
    }

    @Test(priority = 66, groups = "security")
    public void t66_authenticationManager_simulation() {
        LoginRequest req = new LoginRequest("auth@example.com", "password123");
        UsernamePasswordAuthenticationToken token =
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword());
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(token);

        Assert.assertEquals(token.getPrincipal(), req.getEmail());
        verify(authenticationManager, never()).authenticate(null);
    }

    @Test(priority = 67, groups = "security")
    public void t67_roleBasedAccessConcept_adminRole() {
        UserAccount admin = new UserAccount(1L, "Admin", "admin@example.com",
                "ENC_pwd", "ADMIN", "IT", LocalDateTime.now());
        Assert.assertEquals(admin.getRole(), "ADMIN");
    }

    @Test(priority = 68, groups = "security")
    public void t68_roleBasedAccessConcept_reviewerNotAdmin() {
        UserAccount reviewer = new UserAccount(2L, "User", "user@example.com",
                "ENC_pwd", "REVIEWER", "Dept", LocalDateTime.now());
        Assert.assertNotEquals(reviewer.getRole(), "ADMIN");
    }

    @Test(priority = 69, groups = "security")
    public void t69_tokenIncludesEmailClaim() {
        UserAccount ua = new UserAccount(15L, "E", "emailclaim@example.com",
                "ENC_pwd", "REVIEWER", "Dept", LocalDateTime.now());
        String token = jwtUtil.generateTokenForUser(ua);
        Object email = jwtUtil.parseToken(token).getPayload().get("email");
        Assert.assertEquals(email, "emailclaim@example.com");
    }

    @Test(priority = 70, groups = "security")
    public void t70_tokenIncludesRoleClaim() {
        UserAccount ua = new UserAccount(16L, "R", "roleclaim@example.com",
                "ENC_pwd", "ADMIN", "Dept", LocalDateTime.now());
        String token = jwtUtil.generateTokenForUser(ua);
        Object role = jwtUtil.parseToken(token).getPayload().get("role");
        Assert.assertEquals(role, "ADMIN");
    }

    @Test(priority = 71, groups = "security")
    public void t71_tokenIncludesUserIdClaim() {
        UserAccount ua = new UserAccount(17L, "I", "idclaim@example.com",
                "ENC_pwd", "REVIEWER", "Dept", LocalDateTime.now());
        String token = jwtUtil.generateTokenForUser(ua);
        Object id = jwtUtil.parseToken(token).getPayload().get("userId");
        Assert.assertNotNull(id);
    }

    @Test(priority = 72, groups = "security")
    public void t72_invalidTokenParsingThrows() {
        String invalid = "invalid.token.string";
        try {
            jwtUtil.parseToken(invalid);
            Assert.fail("Expected exception");
        } catch (Exception ex) {
            Assert.assertNotNull(ex.getMessage());
        }
    }

    @Test(priority = 73, groups = "security")
    public void t73_passwordMinLengthValidation() {
        UserAccount ua = new UserAccount(null, "ShortPwd", "shortpwd@example.com",
                "short", "REVIEWER", "Dept", null);
        when(userAccountRepository.existsByEmail("shortpwd@example.com")).thenReturn(false);

        try {
            userAccountService.register(ua);
            Assert.fail("Expected ValidationException");
        } catch (ValidationException ex) {
            Assert.assertTrue(ex.getMessage().contains("Password must be at least 8 characters"));
        }
    }

    @Test(priority = 74, groups = "security")
    public void t74_registerUser_defaultRoleReviewer() {
        UserAccount ua = new UserAccount(null, "DefaultRole", "def@example.com",
                "password123", null, "Dept", null);
        when(userAccountRepository.existsByEmail("def@example.com")).thenReturn(false);
        when(userAccountRepository.save(any(UserAccount.class))).thenAnswer(inv -> {
            UserAccount u = inv.getArgument(0);
            u.setId(30L);
            return u;
        });

        UserAccount created = userAccountService.register(ua);
        Assert.assertEquals(created.getRole(), "REVIEWER");
    }

    // endregion

    // region 8. Advanced querying / HQL-like (10 tests) priority 80-89

    @Test(priority = 80, groups = "hql")
    public void t80_getEventsByBranch_service() {
        AcademicEvent e1 = new AcademicEvent(1L, 1L, "Event1", "EXAM",
                LocalDate.now(), LocalDate.now(), null, null, LocalDateTime.now());
        AcademicEvent e2 = new AcademicEvent(2L, 1L, "Event2", "HOLIDAY",
                LocalDate.now().plusDays(1), LocalDate.now().plusDays(1),
                null, null, LocalDateTime.now());
        when(academicEventRepository.findByBranchId(1L)).thenReturn(List.of(e1, e2));

        List<AcademicEvent> list = academicEventService.getEventsByBranch(1L);
        Assert.assertEquals(list.size(), 2);
    }

    @Test(priority = 81, groups = "hql")
    public void t81_mergeEvents_buildsMergedRecord() {
        AcademicEvent e1 = new AcademicEvent(1L, 1L, "Exam1", "EXAM",
                LocalDate.of(2024, 1, 1), LocalDate.of(2024, 1, 1),
                null, null, LocalDateTime.now());
        AcademicEvent e2 = new AcademicEvent(2L, 1L, "Exam2", "EXAM",
                LocalDate.of(2024, 1, 5), LocalDate.of(2024, 1, 5),
                null, null, LocalDateTime.now());

        when(academicEventRepository.findAllById(List.of(1L, 2L)))
                .thenReturn(List.of(e1, e2));
        when(eventMergeRecordRepository.save(any(EventMergeRecord.class)))
                .thenAnswer(inv -> {
                    EventMergeRecord mr = inv.getArgument(0);
                    mr.setId(50L);
                    return mr;
                });

        EventMergeRecord mr = eventMergeService.mergeEvents(List.of(1L, 2L), "CONFLICT_RESOLUTION");
        Assert.assertEquals(mr.getId(), Long.valueOf(50L));
        Assert.assertTrue(mr.getSourceEventIds().contains("1"));
        Assert.assertTrue(mr.getSourceEventIds().contains("2"));
    }

    @Test(priority = 82, groups = "hql")
    public void t82_mergeEvents_noEventsFound() {
        when(academicEventRepository.findAllById(List.of(99L, 100L)))
                .thenReturn(Collections.emptyList());
        try {
            eventMergeService.mergeEvents(List.of(99L, 100L), "CONFLICT_RESOLUTION");
            Assert.fail("Expected ResourceNotFoundException");
        } catch (ResourceNotFoundException ex) {
            Assert.assertTrue(ex.getMessage().contains("No events found"));
        }
    }

    @Test(priority = 83, groups = "hql")
    public void t83_clashesForEvent_repository() {
        ClashRecord c1 = new ClashRecord(1L, 1L, 2L,
                "DATE_OVERLAP", "HIGH", "", LocalDateTime.now(), false);
        when(clashRecordRepository.findByEventAIdOrEventBId(1L, 1L))
                .thenReturn(List.of(c1));
        List<ClashRecord> list = clashDetectionService.getClashesForEvent(1L);
        Assert.assertEquals(list.size(), 1);
    }

    @Test(priority = 84, groups = "hql")
    public void t84_unresolvedClashes_repository() {
        ClashRecord c1 = new ClashRecord(1L, 1L, 2L,
                "DATE_OVERLAP", "HIGH", "", LocalDateTime.now(), false);
        when(clashRecordRepository.findByResolvedFalse()).thenReturn(List.of(c1));
        List<ClashRecord> list = clashDetectionService.getUnresolvedClashes();
        Assert.assertEquals(list.size(), 1);
        Assert.assertFalse(list.get(0).getResolved());
    }

    @Test(priority = 85, groups = "hql")
    public void t85_generateHarmonizedCalendar_service() {
        when(harmonizedCalendarRepository.save(any(HarmonizedCalendar.class)))
                .thenAnswer(inv -> {
                    HarmonizedCalendar cal = inv.getArgument(0);
                    cal.setId(60L);
                    return cal;
                });
        HarmonizedCalendar cal = harmonizedCalendarService.generateHarmonizedCalendar("Main", "System");
        Assert.assertEquals(cal.getId(), Long.valueOf(60L));
        Assert.assertEquals(cal.getGeneratedBy(), "System");
    }

    @Test(priority = 86, groups = "hql")
    public void t86_getCalendarsWithinRange_repository() {
        HarmonizedCalendar cal = new HarmonizedCalendar(1L, "Cal",
                "System", LocalDateTime.now(),
                LocalDate.of(2024, 1, 1),
                LocalDate.of(2024, 3, 31), "[]");
        when(harmonizedCalendarRepository
                .findByEffectiveFromLessThanEqualAndEffectiveToGreaterThanEqual(
                        LocalDate.of(2024, 1, 15),
                        LocalDate.of(2024, 1, 15)))
                .thenReturn(List.of(cal));

        List<HarmonizedCalendar> list = harmonizedCalendarService
                .getCalendarsWithinRange(LocalDate.of(2024, 1, 15),
                        LocalDate.of(2024, 1, 15));
        Assert.assertEquals(list.size(), 1);
    }

    @Test(priority = 87, groups = "hql")
    public void t87_getMergeRecordsByDate_repository() {
        EventMergeRecord mr = new EventMergeRecord(1L, "1,2",
                "Merged", LocalDate.of(2024, 1, 1),
                LocalDate.of(2024, 1, 10),
                "CONFLICT_RESOLUTION", LocalDateTime.now());
        when(eventMergeRecordRepository.findByMergedStartDateBetween(
                LocalDate.of(2024, 1, 1), LocalDate.of(2024, 1, 31)))
                .thenReturn(List.of(mr));

        List<EventMergeRecord> list = eventMergeService
                .getMergeRecordsByDate(LocalDate.of(2024, 1, 1),
                        LocalDate.of(2024, 1, 31));
        Assert.assertEquals(list.size(), 1);
    }

    @Test(priority = 88, groups = "hql")
    public void t88_getEventsByBranch_noEvents() {
        when(academicEventRepository.findByBranchId(999L))
                .thenReturn(Collections.emptyList());
        List<AcademicEvent> list = academicEventService.getEventsByBranch(999L);
        Assert.assertTrue(list.isEmpty());
    }

    @Test(priority = 89, groups = "hql")
    public void t89_clashResolve_updatesResolvedFlag() {
        ClashRecord cr = new ClashRecord(1L, 1L, 2L,
                "DATE_OVERLAP", "HIGH", "", LocalDateTime.now(), false);
        when(clashRecordRepository.findById(1L)).thenReturn(Optional.of(cr));
        when(clashRecordRepository.save(any(ClashRecord.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        ClashRecord updated = clashDetectionService.resolveClash(1L);
        Assert.assertTrue(updated.getResolved());
    }

    // endregion
}