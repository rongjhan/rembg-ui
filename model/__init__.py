from enum import StrEnum
from typing import Union, Optional
from PIL import Image
from .rembg_mat import rembg_base_predict
# from .hf_sam_mat import sam_predict
from .robust_sam_mat import sam_robust_predict
from .birefnet_mat import birefnet_predict
from .hq_sam_mat import sam_hq_predict
from .util.mask_process import MaskProcessor
from .util.basic_tool import NPIMAGE, fix_image_orientation

# print("u2net" in iter(REMBGModel))
# print("u2net" in REMBGModel._value2member_map_)
# print(REMBGModel("u2net2"))
class SAMModel(StrEnum):
    SAM_BASE = "sam_base"
    SAM_LARGE = "sam_large"
    SAM_HUGE = "sam_huge"


# class AlphaEstimateModel(StrEnum):
#     CLOSED_FORM = "closed_form"

class BiRefNetModel(StrEnum):
    BiRefNet = "birefnet"

class REMBGModel(StrEnum):
    ISNET = "isnet-general-use"
    ISNET_ANIME = "isnet-anime"
    U2NET = "u2net"
    U2NET_HUMAN_SEG = "u2net_human_seg"
    U2NET_CLOTH_SEG = "u2net_cloth_seg"
    SILUETA = "silueta"


Models = Union[SAMModel, REMBGModel, BiRefNetModel]


def get_model(name: str) -> Optional[Models]:
    if name in SAMModel._value2member_map_:
        return SAMModel(name)
    elif name in REMBGModel._value2member_map_:
        return REMBGModel(name)
    elif name in BiRefNetModel._value2member_map_:
        return BiRefNetModel(name)
    else:
        return None


def init_mask(
    img: Image.Image, model: Models, *model_args, **model_kwargs
) -> Image.Image:
    # preprocess
    img = fix_image_orientation(img)
    
    # prdeict
    mask: Image.Image
    if model in SAMModel:
        model_size = model.value.split("_")[1]
        mask = sam_robust_predict(
            img, model_size=model_size, *model_args, **model_kwargs
        )
    elif model in REMBGModel:
        model_name = str(model)
        mask = rembg_base_predict(img, model=model_name, *model_args, **model_kwargs)
    elif model in BiRefNetModel:
        mask = birefnet_predict(img, *model_args, **model_kwargs)
    else:
        raise ValueError("model not found")

    return mask


def post_process_mask(
    mask: Image.Image,
    raw_image: Optional[Image.Image] = None,
    logging: bool = True,
    cutout: bool = True,
    fit: bool = True,  # only work when cutout is True
) -> NPIMAGE:
    # postprocess
    processor = MaskProcessor(mask, raw_image, log=logging)
    processor.remove_noise(kernel_size=3)
    processor.fill_hole(iteration=10)
    processor.smooth_boundry()
    processor.alpha_estimate()

    return_value = processor.cutout(fit=fit) if cutout else processor.mask

    if logging:
        processor.log_gallery.show_gallery()

    return return_value


def predict(
    img: Image.Image,
    model: Models,
    # fg_threshold: int = 50,
    # bg_threshold: int = 20,
    logging: bool = True,
    *model_args,
    **model_kwargs
) -> NPIMAGE:

    mask = init_mask(img, model, *model_args, **model_kwargs)
    return post_process_mask(mask, img, logging=logging, cutout=True, fit=False)
