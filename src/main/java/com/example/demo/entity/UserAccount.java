package com.example.demo.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_accounts")
public class UserAccount {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullName;
    @Column(unique = true)
    private String email;
    private String password;
    private String role;
    private String department;
    private LocalDateTime createdAt;

    public UserAccount() {}
    public UserAccount(Long id, String fullName, String email, String password, String role, String department, LocalDateTime createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.department = department;
        this.createdAt = createdAt;
    }
    @PrePersist public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.role == null) this.role = "REVIEWER";
    }
    // Getters/Setters omitted for brevity, BUT YOU MUST INCLUDE THEM (All fields)
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; } public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; } public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; } public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; } public void setRole(String role) { this.role = role; }
    public String getDepartment() { return department; } public void setDepartment(String department) { this.department = department; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}