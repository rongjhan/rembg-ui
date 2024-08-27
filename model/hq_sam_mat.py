import numpy as np
from segment_anything_hq import sam_model_registry, SamPredictor
from PIL import Image
from typing import Literal, Optional
from .util.inputs_loader import INPUT_POINTS, INPUT_BOXS, INPUT_LABELS, Device, SamInputModifyer
from config import Config
import torch
# github : https://github.com/SysCV/sam-hq
# Demo : https://github.com/SysCV/sam-hq/blob/main/demo/demo_hqsam_light.py

cache_path = Config.cache_dir/"sam_hq"
_ckpt_name = "sam_hq_vit_{}.pth"

def sam_hq_predict(
    raw_image: Image.Image,
    *,
    input_points: Optional[INPUT_POINTS] = None,
    input_labels: Optional[INPUT_LABELS] = None,
    input_boxes: Optional[INPUT_BOXS] = None,
    model_size: Literal["base", "large", "huge"] = "huge",
    device: Device = "cpu",
    precision: torch.dtype = torch.float32,
) -> Image.Image:
    
    raw_image, device, precision, input_points, input_labels, input_boxes = (
        SamInputModifyer(
            raw_image,
            device,
            precision,
            input_points,
            input_labels,
            input_boxes
        ).get_inputs()
    )

    sam = sam_model_registry[f"vit_{model_size[0:1]}"](
        checkpoint=cache_path / _ckpt_name.format(model_size[0:1])
    )

    sam.eval()
    predictor = SamPredictor(sam)

    predictor.set_image(np.array(raw_image))

    # prompt
    np_input_boxes = np.array(input_boxes) if input_boxes else None
    np_input_points = np.array(input_points) if input_points else None
    np_input_labels = np.array(input_labels) if input_labels else None

    mask, scores, logits = predictor.predict(
        point_coords=np_input_points,
        point_labels=np_input_labels,
        box=np_input_boxes,
        multimask_output=False,
        hq_token_only=False
        # hq_token_only: False means use hq output to correct SAM output. 
        #                True means use hq output only. 
        #                Default: False
        # To achieve best visualization effect, 
        # for images contain multiple objects (like typical coco images), 
        #   we suggest to set hq_token_only=False
        # For images contain single object, 
        #   we suggest to set hq_token_only = True
        # For quantiative evaluation on COCO/YTVOS/DAVIS/UVO/LVIS etc., we set hq_token_only = False
    )

    h, w = mask.shape[-2:]  # 輸出mask的shape為(1,h,w) , dtype為boolean  

    return Image.fromarray(mask.reshape(h, w).astype(np.uint8)*255)
    # fromArray接收shape為 (num_channels, height, width) https://stackoverflow.com/q/30345937
    # 須將數值轉為unit8 , 否則PIL可能會出現異常
    # 乘255是因為bool會轉換為0,1 , 但黑白兩值應顯示為0,255
