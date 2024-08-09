"use client"
import React from 'react'
import { EditorNav } from '@/_component/editorNav';
// import { EditorBody } from '@/_component/editorBody';
import dynamic from "next/dynamic";

let EditorBody = dynamic(() => import('../_component/editorBody'), { ssr: false, });


export default function Editor(){

  return (
      <div style={{display:"flex",flexDirection:"column",position:"fixed",inset:"0"}}>
        <EditorNav/>
        <EditorBody/>
      </div>
  )
}


