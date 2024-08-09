import {State} from "../_store/store"
import {findFieldByName,FormItem} from "../_lib/form_tool"
import {useSelector} from 'react-redux'

type InvalidInfo = [false,FormItem["payload"]]
type FormItemInfo = [true,FormItem["payload"]]


export function useFormItem(formItemName:string):FormItemInfo| InvalidInfo{
    let payload= useSelector((state:State) => {
        let formItem = findFieldByName(state.editor,formItemName)
        if (formItem) {
            return [true,{...formItem.payload}] as FormItemInfo
        }
        return [false,{value:undefined}] as InvalidInfo
    },compare)

    return payload 
}


function compare(a,b){
    if (a[0]!==b[0]) {
        return false
    }else {
        if (a[0]===true) return a[1].value===b[1].value
    }
    return true
}