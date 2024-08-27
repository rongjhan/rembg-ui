"use client"
import React, { useEffect,useRef } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { addCutout } from '@/_store/features/cutouts'
import { changeCutTimes } from '@/_store/features/editor'
import styled from "styled-components"
import { CutoutSideBar } from './cutoutSideBar'
import { useFormItem } from '@/_hook/useFormItem'
import { useInitMaskQuery } from '@/_hook/useInitMaskQuery'
import { genInitMask } from '@/_store/features/api'
import { RawImage } from '@/_store/type'
import {stackAlphaCutout,getLoadedImageObj } from '@/_lib/canvas_tool'
import { Image as KonvaImage, Rect, Circle, Line} from "react-konva";
import type Konva from "konva";
import { KonvaEventObject } from 'konva/lib/Node'
import { ball } from '@/_lib/icon'

import type { State } from '@/_store/store'
import Layer,{LayerProps} from "./pure/konva/enhancedLayer"
import Viewer from "./pure/konva/view"


let StyledEditorBody = styled.div`
    display:flex;
    flex-grow: 1;
    flex-wrap: wrap;
    overflow: hidden;
    scrollbar-width: "none";
    position: relative;
    overflow-x:clip;
    background-color: #fff;
    /* padding: 0 5px; */
    column-gap: 5px;
`
let StyledViewer = styled(Viewer)`
    height:100%;
    flex-basis:0px;
    border-radius: 3px;
    flex-grow:1;
    position: relative;
`



export default function EditorBody(props: { style?: React.CSSProperties }) {
    let [, { value: stage }] = useFormItem("stage")
    let [, { value: imgID }] = useFormItem("imageID")

    let rawImage = useSelector((state: State) => {
        return state.rawImages.images.find(img => img.id === imgID)
    })

    return (
        <StyledEditorBody style={props.style}>
            <React.Fragment key={rawImage?.id}>
                {
                    rawImage?
                    (   
                        stage ==="init"?
                        <InitStageBody rawImg={rawImage}/>: 
                        <ModifyStageBody rawImg={rawImage}/>
                    ):
                    null
                }
            </React.Fragment>
            <CutoutSideBar/>
        </StyledEditorBody>
    )
}



function MaskLayer(props: {
    width: number,
    height: number,
    mask: Blob,
    style?:LayerProps["style"]
}) {

    let [maskImg, setMaskImg] = React.useState<HTMLImageElement>()

    useEffect(() => {
        getLoadedImageObj(props.mask).then((img)=>{setMaskImg(img)})

    }, [props.mask])


    return (
        <Layer style={props.style}>
            {
            maskImg ?
                <KonvaImage
                    image={maskImg}
                    width={props.width}
                    height={props.height}
                />
                : null
            }
        </Layer>
    )
}


function InitStageBody(props: { rawImg: RawImage}) {
    let [acceptMarkInput, { value: markStyle }] = useFormItem("markStyle")
    let { data:mask, isFetching } = genInitMask.useQuery({ rawImage: props.rawImg })
    let [,{value:layers}]:[boolean,{value:string[]}] = useFormItem("initLayer")
    
    const stageRef = useRef<Konva.Stage>(null);
    useEffect(()=>{
        let content = stageRef.current?.content
        if (isFetching) {
            content?.classList.add("isFetching")
        }else{
            content?.classList.remove("isFetching")
        }
    },[isFetching])

    return (
        <StyledViewer ref={stageRef} src={props.rawImg.blobURL} layerStyle={{opacity:layers.includes("rawImg")?"1":"0"}}>
            {(width, height) => {
                let containSize = {width,height}
                let children: React.ReactNode[] = []
                if (mask) {
                    children.push(
                        <MaskLayer 
                            {...containSize} 
                            mask={mask} 
                            style={{opacity:layers.includes("mask")?"0.6":"0"}}
                        />
                    )
                }
                children.push(acceptMarkInput? 
                    <MarkInitLayer {...containSize} markStyle={markStyle} rawImg={props.rawImg}/>:
                    <SimpleInitLayer {...containSize} rawImg={props.rawImg}/>
                )

                return children
            }}
        </StyledViewer>
    )
}


