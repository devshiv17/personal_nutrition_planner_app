import { clsx, type ClassValue } from 'clsx';

/**
 * Utility function for conditionally joining classNames
 * Combines clsx functionality with automatic filtering of falsy values
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export default cn;