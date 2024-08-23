from rembg import new_session
from rembg.sessions.base import BaseSession
from PIL.Image import Image
from config import Config
# from .util.inputs_loader import Device, InputModifyer
from .util.add_box_promt import add_box_prompt
# from .util.process_wrapper import self_defined_post_process, self_defined_alpha_estimate
# rembg範例:https://github.com/danielgatis/rembg/blob/main/USAGE.md


@classmethod
def u2net_home(cls, *args, **kwargs):
    return str(Config.cache_dir/"rembg")


BaseSession.u2net_home = u2net_home


@add_box_prompt
def rembg_base_predict(
    img: Image,
    model: str = "u2net",
    *model_args,
    **model_kwargs
) -> Image:
    # TODO: add prcession arg if possible: https://onnxruntime.ai/docs/performance/model-optimizations/float16.html
    # TODO: add device arg : https://onnxruntime.ai/docs/execution-providers/
    # raw_image, device, precision = InputModifyer(raw_image,device,precision).get_inputs()
    session = new_session(model, *model_args, **model_kwargs)

    masks = session.predict(img, *model_args, **model_kwargs)

    return masks[0] if type(masks) == list else masks



