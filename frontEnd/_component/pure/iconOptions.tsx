import styled from "styled-components"
import React from "react"


export const StyledIconOptionGroup = styled.div`
    width:min-content;
    display: inline-flex;
    user-select: none;
    flex-direction: row;
`


const StyledIconRadio = styled.label`
    cursor: pointer;
    padding: 2px;
    filter:drop-shadow(1px 1px 3px rgb(190 190 190));
    &:first-child{
        border-radius:5px 0 0 5px ;
        >img{
            border-radius:5px 0 0 5px ;
        }

    }
    &:last-child{
        border-radius:0 5px 5px 0;
        >img{
            border-radius:0 5px 5px 0;
        }
    }

    >img{
        display: block;
        height: 100%;
        margin:auto;
        object-fit: contain;
        object-position: center;
    }

    >input{
        display: none;
        margin:0;
        appearance: none;
    }

`

function IconOption(props:{
    checked:boolean,
    name:string,
    value:string,
    type:"radio"|"checkbox",
    iconSrc:string,
    iconSize?:number,
    style?:React.CSSProperties,
}){
    return (
        <StyledIconRadio
            style={{
                backgroundColor: props.checked?
                    "var(--tab-cotnent-color-darken)":
                    "var(--tab-cotnent-color)"
                ,
                ...props.style
            }}
        >
            <input type={props.type} name={props.name} value={props.value} checked={props.checked}/>
            <img 
                src={props.iconSrc}
                style={{
                    width: (props.iconSize || 70) + "%"
                }}
            />
        </StyledIconRadio>
    )
}



export function IconOptionGroup(props:{
    name:string,
    selected:string|string[],
    children:React.ReactElement<Parameters<Option>[0],Option>[]
    onChange?:React.ChangeEventHandler<HTMLInputElement>
}){
    let optType:"radio"|"checkbox" = Array.isArray(props.selected)?"checkbox":"radio"

    return (
        <StyledIconOptionGroup onChange={props.onChange}>
        {
            props.children.map(
                (opt)=>{
                    let checked = optType=="radio"?
                        opt.props.value==props.selected:
                        props.selected.includes(opt.props.value)

                    return(
                        <IconOption
                            {...opt.props}
                            key = {opt.props.value}
                            name = {props.name}
                            type = {optType}
                            checked = {checked}
                        />
                    )
                }
            )
        }
        </StyledIconOptionGroup>
    )

}



export const Option = "option" as Option
export type Option = (props:{
    value:string,
    iconSrc:string,
    iconSize?:number,
    style?:React.CSSProperties,
})=>React.ReactElement
