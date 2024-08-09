import React from 'react'
import { useDispatch} from 'react-redux'
import { changeEditStage } from '@/_store/features/editor'
import {useFormItem} from "../_hook/useFormItem"
import styled, { CSSProperties } from 'styled-components'
import * as Conf from "./config"



export default function ToolTab(props:{style:CSSProperties}) {
    let dispatch = useDispatch()
    let [isShown,payload] = useFormItem("stage")
    return (
        <TabContainer style={props.style}>
            {isShown?(
                <>
                    <TabNav setSelected={(value)=>{dispatch(changeEditStage(value))}}>
                        {payload.options.map((t)=>{
                            return <TabTag value={t} selected={payload.value} key={t}>
                                {t=="init"?
                                    <img src="/magic-wand.png" style={{width:17}}/>:
                                    <img src="/edit.png" style={{width:18}}/>
                                }
                            </TabTag>
                        })}
                    </TabNav>
                    <TabContent value="init" selected={payload.value}>
                        <Conf.ModelSelector/>
                        <Conf.AlphaEstimateSwitch/>
                        <Conf.MarkStyleSelector/>
                        <Conf.InitLayerChooser/>
                        <Conf.RunButton/>
                    </TabContent>
                    <TabContent value="modify" selected={payload.value}>
                        <Conf.ModifyToolSelector/>
                        <Conf.ModifySizeSelector/>
                        <Conf.ModifyLayerChooser/>
                        <Conf.CutButton/>
                    </TabContent>
                </>
            ):null}
        </TabContainer>

    )
}


function TabNav(props:{setSelected:(value:string)=>void,children:JSX.Element[]}) {

    let onChange = React.useCallback((e:MouseEvent)=>{
        let tags = e.currentTarget.querySelectorAll("div[data-value]")

        for (let tag of tags){
            if (tag===e.target || tag.contains(e.target)) {
                props.setSelected(tag.getAttribute("data-value"))
                break
            }
        }
    },[])


    return (
        <StyledTabNav onClick={onChange}>
            {props.children}
        </StyledTabNav>
    )
}


const TabContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const StyledTabNav = styled.div`
    height: var(--tab-height);
    display: flex;
    position:relative;
    flex-grow: 0;
    align-items: stretch;
    background-color: var(--tab-color);
    flex-wrap: nowrap;
`

const TabTag = styled.div.attrs<{selected:string,value:string}>((props)=>{
    return{
        "data-value":props.value,
        style:{
            backgroundColor: props.selected===props.value?"var(--tab-cotnent-color)":"transparent",
            filter:"drop-shadow(rgb(190, 190, 190) 0px -3px 2px)"
        },
    }
})`
    min-width:fit-content;
    padding: 5px 10px;
    width:100px;
    cursor: pointer;
    user-select: none;
    display: flex;
    flex-grow: 0;
    align-items: center;
    justify-content: center;

    &:last-child{
        margin-right:auto;
    }
`

const TabContent = styled.div.attrs<{selected:string,value:string}>((props)=>({
    style:(props.selected!==props.value?{display:"none"}:{}),
}))`
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    width: 100%;
    height:calc(var(--nav-height) - var(--tab-height));
    background-color: var(--tab-cotnent-color);
`





