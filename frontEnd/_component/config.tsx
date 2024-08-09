import React, { useEffect } from  'react'
import {useDispatch} from 'react-redux'
import {useFormItem} from "../_hook/useFormItem"
import { changeModel,changeSamMarker,changeMdoifyToolType,changeModifyToolSize,changeAlphaEstimate,changeshowImages,changeRunTimes, changeCutTimes, changeModifyLayer, changeInitLayer} from '@/_store/features/editor'
import { openImages } from '@/_store/features/images'
import { Option,IconOptionGroup } from './pure/iconOptions'
import styled from 'styled-components'
import { MenuItem, TextField, Switch, Slider } from '@mui/material';
import { IconButton } from './pure/button'
import { ball } from '@/_lib/icon'


let Box = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
    width:min-content;
    min-width: 70px;

    > span:first-child {
        font-size: 14px;
        user-select: none;
        color: #aca8a3;
        flex-grow: 0;
        padding: 2px;
        text-align: center;
    }

    > *:nth-child(2) {
        margin-top: auto;
        margin-bottom: auto;
    }
`

export function ConfigBox(props:{configName:string, children:JSX.Element,style?:React.CSSProperties}){
    return (
        <Box style={props.style}>
            <span>
                {props.configName}
            </span>
            {props.children}
        </Box>
    )
}


export function FileSelector(props:any){
    let dispatch = useDispatch()
    let [_,{value:show}] = useFormItem("showImages") 

    return (
        <div style={{width:90,height:"var(--nav-height)",display:"flex",flexDirection:"column",
        userSelect:"none",backgroundColor:"var(--tab-cotnent-color)"}}>
            <IconButton 
                iconSize='40%'
                style={{flexGrow:1,borderBottom:"1px solid #e0d6d6"}}
                src="/folder.png" 
                onClick={() => {dispatch(openImages())}}
            />
            <IconButton 
                iconSize='12%'
                style={{flexGrow:0,height:25,transform:(show?"none":"rotate(-0.5turn)")}} 
                src="/down_arrow.svg" 
                onClick={()=> {dispatch(changeshowImages(!show))}}
            />
        </div>
    )
}


export function RunButton(props:any){
    let dispatch = useDispatch()
    let [isShown,{value:times}] = useFormItem("runTimes")
    return (
        isShown?(
            <ConfigBox configName='run'>
                <IconButton 
                    iconSize='40%'
                    style={{width:"100%",height:"100%"}}
                    src="/run.svg" 
                    onClick={() => {dispatch(changeRunTimes(parseInt(times)+1))}}
                />
            </ConfigBox>
        ):null
    )
}

export function CutButton(props:any){
    let dispatch = useDispatch()
    let [isShown,{value:times}] = useFormItem("cutTimes")
    return (
        isShown?(
            <ConfigBox configName='cut'>
                <IconButton 
                    iconSize='45%'
                    style={{width:"100%",height:"100%"}}
                    src="/cut.svg" 
                    onClick={() => {dispatch(changeCutTimes(parseInt(times)+1))}}
                />
            </ConfigBox>
        ):null
    )
}

export function ModelSelector(props:any){
    let dispatch = useDispatch()
    let [isShown,payload] = useFormItem("model")

    return(
        (isShown?(
            <ConfigBox configName='model'>
                <TextField 
                    select 
                    sx={{width:120}} 
                    onChange={(e) => { dispatch(changeModel(e.target.value)) }}
                    size="small"
                    value={payload.value}
                >
                    {payload.options.map((v) => {
                        return <MenuItem value={v} key={v}>{v}</MenuItem>
                    })}
                </TextField>
            </ConfigBox>
        ):null)
    )
}


export function MarkStyleSelector(props:any){
    let dispatch = useDispatch()
    let [isShown,payload] = useFormItem("markStyle")

    return (
        isShown?(
            <ConfigBox configName='mark style'>
                <IconOptionGroup 
                    name="markStyle"
                    selected = {payload.value}
                    onChange={(e) =>{dispatch(changeSamMarker(e.target.value))}}
                >
                    {payload.options.map((v) => {
                        return (
                            <Option
                                style={{width:30,height:30}}
                                value={v}
                                iconSize={70}
                                iconSrc={
                                    v=="include_box"?"/rect-dashed.svg":
                                    v=="include_points"?ball(30,"#009e2dd7"):
                                    ball(30,"#ff000080")
                                }
                            />
                        )
                    })}
                </IconOptionGroup>
            </ConfigBox>
        ):null
    )
}

export function AlphaEstimateSwitch(props:any){

    let dispatch = useDispatch()
    let [isShown,payload] = useFormItem("alphaEstimate")

    return (
        isShown?(
            <ConfigBox configName='alpha Estimate'>
                <Switch 
                    checked={payload.value}
                    onChange={(e)=>dispatch(
                    changeAlphaEstimate(e.target.checked?true:false)
                )}/>
            </ConfigBox>
        ):null
    )
}

export function ModifyToolSelector(props:any){
    let dispatch = useDispatch()
    let [isShown,payload] = useFormItem("modifyTool")

    return (
        isShown?(
            <ConfigBox configName='modifyTool'>
                <IconOptionGroup 
                    name="modifyToolType"
                    selected = {payload.value}
                    onChange={(e) => dispatch(changeMdoifyToolType(e.target.value))}
                >
                    {payload.options.map((v) => {
                        return (
                            <Option
                                style={{width:30,height:30}}
                                value={v}
                                iconSize={70}
                                iconSrc={
                                    v=="white"?ball(30,"white"):
                                    v=="black"?ball(30,"black"):
                                    "./eraser.svg"
                                }
                            />
                        )
                    })}
                </IconOptionGroup>
            </ConfigBox>
        ):null
    )
}

export function ModifySizeSelector(props:any){
    let dispatch = useDispatch()
    let [isShown,payload] = useFormItem("modifyToolSize")
    
    return (
        isShown?(
            <ConfigBox configName='tool size'>
                    {/* <input type="range" name="volume" min="5" max="50" value={payload.value}/> */}
                    <Slider
                        value={parseInt(payload.value)}
                        sx={{width:70}}
                        onChange={(e) => dispatch(changeModifyToolSize(e.target.value))}
                        valueLabelDisplay="auto"
                        shiftStep={30}
                        step={1}
                        min={5}
                        max={50}
                    />
            </ConfigBox>
        ):null
    )
}


export function InitLayerChooser(props:any){
    let dispatch = useDispatch()
    let [isShown,payload] = useFormItem("initLayer")

    return (
        isShown?(
            <ConfigBox configName='layer'>
                <IconOptionGroup 
                    name="layers"
                    selected = {payload.value}
                    onChange={(e) => {
                        dispatch(changeInitLayer({
                            value:e.target.value,
                            checked:e.target.checked
                        }))
                    }}
                >
                    {payload.options.map((v) => {
                        return (
                            <Option
                                style={{width:30,height:30}}
                                value={v}
                                iconSize={70}
                                iconSrc={v=="mask"?"/mask.svg":"/image.svg"}
                            />
                        )
                    })}
                </IconOptionGroup>
            </ConfigBox>
        ):null
    )
}


export function ModifyLayerChooser(props:any){
    let dispatch = useDispatch()
    let [isShown,payload] = useFormItem("modifyLayer")
    return (
        isShown?(
            <ConfigBox configName='layer'>
                <IconOptionGroup 
                    name="modifyLayers"
                    selected = {payload.value}
                    onChange={(e) => {
                        dispatch(changeModifyLayer({
                            value:e.target.value,
                            checked:e.target.checked
                        }))
                    }}
                >
                    {payload.options.map((v) => {
                        return (
                            <Option
                                style={{width:30,height:30}}
                                value={v}
                                iconSize={70}
                                iconSrc={v=="mask"?"/mask.svg":"/image.svg"}
                            />
                        )
                    })}
                </IconOptionGroup>
            </ConfigBox>
        ):null
    )
}