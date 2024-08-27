"use client"
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createFormItem, createFormGroup,setFormItemValue } from "@/_lib/form_tool"
import {ModelKeys} from "../type"
import { Model } from '../enum'

// editorRoot>>[imageid,showimage,showCutout] >> stage  >> init[model >> mark_style , alphaEstimate] 
//                                                      >> modify[tool_type, tool_size]

let editorRoot = createFormGroup(
    "editorRoot",
    ()=> [imageID,showImages,showCutouts]
)


let imageID = createFormItem(
    "imageID",
    "input",
    {
        value:Symbol(undefined)
    },
    (current)=>current.payload.value===undefined?null:stageOption
)

let showImages = createFormItem(
    "showImages",
    "switch",
    {  
        value:true,
    }
)


let showCutouts = createFormItem(
    "showCutouts",
    "switch",
    {  
        value:true,
    }
)

let stageOption = createFormItem(
    "stage",
    "select",
    {
        value:"init",
        options:["init","modify"]
    },
    (current)=>{
        switch (current.payload.value){
            case"init":
                return initOptions
            case"modify":
                return modifyOptions
            default:
                throw "invalid value"
        }
    }
)

let initOptions = createFormGroup(
    "initOptions",
    ()=>[model,alphaEstimate,initLayer,runTimes]
)

let modifyOptions = createFormGroup(
    "modifyOptions",
    ()=>[modifyTool,modifyToolSize,modifyLayer,cutTimes]
)

let runTimes = createFormItem(
    "runTimes",
    "input",
    {
        value:"0"
    }
)

let cutTimes = createFormItem(
    "cutTimes",
    "input",
    {
        value:"0"
    }
)


let model = createFormItem(
    //初始parent為null,此時為游離狀態，直到有父節點執行next才會被明確賦值
    "model",
    "select",
    {   
        value:"ISNET",
        options:Object.keys(Model)
        // options:["ISNET","ISNET_ANIME","U2NET","U2NET_HUMAN_SEG","U2NET_CLOTH_SEG","SILUETA","SAM_BASE","SAM_LARGE","SAM_HUGE"]
    },
    (current)=>current.payload.value.includes("SAM")?samMarkStyle:null

) 

let samMarkStyle = createFormItem(
    "markStyle",
    "select",
    {    
        value:"include_box",
        options:["include_points","exclude_points","include_box"]
    }
)


let alphaEstimate = createFormItem(
    "alphaEstimate",
    "switch",
    {   
        value:false
    }
)


let modifyTool = createFormItem(
    "modifyTool",
    "select",
    {
        value:"white",
        options:["white","black","eraser"]
    }
)

let modifyToolSize = createFormItem(
    "modifyToolSize",
    "input",
    {
        value:"14",
    }
)


let initLayer = createFormItem(
    "initLayer",
    "select",
    {
        value:["mask","rawImg"],
        options:["mask","rawImg"]
    }
)

let modifyLayer = createFormItem(
    "modifyLayer",
    "select",
    {
        value:["mask","rawImg"],
        options:["mask","rawImg"]
    }
)


// Then, handle actions in your reducers:
export const editorSlice = createSlice({
    name: 'editor',
    initialState:editorRoot,
    reducers: { 
        changeshowImages(state,action:PayloadAction<boolean>){
            //不直接更改stageOption.payload.value, 要findFieldByName找的到才更改
            //代表此時該field在頁面上因此可以被設置
            return setFormItemValue(state,showImages.name,action.payload)
        },
        changeRunTimes(state,action:PayloadAction<number>){
            return setFormItemValue(state,runTimes.name,`${action.payload}`)
        }
        ,
        changeCutTimes(state,action:PayloadAction<number>){
            return setFormItemValue(state,cutTimes.name,`${action.payload}`)
        }
        ,
        changeshowCutouts(state,action:PayloadAction<boolean>){
            return setFormItemValue(state,showCutouts.name,action.payload)
        },
        loadImage(state,action: PayloadAction<string>){
            return setFormItemValue(state,imageID.name,action.payload)
        },
        changeEditStage(state,action: PayloadAction<"init"|"modify">){
            return setFormItemValue(state,stageOption.name,action.payload)
        },
        changeModel(state,action: PayloadAction<ModelKeys>){
            return setFormItemValue(state,model.name,action.payload)
        },
        changeAlphaEstimate(state,action: PayloadAction<boolean>){
            return setFormItemValue(state,alphaEstimate.name,action.payload)  
        },
        changeMdoifyToolType(state,action: PayloadAction<"draw"|"eraser">){
            return setFormItemValue(state,modifyTool.name,action.payload)
        },
        changeModifyToolSize(state,action: PayloadAction<number>){
            return setFormItemValue(state,modifyToolSize.name,action.payload)
        },
        changeSamMarker(state,action: PayloadAction<"include_points"|"exclude_points"|"include_box">){
            return setFormItemValue(state,samMarkStyle.name,action.payload)
        },
        changeInitLayer(state,action: PayloadAction<{value:"mask"|"rawImg",checked:boolean}>){
            let selected = [...initLayer.payload.value as string[]]

            if (action.payload.checked){
                selected.push(action.payload.value)
                
            }else{
                selected.splice(selected.indexOf(action.payload.value),1)
            }

            return setFormItemValue(state,initLayer.name,selected)
        },

        changeModifyLayer(state,action: PayloadAction<{value:"mask"|"rawImg",checked:boolean}>){
            let selected = [...modifyLayer.payload.value as string[]]

            if (action.payload.checked){
                selected.push(action.payload.value)
            }else{
                selected.splice(selected.indexOf(action.payload.value),1)
            }

            return setFormItemValue(state,modifyLayer.name,selected)
        },
    }
})

export default editorSlice
export const {
    changeshowCutouts,
    changeshowImages,
    changeRunTimes,
    changeCutTimes,
    loadImage,
    changeModel,
    changeAlphaEstimate,
    changeEditStage,
    changeMdoifyToolType,
    changeModifyToolSize,
    changeSamMarker,
    changeInitLayer,
    changeModifyLayer
} = editorSlice.actions


// window.changeModel = changeModel
// window.loadImage = loadImage
// window.changeEditStage = changeEditStage
// window.changeMdoifyToolType = changeMdoifyToolType
// window.changeModifyToolSize = changeModifyToolSize
// window.changeSamMarker = changeSamMarker