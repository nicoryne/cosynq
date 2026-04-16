// =====================================================================
// Security Logger Utility
// =====================================================================
// Centralized logging for authentication and security events
// Ensures sensitive data (passwords, tokens) is never logged

/**
 * Security event types for categorization and filtering
 */
export enum SecurityEventType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  EMAIL_VERIFICATION_SENT = 'EMAIL_VERIFICATION_SENT',
  EMAIL_VERIFICATION_SUCCESS = 'EMAIL_VERIFICATION_SUCCESS',
  EMAIL_VERIFICATION_FAILED = 'EMAIL_VERIFICATION_FAILED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  AUTHORIZATION_FAILED = 'AUTHORIZATION_FAILED',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

/**
 * Security event severity levels
 */
export enum SecurityEventSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

/**
 * Security event log entry structure
 */
export interface SecurityLogEntry {
  timestamp: string; // ISO format
  eventType: SecurityEventType;
  severity: SecurityEventSeverity;
  userId?: string;
  email?: string;
  username?: string;
  ipAddress?: string;
  userAgent?: string;
  message: string;
  metadata?: Record<string, unknown>;
}

/**
 * SecurityLogger - Centralized security event logging
 * Requirements: 3.9, 10.6, 12.8, 20.29
 */
export class SecurityLogger {
  /**
   * Sanitizes data to ensure no sensitive information is logged
   * @param data - Data to sanitize
   * @returns Sanitized data safe for logging
   */
  private static sanitize(data: Record<string, unknown>): Record<string, unknown> {
    const sanitized = { ...data };
    
    // Remove sensitive fields
    const sensitiveFields = [
      'password',
      'confirmPassword',
      'token',
      'accessToken',
      'refreshToken',
      'jwt',
      'secret',
      'apiKey',
      'privateKey',
    ];

    sensitiveFields.forEach((field) => {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  /**
   * Creates a structured log entry
   * @param eventType - Type of security event
   * @param severity - Severity level
   * @param message - Human-readable message
   * @param metadata - Additional context (will be sanitized)
   * @returns Structured log entry
   */
  private static createLogEntry(
    eventType: SecurityEventType,
    severity: SecurityEventSeverity,
    message: string,
    metadata?: Record<string, unknown>
  ): SecurityLogEntry {
    return {
      timestamp: new Date().toISOString(),
      eventType,
      severity,
      message,
      metadata: metadata ? this.sanitize(metadata) : undefined,
    };
  }

  /**
   * Logs the entry to the appropriate destination
   * Requirements: NODE_ENV check for production suppression
   * @param entry - Log entry to write
   */
  private static writeLog(entry: SecurityLogEntry): void {
    // Disable logs entirely on 'prod' as requested
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    // Format the log message
    const logMessage = `[${entry.severity}] ${entry.eventType} - ${entry.message}`;
    const logData = {
      ...entry,
      environment: process.env.NODE_ENV,
    };

    // Write to appropriate log level
    switch (entry.severity) {
      case SecurityEventSeverity.INFO:
        console.info(logMessage, logData);
        break;
      case SecurityEventSeverity.WARNING:
        console.warn(logMessage, logData);
        break;
      case SecurityEventSeverity.ERROR:
        console.error(logMessage, logData);
        break;
      case SecurityEventSeverity.CRITICAL:
        console.error(`🚨 ${logMessage}`, logData);
        break;
    }
  }

  /**
   * Logs a successful sign-up event
   * Requirements: 3.9, 12.8
   */
  static logSignUp(userId: string, email: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry(
      SecurityEventType.SIGN_UP,
      SecurityEventSeverity.INFO,
      `User signed up successfully: ${email}`,
      {
        userId,
        email,
        ...metadata,
      }
    );
    this.writeLog(entry);
  }

  /**
   * Logs a successful sign-in event
   * Requirements: 3.9, 12.8
   */
  static logSignIn(userId: string, email: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry(
      SecurityEventType.SIGN_IN,
      SecurityEventSeverity.INFO,
      `User signed in successfully: ${email}`,
      {
        userId,
        email,
        ...metadata,
      }
    );
    this.writeLog(entry);
  }

  /**
   * Logs a sign-out event
   * Requirements: 3.9, 12.8
   */
  static logSignOut(userId: string, email: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry(
      SecurityEventType.SIGN_OUT,
      SecurityEventSeverity.INFO,
      `User signed out: ${email}`,
      {
        userId,
        email,
        ...metadata,
      }
    );
    this.writeLog(entry);
  }

  /**
   * Logs an email verification sent event
   * Requirements: 20.29
   */
  static logEmailVerificationSent(email: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry(
      SecurityEventType.EMAIL_VERIFICATION_SENT,
      SecurityEventSeverity.INFO,
      `Verification email sent to: ${email}`,
      {
        email,
        ...metadata,
      }
    );
    this.writeLog(entry);
  }

  /**
   * Logs a successful email verification event
   * Requirements: 20.29
   */
  static logEmailVerificationSuccess(userId: string, email: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry(
      SecurityEventType.EMAIL_VERIFICATION_SUCCESS,
      SecurityEventSeverity.INFO,
      `Email verified successfully: ${email}`,
      {
        userId,
        email,
        ...metadata,
      }
    );
    this.writeLog(entry);
  }

  /**
   * Logs a failed email verification event
   * Requirements: 20.29
   */
  static logEmailVerificationFailed(email: string, reason: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry(
      SecurityEventType.EMAIL_VERIFICATION_FAILED,
      SecurityEventSeverity.WARNING,
      `Email verification failed for ${email}: ${reason}`,
      {
        email,
        reason,
        ...metadata,
      }
    );
    this.writeLog(entry);
  }

  /**
   * Logs a rate limit exceeded event
   * Requirements: 18.10
   */
  static logRateLimitExceeded(
    endpoint: string,
    identifier: string,
    metadata?: Record<string, unknown>
  ): void {
    const entry = this.createLogEntry(
      SecurityEventType.RATE_LIMIT_EXCEEDED,
      SecurityEventSeverity.WARNING,
      `Rate limit exceeded for ${endpoint} by ${identifier}`,
      {
        endpoint,
        identifier,
        ...metadata,
      }
    );
    this.writeLog(entry);
  }

  /**
   * Logs suspicious activity patterns
   * Requirements: 3.9
   */
  static logSuspiciousActivity(
    description: string,
    severity: SecurityEventSeverity,
    metadata?: Record<string, unknown>
  ): void {
    const entry = this.createLogEntry(
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      severity,
      `Suspicious activity detected: ${description}`,
      metadata
    );
    this.writeLog(entry);
  }

  /**
   * Logs a failed authentication attempt
   * Requirements: 3.9, 10.6
   */
  static logAuthenticationFailed(
    emailOrUsername: string,
    reason: string,
    metadata?: Record<string, unknown>
  ): void {
    const entry = this.createLogEntry(
      SecurityEventType.AUTHENTICATION_FAILED,
      SecurityEventSeverity.WARNING,
      `Authentication failed for ${emailOrUsername}: ${reason}`,
      {
        emailOrUsername,
        reason,
        ...metadata,
      }
    );
    this.writeLog(entry);
  }

  /**
   * Logs a failed authorization attempt
   * Requirements: 3.9
   */
  static logAuthorizationFailed(
    userId: string,
    resource: string,
    action: string,
    metadata?: Record<string, unknown>
  ): void {
    const entry = this.createLogEntry(
      SecurityEventType.AUTHORIZATION_FAILED,
      SecurityEventSeverity.WARNING,
      `Authorization failed: User ${userId} attempted ${action} on ${resource}`,
      {
        userId,
        resource,
        action,
        ...metadata,
      }
    );
    this.writeLog(entry);
  }

  /**
   * Logs a successful password reset event
   * Requirements: 3.9, 12.8
   */
  static logPasswordReset(userId: string, email: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry(
      SecurityEventType.PASSWORD_RESET,
      SecurityEventSeverity.INFO,
      `User reset password successfully: ${email}`,
      {
        userId,
        email,
        ...metadata,
      }
    );
    this.writeLog(entry);
  }

  /**
   * Logs a password reset request event
   * Note: This is logged regardless of whether the email exists for security
   */
  static logPasswordResetRequested(email: string, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry(
      SecurityEventType.PASSWORD_RESET,
      SecurityEventSeverity.INFO,
      `Password reset requested for: ${email}`,
      {
        email,
        ...metadata,
      }
    );
    this.writeLog(entry);
  }
}
