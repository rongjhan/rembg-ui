import {useRef,useEffect,useState} from "react";


export default function useResizeObserver(callback?:(w:Number,h:Number)=>void) {
    const [size, setSize] = useState<{width: number, height: number}>();

    const target = useRef<Element|undefined>();
    

    useEffect(() => {
        if (target.current) {        
            const resizeObserver = new ResizeObserver((entries) => {   
                const { width, height } = entries[0].contentRect;
                callback && callback(width,height);
                setSize({ width, height });
            });            
            resizeObserver.observe(target.current);
            return () => {
                resizeObserver.disconnect();
            };
        }            
    }, [target.current]);
    
    return { target, size };
}