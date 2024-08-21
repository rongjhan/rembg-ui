"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[753],{8753:function(e,t,r){r.r(t),r.d(t,{default:function(){return E}});var n=r(7437),i=r(2265),o=r(828),a=r(7290),l=r(66),s=r(4277),u=r(2669),c=r(1852);let d=s.ZP.div.withConfig({componentId:"sc-356f2674-0"})(["--radius:50%;position:absolute;background-color:hsl(215,70%,91%);width:55px;aspect-ratio:1;border-radius:var(--radius);&:active{width:50px;cursor:grabbing;}&:hover{cursor:grabbing;}&.right{right:0;&.static{border-radius:var(--radius) 0 0 var(--radius);transform:translateX(40%);}}&.left{left:0;&.static{border-radius:0 var(--radius) var(--radius) 0;transform:translateX(-40%);}}"]);function h(e){let t=(0,i.useRef)(),r=(0,i.useRef)({x:e.side,y:e.init_y}),o=(0,i.useRef)(!1),a=(0,i.useRef)(!1),l=n=>{if(o.current&&a.current){o.current=!1,a.current=!1;let i=t.current,l=i.offsetParent,s=(null==l?void 0:l.clientHeight)-i.offsetHeight,u=n.clientX>(null==l?void 0:l.clientWidth)/2?"right":"left";i.style.transform="",null==i||i.classList.add("static"),"right"==u?(r.current.x="right",null==i||i.classList.replace("left","right")):(r.current.x="left",null==i||i.classList.replace("right","left"));let c=Math.max(Math.min(n.clientY-(null==l?void 0:l.getBoundingClientRect().top),s),0);r.current.y=100*c/(null==l?void 0:l.clientHeight),i.style.top="".concat(r.current.y,"%"),e.onChangeSide&&e.onChangeSide(u)}},s=e=>{if(o.current){let n=t.current,i=n.offsetParent,{left:o,top:l}=i.getBoundingClientRect(),s="right"==r.current.x?i.clientWidth-n.offsetWidth:0,u=r.current.y*i.clientHeight/100,c=e.clientX-o-s,d=e.clientY-l-u;if(a.current){a.current=!0,null==n||n.classList.remove("static");let e=(null==i?void 0:i.clientWidth)-s-(null==n?void 0:n.offsetWidth),t=(null==i?void 0:i.clientHeight)-u-(null==n?void 0:n.offsetHeight);n.style.transform="translate(".concat(Math.max(Math.min(c,e),-s),"px, ").concat(Math.max(Math.min(d,t),-u),"px)")}}};return(0,n.jsx)(d,{className:"".concat(e.side," static"),ref:t,onMouseDown:e=>{o.current=!0;let r=t.current.offsetParent,n=function(e){s(e)},i=function(e){l(e),r.removeEventListener("mouseup",i),r.removeEventListener("mousemove",n),r.removeEventListener("mouseleave",a)},a=function(e){i(e)};r.addEventListener("mouseup",i),r.addEventListener("mousemove",n),r.addEventListener("mouseleave",a)},onMouseLeave:e=>{o.current&&(a.current=!0)},onClick:e.onClick,style:{...e.style,top:r.current.y+"%",userSelect:"none"}})}let f=s.ZP.div.withConfig({componentId:"sc-1d64f64e-0"})(["position:absolute;top:0;height:100%;width:150px;display:flex;flex-direction:column;align-items:stretch;background-color:#f9f9f9;filter:drop-shadow(2px 4px 6px gray);"]),g=(0,s.ZP)(c.h).withConfig({componentId:"sc-1d64f64e-1"})(["aspect-ratio:1;height:100%;border-radius:5px;background-color:white;filter:drop-shadow(0px 0px 1px gray);&:active{background-color:#f6f6f6;}"]);function m(e){let t=(0,o.I0)(),r=(0,o.v9)(e=>e.cutouts.cutouts),[l,s]=i.useState(!1),[d,m]=i.useState("right");return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(h,{side:d,init_y:50,onClick:e=>{s(!l)},onChangeSide:e=>{m(e)}}),(0,n.jsxs)(f,{style:{transform:l?"none":"scaleX(0)",left:"left"==d?0:"auto",right:"right"==d?0:"auto"},children:[(0,n.jsx)(c.h,{style:{position:"absolute",top:5,left:"left"==d?"100%":"auto",right:"right"==d?"100%":"auto",height:50,width:20,transform:"rotate(".concat("right"==d?-180:0,"deg)")},src:"/left_arrow.svg",iconSize:"50%",onClick:e=>{s(!l)}}),(0,n.jsx)("div",{style:{flexGrow:1,scrollbarWidth:"none",overflowY:"auto"},children:r.map(e=>(0,n.jsx)(u.Z,{style:{height:90},src:e.blobURL,onDelete:()=>t((0,a.R6)(e))},e.id))}),(0,n.jsxs)("div",{style:{height:40,padding:5,display:"inline-flex",columnGap:5,boxShadow:"rgb(160 160 160) 0px 0px 2px"},children:[(0,n.jsx)(g,{src:"/download.svg",iconSize:"60%",onClick:()=>t((0,a.o4)())}),(0,n.jsx)(g,{src:"/clear.svg",iconSize:"60%",onClick:()=>t((0,a.jW)())})]})]})]})}var w=r(8893),p=r(6176),y=r(8823);function v(e){let t=(0,o.I0)(),[,{value:r}]=(0,w.A)("runTimes");r=parseInt(r);let[,{value:n}]=(0,w.A)("model"),[,{value:a}]=(0,w.A)("alphaEstimate"),[s,{isFetching:u}]=p.E.useLazyQuery();(0,i.useEffect)(()=>{if(r>0){let i="function"==typeof e?e({model:n,alphaEstimate:a}):e;s({model:y.Hn[n],alphaEstimate:a,...i}),t((0,l.t1)(r-1))}},[r])}var x=r(1520),b=r(2963),k=r(2151);let I=(0,i.forwardRef)(function(e,t){let{children:r,style:o,onKeyPress:a,...l}=e,s=Object.keys(l).length>0,u=i.useRef(),c=i.useRef(!1),[d,h]=i.useState({width:0,height:0});(0,i.useImperativeHandle)(t,()=>u.current,[u.current]);let f=()=>{var e;let t;if(t=null===(e=u.current)||void 0===e?void 0:e.getStage()){let e=t.width(),r=t.height();0===e&&0===r?setTimeout(f,100):h({width:e,height:r})}};return i.useEffect(()=>{s&&f()},[s]),i.useEffect(()=>{o&&(u.current.canvas._canvas.style.opacity=o.opacity,u.current.canvas._canvas.style.cursor=o.cursor)},[o]),i.useEffect(()=>{if(a){let e=u.current.parent.container(),t=t=>{if(!c.current&&a){let r=a(t);c.current=r(t);let n=t=>{r(t)||(c.current=!1,e.removeEventListener("keyup",n))};e.addEventListener("keyup",n)}};return e.addEventListener("keydown",t),()=>{e.removeEventListener("keydown",t)}}},[a]),(0,n.jsxs)(b.mh,{ref:u,...l,children:[s?(0,n.jsx)(b.UL,{x:0,y:0,...d,fill:"transparent",stroke:"transparent"}):null,r]})});var L=r(8296);let R=(0,i.forwardRef)(function(e,t){var r;let{src:o,className:a,style:l,children:s,...u}=e,[c,d,h,f]=function(e,t,r){let[n,o]=function(e,t,r){let n=i.useRef("loading"),o=i.useRef(),[a,l]=i.useState(0),s=i.useRef(),u=i.useRef(),c=i.useRef();return(s.current!==e||u.current!==t||c.current!==r)&&(n.current="loading",o.current=void 0,s.current=e,u.current=t,c.current=r),i.useLayoutEffect(function(){if(e){var i=document.createElement("img");return i.addEventListener("load",a),i.addEventListener("error",s),t&&(i.crossOrigin=t),r&&(i.referrerPolicy=r),i.src=e,function(){i.removeEventListener("load",a),i.removeEventListener("error",s)}}function a(){n.current="loaded",o.current=i,l(Math.random())}function s(){n.current="failed",o.current=void 0,l(Math.random())}},[e,t,r]),[o.current,n.current]}(e),{target:a,size:l}=(0,L.Z)(),s=i.useMemo(()=>{if(!n||!l)return[0,0];{let e=n.naturalWidth/n.naturalHeight;return e>=l.width/l.height?[l.width,l.width/e]:[l.height*e,l.height]}},[n,null==l?void 0:l.width,null==l?void 0:l.height]);return[n,o,a,s]}(o),g=(0,i.useRef)(null);(0,i.useImperativeHandle)(t,()=>g.current,[g.current]),(0,i.useLayoutEffect)(()=>{var e;h.current=null===(e=g.current)||void 0===e?void 0:e.container()},[null===(r=g.current)||void 0===r?void 0:r.container()]);let m=(0,i.useCallback)(e=>{var t;let r=e.currentTarget.content,n=/(?:scale\()([+-]?(\d*[.])?\d+)(?:\))/,i=parseFloat((null!==(t=n.exec(r.style.transform))&&void 0!==t?t:[null,"1"])[1]),o="".concat(e.evt.offsetX,"px ").concat(e.evt.offsetY,"px");r.style.transformOrigin=o;let a=Math.min(Math.max(1,i-e.evt.deltaY/1e3),4);r.style.transform.search(n)>=0?r.style.transform=r.style.transform.replace(n,"scale(".concat(a,")")):r.style.transform+="scale(".concat(a,")"),e.evt.preventDefault(),e.evt.stopPropagation()},[]);return(0,n.jsxs)(b.Hf,{tabIndex:0,ref:g,style:{...l,display:"flex",justifyContent:"center",alignItems:"center",overflow:"hidden"},className:a,width:f[0],height:f[1],...u,onWheel:m,children:[(0,n.jsx)(I,{style:e.layerStyle,children:c?(0,n.jsx)(b.Ee,{Zindex:"123",image:c,width:f[0],height:f[1]}):null}),s&&s(f[0],f[1])]})}),j=s.ZP.div.withConfig({componentId:"sc-407c8454-0"})(['display:flex;flex-grow:1;flex-wrap:wrap;overflow:hidden;scrollbar-width:"none";position:relative;overflow-x:clip;background-color:#fff;column-gap:5px;']),S=(0,s.ZP)(R).withConfig({componentId:"sc-407c8454-1"})(["height:100%;flex-basis:0px;border-radius:3px;flex-grow:1;position:relative;"]);function E(e){let[,{value:t}]=(0,w.A)("stage"),[,{value:r}]=(0,w.A)("imageID"),a=(0,o.v9)(e=>e.rawImages.images.find(e=>e.id===r));return(0,n.jsxs)(j,{style:e.style,children:[(0,n.jsx)(i.Fragment,{children:a?"init"===t?(0,n.jsx)(M,{rawImg:a}):(0,n.jsx)(_,{rawImg:a}):null},null==a?void 0:a.id),(0,n.jsx)(m,{})]})}function C(e){let[t,r]=i.useState();return(0,i.useEffect)(()=>{(0,x.OI)(e.mask).then(e=>{r(e)})},[e.mask]),(0,n.jsx)(I,{style:e.style,children:t?(0,n.jsx)(b.Ee,{image:t,width:e.width,height:e.height}):null})}function M(e){let[t,{value:r}]=(0,w.A)("markStyle"),{data:o,isFetching:a}=p.E.useQuery({rawImage:e.rawImg}),[,{value:l}]=(0,w.A)("initLayer"),s=(0,i.useRef)(null);return(0,i.useEffect)(()=>{var e;let t=null===(e=s.current)||void 0===e?void 0:e.content;a?null==t||t.classList.add("isFetching"):null==t||t.classList.remove("isFetching")},[a]),(0,n.jsx)(S,{ref:s,src:e.rawImg.blobURL,layerStyle:{opacity:l.includes("rawImg")?"1":"0"},children:(i,a)=>{let s={width:i,height:a},u=[];return o&&u.push((0,n.jsx)(C,{...s,mask:o,style:{opacity:l.includes("mask")?"0.6":"0"}})),u.push(t?(0,n.jsx)(U,{...s,markStyle:r,rawImg:e.rawImg}):(0,n.jsx)(P,{rawImg:e.rawImg})),u}})}function P(e){return v({rawImage:e.rawImg}),null}function U(e){let t=i.useRef(null);v(t=>{let{model:n,alphaEstimate:i}=t,{width:o,height:l}=e.rawImg;return{rawImage:e.rawImg,modelArgs:{input_points:r.map(e=>[e.x*o,e.y*l]),input_labels:r.map(e=>"green"===e.fill?1:0),input_boxes:a?[[a.x*o,a.y*l,(a.x+a.width)*o,(a.y+a.height)*l]]:[]}}});let[r,o]=i.useState([]),[a,l]=i.useState(null);return(0,n.jsxs)(I,{style:{cursor:"include_box"===e.markStyle?"crosshair":"url('".concat("include_points"===e.markStyle?(0,k.V)(10,"#009e2dd7"):"exclude_points"===e.markStyle?(0,k.V)(10,"#ff0000d7"):"none","') 5 5,auto")},onMouseDown:r=>{let{x:n,y:i}=r.target.getStage().getPointerPosition();t.current={x:n/e.width,y:i/e.height}},onMouseUp:n=>{if(t.current&&"include_box"!==e.markStyle){let{x:t,y:i}=n.target.getStage().getPointerPosition();t/=e.width,i/=e.height,"include_points"===e.markStyle?o([...r,{x:t,y:i,fill:"green"}]):"exclude_points"===e.markStyle&&o([...r,{x:t,y:i,fill:"red"}])}t.current=null},onMouseMove:r=>{if(t.current&&"include_box"===e.markStyle){let{x:n,y:i}=r.target.getStage().getPointerPosition();n=Math.max(Math.min(n/e.width,1),0),i=Math.max(Math.min(i/e.height,1),0);let{x:o,y:a}=t.current;l({x:o,y:a,width:n-o,height:i-a})}},onMouseLeave:e=>t.current=null,onKeyPress:e=>{let t=e=>{switch(e.type){case"keydown":return e.ctrlKey&&"z"==e.key;case"keyup":return"z"!=e.key;default:return!1}};return t(e)&&o(r.slice(0,-1)),t},children:[a?(0,n.jsx)(b.UL,{x:a.x*e.width,y:a.y*e.height,width:a.width*e.width,height:a.height*e.height,fill:"transparent",stroke:"white"}):null,[...r].map(t=>(0,n.jsx)(b.Cd,{x:t.x*e.width,y:t.y*e.height,radius:5,fill:t.fill,stroke:"white"},t.x+"-"+t.y))]})}function _(e){let[t,{value:r}]=(0,w.A)("modifyTool"),[,{value:o}]=(0,w.A)("modifyToolSize"),[,{value:a}]=(0,w.A)("modifyLayer"),[l,s]=i.useState();return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(S,{src:e.rawImg.blobURL,layerStyle:{opacity:a.includes("rawImg")?"1":"0"},children:(i,a)=>{let l=[];return t&&l.push((0,n.jsx)(W,{width:i,height:a,rawImg:e.rawImg,modifyTool:r,toolSize:o,setModifyResult:s})),l}}),(0,n.jsx)(z,{rawImg:e.rawImg,mask:l})]})}function z(e){let t=(0,o.I0)(),[r,s]=i.useState(),[,{value:u}]=(0,w.A)("cutTimes");return u=parseInt(u),(0,i.useEffect)(()=>{if(e.mask){let{promise:t,resolve:r,reject:n}=Promise.withResolvers();r((0,x.ts)(e.rawImg.blobURL,e.mask)),t.then(e=>{s(URL.createObjectURL(e))})}return()=>{r&&URL.revokeObjectURL(r)}},[e.mask]),(0,i.useEffect)(()=>{u>0&&(r&&t((0,a.pz)({raw:e.rawImg,mask:r})),t((0,l.Xh)(u-1)))},[u]),(0,n.jsx)(S,{src:null!=r?r:e.rawImg.blobURL})}function W(e){let t=parseInt(e.toolSize),r=i.useRef(),o=i.useRef(!1),[,{value:a}]=(0,w.A)("modifyLayer"),[l,s]=i.useState([]),[{x:u,y:c,shown:d},h]=i.useState({x:0,y:0,shown:!1}),[f,g]=i.useState(),{data:m}=p.E.useQuery({rawImage:e.rawImg});(0,i.useEffect)(()=>{let t=document.createElement("canvas");t.width=e.rawImg.width,t.height=e.rawImg.height;let r=t.getContext("2d");m?(0,x.OI)(m).then(e=>r.drawImage(e,0,0)):(r.fillStyle="white",r.fillRect(0,0,t.width,t.height)),g(t)},[m]);let y=e=>{o.current=!1};return(0,i.useEffect)(()=>{r.current&&clearTimeout(r.current),r.current=setTimeout(()=>{if(0===l.length)m&&f.toBlob(t=>{t&&e.setModifyResult(t)});else{let t=document.createElement("canvas");t.width=e.rawImg.width,t.height=e.rawImg.height;let r=t.getContext("2d");l.forEach((e,n)=>{r.lineWidth=e.strokeWidth,r.lineCap="round",r.lineJoin="round",r.globalCompositeOperation="eraser"==e.tool?"destination-out":"source-over",r.strokeStyle="white"==e.tool?"#ffffff":"#000000",null==r||r.beginPath();for(let n=0;n<e.points.length;n+=2){let i=e.points[n]*t.width,o=e.points[n+1]*t.height;0==n?r.moveTo(i,o):r.lineTo(i,o)}null==r||r.stroke()});let n=document.createElement("canvas");n.width=e.rawImg.width,n.height=e.rawImg.height;let i=n.getContext("2d");null==i||i.drawImage(f,0,0),null==i||i.drawImage(t,0,0),null==n||n.toBlob(t=>{t&&e.setModifyResult(t)})}},600)},[f,l]),(0,n.jsxs)(n.Fragment,{children:[f?(0,n.jsx)(I,{style:{opacity:a.includes("mask")?"0.6":"0"},children:(0,n.jsx)(b.Ee,{image:f,width:e.width,height:e.height})}):null,(0,n.jsxs)(I,{style:{cursor:"url('".concat("black"===e.modifyTool?(0,k.V)(t,"gray"):"white"===e.modifyTool?(0,k.V)(t,"white"):(0,k.V)(t,"#e8e86c"),"') ").concat(t/2," ").concat(t/2,",auto")},onMouseDown:r=>{o.current=!0;let n=r.target.getStage().getPointerPosition(),i=e.rawImg.width/e.width;s([...l,{tool:e.modifyTool,strokeWidth:parseInt(t)*i,points:[n.x/e.width,n.y/e.height]}])},onMouseMove:t=>{let r=t.target.getStage().getPointerPosition();if(h({x:r.x,y:r.y,shown:!0}),o.current){let t=l[l.length-1];t.points=t.points.concat([r.x/e.width,r.y/e.height]),l.splice(l.length-1,1,t),s(l.concat())}},onMouseUp:y,onMouseEnter:e=>{h({x:u,y:c,shown:!0})},onMouseLeave:e=>{y(e),h({x:u,y:c,shown:!1})},onKeyPress:e=>{let t=e=>{switch(e.type){case"keydown":return e.ctrlKey&&"z"==e.key;case"keyup":return"z"!=e.key;default:return!1}};return t(e)&&s(l.slice(0,-1)),t},children:[l.map((t,r)=>(0,n.jsx)(b.x1,{points:t.points.map((t,r)=>r%2==0?t*e.width:t*e.height),stroke:"white"===t.tool?"#ffff":"#000",strokeWidth:t.strokeWidth/(e.rawImg.width/e.width),tension:.5,lineCap:"round",lineJoin:"round",globalCompositeOperation:"eraser"===t.tool?"destination-out":"source-over"},r)),d?(0,n.jsx)(b.Cd,{radius:t/2,x:u,y:c,stroke:"white",fill:"black"}):null]})]})}},7290:function(e,t,r){r.d(t,{R6:function(){return u},jW:function(){return c},o4:function(){return a},pz:function(){return l}});var n=r(6608),i=r(2115),o=r(2344);let a=(0,n.hg)("saveCutout",async(e,t)=>{let r=t.getState().cutouts.cutouts;if(r.length>1){let e=await window.showSaveFilePicker({startIn:"downloads",suggestedName:"cutouts.zip",types:[{description:"zipped",accept:{"application/zip":[".zip"]}}]}),t=await e.createWritable(),n=await Promise.all(r.map(function(e){let{promise:t,resolve:r}=Promise.withResolvers(),n="".concat(e.from_image,"_").concat(e.id,".png");return fetch(e.blobURL).then(async e=>{r(new File([await e.blob()],n))}),t})),i=await (0,o.RZ)(n).blob();await t.write(i),await t.close()}else{let e=r[0],t=await window.showSaveFilePicker({startIn:"downloads",suggestedName:"".concat(e.from_image,"_").concat(e.id,".png"),types:[{description:"png",accept:{"image/png":[".png"]}}]}),n=await t.createWritable(),i=await fetch(e.blobURL).then(async e=>await e.blob());await n.write(i),await n.close()}}),l=(0,n.hg)("addCutout",async(e,t)=>{let r;return r="string"==typeof e.mask?await fetch(e.mask).then(async e=>await e.blob()):e.mask,{id:crypto.randomUUID(),from_image:e.raw.fileHandle.name,blobURL:URL.createObjectURL(r)}}),s=(0,n.oM)({name:"cutout",initialState:{cutouts:[]},reducers:{removeCutout(e,t){let r=e.cutouts.splice((0,i.Js)(e.cutouts).indexOf(t.payload),1);URL.revokeObjectURL(r[0].blobURL)},cleanAllCut:(e,t)=>(e.cutouts.forEach(e=>URL.revokeObjectURL(e.blobURL)),{cutouts:[]})},extraReducers:e=>{e.addCase(l.fulfilled,(e,t)=>{e.cutouts=e.cutouts.concat(t.payload)}),e.addCase(a.fulfilled,(e,t)=>{e.cutouts.splice(0,e.cutouts.length)})}}),{removeCutout:u,cleanAllCut:c}=s.actions;t.ZP=s}}]);