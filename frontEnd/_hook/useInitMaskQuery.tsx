import { useEffect } from 'react'
import { useFormItem } from "./useFormItem";
import { useDispatch } from "react-redux";
import { InitMaskParam } from "@/_store/type";
import { changeRunTimes } from '@/_store/features/editor';
import { genInitMask } from '@/_store/features/api';
import { Model } from '@/_store/enum';

type outSideAgs = Pick<InitMaskParam,"model"|"alphaEstimate">
type insideArgs = Pick<InitMaskParam,"rawImage"|"modelArgs">


export function useInitMaskQuery(args:insideArgs|((args:outSideAgs)=>insideArgs)) {

    let dispatch = useDispatch()
    let [, { value: times }] = useFormItem("runTimes")
    times = parseInt(times)
    let [, { value: model }] = useFormItem("model")
    let [, { value: alphaEstimate}] = useFormItem("alphaEstimate")

    let [trigger,{isFetching}] = genInitMask.useLazyQuery()

    useEffect(() => {
        if (times>0) {
            let insideArgs = typeof args == "function" ? args({model,alphaEstimate}) : args
            trigger({model:Model[model],alphaEstimate,...insideArgs})
            dispatch(changeRunTimes(times-1))
            // if (!isFetching) {
            //     let insideArgs = typeof args == "function" ? args({model,alphaEstimate}) : args
            //     trigger({model:Model[model],alphaEstimate,...insideArgs})
            // } else {
            //     dispatch(changeRunTimes(false))
            // }
        }
    }, [times])
}



