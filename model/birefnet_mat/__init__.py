# Imports

from PIL import Image
import torch
from torchvision import transforms
from config import Config
import os
from typing import Literal

model_path = str(Config.cache_dir/"huggingface")
os.environ['HF_HOME'] = model_path
# cache路徑必須在import transformers前設置

from .birefnet import BiRefNet






def birefnet_predict(
    raw_image: Image.Image,
    device: Literal["cpu", "cuda"] = "cuda",
) -> Image.Image:

    if raw_image.mode != "RGB":
        raw_image = raw_image.convert("RGB")
    
    if device == "cuda":
        if torch.cuda.is_available():
            torch.set_float32_matmul_precision(['high', 'highest'][0])
        else:
            print("cuda is not available, will run in cpu")
            device = "cpu"
    
    birefnet_model = BiRefNet.from_pretrained('ZhengPeng7/BiRefNet')
    birefnet_model.to(device)
    birefnet_model.eval()
    with torch.no_grad():
        preds = birefnet_model(transform_image(raw_image).to(device))[-1].sigmoid().cpu()
    
    pred = preds[0].squeeze()
    pred_pil = transforms.ToPILImage()(pred)
    mask = pred_pil.resize(raw_image.size)
    
    return mask


def transform_image(image: Image.Image) -> torch.Tensor:
    image_size = (1024, 1024)
    transform_image = transforms.Compose([
        transforms.Resize(image_size),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    return transform_image(image).unsqueeze(0)

