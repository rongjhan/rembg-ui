import numpy.typing as npt
import numpy as np
import matplotlib.pyplot as plt
from PIL import ImageOps, Image

PIXEL = npt.NDArray[np.uint8]
NPIMAGE = npt.NDArray[np.uint8]

def is_binary(img:NPIMAGE)->bool:
    pixels = set()
    for pixel in img.flat:
        if pixel not in pixels:
            if len(pixels) == 2 :
                # print(pixels, pixel)
                return False
            else:
                pixels.add(pixel)
    if pixels == {0,1}:
        print("it's one bit encode binary image")
        return True
    elif pixels == {0,255}:
        print("it's 8 bit encode binary image")
        return True
    else:
        print("it's not binary image")
        return False

def is_gray(img:NPIMAGE)->bool:
    dim = len(img.shape)
    if dim == 3:
        return False
    elif dim == 2:
        return True
    else:
        raise ValueError("it's not correct format of image")


def figure_to_ndarray(figure:plt.Figure)->NPIMAGE:

    # https://stackoverflow.com/questions/35355930/figure-to-image-as-a-numpy-array
    canvas = figure.canvas
    canvas.draw()
    image_flat = np.frombuffer(canvas.tostring_rgb(), dtype='uint8')  # (H * W * 3,)
    # NOTE: reversed converts (W, H) from get_width_height to (H, W)
    image = image_flat.reshape(*reversed(canvas.get_width_height()), 3)  # (H, W, 3)

    return image

def show_image(img:NPIMAGE|Image.Image):
    if isinstance(img,Image.Image):
        img.show()
    else:
        Image.fromarray(img).show()

def show_distinct_pixel(NPIMAGE:NPIMAGE):
    pixels = []
    for pixel in NPIMAGE.flat:
        if pixel not in pixels:
            pixels.append(pixel)
    
    print(pixels)