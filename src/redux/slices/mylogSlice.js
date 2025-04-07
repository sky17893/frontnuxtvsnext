import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  logs: [],  // 기존 메모 및 열람 기록을 저장하는 배열
  viewedLogs: [], // 새로운 열람 기록 상태 추가
};

// ✅ 메모 및 열람 기록을 관리하는 Redux Slice
const mylogSlice = createSlice({
  name: "mylog",
  initialState,
  reducers: {
    setLogs: (state, action) => {
      state.logs = action.payload;
    },
    removeMemo: (state, action) => {
      state.logs = state.logs.map((memo) =>
        memo.id === action.payload ? { ...memo, is_deleted: true } : memo
      );
    },
    updateMemoInState: (state, action) => {
      const updatedMemo = action.payload;
      const index = state.logs.findIndex((memo) => memo.id === updatedMemo.id);
      if (index !== -1) {
        state.logs[index] = updatedMemo;
      }
    },

    // ✅ 새로운 열람 기록을 Redux Store에 저장하는 리듀서
    setViewedLogs: (state, action) => {
      state.viewedLogs = action.payload;
    },

    // ✅ 특정 열람 기록 삭제
    removeViewedLog: (state, action) => {
      state.viewedLogs = state.viewedLogs.filter(log => log.id !== action.payload);
    },    

    // ✅ 모든 열람 기록 삭제
    clearViewedLogs: (state) => {
      state.viewedLogs = [];
    },
    
  },
});

export const { setLogs, removeMemo, updateMemoInState, setViewedLogs, removeViewedLog, clearViewedLogs } = mylogSlice.actions;
export default mylogSlice.reducer;
