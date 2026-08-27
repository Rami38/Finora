package com.finora.backend.security;

import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    private SecurityUtils() {}

    // JwtAuthFilter sets the authenticated principal's "username" to the user's email
    // (see CustomUserDetailsService). This reads it back out in any controller.
    public static String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
