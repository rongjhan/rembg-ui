from PIL import Image
import numpy as np
from typing import Final, Optional
from pymatting.alpha.estimate_alpha_cf import estimate_alpha_cf
from pymatting.foreground.estimate_foreground_ml import estimate_foreground_ml
from pymatting.util import stack_images
from .process_log import Logger
from .basic_tool import is_binary, show_distinct_pixel,NPIMAGE
import cv2 as cv


class ForgroundEstimate:
    pass


class MaskProcessor(metaclass=Logger):
    def __init__(
        self, mask: Image.Image, raw_img: Optional[Image.Image] = None, *, log: bool = False
    ):
        if raw_img and raw_img.mode != "RGB" :
            raw_img = raw_img.convert("RGB")
            
        self.raw_img: Optional[NPIMAGE] = np.array(raw_img).astype(np.uint8) if raw_img else None
        self.origin_mask: Final[NPIMAGE] = np.array(mask).astype(np.uint8)
        self.mask: NPIMAGE = self.origin_mask  # current mask

    def gray_to_trimap(
        self, fg_threshold: int = 100, bg_threshold: int = 50
    ) -> NPIMAGE:
        """依照threshold將grayscale劃分為 前景(255) 背景(0) 和可能前景區域(127)"""
        is_fg = self.mask >= fg_threshold
        is_bg = self.mask <= bg_threshold
        is_pbfg = (self.mask < fg_threshold) & (self.mask > bg_threshold)

        trimap = np.where(is_fg, 255, self.mask).astype(np.uint8)
        trimap = np.where(is_bg, 0, self.mask).astype(np.uint8)
        trimap = np.where(is_pbfg, 127, self.mask).astype(np.uint8)

        return trimap

    def binary_to_trimap(self, erode_size: int = 10, iteration=5) -> NPIMAGE:
        """先用erode縮小 , 將縮小部分設為可能為前景區"""
        kernel = np.array([erode_size, erode_size], dtype=np.uint8)
        is_white = self.mask == 255

        erode_mask = cv.erode(self.mask, kernel, iterations=iteration)
        bg_mask = np.where(is_white, 127, self.mask)
        trimap = np.zeros(self.mask.shape, dtype=np.uint8)

        for idx, pixel in np.ndenumerate(trimap):
            if erode_mask[idx] == 255:
                trimap[idx] = 255
            elif bg_mask[idx] == 127:
                trimap[idx] = 127

        return trimap

    def remove_noise(self, kernel_size: int = 3, ) -> NPIMAGE:
        """
        基於Morphological Closing , 另外透過fincountour也是另一種實現
        若要消除的雜訊較大可以透過加大kernel_size解決 , 
        但是越大有可能反而清除到本體而非雜訊 , 須有所權衡
        """
        iteration = 1  # 此參數對最終結果影響不大
        kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, [kernel_size] * 2)
        self.mask = cv.morphologyEx(
            self.mask, cv.MORPH_OPEN, kernel, iterations=iteration
        )
        return self.mask

    def fill_hole(self, iteration=5) -> NPIMAGE:
        """
        基於Morphological Closing , 另外透過fincountour也是另一種實現
        若要補的洞較大可以透過提高iteration達成,
        但是也會讓mask圖像位移較多
        """
        kernel_size = 3  # 此參數對最終結果影響不大
        kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, [kernel_size] * 2)
        self.mask = cv.morphologyEx(
            self.mask, cv.MORPH_CLOSE, kernel, iterations=iteration
        )
        return self.mask

    def pad_mask(self, pad_size):
        pads = (pad_size,)*4
        return cv.copyMakeBorder(
            self.mask, *pads, cv.BORDER_CONSTANT, value=(0, 0, 0)
        )

    def erosion(self, kernel_size: int = 3, iteration=50):
        pad_size = 100
        pad_mask = self.pad_mask(pad_size=pad_size)
        pad_binary_mask = np.where(pad_mask >= 10, 255, 0).astype(np.uint8)
        h, w = pad_binary_mask.shape[0:2]
        kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, (kernel_size, kernel_size))
        return cv.erode(pad_binary_mask, kernel, iterations=iteration)[
            pad_size:h-pad_size, pad_size:w-pad_size
        ]

    def gen_tripmap(self):
        is_fg = self.erosion()
        is_pbfg = np.where(self.mask >= 10, 127, 0)
        return np.where(is_fg == 255, is_fg, is_pbfg)

    def alpha_estimate(self, trimap=None) -> NPIMAGE:
        """參考 from rembg.bg import alpha_matting_cutout 實作"""

        if self.raw_img is None:
            raise ValueError("raw_img is not been set yet")

        if trimap is None:
            # trimap = self.mask
            trimap = self.gen_tripmap()
            # trimap = (
            #     self.binary_to_trimap()
            #     if is_binary(self.mask)
            #     else self.gray_to_trimap()
            # )

        img_normalized = self.raw_img / 255.0
        trimap_normalized = trimap / 255.0
        alpha = estimate_alpha_cf(img_normalized, trimap_normalized)
        
        self.mask = np.clip(alpha * 255, 0, 255).astype(np.uint8)

        # 以下為了比較forground esitmate有無的差異
        # foreground = estimate_foreground_ml(img_normalized, alpha)
        # print("foreground.shape",foreground.shape)

        # cutout1 = stack_images(img_normalized, alpha)
        # cutout2 = stack_images(foreground, alpha)
        # # print("cutout.shape",cutout.shape)
        # cutout1 = np.clip(cutout1 * 255, 0, 255).astype(np.uint8)
        # cutout2 = np.clip(cutout2 * 255, 0, 255).astype(np.uint8)

        # cutout1 = Image.fromarray(cutout1)
        # cutout2 = Image.fromarray(cutout2)

        # cutout1.show()
        # cutout2.show()

        # cutout1.save("D:\\下載\\cutout1.png")
        # cutout2.save("D:\\下載\\cutout2.png")

        return self.mask

    def smooth_boundry(self) -> NPIMAGE:
        self.mask = cv.GaussianBlur(
            self.mask, (5, 5), sigmaX=2, sigmaY=2, borderType=cv.BORDER_DEFAULT
        )
        return self.mask

    def cutout(self, fit: bool = True) -> NPIMAGE:
        """
        參考 from rembg.bg import naive_cutout 實作
        https://stackoverflow.com/questions/1905421/crop-a-png-image-to-its-minimum-size

        也可參考 pymatting stack_images來實現
        from pymatting.util.util import stack_images
        """
        if self.raw_img is None:
            raise ValueError("raw_img is not been set yet")

        raw_img = Image.fromarray(self.raw_img)
        empty = Image.new("RGBA", raw_img.size, 0)
        mask = Image.fromarray(self.mask)
        cutout = Image.composite(raw_img, empty, mask)
        cutout.show()
        if fit:
            cutout = cutout.crop(cutout.getbbox())

        return np.array(cutout)
