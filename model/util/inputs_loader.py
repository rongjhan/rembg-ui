from PIL import Image, ImageOps
from typing import Union, Sequence, Tuple, Literal, Optional
import requests
import os
import torch
import transformers.utils.import_utils as iutil

Device = Literal["cuda", "cpu"]
NUM = Union[int, float]
Coordinate = Tuple[NUM, NUM]
INPUT_POINTS = Sequence[Coordinate]
BOX = Tuple[NUM, NUM, NUM, NUM]
INPUT_BOXS = Sequence[BOX]  # 利用(左上座標,右下座標)定義Box
INPUT_LABELS = Sequence[Literal[0, 1]]  # 0:表示背景 1:表示前景


class InputModifyer():
    def __init__(
            self,
            image: Image.Image,
            device: Device = "cuda",
            precision: torch.dtype = torch.float32,
        ):
        self.image = self.modify_image(image)
        self.device, self.precision = self.request_device_and_precision(device, precision)

    def request_device_and_precision(
            self,
            device: Device,
            precision: torch.dtype
        )-> Tuple[Device, torch.dtype]:
        if device == "cuda" and not torch.cuda.is_available():
            print("cuda is not available, will run in cpu")
            device = "cpu"
        
        if precision == torch.float32:
            pass
        elif precision == torch.float16:
            if iutil.is_torch_bf16_available_on_device(device):
                precision = torch.bfloat16
            elif iutil.is_torch_fp16_available_on_device(device):
                precision = torch.float16
        else:
            try:
                x = torch.zeros(2, 2, dtype=torch.float16).to(device)
                _ = x @ x
            except:  # noqa: E722
                # TODO: more precise exception matching, if possible.
                # most backends should return `RuntimeError` however this is not guaranteed.
                precision = torch.float32
        
        if precision == torch.float32:
            torch.set_float32_matmul_precision(['high', 'highest'][0])
        
        return device, precision

    def modify_image(self, image: Image.Image):
        """參考 import rembg.bg.fix_image_orientation 實作"""
        image = ImageOps.exif_transpose(image)

        if image.mode != "RGB":
            image = image.convert("RGB")
        return image
    
    def get_inputs(self):
        return [self.__dict__[input] for input in self.__dict__]


class SamInputModifyer(InputModifyer):
    def __init__(
        self,
        image: Image.Image,
        device: Device = "cuda",
        precision: torch.dtype = torch.float32,
        input_points: Optional[INPUT_POINTS] = None,
        input_labels: Optional[INPUT_LABELS] = None,
        input_boxes: Optional[INPUT_BOXS] = None
    ):
        super().__init__(image, device, precision)
        self.points, self.labels, self.boxes = self.check_modify_prompt(
            input_points,
            input_labels,
            input_boxes
        )
        
    def check_modify_prompt(
            self,
            input_points: Optional[INPUT_POINTS] = None,
            input_labels: Optional[INPUT_LABELS] = None,
            input_boxes: Optional[INPUT_BOXS] = None
        ):
        if input_points is not None:
            if input_labels is None:
                input_labels = [[1] for p in input_points]
            else:
                len_p = len(input_points)
                len_l = len(input_labels)
                if len_p != len_l:
                    print("input_points and input_labels must have the same length")
                    if len_p > len_l:
                        expand_label = [1] * (len_p - len_l)
                        input_labels = list(input_labels) + expand_label
                    else:
                        input_labels = input_labels[:len_p]
        else:
            if input_labels is not None:
                print("input_points and input_labels must have the same length")
                input_labels = None
            if input_boxes is None:
                w, h = self.image.size
                input_boxes = [[0, 0, w, h]]

        return input_points, input_labels, input_boxes


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
