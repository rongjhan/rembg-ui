"use client"
import { CSSProperties, useEffect } from "react";
import useResizeObserver from "@/_hook/useResizeObserver";
import styled from "styled-components";


const ScrollBox = styled.div`
    &::-webkit-scrollbar{
        display: none;
    }
    scrollbar-width: none;
    width:var(--width);
    height:var(--height);
    overflow:auto;
    transform-origin:left top;
    transform:translateY(var(--width)) rotate(-90deg);
    position: relative;
    padding:10px 0px;
`
const ContentBox = styled.div<{$columnGap:number}>`
    width:var(--height);
    height:var(--width);
    transform-origin:left top;
    transform: rotate(90deg);
    position: absolute;
    top:0px;
    left:var(--width);
    display: flex;
    flex-wrap: nowrap;
    align-items: stretch;

    column-gap: ${props=>props.$columnGap}px;
    &::after{
        content:"";
        display: block;
        padding-right:1px;
    }
    &>*{
        box-sizing: border-box;
        max-height: 90%;
        flex-shrink: 0;
        flex-grow: 0;
    }
`

export function HWheelBox(props:{
    style?:CSSProperties,
    children?:React.ReactNode,
    gap:number,
    className?:string
}) {
    //參考實現 : https://www.bilibili.com/video/BV1Nf421R7jA/?spm_id_from=333.1007.top_right_bar_window_history.content.click
    let {target,size} = useResizeObserver()


    return (
        <div ref={target} className={props.className} style={{...props.style}}>
            <ScrollBox style={{
                "--width":size?.height+"px",
                "--height":size?.width+"px"
            }}>
                <ContentBox $columnGap={props.gap}>
                    {props.children}
                </ContentBox>
            </ScrollBox>
        </div>
    )
    

}







