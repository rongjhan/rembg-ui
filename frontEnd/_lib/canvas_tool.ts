import { ImgSrc } from "@/_store/type"

export async function getLoadedImageObj(imgSrc: ImgSrc): Promise<HTMLImageElement> {
    let { promise: loadPromise, resolve } = Promise.withResolvers()

    let imgObject = new Image()
    imgObject.onload = function () { resolve("success") }

    if (typeof imgSrc === "string") {
        imgObject.src = imgSrc
    } else if (imgSrc instanceof HTMLImageElement) {
        imgObject.src = imgSrc.src
    } else if (imgSrc instanceof Blob) {
        imgObject.src = URL.createObjectURL(imgSrc)
    }

    await loadPromise

    if (imgSrc instanceof Blob) {
        URL.revokeObjectURL(imgObject.src)
    }

    return imgObject
}


export async function getImageData(imgSrc: ImgSrc): Promise<ImageData> {
    let imgObject = await getLoadedImageObj(imgSrc)

    let canvas = document.createElement("canvas")
    canvas.width = imgObject.naturalWidth
    canvas.height = imgObject.naturalHeight

    let ctx = canvas.getContext("2d")
    ctx.drawImage(imgObject, 0, 0)

    return ctx.getImageData(0, 0, canvas.width, canvas.height)

}

export function imageDataToImg(imagedata:ImageData) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx.putImageData(imagedata, 0, 0);

    var image = new Image();
    image.src = canvas.toDataURL();
    return image;
}

export async function resizeImageData(imageData: ImageData, width: number, height: number) {
    //參考實現 : https://gist.github.com/mauriciomassaia/b9e7ef6667a622b104c00249f77f8c03
    const resizeWidth = width >> 0
    const resizeHeight = height >> 0
    console.log(resizeWidth / imageData.width, resizeHeight / imageData.height)
    const ibm = await window.createImageBitmap(imageData, 0, 0, imageData.width, imageData.height, {
        resizeWidth, resizeHeight
    })
    const canvas = document.createElement('canvas')
    canvas.width = resizeWidth
    canvas.height = resizeHeight
    const ctx = canvas.getContext('2d')
    ctx.scale(resizeWidth / imageData.width, resizeHeight / imageData.height)
    ctx.drawImage(ibm, 0, 0)
    return ctx.getImageData(0, 0, resizeWidth, resizeHeight)
}


export async function toColorMask(imgSrc: ImgSrc): Promise<ImageData> {
    let maskData = await getImageData(imgSrc)
    let newMask = new ImageData(maskData.width, maskData.height)

    for (let i = 0; i < maskData.data.length; i += 4) {
        let alpha = maskData.data[i + 3]

        if (alpha > 250) {
            newMask.data[i] = 13
            newMask.data[i + 1] = 236
            newMask.data[i + 2] = 28
            newMask.data[i + 3] = 80
        } else {
            newMask.data[i] = 0
            newMask.data[i + 1] = 0
            newMask.data[i + 2] = 0
            newMask.data[i + 3] = 0
        }

    }
    return newMask
}

export function thresholdMask(
    maskData: ImageData,
    threshold: number,
    boundaryPoint: "upper" | "lower" = "upper"
): ImageData {

    let newMask = new ImageData(maskData.width, maskData.height)

    for (let i = 0; i < maskData.data.length; i += 4) {
        let r = maskData.data[i]
        let g = maskData.data[i + 1]
        let b = maskData.data[i + 2]
        let a = maskData.data[i + 3]


        if (r === g && g === b) {
            let condition = boundaryPoint === "upper" ? r >= threshold : r > threshold
            if (r > 0 && r < 255) { r = g = b = (condition ? 255 : 0) }
        } else {
            throw new Error("Mask is not grayscale image")
        }

        if (r + g + b === 0 || a === 0) {
            newMask.data[i + 3] = 0
        } else {
            newMask.data[i] =
                newMask.data[i + 1] =
                newMask.data[i + 2] =
                newMask.data[i + 3] = 255
        }
    }

    return newMask

}

export function stackAlphaCutout(rawImg: ImgSrc, mask: ImgSrc): Promise<Blob> {
    //stackImage
    const { promise, resolve, reject } = Promise.withResolvers<Blob>()

    Promise.all([getImageData(rawImg), getImageData(mask)]).then(
        ([rawImgData, maskData]) => {
            if (rawImgData.data.length !== maskData.data.length) {
                throw new Error("mask and image data length is not same")
            }

            let canvas = document.createElement("canvas")
            canvas.width = rawImgData.width
            canvas.height = rawImgData.height

            let ctx = canvas.getContext("2d")
            let newPic = new ImageData(canvas.width, canvas.height)
            //或 ctx.createImageData(canvas.width, canvas.height)

            for (let i = 0; i < rawImgData.data.length; i += 4) {
                newPic.data[i] = rawImgData.data[i]           //r
                newPic.data[i + 1] = rawImgData.data[i + 1]   //g
                newPic.data[i + 2] = rawImgData.data[i + 2]   //b
                newPic.data[i + 3] = maskData.data[i]     //a

            }

            ctx.putImageData(newPic, 0, 0)

            canvas.toBlob((blob) => { resolve(blob) })
        }
    )

    return promise
}

export function binarizeCutout(rawImg: ImgSrc, mask: ImgSrc, threshold = 30): Promise<Blob> {
    // let threshold = 30 // 0~255
    const { promise, resolve, reject } = Promise.withResolvers<Blob>()

    Promise.all([getLoadedImageObj(rawImg), getImageData(mask)]).then(
        ([rawImg, maskData]) => {

            let canvas = document.createElement("canvas")
            canvas.width = rawImg.naturalWidth
            canvas.height = rawImg.naturalHeight

            let ctx = canvas.getContext("2d")

            ctx.putImageData(thresholdMask(maskData, threshold), 0, 0)
            ctx.globalCompositeOperation = "source-in"
            ctx.drawImage(rawImg, 0, 0)

            canvas.toBlob((blob) => { resolve(blob) })
        }
    )

    return promise
}


let defaultCutout = binarizeCutout
export default defaultCutout 