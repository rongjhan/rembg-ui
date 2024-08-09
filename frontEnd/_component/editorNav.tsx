"use client"
import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useFormItem } from "../_hook/useFormItem"
import type { State } from '@/_store/store';
import type { RawImage } from '@/_store/type';
import { loadImage } from "@/_store/features/editor"
import { removeImage } from '@/_store/features/images';
import { HWheelBox } from "./pure/WheelBox"
import ImgCard from "./pure/imgCard"
import ToolTab from "./configTab"
import { FileSelector } from '@/_component/config';
import { genInitMask } from '@/_store/features/api';


function SubscribeImgCard(props:Parameters<typeof ImgCard>[0]&{img:RawImage}) {
    
    const {refetch} = genInitMask.useQuerySubscription({rawImage:props.img})

    return (
        <ImgCard {...props}/>
    )
}


export  function EditorNav(props:{style?:React.CSSProperties}) {
    let dispatch = useDispatch()
    let images = useSelector((state: State) => state.rawImages.images)
    let [_, { value: show }] = useFormItem("showImages")
    return (
        <div style={{ ...props.style,display: "flex", width: "100%"}}>
            <ToolTab style={{ flexGrow: 1 }}></ToolTab>
            <FileSelector />
            <HWheelBox style={{
                position: "fixed", 
                top: "var(--nav-height)" , 
                left: 0, 
                zIndex: 1,
                transform:show?"scaleY(1)":"scaleY(0)",
                transformOrigin: "top",
                width: "100%", 
                userSelect:"none",
                height:100,
                // height: "var(--nav-height)", 
                transition: "transform 0.2s ease", 
                boxShadow: "0px 11px 14px -9px rgba(0,0,0,0.63)", 
                backgroundColor:"white"
            }} gap={15}>
                {
                    images.map((img) => <SubscribeImgCard
                        style={{ width: 100, height: "80%" }}
                        img={img}
                        src={img.blobURL}
                        key={img.id}
                        onClick={() => dispatch(loadImage(img.id))}
                        onDelete={() => dispatch(removeImage(img))}
                    />)
                }
            </HWheelBox>
        </div>
    )
}
