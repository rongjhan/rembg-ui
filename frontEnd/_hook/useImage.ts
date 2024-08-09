import React, { useEffect, useLayoutEffect, useState } from 'react'
import useResizeObserver from './useResizeObserver'

type CrossOrigin = 'anonymous' | 'use-credentials' 
type ReferrerPolicy = 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url' 
type Status = 'loaded' | 'loading' | 'failed' 

export default function useImage(
    url: string,
    crossOrigin?: CrossOrigin,
    referrerpolicy?: ReferrerPolicy
): [undefined | HTMLImageElement,Status ] {
    /**
     * 此為konva.js實現
     * https://github.com/konvajs/use-image
     */
    
    // lets use refs for image and status
    // so we can update them during render
    // to have instant update in status/image when new data comes in
    const statusRef = React.useRef<Status>('loading');
    const imageRef = React.useRef<HTMLImageElement>();

    // we are not going to use token
    // but we need to just to trigger state update
    const [_, setStateToken] = React.useState(0);

    // keep track of old props to trigger changes
    const oldUrl = React.useRef<string>();
    const oldCrossOrigin = React.useRef<CrossOrigin>();
    const oldReferrerPolicy = React.useRef<ReferrerPolicy>();
    if (oldUrl.current !== url || oldCrossOrigin.current !== crossOrigin || oldReferrerPolicy.current !== referrerpolicy) {
        statusRef.current = 'loading';
        imageRef.current = undefined;
        oldUrl.current = url;
        oldCrossOrigin.current = crossOrigin;
        oldReferrerPolicy.current = referrerpolicy;
    }

    React.useLayoutEffect(
        function () {
            if (!url) return;
            var img = document.createElement('img');

            function onload() {
                statusRef.current = 'loaded';
                imageRef.current = img;
                setStateToken(Math.random());
            }

            function onerror() {
                statusRef.current = 'failed';
                imageRef.current = undefined;
                setStateToken(Math.random());
            }

            img.addEventListener('load', onload);
            img.addEventListener('error', onerror);
            crossOrigin && (img.crossOrigin = crossOrigin);
            referrerpolicy && (img.referrerPolicy = referrerpolicy);
            img.src = url;

            return function cleanup() {
                img.removeEventListener('load', onload);
                img.removeEventListener('error', onerror);
            };
        },
        [url, crossOrigin, referrerpolicy]
    );

    // return array because it is better to use in case of several useImage hooks
    // const [background, backgroundStatus] = useImage(url1);
    // const [patter] = useImage(url2);
    return [imageRef.current, statusRef.current];
};




export function useContainImage(
    url: string,
    crossOrigin?: CrossOrigin,
    referrerpolicy?: ReferrerPolicy,
):[
    undefined | HTMLImageElement,
    Status,
    React.MutableRefObject<Element | undefined>,
    [number,number]
]{
    /**
     * 在useImage上增加計算contain image需要的長寬
     */
    let [imgObj,status] = useImage(url)
    let  {target:container,size:containerSize} = useResizeObserver()
    
    let containSize = React.useMemo<[Number,Number]>(()=>{
        if (imgObj && containerSize) {
            let intrinsicRatio = imgObj.naturalWidth / imgObj.naturalHeight
            let containerRatio = containerSize.width / containerSize.height
            if (intrinsicRatio >= containerRatio) {
                return [containerSize.width, containerSize.width / intrinsicRatio]
            } else {
                return [containerSize.height * intrinsicRatio, containerSize.height]
            }
        }else{
            return [0,0]
        }
    },[imgObj,containerSize?.width,containerSize?.height])

    return [
        imgObj,
        status,
        container, 
        containSize // [containImgWidth,containImgHeight]
    ]
}