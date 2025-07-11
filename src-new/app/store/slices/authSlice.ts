import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService, AuthUser } from '../../../shared/services/auth/authService';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const initAuth = createAsyncThunk(
  'auth/initAuth',
  async (_, { rejectWithValue }) => {
    try {
      // Check if user is already authenticated
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        if (user) {
          return { user, isAuthenticated: true };
        }
      }
      
      // Check for active session
      if (await authService.hasActiveSession()) {
        const user = await authService.getUserFromSession();
        if (user) {
          return { user, isAuthenticated: true };
        }
      }
      
      return { user: null, isAuthenticated: false };
    } catch (error: any) {
      return rejectWithValue(error.message || 'فشل في تهيئة المصادقة');
    }
  }
);

export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await authService.loginWithEmail(email, password);
      return result.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'فشل تسجيل الدخول');
    }
  }
);

export const loginWithNationalId = createAsyncThunk(
  'auth/loginWithNationalId',
  async ({ nationalId, otp, sessionId }: { nationalId: string; otp: string; sessionId?: number }, { rejectWithValue }) => {
    try {
      const result = await authService.loginWithNationalId(nationalId, otp, sessionId);
      return result.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'فشل التحقق من رمز OTP');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'فشل تسجيل الخروج');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Init Auth
      .addCase(initAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.error = null;
      })
      .addCase(initAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.error = action.payload as string;
      })
      
      // Login with Email
      .addCase(loginWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Login with National ID
      .addCase(loginWithNationalId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithNationalId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginWithNationalId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;