function SimpleInitLayer(props: {
    width: number,
    height: number,
    rawImg: RawImage
}){
    type Rect = { x: number, y: number, width: number, height: number }
    let [rect, setRect] = React.useState<Rect | null>(null)
    let mouseDownPoint = React.useRef<{ x: number, y: number } | null>(null)

    useInitMaskQuery(({model,alphaEstimate})=>{
        let {width:w,height:h} = props.rawImg
        let args = {rawImage: props.rawImg}
        if (rect){
            let box = [rect.x*w, rect.y*h, (rect.x+rect.width)*w, (rect.y+rect.height)*h]
            if (rect.width < 0 || rect.height < 0){
                box = box.slice(2).concat(box.slice(0,2))
            }
            args["modelArgs"] = {"box":box}
        }
        return args
    })

    let handleMouseDown = (event:KonvaEventObject<MouseEvent>) => {
        let { x, y } = event.target.getStage().getPointerPosition()
        mouseDownPoint.current = { x: x / props.width, y: y / props.height }
    }

    let handleMouseUp = (event:KonvaEventObject<MouseEvent>) => {
        mouseDownPoint.current = null
    }

    let handleMouseMove = (event:KonvaEventObject<MouseEvent>) => {
        if (mouseDownPoint.current) {
            let { x, y } = event.target.getStage().getPointerPosition()
            x = Math.max(Math.min(x / props.width,1),0)
            y = Math.max(Math.min(y / props.height,1),0)
            let { x: sx, y: sy } = mouseDownPoint.current
            setRect({ x: sx, y: sy, width: x - sx, height: y - sy })
        }
    }

    let handleKeyPress = (e:KeyboardEvent) => {
        let checkPressed  = (e:KeyboardEvent)=>{
            switch (e.type){
                case "keydown":
                    return e.ctrlKey && e.key == "z"
                case "keyup":
                    return !(e.key == "z")
                default:
                    return false
            }
        }

        if (checkPressed(e)) {setRect(null)}
        return checkPressed
    }

    return (
        <Layer
            style={{"cursor":"crosshair"}}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={(e)=>mouseDownPoint.current = null}
            onKeyPress={handleKeyPress}
        >
            {rect ?
                <Rect
                    x={rect.x * props.width}
                    y={rect.y * props.height}
                    width={rect.width * props.width}
                    height={rect.height * props.height}
                    fill="transparent"
                    stroke="white"
                />
                : null
            }
        </Layer>
    )
}

