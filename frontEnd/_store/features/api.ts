"use client"
// Need to use the React-specific entry point to import createApi
import {skipToken, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {InitMaskParam} from "../type"


// let baseQuery = fetchBaseQuery({ baseUrl:`http://localhost:5000`}) //test usage
let baseQuery = fetchBaseQuery()

// Define a service using a base URL and expected endpoints
const processApi = createApi({
    reducerPath: 'processApi',
    baseQuery: (args,api,extraOptions)=>baseQuery(args,api,extraOptions),
    tagTypes: ['InitMask', 'PostedMask'],
    endpoints: (builder) => ({
        genInitMask: builder.query<File|undefined, InitMaskParam>({
            keepUnusedDataFor:0,
            providesTags:(result, error, arg) =>[{type:'InitMask',id:arg.rawImage.id}],
            queryFn: (args,api,extraOptions,baseQuery) => {
                if(args.model){
                    console.log("send query")
                    let form = new FormData()
                    form.append("model",args.model)
                    form.append("content",args.rawImage.content)
                    form.append("modelArgs",args.modelArgs?JSON.stringify(args.modelArgs):"{}")
                    form.append("alphaEstimate",JSON.stringify(args.alphaEstimate??false)) 
                    return baseQuery({
                        url: `/api/init_mask/`,
                        method: 'POST',
                        body:form,
                        formData:true,
                        responseHandler:(r:Response)=>r.blob()
                    })
                }else{
                    //for subscribe cache usage
                    return {data:null,}
                }
            },
            // query: (args) => {
            //     console.log("start query")
            //     let form = new FormData()
            //     form.append("model",args.model)
            //     form.append("content",args.rawImage.content)
            //     form.append("modelArgs",JSON.stringify(args.modelArgs))
            //     return {
            //         url: `/init_mask/`,
            //         method: 'POST',
            //         body:form,
            //         formData:true,
            //         responseHandler:(r:Response)=>r.blob()
            //     }
            // },
            serializeQueryArgs:({queryArgs,endpointName})=>{
                if (queryArgs!==skipToken){
                    return endpointName+queryArgs.rawImage.id
                }else{
                    return skipToken
                }
            },

        })
    }),
})




// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { genInitMask } = processApi.endpoints
export default processApi