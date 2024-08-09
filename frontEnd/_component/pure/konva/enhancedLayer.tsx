import React,{CSSProperties, forwardRef,useImperativeHandle} from 'react'
import { Layer as KonvaLayer, Rect} from "react-konva";
import type Konva from "konva"
import type {KonvaNodeEvents} from "react-konva/ReactKonvaCore"


export interface LayerProps extends KonvaNodeEvents { 
    style?:Pick<CSSProperties,"cursor"|"opacity"> , 
    children?:React.ReactNode,
    cursor?:string,
    onKeyPress?:(e:KeyboardEvent)=>(e:KeyboardEvent)=>boolean,
} 


const Layer =  forwardRef(function (props:LayerProps,ref){
    let { children,style,onKeyPress,...eventHandlers} = props
    
    let isInteractive = Object.keys(eventHandlers).length > 0
    let layer = React.useRef<Konva.Layer>()
    let keyPressed = React.useRef<boolean>(false)
    let [containerSize,setSize] = React.useState({width:0,height:0})
    // console.log(isInteractive,eventHandlers,containerSize)

    useImperativeHandle(ref,()=>layer.current,[layer.current])

    let handleSetSize = () => {
        let stage:Konva.Stage|undefined
        if (stage = layer.current?.getStage()){
            let width = stage.width()
            let height = stage.height()

            if (width===0 && height===0){ 
                setTimeout(handleSetSize,100)
            }else{
                setSize({width,height})
            }
        }
    }

    React.useEffect(() => {
        if (isInteractive){
            handleSetSize()
        }
    },[isInteractive])

    React.useEffect(() => {
        if (style){
            layer.current.canvas._canvas.style.opacity = style.opacity
            layer.current.canvas._canvas.style.cursor = style.cursor
        }
    }, [style])


    React.useEffect(() => {
        if (onKeyPress){
            let container = layer.current.parent.container()

            let handleKeyDown = (e: KeyboardEvent) => {
                if (!keyPressed.current && onKeyPress){
                    let checkPressed = onKeyPress(e)
                    keyPressed.current = checkPressed(e)
    
                    let handleUp = (e: KeyboardEvent) => {
                        if(!checkPressed(e)){
                            keyPressed.current = false;
                            container.removeEventListener("keyup", handleUp)
                        }
                    }
                    container.addEventListener("keyup",handleUp)
                }
            }
            container.addEventListener("keydown",handleKeyDown)
    
            return () => {container.removeEventListener("keydown", handleKeyDown)}
        }
    }, [onKeyPress])


    return (
        <KonvaLayer 
            ref={layer} 
            {...eventHandlers}
        >
            {isInteractive?
                <Rect
                    x={0}
                    y={0}
                    {...containerSize}
                    fill="transparent"
                    stroke="transparent"
                />
                :null
            }
            {children}
        </KonvaLayer>
    )

})

export default Layer