import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from 'dompurify';

const encode = new TextEncoder();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function hashPassword(password: string, salt: Uint8Array): Promise<string> {
  // Encode the password as bytes
  const passwordBytes = new TextEncoder().encode(password);

  // Combine password and salt
  const combined = new Uint8Array(passwordBytes.length + salt.length);
  combined.set(passwordBytes);
  combined.set(salt, passwordBytes.length);

  // Hash using SHA-256
  const hashBuffer = await crypto.subtle.digest("SHA-256", combined);

  // Convert the ArrayBuffer to a base64 string
  const hashArray = new Uint8Array(hashBuffer);
  const hashString = String.fromCharCode(...hashArray);
  const base64Hash = btoa(hashString);

  return base64Hash;
}

export function sanitizeHTML(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: []
  });
}

export const insertItemAtIndex = <T>(
  arr: T[],
  index: number,
  newItem: T
): T[] => {
  return [...arr.slice(0, index), newItem, ...arr.slice(index)];
};

export const replaceItemAtIndex = <T>(
  arr: T[],
  index: number,
  newValue: T
): T[] => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
};

export const removeItemAtIndex = <T>(arr: T[], index: number): T[] => {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
};

export const moveArrayAtIndex = <T>(
  arr: T[] = [],
  index: number,
  toIndex: number
): T[] => {
  let array = [...arr];
  const element = array[index];
  array.splice(index, 1);
  array.splice(toIndex, 0, element);
  return array;
};