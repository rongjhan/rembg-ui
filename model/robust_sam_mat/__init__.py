import numpy as np
import torch.types
from .robust_segment_anything import SamPredictor, sam_model_registry
from .robust_segment_anything.utils.transforms import ResizeLongestSide 
from PIL import Image
from typing import Literal, Optional
from ..util.inputs_loader import INPUT_POINTS, INPUT_BOXS, INPUT_LABELS, Device, SamInputModifyer
from config import Config
import os
import urllib.request as req


cache_path = Config.cache_dir/"sam_robust"
ckpt_resource = "https://huggingface.co/robustsam/robustsam/resolve/main/model_checkpoint/"
_ckpt_name = "robustsam_checkpoint_{}.pth"


def sam_robust_predict(
    raw_image: Image.Image,
    input_points: Optional[INPUT_POINTS] = None,
    input_labels: Optional[INPUT_LABELS] = None,
    input_boxes: Optional[INPUT_BOXS] = None,
    model_size: Literal["base", "large", "huge"] = "large",
    device: Device = "cuda",
) -> Image.Image:
    
    raw_image, device, _, input_points, input_labels, input_boxes = (
        SamInputModifyer(
            raw_image,
            device,
            torch.float32,  # this model only work in float32
            input_points,
            input_labels,
            input_boxes
        ).get_inputs()
    )

    ckpt_name = _ckpt_name.format(model_size[0:1])
    ckpt_cache = cache_path/ckpt_name

    if not os.path.exists(cache_path):
        os.makedirs(cache_path, exist_ok=True)
    if not os.path.exists(ckpt_cache):
        req.urlretrieve(ckpt_resource + ckpt_name, ckpt_cache)

    model = sam_model_registry[f"vit_{model_size[0:1]}"](None, checkpoint=ckpt_cache)
    sam_transform = ResizeLongestSide(model.image_encoder.img_size)
    model = model.to(device)

    data_dict = {}

    #transform image
    image = np.array(raw_image, dtype=np.uint8)
    image_t = torch.tensor(image, dtype=torch.uint8).unsqueeze(0).to(device)
    image_t = torch.permute(image_t, (0, 3, 1, 2))
    image_t_transformed = sam_transform.apply_image_torch(image_t.float())
    
    data_dict['image'] = image_t_transformed


    # prompt
    np_input_boxes = np.array(input_boxes) if input_boxes else None
    np_input_points = np.array(input_points) if input_points else None
    np_input_labels = np.array(input_labels) if input_labels else None


    #handle box prompt
    if np_input_boxes is not None:
        box_t = torch.Tensor(input_boxes).unsqueeze(0).to(device)
        data_dict['boxes'] = sam_transform.apply_boxes_torch(box_t, image_t.shape[-2:]).unsqueeze(0)


    #handle point prompt
    if np_input_points is not None:
        input_label = torch.Tensor(np_input_labels).to(device)
        point_t = torch.Tensor(np_input_points).to(device)
        data_dict['point_coords'] = sam_transform.apply_coords_torch(point_t, image_t.shape[-2:]).unsqueeze(0)
        data_dict['point_labels'] = input_label.unsqueeze(0)

    data_dict['original_size'] = image_t.shape[-2:]
    # print("data_dict", data_dict)
    with torch.no_grad():   
        batched_output = model.predict(None, [data_dict], multimask_output=False, return_logits=False) 

    output_mask = batched_output[0]['masks']
    h, w = output_mask.shape[-2:]
    # print(output_mask.shape, output_mask.dtype)
    img = Image.fromarray(output_mask.reshape(h, w).cpu().numpy().astype(np.uint8)*255)
    # img.show()
    return img

