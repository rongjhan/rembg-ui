from PIL import Image
from typing import Union, Sequence, Tuple, Literal
import requests
import os
from .basic_tool import NPIMAGE

Coordinate = Tuple[Union[int, float], Union[int, float]]
INPUT_POINTS = Sequence[Coordinate]
INPUT_BOXS = Sequence[Tuple[Coordinate, Coordinate]]  #利用(左上座標,右下座標)定義Box
INPUT_LABELS = Sequence[Literal[0, 1]]  # 0:表示去除 1:表示包含


class ImageLoader:
    def __init__(
        self, img_paths: list[os.PathLike], from_online: bool = False, strict=True
    ) -> None:

        self.img_paths = (
            img_paths if (from_online or not strict) else self.get_all_imgs(img_paths)
        )
        self.from_online = from_online
        self.index = 0

    @classmethod
    def get_all_imgs(cls, path):
        all_img_paths = []
        for p in path:
            if os.path.isdir(p):
                all_img_paths += [
                    os.path.join(p, f) for f in os.listdir(p) if cls.is_image(f)
                ]
            elif os.path.isfile(p):
                all_img_paths.append(p)
            else:
                raise FileNotFoundError("is not valid path")
        return all_img_paths

    @staticmethod
    def is_image(file_name: str):
        support_format = (
            ".jpeg",
            ".jpg",
            ".png",
            ".gif",
            ",bmp",
            ".tiff",
            ".ppm",
            ".ico",
            ".psd",
        )
        return file_name.endswith(support_format)

    @staticmethod
    def load(path: str, from_online: bool, mode="RGB") -> Image.Image:
        if not from_online:
            return Image.open(path).convert(mode)
        else:
            return Image.open(requests(path, stream=True).raw).convert(mode)

    def __iter__(self):
        return self

    def __next__(self):
        if self.index < len(self.img_paths):
            current_idx = self.index
            self.index += 1
            return current_idx, self.load(self.img_paths[current_idx], self.from_online)
        else:
            self.index = 0
            raise StopIteration

    def __getitem__(self, idx: Union[int, slice]):
        name = type(idx).__name__
        
        if name=="int":
            new_paths = [self.img_paths[idx]]
        elif name=="slice":
            new_paths = self.img_paths[idx]
        else:
            raise ValueError("invalid value")
        
        return self.__class__(
            new_paths,
            self.from_online,
            strict=False,
        )


class GetInputPoints:
    def __init__(self, points: INPUT_POINTS, box: INPUT_BOXS, mask: NPIMAGE):
        self.points = points
        self.box = box
        self.mask = mask


class GetInputBox:
    def __init__(self, points: INPUT_POINTS, box: INPUT_BOXS, mask: NPIMAGE):
        self.points = points
        self.box = box
        self.mask = mask


class ModifyMask:
    def __init__(self, points: INPUT_POINTS, box: INPUT_BOXS, mask: NPIMAGE):
        self.points = points
        self.box = box
        self.mask = mask
