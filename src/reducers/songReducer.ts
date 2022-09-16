import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
    songs: [],
  };


  export function fetchAllSongs() {
    return async (dispatch: (arg0: any) => void) => {
  
      try {
        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
        headers.append('Access-Control-Allow-Credentials', 'true');
        const response = await fetch('http://localhost:8080/api/songs/read', {
          method: 'GET',
          headers
        });
  
        const result = await response.json();
  
        dispatch(getSongs(result));
      } catch (error) {
         console.log(error);
      }
    }
  }

const SongSliceReducer = createSlice({
    name: 'SongSliceReducer',
    initialState,
    reducers: {
      getSongs: (state, actions) => {
        return {
          ...state,
          songs: actions.payload,
        };
      },
    },
  });


  export const { getSongs,  } =
  SongSliceReducer.actions;
export default SongSliceReducer.reducer;