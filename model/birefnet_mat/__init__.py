from PIL import Image
import torch
from torchvision import transforms
from ..util.inputs_loader import Device, InputModifyer
from ..util.add_box_prompt import add_box_prompt
from .birefnet import BiRefNet

@add_box_prompt
def birefnet_predict(
    raw_image: Image.Image,
    device: Device = "cuda",
    precision: torch.dtype = torch.float16,
) -> Image.Image:
    
    raw_image, device, precision = InputModifyer(raw_image, device, precision).get_inputs()

    birefnet_model = BiRefNet.from_pretrained('ZhengPeng7/BiRefNet')
    birefnet_model.to(device, precision)
    birefnet_model.eval()
    with torch.no_grad():
        preds = birefnet_model(transform_image(raw_image).to(device, precision))[-1].sigmoid().cpu()
    
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

