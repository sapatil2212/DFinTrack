import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  expenses: [], // Array of expense objects
  loading: false, // Loading state for async actions
  error: null, // Error message for any failed operations
};

// Expense slice
const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    /**
     * Sets the list of expenses.
     * @param {Object} state - The current state.
     * @param {Object} action - Action payload containing the expenses array.
     */
    setExpenses: (state, action) => {
      state.expenses = action.payload;
      state.error = null;
    },

    /**
     * Adds a new expense to the state.
     * @param {Object} state - The current state.
     * @param {Object} action - Action payload containing the new expense.
     */
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
      state.error = null;
    },

    /**
     * Updates an existing expense in the state.
     * @param {Object} state - The current state.
     * @param {Object} action - Action payload containing the updated expense.
     */
    updateExpense: (state, action) => {
      const index = state.expenses.findIndex(
        (expense) => expense.id === action.payload.id
      );
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
      state.error = null;
    },

    /**
     * Deletes an expense from the state by ID.
     * @param {Object} state - The current state.
     * @param {Object} action - Action payload containing the ID of the expense to delete.
     */
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter(
        (expense) => expense.id !== action.payload
      );
      state.error = null;
    },

    /**
     * Sets the loading state for async operations.
     * @param {Object} state - The current state.
     * @param {Object} action - Action payload containing the loading state (true/false).
     */
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    /**
     * Sets an error message in the state.
     * @param {Object} state - The current state.
     * @param {Object} action - Action payload containing the error message.
     */
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Export actions for synchronous dispatch
export const {
  setExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  setLoading,
  setError,
} = expensesSlice.actions;

// Export the reducer
export default expensesSlice.reducer;
