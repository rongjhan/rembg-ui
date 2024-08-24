from PIL import Image
from typing import Callable, Optional
from .inputs_loader import InputModifyer, BOX


def add_box_prompt(predictor: Callable[..., Image.Image]) -> Callable[..., Image.Image]:
    
    def wrapper(image: Image.Image, *args, box: Optional[BOX] = None, **kwargs):
        modifyer_args = {k: kwargs[k] for k in kwargs if k in ["device", "precision"]}
        image, device, precision = InputModifyer(image, **modifyer_args).get_inputs()

        kwargs["device"] = device
        kwargs["precision"] = precision

        need_crop = box is not None
        raw_w, raw_h = image.size

        if need_crop:
            box = tuple([int(p) for p in box])
            try:
                image = image.crop(box)
            except ValueError:
                box = box[:2]+box[2:]
                image = image.crop(box)
        
        mask = predictor(image, *args, **kwargs)

        if need_crop:
            new_mask = Image.new("RGB", (raw_w, raw_h), 0)
            new_mask.paste(mask,(box[0], box[1]))
            return new_mask

        return mask

    return wrapper

