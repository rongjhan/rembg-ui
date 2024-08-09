"use client"
import { Stage, Image as KonvaImage,Rect} from "react-konva";
import Layer, {LayerProps} from "./enhancedLayer"
import type {KonvaNodeEvents} from "react-konva/ReactKonvaCore"
import type Konva from "konva";
import { useContainImage } from '@/_hook/useImage'
import { useRef,forwardRef, useImperativeHandle, CSSProperties, useLayoutEffect, useCallback} from "react";


interface ViewerProps extends KonvaNodeEvents { 
    src: string ,
    className?:string,
    style?:CSSProperties,
    layerStyle?:LayerProps["style"],
    children?:(containWudth:number,containHeight:number)=>React.ReactNode
} 

const Viewer = forwardRef(function(props:ViewerProps, ref) { 
    let { src, className,style,children,...handleInteractive} = props
    let [imgObj,status,containerRef,containImgSize] = useContainImage(src)
    const stageRef = useRef<Konva.Stage>(null);
    
    useImperativeHandle(ref,()=>{
        return stageRef.current
    },[stageRef.current])
    // useImperativeHandle(ref,()=>{
    //     return {
    //         stage:stageRef.current,
    //         imgObj:imgObj
    //     }
    // },[stageRef.current])

    useLayoutEffect(()=>{
        containerRef.current = stageRef.current?.container()
    },[stageRef.current?.container()])

    const handleScale = useCallback((e:Konva.KonvaEventObject<WheelEvent>) => {

        let stageBox:HTMLDivElement = e.currentTarget.content
        let scaleMatcher = /(?:scale\()([+-]?(\d*[.])?\d+)(?:\))/
        let currentScale = parseFloat((scaleMatcher.exec(stageBox.style.transform)??[null,"1"])[1])
        let transformOrigin = `${e.evt.offsetX}px ${e.evt.offsetY}px`
        stageBox.style.transformOrigin = transformOrigin

        let restrictNextScale = Math.min(Math.max(1, currentScale-(e.evt.deltaY / 1000)), 4)

        if (stageBox.style.transform.search(scaleMatcher)>=0){
            stageBox.style.transform = stageBox.style.transform.replace(
                scaleMatcher,
                `scale(${restrictNextScale})`
            )
        }else{
            stageBox.style.transform += `scale(${restrictNextScale})`
        }

        e.evt.preventDefault()
        e.evt.stopPropagation()
    },[])

    return (

        <Stage 
            tabIndex={0}
            ref={stageRef}
            style={{...style,display:"flex",justifyContent:"center",alignItems:"center",overflow:"hidden"}}
            className={className}
            width={containImgSize[0]}
            height={containImgSize[1]}
            {...handleInteractive}
            onWheel={handleScale}
        >
            <Layer style={props.layerStyle}>
                {imgObj?(
                    <KonvaImage 
                        Zindex={"123"}  
                        image={imgObj} 
                        width={containImgSize[0]}
                        height={containImgSize[1]}
                    />
                ):null}
            </Layer>
            {children && children(containImgSize[0],containImgSize[1])}
        </Stage>
    )
})

export default Viewer