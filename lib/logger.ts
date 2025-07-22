/**
 * Simple logger utility for monitoring and debugging
 * 
 * This module provides a consistent logging interface that can be extended
 * to integrate with external monitoring services in the future.
 */

// Log levels for different types of messages
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export const LOG_LEVEL = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const;

// Log entry structure for consistent formatting
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

/**
 * Determines if logging should be enabled based on environment
 * Only log in development or when explicitly enabled
 */
function isLoggingEnabled(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.ENABLE_LOGGING === 'true';
}

/**
 * Creates a formatted log entry with consistent structure
 */
function createLogEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
  error?: Error
): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
    error,
  };
}

/**
 * Formats a log entry for console output
 */
function formatLogEntry(entry: LogEntry): string {
  const { level, message, timestamp, context, error } = entry;
  
  let formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  if (context && Object.keys(context).length > 0) {
    formattedMessage += `\nContext: ${JSON.stringify(context, null, 2)}`;
  }
  
  if (error) {
    formattedMessage += `\nError: ${error.message}`;
    if (error.stack) {
      formattedMessage += `\nStack: ${error.stack}`;
    }
  }
  
  return formattedMessage;
}

/**
 * Logs an error message
 */
export function logError(message: string, context?: Record<string, unknown>, error?: Error): void {
  if (!isLoggingEnabled()) { return; }
  
  const entry = createLogEntry(LOG_LEVEL.ERROR, message, context, error);
  
  // In a production environment, this could be replaced with a call to an external logging service
  // biome-ignore lint/suspicious/noConsole: it's ok
  console.error(formatLogEntry(entry));
}

/**
 * Logs a warning message
 */
export function logWarn(message: string, context?: Record<string, unknown>): void {
  if (!isLoggingEnabled()) { return; }
  
  const entry = createLogEntry(LOG_LEVEL.WARN, message, context);
  
  // biome-ignore lint/suspicious/noConsole: it's ok
    console.warn(formatLogEntry(entry));
}

/**
 * Logs an informational message
 */
export function logInfo(message: string, context?: Record<string, unknown>): void {
  if (!isLoggingEnabled()) { return; }
  
  const entry = createLogEntry(LOG_LEVEL.INFO, message, context);
  
  // biome-ignore lint/suspicious/noConsole: it's ok
  console.info(formatLogEntry(entry));
}

/**
 * Logs a debug message (only in development)
 */
export function logDebug(message: string, context?: Record<string, unknown>): void {
  if (!isLoggingEnabled() || process.env.NODE_ENV === 'production') { return; }
  
  const entry = createLogEntry(LOG_LEVEL.DEBUG, message, context);
  
  // biome-ignore lint/suspicious/noConsole: it's ok
  console.debug(formatLogEntry(entry));
}

/**
 * Performance monitoring utility to measure execution time
 */
export class PerformanceMonitor {
  private startTime: number;
  private name: string;
  
  constructor(name: string) {
    this.name = name;
    this.startTime = Date.now();
  }
  
  /**
   * Ends the performance measurement and logs the result
   */
  end(context?: Record<string, unknown>): number {
    const endTime = Date.now();
    const duration = endTime - this.startTime;
    
    logInfo(`Performance: ${this.name} completed in ${duration}ms`, {
      ...context,
      duration,
      operation: this.name,
    });
    
    return duration;
  }
}

/**
 * Creates a new performance monitor instance
 */
export function startPerformanceMonitoring(name: string): PerformanceMonitor {
  return new PerformanceMonitor(name);
}