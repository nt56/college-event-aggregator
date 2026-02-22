import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registrationService } from "@/services/registrationService";

export interface Registration {
  id: string;
  _id?: string;
  eventId:
    | string
    | {
        _id: string;
        title: string;
        date: string;
        venue: string;
        status: string;
        category: string;
        collegeId?: { _id: string; name: string };
      };
  studentId:
    | string
    | { _id: string; firstName: string; lastName: string; email: string };
  /** Populated event data returned by GET /api/registrations (student view) */
  event?: {
    id: string;
    title: string;
    date: string;
    venue: string;
    status: string;
  };
  /** Populated student data returned by GET /api/registrations (organizer view) */
  student?: {
    id: string;
    name: string;
    email: string;
  };
  registeredAt: string;
  createdAt?: string;
}

interface RegistrationsState {
  items: Registration[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RegistrationsState = {
  items: [],
  pagination: null,
  isLoading: false,
  error: null,
};

export const fetchRegistrations = createAsyncThunk(
  "registrations/fetchRegistrations",
  async (params: Record<string, string> = {}, { rejectWithValue }) => {
    try {
      const response = await registrationService.getRegistrations(params);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch registrations",
      );
    }
  },
);

export const registerForEvent = createAsyncThunk(
  "registrations/registerForEvent",
  async (eventId: string, { rejectWithValue }) => {
    try {
      const response = await registrationService.registerForEvent(eventId);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const cancelRegistration = createAsyncThunk(
  "registrations/cancelRegistration",
  async (
    { eventId, studentId }: { eventId: string; studentId?: string },
    { rejectWithValue },
  ) => {
    try {
      await registrationService.cancelRegistration(eventId, studentId);
      return { eventId, studentId };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Cancellation failed",
      );
    }
  },
);

const registrationsSlice = createSlice({
  name: "registrations",
  initialState,
  reducers: {
    clearRegistrationsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegistrations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRegistrations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || action.payload;
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchRegistrations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(registerForEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder.addCase(cancelRegistration.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = state.items.filter((r) => {
        const regEventId =
          typeof r.eventId === "string" ? r.eventId : r.eventId._id;
        return regEventId !== action.payload.eventId;
      });
    });
  },
});

export const { clearRegistrationsError } = registrationsSlice.actions;
export default registrationsSlice.reducer;
