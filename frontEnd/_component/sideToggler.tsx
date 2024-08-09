import { CssBaselineProps } from '@mui/material'
import React,{useState,useEffect,useRef, CSSProperties} from 'react'
import styled from 'styled-components'

let StyledToggler = styled.div`
    --radius:50%;
    position: absolute;
    /* cursor:grab; */

    background-color:hsl(215, 70%, 91%);
    width: 55px;
    aspect-ratio: 1;
    border-radius:var(--radius);
    &:active{
        width: 50px;
        cursor: grabbing;
    }

    &:hover{
        cursor: grabbing;
    }


    &.right{
        right:0;
        &.static{
            /* --radius:30%; */
            border-radius:var(--radius) 0 0 var(--radius);
            transform:translateX(40%) ;
        }
    }


    &.left{
        left:0;
        &.static{
            /* --radius:30%; */
            border-radius:0 var(--radius) var(--radius) 0;
            transform:translateX(-40%);
        }
    }
    /* :hover{
        cursor: grabbing;
    } */
    /* &:active{
        cursor: grabbing;
    } */
`

export function DragSideToggler(props:{
    side:"right"|"left",
    init_y:number, //percentage of offsetParent
    onClick?:React.MouseEventHandler<HTMLDivElement>,
    onChangeSide?:(side:"right"|"left")=>void,
    style?:Exclude<CSSProperties,"top"|"left"|"right"|"bottom"|"transform"|"position"|"userSelect">
}){
    let toggler = useRef<HTMLDivElement>()
    let location = useRef({x:props.side,y:props.init_y})
    let isPressed = useRef(false)
    let isMoving = useRef(false)

    let handleUp = (e:MouseEvent) => {
        if (isPressed.current && isMoving.current) {
            isPressed.current = false
            isMoving.current = false
    
            let toggleEl = toggler.current
            let parent  = toggleEl.offsetParent
    
            let maxYlocation = parent?.clientHeight - toggleEl.offsetHeight
            let stickSide:"left"|"right" = e.clientX > (parent?.clientWidth/2)?'right':'left'
    
            
            toggleEl.style.transform = ''
            toggleEl?.classList.add("static")
    
            if (stickSide=="right") {
                location.current.x = "right"
                toggleEl?.classList.replace("left","right")
            }else{
                location.current.x = "left"
                toggleEl?.classList.replace("right","left")
            }
            
    
            let locationYbyPixel = Math.max(
                Math.min(
                    e.clientY-parent?.getBoundingClientRect().top,
                    maxYlocation
                ),0
            )
    
            location.current.y = 100*locationYbyPixel/(parent?.clientHeight)
            toggleEl.style.top = `${location.current.y}%`
            
            props.onChangeSide && props.onChangeSide(stickSide)
            // setLocation(newLocation)
        }
    }

    let handleMove = (e:MouseEvent) => {
        if (isPressed.current) {
            let toggleEl = toggler.current
            let parent  = toggleEl.offsetParent

            let {left:originX,top:originY} = parent.getBoundingClientRect()

            let startX = location.current.x=="right"?parent.clientWidth-toggleEl.offsetWidth:0
            let startY = location.current.y * parent.clientHeight/100

            let moveX = (e.clientX-originX)-startX
            let moveY = (e.clientY-originY)-startY

            if(isMoving.current){
                isMoving.current = true
                toggleEl?.classList.remove("static")
                let maxMoveX = parent?.clientWidth-startX-toggleEl?.offsetWidth
                let maxMoveY = parent?.clientHeight-startY-toggleEl?.offsetHeight
    
                let finalMoveX = Math.max(Math.min(moveX,maxMoveX),-startX)
                let finalMoveY = Math.max(Math.min(moveY,maxMoveY),-startY)
                toggleEl.style.transform = `translate(${finalMoveX}px, ${finalMoveY}px)`
            }
        }
    }

    let handleLeave = (e:MouseEvent) => { isPressed.current && (isMoving.current = true)}

    let handleMouseDown = (e:React.MouseEvent) => {
        isPressed.current = true
        let parent = toggler.current.offsetParent
        let wrapHandleMove = function(e:MouseEvent){handleMove(e);}
        let wrapHandleUp = function(e:MouseEvent){
            handleUp(e);
            parent.removeEventListener("mouseup",wrapHandleUp)
            parent.removeEventListener("mousemove",wrapHandleMove)
            parent.removeEventListener("mouseleave",mouseLeave)
        }
        let mouseLeave = function(e){wrapHandleUp(e)}

        parent.addEventListener("mouseup",wrapHandleUp)
        parent.addEventListener("mousemove",wrapHandleMove)
        parent.addEventListener("mouseleave",mouseLeave)
    }

    return (
        <StyledToggler 
            className={`${props.side} static`}
            ref={toggler}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleLeave}
            onClick={props.onClick}
            style={{
                ...props.style,
                top:location.current.y+"%",
                userSelect:"none" //為了讓mouseup正常觸發 https://stackoverflow.com/q/9506041
            }}
        />
    )
}


{/* <>
    <DragSideToggler
        init_x="left"
        init_y={40}
    />
    <SideBar
        init_x="right"
        init_y={40}
    />
</> */}