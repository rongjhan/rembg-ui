from rembg import new_session
from rembg.sessions.base import BaseSession
from PIL.Image import Image
from config import Config
# from .util.process_wrapper import self_defined_post_process, self_defined_alpha_estimate
# rembg範例:https://github.com/danielgatis/rembg/blob/main/USAGE.md


@classmethod
def u2net_home(cls, *args, **kwargs):
    return str(Config.cache_dir/"rembg")


BaseSession.u2net_home = u2net_home


def rembg_base_predict(
    img: Image,
    model: str = "u2net",
    *model_args,
    **model_kwargs
) -> Image:

    session = new_session(model, *model_args, **model_kwargs)
    # All models are downloaded and saved in the user home folder in the .u2net directory.

    masks = session.predict(img, *model_args, **model_kwargs)

    return masks[0] if type(masks) == list else masks

    # outputs = []
    # mask:Image.Image
    # for mask in masks:
    #     # alpha_estimate_mask = self_defined_alpha_estimate(input, mask, fg_threshold, bg_threshold)
    #     # posted_mask = self_defined_post_process(alpha_estimate_mask, fg_threshold, bg_threshold)
    #     # cutout = naive_cutout(input, mask)
    #     # cutout.show()
    #     processor = MaskProcessor(img, mask, fg_threshold, bg_threshold)
    #     mask.save("./mask.png")

    #     outputs.append({
    #         "input":img,
    #         "origin_mask":mask,
    #         "alpha_estimate_mask":post_process.mask_alpha_estimate(),
    #         "posted_mask":post_process.mask_smooth_boundry(),
    #         "cutout":post_process.cutout_fit()
    #     })

    #     post_process.show()
    
    # # OutputGallery.show_Ouputs(outputs)

    # return outputs


