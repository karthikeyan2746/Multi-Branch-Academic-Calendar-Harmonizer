package com.example.demo.controller;
import com.example.demo.dto.JwtResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.UserAccount;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.UserAccountService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication")
public class UserAccountController {
    private final UserAccountService userAccountService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public UserAccountController(UserAccountService userAccountService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userAccountService = userAccountService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            UserAccount user = new UserAccount();
            user.setFullName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword());
            user.setRole(request.getRole() != null ? request.getRole() : "REVIEWER");
            user.setDepartment(request.getDepartment());
            UserAccount savedUser = userAccountService.register(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            UserAccount user = userAccountService.findByEmail(request.getEmail());
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body("Invalid credentials");
            }
            String token = jwtUtil.generateTokenForUser(user);
            return ResponseEntity.ok(new JwtResponse(token, user.getId(), user.getEmail(), user.getRole()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
        }
    }

    @GetMapping("/users")
    public List<UserAccount> getAllUsers() { return userAccountService.getAllUsers(); }

    @GetMapping("/users/{id}")
    public UserAccount getUser(@PathVariable Long id) { return userAccountService.getUser(id); }
}