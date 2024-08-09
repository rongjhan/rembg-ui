import { CSSProperties, MouseEventHandler,MouseEvent } from "react"
import styled from "styled-components"

const Container = styled.div`
    --icon-size : 16px;
    --shadow-r-shift : 3px;
    --shadow-d-shift : 0px;
    --shadow-spread : 7px;
    --shadow-blur : 6px;
    --shadow-basic-margin : calc(var(--shadow-spread) + var(--shadow-blur)/2);
    --shadow-color : #eae8e8;
    border-radius: 10px;
    transform: rotate(1deg);
    contain: layout;
    cursor: pointer;
    margin-top: max(var(--shadow-basic-margin),calc((var(--icon-size)/2)));
    margin-left: var(--shadow-basic-margin);
    margin-right: calc(var(--shadow-r-shift) + var(--shadow-basic-margin));
    margin-bottom: calc(var(--shadow-d-shift) + var(--shadow-basic-margin));
    box-shadow:  var(--shadow-r-shift) var(--shadow-d-shift) var(--shadow-spread) var(--shadow-blur) var(--shadow-color);
`
const Img = styled.img`
    height: 100%;
    width:100%;
    display: block;
    object-fit: contain;
    object-position:  center center;
`
const Remove = styled.img.attrs<{onClick:MouseEventHandler<HTMLImageElement>}>(
(props)=>{
    let handler = props.onClick
    return {onClick:(e:MouseEvent)=>{e.stopPropagation();handler(e)}}
})`
    position: absolute;
    top: 0;
    right: 0;
    aspect-ratio: 1/1;
    height: var(--icon-size);
    transform: translateX(50%) translateY(-50%);
    /*background-color: #efa1a1;*/
    background-color: #805959;
    border-radius: 50%;
    cursor: pointer;
`

export default function ImgCard(props:{
    style?:CSSProperties,
    src:string,
    onClick?:MouseEventHandler<HTMLDivElement>
    onDelete?:MouseEventHandler<HTMLSpanElement>
}){
    return (
        <Container style={props.style} onClick={props.onClick}>
            <Img src={props.src}/>
            <Remove src="./cancel.svg" onClick={props.onDelete}/>
        </Container>
    )
}