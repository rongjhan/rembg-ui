import torch
import numpy as np
import torch.types
from PIL import Image
from typing import Literal, Optional
from .util.inputs_loader import INPUT_POINTS, INPUT_BOXS, INPUT_LABELS, Device, SamInputModifyer
from transformers import SamModel, SamProcessor, SamImageProcessor
from transformers.feature_extraction_utils import BatchFeature
from transformers.models.sam.modeling_sam import SamImageSegmentationOutput
# 修改預設模型存放路徑 https://stackoverflow.com/q/63312859

# HuggingFace範例: 
# https://github.com/huggingface/notebooks/blob/main/examples/segment_anything.ipynb

# 文檔: 
# https://huggingface.co/docs/transformers/v4.38.1/en/model_doc/sam#transformers.SamModel


def sam_predict(
    raw_image: Image.Image,
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

    model_size = f"facebook/sam-vit-{model_size}"
    model: SamModel = SamModel.from_pretrained(model_size, torch_dtype=precision).to(device)
    # to方法定義於PreTrainedModel類中 , 定義於 transformer.modeling_utils``
    processor: SamProcessor = SamProcessor.from_pretrained(model_size)
    # processor能接收的參數定義於SamProcessor.__call__方法中,其會再呼叫SamImageProcessor的process方法
    # to方法定義於BatchFeature類中 , 定義於 transformers.feature_extraction_utils

    #  SamProcessor 對資料做預處理輸出最終要給model的input , 結構如下
    #  input_structure = {
    #     "pixel_values": images,,
    #     "reshaped_input_sizes": reshape
    #     "original_sizes": original_sizesd_input_sizes,
    #     "input_points": input_points,
    #     "input_boxes": input_boxes
    #     "input_labels": input_labels  //用於標示該input_point意義是包含(1)還是不包含(0)的區域
    #     "labels": segmentation_maps
    # }
    with torch.no_grad():
        inputs: BatchFeature = processor(
            # processor可以接收多張圖片進行inference , 但sam_predict設計為僅接收一張圖片
            # 故將 raw_image和input_points 放進陣列裡
            [raw_image], 
            input_points=[input_points] if input_points else None,
            input_boxes=[input_boxes] if input_boxes else None, 
            input_labels=[input_labels] if input_points else None, 
            return_tensors="pt"
        ).to(device)
        

        image_embeddings = model.get_image_embeddings(inputs["pixel_values"].to(precision))
        inputs.pop("pixel_values", None)
        inputs.update({"image_embeddings": image_embeddings})
        
        sam_outputs: SamImageSegmentationOutput = model(**inputs, multimask_output=False)
        # model.forward的時候可以傳入pixel_values或image_embeddings (二選一)
        # 若發現傳入的是pixel_values 他會先求去求image_embeddings
        # 我們先求好image_embeddings , 以減輕model.forward的計算負擔
        # model接收參數可以於transformers.models.sam.modeling_sam.SAM_INPUTS_DOCSTRING查看

        # outputs為一個dataclass , 結構為
        # SamImageSegmentationOutput(
        #     iou_scores=iou_predictions,
        #     pred_masks=low_res_masks,
        #     vision_hidden_states=vision_hidden_states,
        #     vision_attentions=vision_attentions,
        #     mask_decoder_attentions=mask_decoder_attentions,
        # )
    
    masks = processor.image_processor.post_process_masks(
        sam_outputs.pred_masks.cpu(),
        inputs["original_sizes"].cpu(),
        inputs["reshaped_input_sizes"].cpu(),
    )
    # masks輸出為list of Tensor(batch_size, num_channels, height, width),
    # 其中 (height, width) is given by original_size.
    # 此函數由於限制batch_szie故為1 , num_channels為灰度圖也為1
    # show_distinct_pixel(masks[0][0][0].numpy())
    mask = masks[0][0][0].numpy() # mask shape 為(H, W) , dtype為boolean 
    
    return Image.fromarray(mask.astype(np.uint8)*255)
    # 須將數值轉為unit8 , 否則PIL可能會出現異常
    # 乘255是因為bool會轉換為0,1 , 但黑白兩值應顯示為0,255
