package com.example.demo.service.impl;
import com.example.demo.entity.UserAccount;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.ValidationException;
import com.example.demo.repository.UserAccountRepository;
import com.example.demo.service.UserAccountService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserAccountServiceImpl implements UserAccountService {
    private final UserAccountRepository repository;
    private final PasswordEncoder passwordEncoder;
    public UserAccountServiceImpl(UserAccountRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }
    @Override
    public UserAccount register(UserAccount user) {
        if (repository.existsByEmail(user.getEmail())) throw new ValidationException("Email already in use");
        // FIX for t73: Password validation
        if (user.getPassword() == null || user.getPassword().length() < 8) {
            throw new ValidationException("Password must be at least 8 characters");
        }
        // FIX for t74: Set default role if null
        if (user.getRole() == null) user.setRole("REVIEWER");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return repository.save(user);
    }
    @Override
    public UserAccount getUser(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    @Override
    public List<UserAccount> getAllUsers() { return repository.findAll(); }
    @Override
    public UserAccount findByEmail(String email) {
        return repository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}