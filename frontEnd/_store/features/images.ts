"use client"
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getLoadedImageObj } from '@/_lib/canvas_tool'
import {RawImage} from "../type"
import { original } from '@reduxjs/toolkit'


export const openImages = createAsyncThunk(
    '',
    async (arg:undefined, thunkAPI) => {
        const options = {
            multiple: true,
            types: [
                {
                    description: "Images",
                    accept: {
                        "image/*": [".png", ".bmp", ".jpeg", ".jpg", ".svg"],
                    },
                },
            ],
        };

        const fileHandle:FileSystemFileHandle[] = await window.showOpenFilePicker(options);
        let images:RawImage[] = []
        
        for await (const img of fileHandle) {
            let url = URL.createObjectURL(await img.getFile())
            let {naturalWidth,naturalHeight} = await getLoadedImageObj(url)
            images.push({
                fileHandle: img,
                id: crypto.randomUUID(),
                width:naturalWidth,
                height:naturalHeight,
                blobURL: url,
                content: await img.getFile(),
            })
        }
        
        return images
    },
)





const initialState :{images: RawImage[]} = {images:[]}

// Then, handle actions in your reducers:
const rawImages = createSlice({
    name: 'images',
    initialState,
    reducers: {
        removeImage(state,action: PayloadAction<RawImage>){
            state.images.splice(original(state.images).indexOf(action.payload),1)
        }
        // standard reducer logic, with auto-generated action types per reducer
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(openImages.fulfilled, (state, action) => {
            // Add user to the state array
            state.images =  [...state.images,...action.payload]
        })
    },
})

export const {removeImage} =  rawImages.actions
export default rawImages