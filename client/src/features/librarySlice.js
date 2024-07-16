import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  library: [],
  loading: false,
  error: "",
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    fetchPending(state) {
      state.loading = true;
      state.library = [];
      state.error = "";
    },
    fetchSuccess(state, action) {
      state.loading = false;
      state.library = action.payload;
      state.error = "";
    },
    fetchReject(state, action) {
      state.loading = false;
      state.library = [];
      state.error = action.payload;
    },
  },
});

export const libraryReducer = librarySlice.reducer
export const { fetchPending, fetchSuccess, fetchReject } = librarySlice.actions;

export const fetchLibrary = (id) => {
    return async (dispatch) => {
        try {
            dispatch(fetchPending())
            const { data } = await axios.get(`http://localhost:3000/library/${id}`)

            dispatch(fetchSuccess(data.library))
        } catch (error) {
            dispatch(fetchReject(error.message))
        }
    }
}