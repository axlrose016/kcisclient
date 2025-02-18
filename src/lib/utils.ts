import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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