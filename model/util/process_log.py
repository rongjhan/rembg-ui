import matplotlib.pyplot as plt
from PIL import Image
from PIL.ImageDraw import ImageDraw
import numpy as np
from typing import Literal,Optional
from .inputs_loader import INPUT_POINTS, INPUT_BOXS
from .basic_tool import is_gray, figure_to_ndarray, NPIMAGE
import math


class GalleryLayout():
    def __init__(self,nb_imgs,nb_cols:int):
        self.nb_imgs = nb_imgs
        self.img_idx = 0

        self.cols = nb_cols if nb_cols < nb_imgs else nb_imgs
        self.rows = math.ceil(nb_imgs/self.cols)
        self.fig, self.axes = plt.subplots(self.rows, self.cols, squeeze=False)
        self.row_idx = 0
        self.col_idx = 0
        
    def to_next_position(self):
        if self.col_idx+1 < self.cols:
            self.col_idx += 1
        else:
            if self.row_idx+1 < self.rows:
                self.col_idx = 0
                self.row_idx +=1
            else:
                pass
            
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.img_idx < self.nb_imgs:
            current_row , current_col = self.row_idx, self.col_idx
            self.to_next_position()
            return self.fig, self.axes[current_row][current_col]
        else:
            raise StopIteration

class EmptyLayout(GalleryLayout):

    def __init__():
        ...
    def __next__():
        print("Empty Layout")
        raise StopIteration
    

class LogGallery():
    def __init__(self,images=None,log:bool=True):
        self.log = log 
        self.galary_shot = None # cache prevoius show_utput() result 
        self.layout = None
        self.images = images if images is not None else {}
    
    def append(self, title:str, img:NPIMAGE):
        if self.log:
            self.images[title] = img
        else:
            print("you can set log=True to visualize process")

    def __generate_layout(self,nb_cols:int):
        self.layout =  GalleryLayout(len(self.images),nb_cols) if len(self.images) > 0 else EmptyLayout()

    def __fill_layout(self):
        items = list(self.images.items())
        for idx,(figure,axe) in enumerate(self.layout):
            # cmap 列表 : https://matplotlib.org/stable/gallery/color/colormap_reference.html
            # cmap 參數 : https://blog.csdn.net/guduruyu/article/details/60868501

            cmap = plt.get_cmap('gray') if is_gray(items[idx][1]) else "viridis"
            axe.imshow(items[idx][1],cmap=cmap)
            axe.title.set_text(items[idx][0])
            axe.axis("off")

            if idx == len(self.images)-1:
                return figure

    def show_gallery(self, nb_cols:Optional[int]=3, useShot=True, edit=False):
        if useShot and self.galary_shot is not None:
            pass
        else:
            self.__generate_layout(nb_cols=nb_cols)
            figure = self.__fill_layout()
            
            if figure is not None:
                galary_shot = figure_to_ndarray(figure)
                self.galary_shot = galary_shot
                #https://superuser.com/questions/1414402/command-line-interface-for-photos-app-in-windows-10
                # Image.fromarray(self.galary_shot).show(command="mspaint" if edit else "explorer")
                Image.fromarray(self.galary_shot).show()


class StackedImage():
    def __init__(self,raw_img:Image.Image):
        self.raw_img = raw_img
    def stack_box(self,box:INPUT_BOXS):
        pass
    def stack_points(self,points:INPUT_POINTS,radius:int=5,point_color="greenyellow"):
        drawer = ImageDraw(self.raw_img)

        for p in points:
            (x0,y0),(x1,y1) = [coor-radius for coor in p], [coor+radius for coor in p]
            drawer.ellipse((x0,y0,x1,y1),fill=point_color,outline="white",width=2)

        return self.raw_img
        
    def stack_mask(self,mask:Image.Image,mask_color:Literal["default","random"]):
        # transparentify mask
        if mask_color == "default":
            color = np.array([30 / 255, 144 / 255, 255 / 255, 0.6])
        elif mask_color == "random":
            color = np.concatenate([np.random.random(3), np.array([0.6])], axis=0)
        else:
            raise ValueError(f"Invalid mask_color: {mask_color}")
        
        h, w = mask.shape[-2:]
        mask_image = mask.reshape(h, w, 1) * color.reshape(1, 1, -1)

        # paste mask on raw_img
        self.raw_img = self.raw_img.paste(Image.Image.fromarray(mask_image))
        
        return self.raw_img


class Logger(type):
    def __new__(metacls, name, bases, attrs):
        for attr in attrs:
            value = attrs[attr]
            if metacls.is_inst_method(value):
                attrs[attr] = metacls.deco_logger_prorcess(value)
        
        attrs["__init__"] = metacls.deco_init(attrs["__init__"])
        return super().__new__(metacls, name, bases, attrs)
    
    @staticmethod
    def deco_logger_prorcess(func):
        def wrapper(*args, **kwargs):
            log_gallery:LogGallery = args[0].log_gallery
            title = func.__name__ +"_"+ str(len(log_gallery.images))
            result = func(*args, **kwargs)
            log_gallery.append(title,result)
            return result
        return wrapper

    @staticmethod
    def deco_init(func):
        def wrapper(*args, **kwargs):
            self = args[0]
            self.log_gallery = LogGallery(log=kwargs["log"])
            func(*args, **kwargs)

        return wrapper
    
    @staticmethod
    def is_inst_method(attr):
        if callable(attr):
            not_dunder = not attr.__name__.startswith("__")
            instance_method = type(attr)!=classmethod and type(attr)!=staticmethod
            return not_dunder and instance_method
        else:
            return False


def show_points(coords, labels, ax, marker_size=375):
    pos_points = coords[labels == 1]
    neg_points = coords[labels == 0]
    ax.scatter(
        pos_points[:, 0],
        pos_points[:, 1],
        color="green",
        marker="*",
        s=marker_size,
        edgecolor="white",
        linewidth=1.25,
    )
    ax.scatter(
        neg_points[:, 0],
        neg_points[:, 1],
        color="red",
        marker="*",
        s=marker_size,
        edgecolor="white",
        linewidth=1.25,
    )

def show_points_on_image(raw_image, input_points, input_labels=None):
    plt.figure(figsize=(10, 10))
    plt.imshow(raw_image)
    input_points = np.array(input_points)
    if input_labels is None:
        labels = np.ones_like(input_points[:, 0])
    else:
        labels = np.array(input_labels)
    show_points(input_points, labels, plt.gca())
    plt.axis("on")
    plt.show()

def show_mask(mask, ax, random_color=False):
    if random_color:
        color = np.concatenate([np.random.random(3), np.array([0.6])], axis=0)
    else:
        color = np.array([30 / 255, 144 / 255, 255 / 255, 0.6])
    h, w = mask.shape[-2:]
    mask_image = mask.reshape(h, w, 1) * color.reshape(1, 1, -1)
    ax.imshow(mask_image)

def show_masks_on_image(raw_image, masks, scores):

    if len(masks.shape) == 4:
        masks = masks.squeeze()
    if scores.shape[0] == 1:
        scores = scores.squeeze(0)

    nb_predictions = scores.shape[-1]  # nb_predictions表示輸出mask數量
    fig, axes = plt.subplots(1, nb_predictions, figsize=(15, 15), squeeze=False)

    for i, (mask, score) in enumerate(zip(masks, scores)):
        mask = mask.cpu().detach()
        axes[0][i].imshow(np.array(raw_image))
        show_mask(mask, axes[0][i])
        axes[0][i].title.set_text(f"Mask {i+1}, Score: {score.item():.3f}")
        axes[0][i].axis("off")
    plt.show()

