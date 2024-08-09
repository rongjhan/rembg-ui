import React, { CSSProperties } from 'react'
import ImgCard from './pure/imgCard'
import { useSelector,useDispatch } from 'react-redux'
import { saveCutout, removeCutout,cleanAllCut } from '@/_store/features/cutouts'
import { State } from '@/_store/store'
import styled from "styled-components"
import { IconButton } from './pure/button'
import { DragSideToggler } from './sideToggler'




const StyledSideBar = styled.div`
    position: absolute;
    top: 0;
    height: 100%;
    width: 150px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    background-color: #f9f9f9;
    filter: drop-shadow(2px 4px 6px gray);
`

const Button = styled(IconButton)`
    aspect-ratio: 1;
    height: 100%;
    border-radius:5px;
    background-color: white;
    filter: drop-shadow(0px 0px 1px gray);

    &:active{
        background-color: #f6f6f6;
    }
`


export function CutoutSideBar(props:{
    style?:CSSProperties,
    className?:string,
}) {
    let dispatch = useDispatch()
    let cutouts = useSelector((state: State) => state.cutouts.cutouts)
    let [show,setShow] = React.useState<boolean>(false)
    let [side,setSide] = React.useState<"left"|"right">("right")

    return (
        <>
            <DragSideToggler
                side={side}
                init_y={50}
                onClick={(e)=>{setShow(!show)}}
                onChangeSide={(side)=>{setSide(side)}}
            />
            <StyledSideBar style={{
                transform:show?"none":'scaleX(0)',
                left:side=="left"?0:"auto",
                right:side=="right"?0:"auto",
            }}>
                <IconButton 
                    style={{
                        position:"absolute",
                        top:5,
                        left:side=="left"?"100%":"auto",
                        right:side=="right"?"100%":"auto",
                        height:50,
                        width:20,
                        transform:`rotate(${side=="right"?-180:0}deg)`
                    }}
                    src='/left_arrow.svg' 
                    iconSize='50%'
                    onClick={(e)=>{setShow(!show)}}
                />

                <div style={{flexGrow:1,scrollbarWidth:"none",overflowY:"auto"}}>
                    {
                        cutouts.map((c)=>{
                            return (
                                <ImgCard 
                                    style={{height:90}}
                                    key = {c.id}
                                    src={c.blobURL}
                                    onDelete={() => dispatch(removeCutout(c))}
                                />
                            )
                        })
                    }
                </div>
                <div style={{height:40,padding:5,display:"inline-flex",columnGap:5,boxShadow:"rgb(160 160 160) 0px 0px 2px"}}>
                    <Button src='/download.svg' iconSize='60%' onClick={()=>dispatch(saveCutout())}/>
                    <Button src='/clear.svg' iconSize='60%' onClick={()=>dispatch(cleanAllCut())}/>
                </div>
            </StyledSideBar>
        </>
    )
}

