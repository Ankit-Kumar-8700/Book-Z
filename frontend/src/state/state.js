import {createSlice} from "@reduxjs/toolkit";

const initialState={
    serverLink:"http://localhost:8000",
    mode:"light",
    user:{
      links:[]
    },
    books:[],
    currGenre:"All",
    currPage:1,
    token:null,
    totalPages:1,
    query:""
};

export const authSlice = createSlice({
    name: "book-o-philia",
    initialState,
    reducers: {
      setMode: (state) => {
        state.mode = state.mode==="light" ? "dark" : "light";
      },
      setUser:(state,action) => {
        state.user=action.payload.user;
      },
      setLogin: (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      },
      setLogout: (state) => {
        state.user = null;
        state.token = null;
      },
      setBooks: (state,action) => {
        state.books = action.payload.books;
      },
      setGenre: (state,action) => {
        state.currGenre=action.payload.currGenre;
      },
      setPage: (state,action) => {
        state.currPage=action.payload.currPage;
      },
      setTotalPages: (state,action) => {
        state.totalPages=action.payload.totalPages;
      },
      setQuery: (state,action) => {
        state.query=action.payload.query;
      }
    //   setFriends: (state, action) => {
    //     if (state.user) {
    //       state.user.friends = action.payload.friends || [];
    //     } else {
    //       console.error("user does not exist");
    //     }
    //   },
    //   setPosts: (state, action) => {
    //     state.posts = action.payload.posts;
    //   },
    //   setPost: (state, action) => {
    //     const updatedPosts = state.posts.map((post) => {
    //       if (post._id === action.payload.post._id) return action.payload.post;
    //       return post;
    //     });
    //     state.posts = updatedPosts;
    //   },
    },
  });
  
  export const { setMode, setLogin, setUser, setLogout, setBooks, setGenre, setPage, setTotalPages, setQuery } =
    authSlice.actions;
  export const authReducer= authSlice.reducer;