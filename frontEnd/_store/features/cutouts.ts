"use client"
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {stackAlphaCutout} from "../../_lib/canvas_tool"
import {Cutout, RawImage} from "../type"
import { original } from '@reduxjs/toolkit'
import { downloadZip } from 'client-zip';


export const saveCutout = createAsyncThunk(
    'saveCutout', //action type前綴
    async (arg:undefined, thunkAPI) => {
        const allCutouts:Cutout[] = thunkAPI.getState().cutouts.cutouts

        if (allCutouts.length>1){
            let fileHandle: FileSystemFileHandle = await window.showSaveFilePicker({
                startIn: "downloads",
                suggestedName: "cutouts.zip",
                types: [
                    {
                        description: "zipped",
                        accept: { "application/zip": [".zip"] },
                    },
                ]
            });
            const writable: FileSystemWritableFileStream = await fileHandle.createWritable()

            

            let blobs = await Promise.all(
                allCutouts.map(function(cutout):Promise<File>{
                    let {promise,resolve} = Promise.withResolvers<File>()
                    let cutout_name = `${cutout.from_image}_${cutout.id}.png`
                    fetch(cutout.blobURL).then(
                        async (res)=>{
                            resolve(new File([await res.blob()],cutout_name))
                        }
                    )
                    return promise
                })
            )
            let zipFile:Blob = await downloadZip(blobs).blob() 
            await writable.write(zipFile)
            await writable.close()
        }else{
            let cutout = allCutouts[0]
            let fileHandle: FileSystemFileHandle = await window.showSaveFilePicker({
                startIn: "downloads",
                suggestedName: `${cutout.from_image}_${cutout.id}.png`,
                types: [
                    {
                        description: "png",
                        accept: { "image/png": [".png"] },
                    },
                ]
            });
            const writable: FileSystemWritableFileStream = await fileHandle.createWritable()

            

            let blobs = await fetch(cutout.blobURL).then(
                async (res)=>{ return await res.blob()} 
            )
            await writable.write(blobs)
            await writable.close()
        }
    }
    
)


export const addCutout = createAsyncThunk(
    'addCutout', //action type前綴
    async (arg:{raw:RawImage,mask:Blob|string}, thunkAPI):Promise<Cutout> => {
        let cutout:Blob
        if (typeof arg.mask === "string"){
            cutout = await fetch(arg.mask).then( async(res)=>await res.blob())
        }else{
            cutout = arg.mask
        }

        return {
            id: crypto.randomUUID(),
            from_image: arg.raw.fileHandle.name,
            blobURL: URL.createObjectURL(cutout)
        }
    }
)


const initialState :{cutouts: Cutout[]} = {cutouts:[]}

// Then, handle actions in your reducers:
const cutouts = createSlice({
    name: 'cutout',
    initialState,
    reducers: {
        // addCutout(state,action: PayloadAction<{raw:RawImage,mask:Blob|string}>){
        //     let mask = action.payload.mask
        //     state.cutouts.push({
        //         id: crypto.randomUUID(),
        //         from_image: action.payload.raw.fileHandle.name,
        //         blobURL: typeof mask === "string" ? mask : URL.createObjectURL(mask)
        //     })
        // },
        removeCutout(state,action: PayloadAction<Cutout>){
            let remove = state.cutouts.splice(original(state.cutouts).indexOf(action.payload),1)
            URL.revokeObjectURL(remove[0].blobURL)
        },
        cleanAllCut(state,action: PayloadAction<undefined>){
            state.cutouts.forEach(c => URL.revokeObjectURL(c.blobURL));
            return {cutouts:[]}
        }
        // standard reducer logic, with auto-generated action types per reducer
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(addCutout.fulfilled, (state, action) => {
            // Add user to the state array
            state.cutouts = state.cutouts.concat(action.payload)
        })
        builder.addCase(saveCutout.fulfilled, (state, action) => {
            // Add user to the state array
            state.cutouts.splice(0,state.cutouts.length)
        })
    },
})

export const {removeCutout,cleanAllCut} =  cutouts.actions
export default cutouts