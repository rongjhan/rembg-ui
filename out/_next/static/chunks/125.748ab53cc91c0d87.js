"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[125],{2125:function(e,t,r){r.r(t),r.d(t,{default:function(){return P}});var n,i,a,o,l,s,u=r(7437),c=r(2265),d=r(828),h=r(7290),f=r(1099),g=r(4277),m=r(2669),w=r(1852);let p=g.ZP.div.withConfig({componentId:"sc-356f2674-0"})(["--radius:50%;position:absolute;background-color:hsl(215,70%,91%);width:55px;aspect-ratio:1;border-radius:var(--radius);&:active{width:50px;cursor:grabbing;}&:hover{cursor:grabbing;}&.right{right:0;&.static{border-radius:var(--radius) 0 0 var(--radius);transform:translateX(40%);}}&.left{left:0;&.static{border-radius:0 var(--radius) var(--radius) 0;transform:translateX(-40%);}}"]);function y(e){let t=(0,c.useRef)(),r=(0,c.useRef)({x:e.side,y:e.init_y}),n=(0,c.useRef)(!1),i=(0,c.useRef)(!1),a=a=>{if(n.current&&i.current){n.current=!1,i.current=!1;let o=t.current,l=o.offsetParent,s=(null==l?void 0:l.clientHeight)-o.offsetHeight,u=a.clientX>(null==l?void 0:l.clientWidth)/2?"right":"left";o.style.transform="",null==o||o.classList.add("static"),"right"==u?(r.current.x="right",null==o||o.classList.replace("left","right")):(r.current.x="left",null==o||o.classList.replace("right","left"));let c=Math.max(Math.min(a.clientY-(null==l?void 0:l.getBoundingClientRect().top),s),0);r.current.y=100*c/(null==l?void 0:l.clientHeight),o.style.top="".concat(r.current.y,"%"),e.onChangeSide&&e.onChangeSide(u)}},o=e=>{if(n.current){let n=t.current,a=n.offsetParent,{left:o,top:l}=a.getBoundingClientRect(),s="right"==r.current.x?a.clientWidth-n.offsetWidth:0,u=r.current.y*a.clientHeight/100,c=e.clientX-o-s,d=e.clientY-l-u;if(i.current){i.current=!0,null==n||n.classList.remove("static");let e=(null==a?void 0:a.clientWidth)-s-(null==n?void 0:n.offsetWidth),t=(null==a?void 0:a.clientHeight)-u-(null==n?void 0:n.offsetHeight);n.style.transform="translate(".concat(Math.max(Math.min(c,e),-s),"px, ").concat(Math.max(Math.min(d,t),-u),"px)")}}};return(0,u.jsx)(p,{className:"".concat(e.side," static"),ref:t,onMouseDown:e=>{n.current=!0;let r=t.current.offsetParent,i=function(e){o(e)},l=function(e){a(e),r.removeEventListener("mouseup",l),r.removeEventListener("mousemove",i),r.removeEventListener("mouseleave",s)},s=function(e){l(e)};r.addEventListener("mouseup",l),r.addEventListener("mousemove",i),r.addEventListener("mouseleave",s)},onMouseLeave:e=>{n.current&&(i.current=!0)},onClick:e.onClick,style:{...e.style,top:r.current.y+"%",userSelect:"none"}})}let v=g.ZP.div.withConfig({componentId:"sc-1d64f64e-0"})(["position:absolute;top:0;height:100%;width:150px;display:flex;flex-direction:column;align-items:stretch;background-color:#f9f9f9;filter:drop-shadow(2px 4px 6px gray);"]),x=(0,g.ZP)(w.h).withConfig({componentId:"sc-1d64f64e-1"})(["aspect-ratio:1;height:100%;border-radius:5px;background-color:white;filter:drop-shadow(0px 0px 1px gray);&:active{background-color:#f6f6f6;}"]);function b(e){let t=(0,d.I0)(),r=(0,d.v9)(e=>e.cutouts.cutouts),[n,i]=c.useState(!1),[a,o]=c.useState("right");return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(y,{side:a,init_y:50,onClick:e=>{i(!n)},onChangeSide:e=>{o(e)}}),(0,u.jsxs)(v,{style:{transform:n?"none":"scaleX(0)",left:"left"==a?0:"auto",right:"right"==a?0:"auto"},children:[(0,u.jsx)(w.h,{style:{position:"absolute",top:5,left:"left"==a?"100%":"auto",right:"right"==a?"100%":"auto",height:50,width:20,transform:"rotate(".concat("right"==a?-180:0,"deg)")},src:"/left_arrow.svg",iconSize:"50%",onClick:e=>{i(!n)}}),(0,u.jsx)("div",{style:{flexGrow:1,scrollbarWidth:"none",overflowY:"auto"},children:r.map(e=>(0,u.jsx)(m.Z,{style:{height:90},src:e.blobURL,onDelete:()=>t((0,h.R6)(e))},e.id))}),(0,u.jsxs)("div",{style:{height:40,padding:5,display:"inline-flex",columnGap:5,boxShadow:"rgb(160 160 160) 0px 0px 2px"},children:[(0,u.jsx)(x,{src:"/download.svg",iconSize:"60%",onClick:()=>t((0,h.o4)())}),(0,u.jsx)(x,{src:"/clear.svg",iconSize:"60%",onClick:()=>t((0,h.jW)())})]})]})]})}var k=r(8893),I=r(6176);function S(e){let t=(0,d.I0)(),[,{value:r}]=(0,k.A)("runTimes");r=parseInt(r);let[,{value:n}]=(0,k.A)("model"),[,{value:i}]=(0,k.A)("alphaEstimate"),[a,{isFetching:l}]=I.E.useLazyQuery();(0,c.useEffect)(()=>{if(r>0){let l="function"==typeof e?e({model:n,alphaEstimate:i}):e;a({model:o[n],alphaEstimate:i,...l}),t((0,f.t1)(r-1))}},[r])}(n=o||(o={})).ISNET="isnet-general-use",n.ISNET_ANIME="isnet-anime",n.U2NET="u2net",n.U2NET_HUMAN_SEG="u2net_human_seg",n.U2NET_CLOTH_SEG="u2net_cloth_seg",n.SILUETA="silueta",n.SAM_BASE="sam_base",n.SAM_LARGE="sam_large",n.SAM_HUGE="sam_huge",(i=l||(l={})).IN_POINTS="include_points",i.EX_POINTS="exclude_points",i.IN_BOX="include_box",(a=s||(s={})).DRAW="draw",a.Eraser="eraser";var E=r(1520),L=r(2963),R=r(2151);let j=(0,c.forwardRef)(function(e,t){let{children:r,style:n,onKeyPress:i,...a}=e,o=Object.keys(a).length>0,l=c.useRef(),s=c.useRef(!1),[d,h]=c.useState({width:0,height:0});(0,c.useImperativeHandle)(t,()=>l.current,[l.current]);let f=()=>{var e;let t;if(t=null===(e=l.current)||void 0===e?void 0:e.getStage()){let e=t.width(),r=t.height();0===e&&0===r?setTimeout(f,100):h({width:e,height:r})}};return c.useEffect(()=>{o&&f()},[o]),c.useEffect(()=>{n&&(l.current.canvas._canvas.style.opacity=n.opacity,l.current.canvas._canvas.style.cursor=n.cursor)},[n]),c.useEffect(()=>{if(i){let e=l.current.parent.container(),t=t=>{if(!s.current&&i){let r=i(t);s.current=r(t);let n=t=>{r(t)||(s.current=!1,e.removeEventListener("keyup",n))};e.addEventListener("keyup",n)}};return e.addEventListener("keydown",t),()=>{e.removeEventListener("keydown",t)}}},[i]),(0,u.jsxs)(L.mh,{ref:l,...a,children:[o?(0,u.jsx)(L.UL,{x:0,y:0,...d,fill:"transparent",stroke:"transparent"}):null,r]})});var _=r(8296);let M=(0,c.forwardRef)(function(e,t){var r;let{src:n,className:i,style:a,children:o,...l}=e,[s,d,h,f]=function(e,t,r){let[n,i]=function(e,t,r){let n=c.useRef("loading"),i=c.useRef(),[a,o]=c.useState(0),l=c.useRef(),s=c.useRef(),u=c.useRef();return(l.current!==e||s.current!==t||u.current!==r)&&(n.current="loading",i.current=void 0,l.current=e,s.current=t,u.current=r),c.useLayoutEffect(function(){if(e){var a=document.createElement("img");return a.addEventListener("load",l),a.addEventListener("error",s),t&&(a.crossOrigin=t),r&&(a.referrerPolicy=r),a.src=e,function(){a.removeEventListener("load",l),a.removeEventListener("error",s)}}function l(){n.current="loaded",i.current=a,o(Math.random())}function s(){n.current="failed",i.current=void 0,o(Math.random())}},[e,t,r]),[i.current,n.current]}(e),{target:a,size:o}=(0,_.Z)(),l=c.useMemo(()=>{if(!n||!o)return[0,0];{let e=n.naturalWidth/n.naturalHeight;return e>=o.width/o.height?[o.width,o.width/e]:[o.height*e,o.height]}},[n,null==o?void 0:o.width,null==o?void 0:o.height]);return[n,i,a,l]}(n),g=(0,c.useRef)(null);(0,c.useImperativeHandle)(t,()=>g.current,[g.current]),(0,c.useLayoutEffect)(()=>{var e;h.current=null===(e=g.current)||void 0===e?void 0:e.container()},[null===(r=g.current)||void 0===r?void 0:r.container()]);let m=(0,c.useCallback)(e=>{var t;let r=e.currentTarget.content,n=/(?:scale\()([+-]?(\d*[.])?\d+)(?:\))/,i=parseFloat((null!==(t=n.exec(r.style.transform))&&void 0!==t?t:[null,"1"])[1]),a="".concat(e.evt.offsetX,"px ").concat(e.evt.offsetY,"px");r.style.transformOrigin=a;let o=Math.min(Math.max(1,i-e.evt.deltaY/1e3),4);r.style.transform.search(n)>=0?r.style.transform=r.style.transform.replace(n,"scale(".concat(o,")")):r.style.transform+="scale(".concat(o,")"),e.evt.preventDefault(),e.evt.stopPropagation()},[]);return(0,u.jsxs)(L.Hf,{tabIndex:0,ref:g,style:{...a,display:"flex",justifyContent:"center",alignItems:"center",overflow:"hidden"},className:i,width:f[0],height:f[1],...l,onWheel:m,children:[(0,u.jsx)(j,{style:e.layerStyle,children:s?(0,u.jsx)(L.Ee,{Zindex:"123",image:s,width:f[0],height:f[1]}):null}),o&&o(f[0],f[1])]})}),C=g.ZP.div.withConfig({componentId:"sc-26e9ef3-0"})(['display:flex;flex-grow:1;flex-wrap:wrap;overflow:hidden;scrollbar-width:"none";position:relative;overflow-x:clip;background-color:#fff;column-gap:5px;']),U=(0,g.ZP)(M).withConfig({componentId:"sc-26e9ef3-1"})(["height:100%;flex-basis:0px;border-radius:3px;flex-grow:1;position:relative;"]);function P(e){let[,{value:t}]=(0,k.A)("stage"),[,{value:r}]=(0,k.A)("imageID"),n=(0,d.v9)(e=>e.rawImages.images.find(e=>e.id===r));return(0,u.jsxs)(C,{style:e.style,children:[(0,u.jsx)(c.Fragment,{children:n?"init"===t?(0,u.jsx)(T,{rawImg:n}):(0,u.jsx)(N,{rawImg:n}):null},null==n?void 0:n.id),(0,u.jsx)(b,{})]})}function A(e){let[t,r]=c.useState();return(0,c.useEffect)(()=>{(0,E.OI)(e.mask).then(e=>{r(e)})},[e.mask]),(0,u.jsx)(j,{style:e.style,children:t?(0,u.jsx)(L.Ee,{image:t,width:e.width,height:e.height}):null})}function T(e){let[t,{value:r}]=(0,k.A)("markStyle"),{data:n,isFetching:i}=I.E.useQuery({rawImage:e.rawImg}),[,{value:a}]=(0,k.A)("initLayer"),o=(0,c.useRef)(null);return(0,c.useEffect)(()=>{var e;let t=null===(e=o.current)||void 0===e?void 0:e.content;i?null==t||t.classList.add("isFetching"):null==t||t.classList.remove("isFetching")},[i]),(0,u.jsx)(U,{ref:o,src:e.rawImg.blobURL,layerStyle:{opacity:a.includes("rawImg")?"1":"0"},children:(i,o)=>{let l={width:i,height:o},s=[];return n&&s.push((0,u.jsx)(A,{...l,mask:n,style:{opacity:a.includes("mask")?"0.6":"0"}})),s.push(t?(0,u.jsx)(W,{...l,markStyle:r,rawImg:e.rawImg}):(0,u.jsx)(z,{rawImg:e.rawImg})),s}})}function z(e){return S({rawImage:e.rawImg}),null}function W(e){let t=c.useRef(null);S(t=>{let{model:n,alphaEstimate:a}=t,{width:o,height:l}=e.rawImg;return{rawImage:e.rawImg,modelArgs:{input_points:r.map(e=>[e.x*o,e.y*l]),input_labels:r.map(e=>"green"===e.fill?1:0),input_boxes:i?[[i.x*o,i.y*l,(i.x+i.width)*o,(i.y+i.height)*l]]:[]}}});let[r,n]=c.useState([]),[i,a]=c.useState(null);return(0,u.jsxs)(j,{style:{cursor:"include_box"===e.markStyle?"crosshair":"url('".concat("include_points"===e.markStyle?(0,R.V)(10,"#009e2dd7"):"exclude_points"===e.markStyle?(0,R.V)(10,"#ff0000d7"):"none","') 5 5,auto")},onMouseDown:r=>{let{x:n,y:i}=r.target.getStage().getPointerPosition();t.current={x:n/e.width,y:i/e.height}},onMouseUp:i=>{if(t.current&&"include_box"!==e.markStyle){let{x:t,y:a}=i.target.getStage().getPointerPosition();t/=e.width,a/=e.height,"include_points"===e.markStyle?n([...r,{x:t,y:a,fill:"green"}]):"exclude_points"===e.markStyle&&n([...r,{x:t,y:a,fill:"red"}])}t.current=null},onMouseMove:r=>{if(t.current&&"include_box"===e.markStyle){let{x:n,y:i}=r.target.getStage().getPointerPosition();n=Math.max(Math.min(n/e.width,1),0),i=Math.max(Math.min(i/e.height,1),0);let{x:o,y:l}=t.current;a({x:o,y:l,width:n-o,height:i-l})}},onMouseLeave:e=>t.current=null,onKeyPress:e=>{let t=e=>{switch(e.type){case"keydown":return e.ctrlKey&&"z"==e.key;case"keyup":return"z"!=e.key;default:return!1}};return t(e)&&n(r.slice(0,-1)),t},children:[i?(0,u.jsx)(L.UL,{x:i.x*e.width,y:i.y*e.height,width:i.width*e.width,height:i.height*e.height,fill:"transparent",stroke:"white"}):null,[...r].map(t=>(0,u.jsx)(L.Cd,{x:t.x*e.width,y:t.y*e.height,radius:5,fill:t.fill,stroke:"white"},t.x+"-"+t.y))]})}function N(e){let[t,{value:r}]=(0,k.A)("modifyTool"),[,{value:n}]=(0,k.A)("modifyToolSize"),[,{value:i}]=(0,k.A)("modifyLayer"),[a,o]=c.useState();return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(U,{src:e.rawImg.blobURL,layerStyle:{opacity:i.includes("rawImg")?"1":"0"},children:(i,a)=>{let l=[];return t&&l.push((0,u.jsx)(H,{width:i,height:a,rawImg:e.rawImg,modifyTool:r,toolSize:n,setModifyResult:o})),l}}),(0,u.jsx)(O,{rawImg:e.rawImg,mask:a})]})}function O(e){let t=(0,d.I0)(),[r,n]=c.useState(),[,{value:i}]=(0,k.A)("cutTimes");return i=parseInt(i),(0,c.useEffect)(()=>{if(e.mask){let{promise:t,resolve:r,reject:i}=Promise.withResolvers();r((0,E.ts)(e.rawImg.blobURL,e.mask)),t.then(e=>{n(URL.createObjectURL(e))})}return()=>{r&&URL.revokeObjectURL(r)}},[e.mask]),(0,c.useEffect)(()=>{i>0&&(r&&t((0,h.pz)({raw:e.rawImg,mask:r})),t((0,f.Xh)(i-1)))},[i]),(0,u.jsx)(U,{src:null!=r?r:e.rawImg.blobURL})}function H(e){let t=parseInt(e.toolSize),r=c.useRef(),n=c.useRef(!1),[,{value:i}]=(0,k.A)("modifyLayer"),[a,o]=c.useState([]),[{x:l,y:s,shown:d},h]=c.useState({x:0,y:0,shown:!1}),[f,g]=c.useState(),{data:m}=I.E.useQuery({rawImage:e.rawImg});(0,c.useEffect)(()=>{let t=document.createElement("canvas");t.width=e.rawImg.width,t.height=e.rawImg.height;let r=t.getContext("2d");m?(0,E.OI)(m).then(e=>r.drawImage(e,0,0)):(r.fillStyle="white",r.fillRect(0,0,t.width,t.height)),g(t)},[m]);let w=e=>{n.current=!1};return(0,c.useEffect)(()=>{r.current&&clearTimeout(r.current),r.current=setTimeout(()=>{if(0===a.length)m&&f.toBlob(t=>{t&&e.setModifyResult(t)});else{let t=document.createElement("canvas");t.width=e.rawImg.width,t.height=e.rawImg.height;let r=t.getContext("2d");a.forEach((e,n)=>{r.lineWidth=e.strokeWidth,r.lineCap="round",r.lineJoin="round",r.globalCompositeOperation="eraser"==e.tool?"destination-out":"source-over",r.strokeStyle="white"==e.tool?"#ffffff":"#000000",null==r||r.beginPath();for(let n=0;n<e.points.length;n+=2){let i=e.points[n]*t.width,a=e.points[n+1]*t.height;0==n?r.moveTo(i,a):r.lineTo(i,a)}null==r||r.stroke()});let n=document.createElement("canvas");n.width=e.rawImg.width,n.height=e.rawImg.height;let i=n.getContext("2d");null==i||i.drawImage(f,0,0),null==i||i.drawImage(t,0,0),null==n||n.toBlob(t=>{t&&e.setModifyResult(t)})}},600)},[f,a]),(0,u.jsxs)(u.Fragment,{children:[f?(0,u.jsx)(j,{style:{opacity:i.includes("mask")?"0.6":"0"},children:(0,u.jsx)(L.Ee,{image:f,width:e.width,height:e.height})}):null,(0,u.jsxs)(j,{style:{cursor:"url('".concat("black"===e.modifyTool?(0,R.V)(t,"gray"):"white"===e.modifyTool?(0,R.V)(t,"white"):(0,R.V)(t,"#e8e86c"),"') ").concat(t/2," ").concat(t/2,",auto")},onMouseDown:r=>{n.current=!0;let i=r.target.getStage().getPointerPosition(),l=e.rawImg.width/e.width;o([...a,{tool:e.modifyTool,strokeWidth:parseInt(t)*l,points:[i.x/e.width,i.y/e.height]}])},onMouseMove:t=>{let r=t.target.getStage().getPointerPosition();if(h({x:r.x,y:r.y,shown:!0}),n.current){let t=a[a.length-1];t.points=t.points.concat([r.x/e.width,r.y/e.height]),a.splice(a.length-1,1,t),o(a.concat())}},onMouseUp:w,onMouseEnter:e=>{h({x:l,y:s,shown:!0})},onMouseLeave:e=>{w(e),h({x:l,y:s,shown:!1})},onKeyPress:e=>{let t=e=>{switch(e.type){case"keydown":return e.ctrlKey&&"z"==e.key;case"keyup":return"z"!=e.key;default:return!1}};return t(e)&&o(a.slice(0,-1)),t},children:[a.map((t,r)=>(0,u.jsx)(L.x1,{points:t.points.map((t,r)=>r%2==0?t*e.width:t*e.height),stroke:"white"===t.tool?"#ffff":"#000",strokeWidth:t.strokeWidth/(e.rawImg.width/e.width),tension:.5,lineCap:"round",lineJoin:"round",globalCompositeOperation:"eraser"===t.tool?"destination-out":"source-over"},r)),d?(0,u.jsx)(L.Cd,{radius:t/2,x:l,y:s,stroke:"white",fill:"black"}):null]})]})}},7290:function(e,t,r){r.d(t,{R6:function(){return u},jW:function(){return c},o4:function(){return o},pz:function(){return l}});var n=r(6608),i=r(2115),a=r(2344);let o=(0,n.hg)("saveCutout",async(e,t)=>{let r=t.getState().cutouts.cutouts;if(r.length>1){let e=await window.showSaveFilePicker({startIn:"downloads",suggestedName:"cutouts.zip",types:[{description:"zipped",accept:{"application/zip":[".zip"]}}]}),t=await e.createWritable(),n=await Promise.all(r.map(function(e){let{promise:t,resolve:r}=Promise.withResolvers(),n="".concat(e.from_image,"_").concat(e.id,".png");return fetch(e.blobURL).then(async e=>{r(new File([await e.blob()],n))}),t})),i=await (0,a.RZ)(n).blob();await t.write(i),await t.close()}else{let e=r[0],t=await window.showSaveFilePicker({startIn:"downloads",suggestedName:"".concat(e.from_image,"_").concat(e.id,".png"),types:[{description:"png",accept:{"image/png":[".png"]}}]}),n=await t.createWritable(),i=await fetch(e.blobURL).then(async e=>await e.blob());await n.write(i),await n.close()}}),l=(0,n.hg)("addCutout",async(e,t)=>{let r;return r="string"==typeof e.mask?await fetch(e.mask).then(async e=>await e.blob()):e.mask,{id:crypto.randomUUID(),from_image:e.raw.fileHandle.name,blobURL:URL.createObjectURL(r)}}),s=(0,n.oM)({name:"cutout",initialState:{cutouts:[]},reducers:{removeCutout(e,t){let r=e.cutouts.splice((0,i.Js)(e.cutouts).indexOf(t.payload),1);URL.revokeObjectURL(r[0].blobURL)},cleanAllCut:(e,t)=>(e.cutouts.forEach(e=>URL.revokeObjectURL(e.blobURL)),{cutouts:[]})},extraReducers:e=>{e.addCase(l.fulfilled,(e,t)=>{e.cutouts=e.cutouts.concat(t.payload)}),e.addCase(o.fulfilled,(e,t)=>{e.cutouts.splice(0,e.cutouts.length)})}}),{removeCutout:u,cleanAllCut:c}=s.actions;t.ZP=s}}]);