import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getAvatarDetails, AvatarDetailsRecord } from "@/lib/api/avatarApi";

interface FileMetadata {
    name: string;
    type: string;
    size: number;
    lastModified: number;
}

interface AvatarState {
    fullName: string;
    headline: string;
    location: string;
    bio: string;
    cv?: FileMetadata | null;
    linkedinConnected: boolean;
    portfolioLink: string;
    handle: string;
    expertise: string[];
    personalityType: string;
    customTone: string;
    voiceNote?: FileMetadata | null;
    handleVerified: boolean;
    oliv_id: string | null;
    detailsLoading: boolean;
    detailsFetched: boolean;
    lastFetchedHandle?: string | null;
}

const initialState: AvatarState = {
    fullName: "",
    headline: "",
    location: "",
    bio: "",
    cv: null,
    linkedinConnected: false,
    portfolioLink: "",
    handle: "",
    expertise: [],
    personalityType: "professional",
    customTone: "",
    voiceNote: null,
    handleVerified: false,
    oliv_id: null,
    detailsLoading: false,
    detailsFetched: false,
    lastFetchedHandle: null,
}

export const fetchAvatarDetails = createAsyncThunk(
    "avatar/fetchDetails",
    async (userName: string, { rejectWithValue }) => {
        try {
            const response = await getAvatarDetails(userName);
            const record = response.data?.data?.[0] as AvatarDetailsRecord | undefined;
            return { record, userName };
        } catch (error: any) {
            return rejectWithValue(error?.response?.data ?? { message: "Unable to fetch avatar details" });
        }
    }
);

const avatarSlice = createSlice({
    name: "avatar",
    initialState,
    reducers: {

        setAvatarDataState: (state, action: PayloadAction<Partial<AvatarState> & { cv?: File | FileMetadata | null; voiceNote?: File | FileMetadata | null }>) => {
            const payload = { ...action.payload };

            if (payload.cv instanceof File) {
                payload.cv = {
                    name: payload.cv.name,
                    type: payload.cv.type,
                    size: payload.cv.size,
                    lastModified: payload.cv.lastModified,
                };
            }
            if (payload.voiceNote instanceof File) {
                payload.voiceNote = {
                    name: payload.voiceNote.name,
                    type: payload.voiceNote.type,
                    size: payload.voiceNote.size,
                    lastModified: payload.voiceNote.lastModified,
                };
            }

            return { ...state, ...payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAvatarDetails.pending, (state) => {
                state.detailsLoading = true;
            })
            .addCase(fetchAvatarDetails.fulfilled, (state, action) => {
                state.detailsLoading = false;
                state.detailsFetched = true;
                state.lastFetchedHandle = action.payload?.userName ?? null;

                const details = action.payload?.record;
                if (!details) {
                    return;
                }

                state.fullName = details.name ?? state.fullName;
                state.handle = details.agent_id ?? state.handle;
                state.headline = details.headline ?? state.headline;
                state.location = details.location ?? state.location;
                state.bio = details.bio ?? state.bio;
                state.expertise = Array.isArray(details.skills) ? details.skills : state.expertise;

                const personality = details.personality;
                if (personality) {
                    const normalized = personality.toLowerCase();
                    const allowed = ["professional", "friendly", "humorous", "custom"];
                    if (allowed.includes(normalized)) {
                        state.personalityType = normalized;
                        if (normalized !== "custom") {
                            state.customTone = "";
                        }
                    } else {
                        state.personalityType = "custom";
                        state.customTone = personality;
                    }
                }
            })
            .addCase(fetchAvatarDetails.rejected, (state) => {
                state.detailsLoading = false;
                state.detailsFetched = false;
            });
    }
});

export const { setAvatarDataState } = avatarSlice.actions;
export default avatarSlice.reducer;