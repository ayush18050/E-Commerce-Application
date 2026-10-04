import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  productList: [],
  isLoading: false
};

export const addNewProduct = createAsyncThunk('/products/addnewproduct',
    async (formData)=>{
       const result = await axios.post('http://localhost:5000/api/admin/products/add', formData,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
       );
       return result?.data;
    }
)

export const fetchAllProducts = createAsyncThunk('/products/fetchallproducts',
    async ()=>{
       const result = await axios.get('http://localhost:5000/api/admin/products/get');
       return result?.data;
    }
)

export const editProduct = createAsyncThunk('/products/editproduct',
    async ({id, formData})=>{
       const result = await axios.put(`http://localhost:5000/api/admin/products/edit/${id}`, formData,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
       );
       return result?.data;
    }
)

export const deleteProduct = createAsyncThunk('/products/deleteproduct',
    async (id)=>{
       const result = await axios.delete(`http://localhost:5000/api/admin/products/delete/${id}`);
       return result?.data;
    }
)


const AdminProductsSlice = createSlice({
  name: 'adminProducts',
  initialState,
//   reducers: {
//     setProducts: (state, action) => {
//       state.productList = action.payload;
//     },
//     setLoading: (state, action) => {
//       state.isLoading = action.payload;
//     },
//     setError: (state, action) => {
//       state.error = action.payload;
//     }
//   },
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
    });
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
    });
    builder.addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
    });

  }
});

export default AdminProductsSlice.reducer;