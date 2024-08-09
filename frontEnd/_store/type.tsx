import {Model,SamMarkStyle,ModifyTool} from "./enum"


export type ModelKeys = keyof typeof Model;

export type ImgSrc = string|HTMLImageElement|Blob


export interface Cutout{
    id:string,
    from_image:string, // id of raw image
    blobURL:string
}


export interface RawImage {
    id:string
    fileHandle:FileSystemFileHandle
    width:number
    height:number
    content:File|Blob
    blobURL:string
}



interface InitEditOptionOfModel{
    ISNET : null,
    ISNET_ANIME : null,
    U2NET : null,
    U2NET_HUMAN_SEG : null,
    U2NET_CLOTH_SEG : null,
    SILUETA : null,
    SAM_BASE : {mark_style:SamMarkStyle},   
    SAM_LARGE : {mark_style:SamMarkStyle},
    SAM_HUGE : {mark_style:SamMarkStyle},
}

export type InitEditOption<selectedModel extends ModelKeys> = {
    model:Model,
    initOption:InitEditOptionOfModel[selectedModel]
}


type SAMModelArgs = {
    input_points:[number,number][],
    input_labels:(0|1)[],                        //0:表示去除 1:表示包含
    input_boxes:[number,number,number,number][], //(左上角x,左上角y,右下角x,右下角y)
}

interface ModelArgs{
    ISNET : null,
    ISNET_ANIME : null,
    U2NET : null,
    U2NET_HUMAN_SEG : null,
    U2NET_CLOTH_SEG : null,
    SILUETA : null,
    SAM_BASE : SAMModelArgs,
    SAM_LARGE : SAMModelArgs,
    SAM_HUGE : SAMModelArgs
}




export interface InitMaskParam{
    rawImage:RawImage
    model?:Model
    modelArgs?:ModelArgs[ModelKeys]
    alphaEstimate?:boolean
}


