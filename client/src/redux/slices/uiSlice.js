import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isModalOpen: false,
        isSidebarOpen: false,
        theme: 'light',
    },
    reducers: {
        openModal: (state) => {
            state.isModalOpen = true;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
        },
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
    },
});

export const { openModal, closeModal, toggleSidebar, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
