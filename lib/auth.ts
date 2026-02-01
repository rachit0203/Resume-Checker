/**
 * Custom Authentication Library
 * Handles user registration, login, and session management
 */

import { supabase } from "./supabase";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production"
);

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Session {
  user: User;
  token: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create a JWT token for a user
 */
export async function createToken(user: User): Promise<string> {
  const token = await new SignJWT({ userId: user.id, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.userId as string,
      email: payload.email as string,
      created_at: "",
    };
  } catch (error) {
    return null;
  }
}

/**
 * Register a new user
 */
export async function registerUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Invalid email format" };
    }

    // Validate password
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert user
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, password_hash: passwordHash }])
      .select("id, email, created_at")
      .single();

    if (error) throw error;

    return { success: true, user: data };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Registration failed" };
  }
}

/**
 * Login a user
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; session?: Session }> {
  try {
    // Get user from database
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, password_hash, created_at")
      .eq("email", email)
      .single();

    if (error || !user) {
      return { success: false, error: "Invalid email or password" };
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return { success: false, error: "Invalid email or password" };
    }

    // Create session token
    const token = await createToken({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    });

    return {
      success: true,
      session: {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        token,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login failed" };
  }
}

/**
 * Get user from token
 */
export async function getUserFromToken(token: string): Promise<User | null> {
  return verifyToken(token);
}