function MarkInitLayer(props: {
    width: number,
    height: number,
    markStyle: string,
    rawImg: RawImage
}) {
    //參考實現 : https://codesandbox.io/s/react-konva-create-draw-rect-fw9hw

    type Circle = { x: number, y: number, fill: string }
    type Rect = { x: number, y: number, width: number, height: number }

    let mouseDownPoint = React.useRef<{ x: number, y: number } | null>(null)

    useInitMaskQuery(({model,alphaEstimate})=>{
        let {width:w,height:h} = props.rawImg
        return {
            rawImage: props.rawImg,
            modelArgs: { 
                input_points: circles.map(c => [c.x*w, c.y*h]),
                input_labels: circles.map(c => c.fill === "green" ? 1 : 0),
                input_boxes: rect ? [[rect.x*w, rect.y*h, (rect.x+rect.width)*w, (rect.y+rect.height)*h]] : [],
            }
        }
    })

    let [circles, setCircles] = React.useState<Circle[]>([])
    let [rect, setRect] = React.useState<Rect | null>(null)

    

    let handleMouseDown = (event:KonvaEventObject<MouseEvent>) => {
        let { x, y } = event.target.getStage().getPointerPosition()
        mouseDownPoint.current = { x: x / props.width, y: y / props.height }
    }

    let handleMouseUp = (event:KonvaEventObject<MouseEvent>) => {
        if (mouseDownPoint.current && props.markStyle !=="include_box") {
            let { x, y } = event.target.getStage().getPointerPosition()
            x = x / props.width
            y = y / props.height

            if (props.markStyle === "include_points") {
                setCircles([...circles, { x, y, fill: "green" }])
            } else if (props.markStyle === "exclude_points") {
                setCircles([...circles, { x, y, fill: "red" }])
            } 

        }
        mouseDownPoint.current = null
    }

    let handleMouseMove = (event:KonvaEventObject<MouseEvent>) => {
        if (mouseDownPoint.current && props.markStyle === "include_box") {
            let { x, y } = event.target.getStage().getPointerPosition()
            x = Math.max(Math.min(x / props.width,1),0)
            y = Math.max(Math.min(y / props.height,1),0)
            let { x: sx, y: sy } = mouseDownPoint.current
            setRect({ x: sx, y: sy, width: x - sx, height: y - sy })
        }
    }

    let handleKeyPress = (e:KeyboardEvent) => {
        let checkPressed  = (e:KeyboardEvent)=>{
            switch (e.type){
                case "keydown":
                    return e.ctrlKey && e.key == "z"
                case "keyup":
                    return !(e.key == "z")
                default:
                    return false
            }
        }

        if (checkPressed(e)) {setCircles(circles.slice(0, -1))}
        return checkPressed
    }

    return (
        <Layer
            style={{
                cursor:
                    props.markStyle === "include_box" ? "crosshair" : 
                    `url('${
                        props.markStyle === "include_points" ? 
                        ball(10,"#009e2dd7") :
                        props.markStyle === "exclude_points" ?
                        ball(10,"#ff0000d7"):
                        "none"
                    }') 5 5,auto`
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={(e)=>mouseDownPoint.current = null}
            onKeyPress={handleKeyPress}
        >
            {rect ?
                <Rect
                    x={rect.x * props.width}
                    y={rect.y * props.height}
                    width={rect.width * props.width}
                    height={rect.height * props.height}
                    fill="transparent"
                    stroke="white"
                />
                : null
            }
            {[...circles].map((s: Circle) => (
                <Circle
                    key={s.x + "-" + s.y}
                    x={s.x * props.width}
                    y={s.y * props.height}
                    radius={5}
                    fill={s.fill}
                    stroke={"white"}
                />
            ))}
        </Layer>
    )
}



function ModifyStageBody(props: { rawImg: RawImage}) {
    let [modifyable, { value: modifyTool }] = useFormItem("modifyTool")
    let [, { value: toolSize }] = useFormItem("modifyToolSize")
    let [,{value:layers}]:[boolean,{value:string[]}] = useFormItem("modifyLayer")

    let [modifiedMask,setModifiedMask] = React.useState<Blob>()
    // let [trigger, { data:mask}, { lastArg }] = genInitMask.useLazyQuery()
    
    // useEffect(() => {
    //     trigger({ rawImage: props.rawImg }, true)
    // }, [props.rawImg])


    return (
    <>
        <StyledViewer 
            src={props.rawImg.blobURL}
            layerStyle={{opacity:layers.includes("rawImg")?"1":"0"}}
        >
            {(width, height) => {
                let containSize = {width,height}
                let children: React.ReactNode[] = []
                // if (mask) {
                //     children.push(
                //         <MaskLayer {...containSize} mask={mask} />
                //     )
                // }

                if (modifyable) {
                    children.push(
                        <ModifyLayer 
                            {...containSize} 
                            rawImg={props.rawImg}
                            modifyTool={modifyTool} 
                            toolSize={toolSize}
                            setModifyResult={setModifiedMask}
                        />
                    )
                }

                return children
            }}
        </StyledViewer>
        <CutoutArea rawImg={props.rawImg} mask={modifiedMask}/>
    </>
    )
}

function CutoutArea(props: { rawImg: RawImage, mask: Blob | undefined }) {
    let dispatch = useDispatch()
    let [cutoutURL, setCutoutURL] = React.useState<string>()
    let [,{value:times}] = useFormItem("cutTimes")
    times = parseInt(times)
    
    useEffect(() => {
        if (props.mask) {
            
            let { promise, resolve, reject } = Promise.withResolvers<Blob>()
            resolve(stackAlphaCutout(props.rawImg.blobURL, props.mask))
            promise.then((cutout) => {setCutoutURL(URL.createObjectURL(cutout))})
        }

        return () => { cutoutURL && URL.revokeObjectURL(cutoutURL) }
    }, [props.mask])

    useEffect(()=>{
        if (times>0){
            cutoutURL && dispatch(addCutout({raw:props.rawImg,mask:cutoutURL}))
            dispatch(changeCutTimes(times-1))
        }
    },[times])
    // useEffect(() => {
    //     if (props.mask){
    //         let f = new FileReader()
    //         f.onload = () => {setCutoutURL(f.result as string),console.log({d:f.result})}
    //         f.readAsDataURL(props.mask);
    //     }
    //     // return () => { cutoutURL && URL.revokeObjectURL(cutoutURL) }
    // }, [props.mask])

    return (
        <StyledViewer src={cutoutURL??props.rawImg.blobURL}/>
    )
}

function ModifyLayer(props: {
    width: number,
    height: number,
    rawImg: RawImage,
    modifyTool: string,
    toolSize : string,
    setModifyResult:React.Dispatch<Blob>
}) {
    //參考實現 : https://konvajs.org/docs/react/Free_Drawing.html
    type Line = {tool:string, strokeWidth:number,points: number[]}
    
    let toolSize = parseInt(props.toolSize)

    const timer = React.useRef<ReturnType<typeof setTimeout>>()
    const isDrawing = React.useRef<boolean>(false);
    let [,{value:layers}]:[boolean,{value:string[]}] = useFormItem("modifyLayer")

    const [lines, setLines] = React.useState<Line[]>([]);
    const [{x:cursorX,y:cursorY,shown:shownCursor}, setCurPos] = React.useState({x:0,y:0,shown:false});

    let [maskCanvas, setMaskCanvas] = React.useState<HTMLCanvasElement>()
    
    let { data:mask} = genInitMask.useQuery({ rawImage: props.rawImg })


    useEffect(() => {
        let maskCanvas = document.createElement("canvas")
        maskCanvas.width = props.rawImg.width
        maskCanvas.height = props.rawImg.height
        let maskCtx = maskCanvas.getContext("2d")
        if (mask) {
            getLoadedImageObj(mask).then((img)=>maskCtx.drawImage(img,0,0))
        }else{
            maskCtx.fillStyle = "white"
            maskCtx.fillRect(0,0,maskCanvas.width,maskCanvas.height)
        }
        setMaskCanvas(maskCanvas)

    }, [mask])
    

    const handleMouseDown = (e:KonvaEventObject<MouseEvent>) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        let scale = props.rawImg.width/props.width
        setLines([...lines, { 
            tool:props.modifyTool, 
            strokeWidth:parseInt(toolSize)*scale,
            points: [pos.x/props.width, pos.y/props.height] }
        ]);
    };

    const handleMouseMove = (e:KonvaEventObject<MouseEvent>) => {
        // no drawing - skipping
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        // const [x,y] = [point.x/props.width, point.y/props.height]
        setCurPos({x:point.x,y:point.y,shown:true});

        if (isDrawing.current) {
            let lastLine = lines[lines.length - 1];
            // add point
            lastLine.points = lastLine.points.concat([point.x/props.width,point.y/props.height]);
            // replace last
            lines.splice(lines.length - 1, 1, lastLine);
            setLines(lines.concat());
        }

    };

    const handleMouseUp = (e:KonvaEventObject<MouseEvent>) => {isDrawing.current = false;};

    useEffect(()=>{
        if (timer.current){clearTimeout(timer.current)}
        
        timer.current = setTimeout(() => {
            if (lines.length === 0) {
                mask && maskCanvas.toBlob((blob)=>{blob&&props.setModifyResult(blob)})
            }else{
                let canvas = document.createElement("canvas")
                canvas.width = props.rawImg.width
                canvas.height = props.rawImg.height
                let ctx = canvas.getContext("2d")

                lines.forEach((line,i)=>{
                    
                    ctx.lineWidth = line.strokeWidth
                    ctx.lineCap = "round";
                    ctx.lineJoin = 'round';
                    ctx.globalCompositeOperation = line.tool == "eraser" ? 'destination-out': 'source-over'
                    
                    ctx.strokeStyle = line.tool == "white" ? "#ffffff":"#000000"
                    ctx?.beginPath()
                    for (let p=0;p<line.points.length;p+=2){
                        let x = line.points[p]*canvas.width
                        let y = line.points[p+1]*canvas.height
                        p == 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y)
                    }
                    ctx?.stroke()
                })
                let stackCanvas = document.createElement("canvas")
                stackCanvas.width = props.rawImg.width
                stackCanvas.height = props.rawImg.height
                let stackCtx = stackCanvas.getContext("2d")
                stackCtx?.drawImage(maskCanvas,0,0)
                stackCtx?.drawImage(canvas,0,0)
                stackCanvas?.toBlob((blob)=>{blob&&props.setModifyResult(blob)})
            }
            
        },600)
    },[maskCanvas,lines])


    let handleKeyPress = (e:KeyboardEvent) => {
        let checkPressed  = (e:KeyboardEvent)=>{
            switch (e.type){
                case "keydown":
                    return e.ctrlKey && e.key == "z"
                case "keyup":
                    return !(e.key == "z")
                default:
                    return false
            }
        }

        if (checkPressed(e)) {setLines(lines.slice(0, -1))}
        return checkPressed
    }


    return (
        <>
            {
                maskCanvas ?
                <Layer style={{opacity:layers.includes("mask")?"0.6":"0"}}>
                    <KonvaImage
                        image={maskCanvas}
                        width={props.width}
                        height={props.height}
                    />
                </Layer>:
                null
            }
            <Layer
                style = {{
                    // cursor:"none"
                    cursor:(
                        `url('${
                            props.modifyTool === "black" ? 
                            ball(toolSize,"gray"):
                            props.modifyTool === "white" ?
                            ball(toolSize,"white"):
                            ball(toolSize,"#e8e86c")
                        }') ${toolSize/2} ${toolSize/2},auto`
                    )
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseEnter={(e)=>{setCurPos({x:cursorX,y:cursorY,shown:true})}}
                onMouseLeave={(e)=>{handleMouseUp(e);setCurPos({x:cursorX,y:cursorY,shown:false})}}
                onKeyPress={handleKeyPress}
            >
                {lines.map((line, i) => (
                    <Line
                        key={i}
                        points={line.points.map((p,i)=>i%2 == 0 ? p*props.width : p*props.height)}
                        stroke={line.tool === 'white' ? '#ffff':'#000'}
                        strokeWidth={line.strokeWidth/(props.rawImg.width/props.width)}
                        tension={0.5}
                        lineCap="round"
                        lineJoin="round"
                        globalCompositeOperation={
                            line.tool === 'eraser' ? 'destination-out' : 'source-over'
                        }
                    />
                ))}
                {
                    shownCursor?(
                        <Circle 
                        radius={toolSize/2} 
                        x={cursorX} 
                        y={cursorY}
                        stroke="white"
                        fill='black'
                    />
                    ):null
                }

            </Layer>
        </>

    )
}

//"#54e4389b"