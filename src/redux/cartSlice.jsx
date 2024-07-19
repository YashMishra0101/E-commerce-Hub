import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem('cart')) ?? [];

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            state.push(action.payload)
        },
        deleteFromCart(state, action) {
            return state.filter(item => item.id != action.payload.id);
        },
        increaseQuantity(state, action) {
            const { id } = action.payload;
            const item = state.find(item => item.id === id);
            if (item && item.quantity < item.stocks) {
                item.quantity += 1;
            }
        },
        decreaseQuantity(state, action) {
            const { id } = action.payload;
            const item = state.find(item => item.id === id);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        }
    }
})

export const { addToCart, deleteFromCart, increaseQuantity, decreaseQuantity } = cartSlice.actions;

export default cartSlice.reducer;