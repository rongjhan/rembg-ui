import numpy as np
import matplotlib.pyplot as plt
import torch.types
from segment_anything_hq import sam_model_registry, SamPredictor
from PIL import Image
from typing import Literal, Optional
from .util.get_inputs import INPUT_POINTS, INPUT_BOXS, INPUT_LABELS
from config import Config
# girhub : https://github.com/SysCV/sam-hq
# Demo : https://github.com/SysCV/sam-hq/blob/main/demo/demo_hqsam_light.py

model_path = Config.cache_dir/"sam_hq"

def sam_hq_predict(
    raw_image: Image.Image,
    input_points: Optional[INPUT_POINTS] = None,
    input_labels: Optional[INPUT_LABELS] = None,
    input_boxes: Optional[INPUT_BOXS] = None,
    model_size: Literal["base", "large", "huge"] = "huge",
    device: Literal["cpu", "cuda"] = "cpu",
) -> Image.Image:
    
    model_name = f"vit_{model_size[0:1]}"

    sam = sam_model_registry[model_name](checkpoint=model_path/f"sam_hq_{model_name}.pth")

    if device=="cuda" and not torch.cuda.is_available():
        print("cuda is not available, will run in cpu")
        device = "cpu"

    sam.to(device=device)
    sam.eval()
    predictor = SamPredictor(sam)

    if raw_image.mode != "RGB":
        raw_image = raw_image.convert("RGB")

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
        hq_token_only=False, 
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

    # show_res(masks=mask, scores=scores, input_point=np_input_points, input_label=np_input_labels, input_box=np_input_boxes, image=raw_image)

    h, w = mask.shape[-2:]  # 輸出mask的shape為(1,h,w) , dtype為boolean  

    return Image.fromarray(mask.reshape(h, w).astype(np.uint8)*255)
    # fromArray接收shape為 (num_channels, height, width) https://stackoverflow.com/q/30345937
    # 須將數值轉為unit8 , 否則PIL可能會出現異常
    # 乘255是因為bool會轉換為0,1 , 但黑白兩值應顯示為0,255


def show_mask(mask, ax, random_color=False):
    if random_color:
        color = np.concatenate([np.random.random(3), np.array([0.6])], axis=0)
    else:
        color = np.array([30/255, 144/255, 255/255, 0.6])
    h, w = mask.shape[-2:]
    mask_image = mask.reshape(h, w, 1) * color.reshape(1, 1, -1)
    ax.imshow(mask_image)
    

def show_points(coords, labels, ax, marker_size=375):
    pos_points = coords[labels==1]
    neg_points = coords[labels==0]
    ax.scatter(pos_points[:, 0], pos_points[:, 1], color='green', marker='*', s=marker_size, edgecolor='white', linewidth=1.25)
    ax.scatter(neg_points[:, 0], neg_points[:, 1], color='red', marker='*', s=marker_size, edgecolor='white', linewidth=1.25)   
    

def show_box(box, ax):
    x0, y0 = box[0], box[1]
    w, h = box[2] - box[0], box[3] - box[1]
    ax.add_patch(plt.Rectangle((x0, y0), w, h, edgecolor='green', facecolor=(0,0,0,0), lw=2))    


def show_res(masks, scores, input_point, input_label, input_box, image):
    for i, (mask, score) in enumerate(zip(masks, scores)):
        plt.figure(figsize=(10,10))
        plt.imshow(image)
        show_mask(mask, plt.gca())
        if input_box is not None:
            box = input_box[i]
            show_box(box, plt.gca())
        if (input_point is not None) and (input_label is not None): 
            show_points(input_point, input_label, plt.gca())
        
        print(f"Score: {score:.3f}")
        plt.axis('off')
        plt.show()
