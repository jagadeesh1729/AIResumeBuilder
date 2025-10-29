import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    resume: {
        personal_info: {},
        experience: [],
        education: [],
        skills: [],
        certification: [],
    },
    padding: '52px 64px',
    margin: '0.5in',
};

const resumeSlice = createSlice({
    name: 'resume',
    initialState,
    reducers: {
        setResume: (state, action) => {
            state.resume = action.payload;
        },
        setPadding: (state, action) => {
            state.padding = action.payload;
        },
        setMargin: (state, action) => {
            state.margin = action.payload;
        },
    },
});

export const { setResume, setPadding, setMargin } = resumeSlice.actions;
export default resumeSlice.reducer;
