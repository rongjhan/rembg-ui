import styled from "styled-components"
import React from "react"

const IconButtonBase = styled.div`
    display: inline-flex;
    justify-content:center;
    align-items:center;
    cursor: pointer;
    user-select: none;
    background-color:var(--tab-cotnent-color);
    transition: background 0.3s;
    &:hover{
        background:var(--tab-cotnent-color-darken) radial-gradient(circle, transparent 1%, var(--tab-cotnent-color-darken) 1%) center/15000%;
    }
    &:active{
        background-color: var(--tab-cotnent-color-lighten);
        background-size: 100%;
        transition: background 0s;
        >img{
            transform:scale(0.9);
            transform-origin:50% 50%;
        }
    }
`

export function IconButton(props:{
    src:string,
    style?:React.CSSProperties,
    className?:string,
    iconSize?:string,
    onClick?:React.MouseEventHandler<HTMLElement>
}){

    let size = props.iconSize || "50%"
    return (
        <IconButtonBase style={props.style} className={props.className} onClick={props.onClick}>
            <img 
                src={props.src} 
                style={{
                    width:size,
                    aspectRatio:1,
                    objectFit:"contain",
                    cursor:"pointer"
                }}
            />
        </IconButtonBase>
    )
}