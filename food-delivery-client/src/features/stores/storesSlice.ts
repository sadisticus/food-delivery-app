import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { StateStatus } from "../../interfaces/state";
import { CreateStoreRequestDto, Store } from "../../interfaces/store";
import { RootState } from "../../app/store";
import storesService from "./storesService";

interface StoresState {
  stores: Store[];
  status: StateStatus;
  message: string;
}

const initialState: StoresState = {
  stores: [],
  status: StateStatus.None,
  message: "",
};

export const getStores = createAsyncThunk(
  "stores/get-stores",
  async (partnerId: number | null, thunkAPI) => {
    try {
      return await storesService.getStores(partnerId ?? null);
    } catch (error: unknown) {
      let message: string = "";
      if (error instanceof Error) {
        message = error.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createStore = createAsyncThunk(
  "stores/create",
  async (storeData: CreateStoreRequestDto, thunkAPI) => {
    try {
      const { token } = (thunkAPI.getState() as RootState).auth;
      return await storesService.createStore(storeData, token);
    } catch (error: unknown) {
      let message: string = "";
      if (error instanceof Error) {
        message = error.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const storesSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    reset: (state) => {
      state.status = StateStatus.None;
      state.message = "";
    },
    clearStores: (state) => {
      state.stores = [];
      state.status = StateStatus.None;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStores.pending, (state) => {
        state.status = StateStatus.Loading;
      })
      .addCase(getStores.rejected, (state, action) => {
        state.status = StateStatus.Error;
        state.message = action.payload as string;
      })
      .addCase(getStores.fulfilled, (state, action) => {
        state.status = StateStatus.Success;
        state.stores = action.payload;
      })
      .addCase(createStore.pending, (state) => {
        state.status = StateStatus.Loading;
      })
      .addCase(createStore.rejected, (state, action) => {
        state.status = StateStatus.Error;
        state.message = action.payload as string;
      })
      .addCase(createStore.fulfilled, (state, action) => {
        state.status = StateStatus.Success;
        state.stores.push(action.payload);
      });
  },
});

export const storesSelector = (state: RootState) => state.stores;
export const { reset, clearStores } = storesSlice.actions;
export default storesSlice.reducer;
