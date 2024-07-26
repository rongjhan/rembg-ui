from flask import Blueprint, Response, request, send_file
from PIL import Image
from model import *
# from model import init_mask, post_process_mask, get_model, Models
import json
from io import BytesIO
bp_api = Blueprint("api", __name__, url_prefix="/api")


def img_to_bytes(img: Image.Image, format="JPEG") -> BytesIO:
    img_io = BytesIO()
    img.save(img_io, format=format)
    img_io.seek(0)
    return img_io


@bp_api.route("/init_mask/", methods=["POST"])
def get_init_mask():
    img: Image.Image = Image.open(request.files.get("content").stream)
    model = get_model(request.form.get("model"))
    alpha_estimate = request.form.get("alphaEstimate") == "true"
    model_kwargs = json.loads(request.form.get("modelArgs"))

    print('model: ', model)
    print("width,height", img.width, img.height)
    print('alpha_estimate: ', alpha_estimate)
    # print('model_kwargs: ', model_kwargs)
    
    if model and img:
        try:
            mask = init_mask(img, model, **model_kwargs)
            if alpha_estimate:
                posted_mask = post_process_mask(mask, img, logging=False, cutout=False)
                mask = Image.fromarray(posted_mask)

            return send_file(img_to_bytes(mask,format="png"), mimetype="image/png")

        except Exception as e:
            print(e, model)

    return Response(status=404, response="invalid input")


@bp_api.route("/postprocess_mask/", methods=["POST"])
def get_post_process_mask():
    mask: Image.Image = Image.open(request.files.get("mask").stream).convert("L")
    raw_img: Image.Image = Image.open(request.files.get("raw").stream).convert("RGB")
    posted_mask = post_process_mask(mask, raw_img, logging=False, cutout=False)
    return send_file(
        img_to_bytes(Image.fromarray(posted_mask), format="png"),
        mimetype="image/png"
    )


@bp_api.after_request
def after_request(response):
    header = response.headers
    header["Access-Control-Allow-Origin"] = "*"
    header["Access-Control-Allow-Headers"] = "*"
    header["Access-Control-Allow-Methods"] = "*"
    # Other headers can be added here if needed
    return response
