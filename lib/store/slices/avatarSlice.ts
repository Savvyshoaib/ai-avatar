import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
}

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
    }
});

export const { setAvatarDataState } = avatarSlice.actions;
export default avatarSlice.reducer;