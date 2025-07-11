import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { supabase } from '../../../config/supabase';

// Auth Constants
const AUTH_ENDPOINTS = {
  LOGIN: '/functions/v1/admin-login',
  REFRESH: '/functions/v1/refresh-token',
  LOGOUT: '/functions/v1/logout',
  VERIFY_OTP: '/functions/v1/verify-existing-user-otp',
  SEND_OTP: '/functions/v1/send-existing-user-otp',
} as const;

// Token Management Configuration
const TOKEN_CONFIG = {
  ACCESS_TOKEN: 'gov_access_token',
  REFRESH_TOKEN: 'gov_refresh_token',
  ACCESS_EXPIRY: 'gov_token_expiry',
  COOKIE_OPTIONS: {
    secure: true,
    sameSite: 'strict' as const,
    httpOnly: false,
    path: '/',
    expires: 7 // 7 days
  }
} as const;

// Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface UserCredentials {
  email?: string;
  password?: string;
  nationalId?: string;
  otp?: string;
  sessionId?: number;
}

export interface AuthUser {
  id: string;
  full_name: string;
  email?: string;
  national_id?: string;
  phone: string;
  role: 'admin' | 'branch_manager' | 'employee' | 'beneficiary';
  branch_id?: string;
  is_active: boolean;
  member?: any;
  branch?: any;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface OTPResponse {
  sessionId: number;
  expiresIn: number;
}

/**
 * خدمة إدارة الرموز المميزة (Tokens)
 */
export class TokenManager {
  static setTokens(tokens: AuthTokens): void {
    Cookies.set(TOKEN_CONFIG.ACCESS_TOKEN, tokens.accessToken, TOKEN_CONFIG.COOKIE_OPTIONS);
    Cookies.set(TOKEN_CONFIG.REFRESH_TOKEN, tokens.refreshToken, TOKEN_CONFIG.COOKIE_OPTIONS);
    Cookies.set(TOKEN_CONFIG.ACCESS_EXPIRY, tokens.expiresAt.toString(), TOKEN_CONFIG.COOKIE_OPTIONS);
  }

  static getTokens(): AuthTokens | null {
    const accessToken = Cookies.get(TOKEN_CONFIG.ACCESS_TOKEN);
    const refreshToken = Cookies.get(TOKEN_CONFIG.REFRESH_TOKEN);
    const expiresAt = Cookies.get(TOKEN_CONFIG.ACCESS_EXPIRY);

    if (!accessToken || !refreshToken || !expiresAt) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      expiresAt: parseInt(expiresAt, 10)
    };
  }

  static clearTokens(): void {
    Cookies.remove(TOKEN_CONFIG.ACCESS_TOKEN);
    Cookies.remove(TOKEN_CONFIG.REFRESH_TOKEN);
    Cookies.remove(TOKEN_CONFIG.ACCESS_EXPIRY);
  }

  static isTokenExpired(): boolean {
    const tokens = this.getTokens();
    if (!tokens) return true;
    
    // Add 10 second buffer for network latency
    return Date.now() >= (tokens.expiresAt - 10000);
  }

  static decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }
}

/**
 * خدمة المصادقة الموحدة
 * تحل محل جميع خدمات المصادقة المكررة في المشروع
 */
class AuthService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    this.apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    
    if (!this.baseUrl || !this.apiKey) {
      console.error('Authentication service initialization failed: Missing environment variables');
    }
  }

  private getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  private async makeAuthRequest<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await axios.post(
        `${this.baseUrl}${endpoint}`,
        data,
        { headers: this.getAuthHeaders() }
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'فشل في العملية');
      }

      return response.data;
    } catch (error: any) {
      console.error(`Auth request error for ${endpoint}:`, error);
      throw new Error(error.response?.data?.error || error.message || 'فشل في العملية');
    }
  }

  /**
   * تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور (للمديرين)
   */
  async loginWithEmail(email: string, password: string): Promise<LoginResponse> {
    const response = await this.makeAuthRequest<any>(AUTH_ENDPOINTS.LOGIN, { email, password });
    
    const { user, session } = response;
    if (!user || !session) {
      throw new Error('بيانات المستخدم أو الجلسة غير متوفرة');
    }

    const tokens: AuthTokens = {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at * 1000
    };

    TokenManager.setTokens(tokens);
    return { user, tokens };
  }

  /**
   * تسجيل الدخول باستخدام الهوية الوطنية ورمز OTP
   */
  async loginWithNationalId(nationalId: string, otp: string, sessionId?: number): Promise<LoginResponse> {
    const response = await this.makeAuthRequest<any>(AUTH_ENDPOINTS.VERIFY_OTP, { 
      nationalId, 
      otpCode: otp, 
      sessionId 
    });

    const { user, session } = response;
    if (!user || !session) {
      throw new Error('بيانات المستخدم أو الجلسة غير متوفرة');
    }

    const tokens: AuthTokens = {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at * 1000
    };

    TokenManager.setTokens(tokens);
    return { user, tokens };
  }

  /**
   * إرسال رمز OTP للمستخدم الموجود
   */
  async sendOTP(nationalId: string): Promise<OTPResponse> {
    const response = await this.makeAuthRequest<any>(AUTH_ENDPOINTS.SEND_OTP, { nationalId });
    
    return {
      sessionId: response.sessionId,
      expiresIn: response.expiresIn
    };
  }

  /**
   * تحديث الرمز المميز
   */
  async refreshToken(): Promise<AuthTokens> {
    const tokens = TokenManager.getTokens();
    
    if (!tokens) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.makeAuthRequest<any>(AUTH_ENDPOINTS.REFRESH, { 
        refreshToken: tokens.refreshToken 
      });

      const { session } = response;
      if (!session) {
        throw new Error('بيانات الجلسة غير متوفرة');
      }

      const newTokens: AuthTokens = {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        expiresAt: session.expires_at * 1000
      };

      TokenManager.setTokens(newTokens);
      return newTokens;
    } catch (error) {
      TokenManager.clearTokens();
      throw error;
    }
  }

  /**
   * تسجيل الخروج
   */
  async logout(): Promise<void> {
    try {
      const tokens = TokenManager.getTokens();
      
      if (tokens) {
        await this.makeAuthRequest(AUTH_ENDPOINTS.LOGOUT, { 
          refreshToken: tokens.refreshToken 
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenManager.clearTokens();
      localStorage.removeItem('user');
    }
  }

  /**
   * التحقق من حالة المصادقة
   */
  isAuthenticated(): boolean {
    const tokens = TokenManager.getTokens();
    return !!tokens && !TokenManager.isTokenExpired();
  }

  /**
   * التحقق من وجود جلسة نشطة في Supabase
   */
  async hasActiveSession(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session && session.expires_at * 1000 > Date.now();
    } catch (error) {
      console.error('Error checking active session:', error);
      return false;
    }
  }

  /**
   * الحصول على بيانات المستخدم من الجلسة النشطة
   */
  async getUserFromSession(): Promise<AuthUser | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;
      
      const { data: userData, error } = await supabase
        .from('users')
        .select(`
          *, 
          branch:branch_id(id, name, city),
          member:members!user_id(*)
        `)
        .eq('id', session.user.id)
        .single();
      
      if (error || !userData) return null;
      
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Error getting user from session:', error);
      return null;
    }
  }

  /**
   * الحصول على المستخدم المحفوظ محلياً
   */
  getCurrentUser(): AuthUser | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
}

// Export as singleton
export const authService = new AuthService();
export default authService;

