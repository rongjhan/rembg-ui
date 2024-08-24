# ensure c compiler was installed before
# conda install pyinstaller
# pip install cython==3.0.10
. ./bundler/out_dir.ps1
$out_dir = Get_outdir
ren model model_source
python ./bundler/setup.py build
pyinstaller -y --log-level=WARN `
    --name=rembgui `
    --add-data="out;out" `
    --windowed `
    --optimize=0 `
    --icon=./out/favicon.ico `
    --distpath=$out_dir"/dist" `
    --workpath=$out_dir"/build" `
    --additional-hooks-dir="./bundler/" `
    --hidden-import=numpy `
    --hidden-import=pymatting `
    --hidden-import=torch `
    --hidden-import=cv2 `
    --hidden-import=PIL `
    --hidden-import=transformers `
    --hidden-import=rembg `
    --hidden-import=segment_anything_hq `
    --hidden-import=matplotlib `
    --hidden-import=requests `
    --hidden-import=config `
    --hidden-import=model.hf_sam_mat `
    --hidden-import=model.robust_sam_mat `
    --hidden-import=model.birefnet_mat `
    --hidden-import=model.hq_sam_mat `
    --hidden-import=model.rembg_mat `
    --hidden-import=model.util.basic_tool `
    --hidden-import=model.util.add_box_prompt `
    --hidden-import=model.util.inputs_loader `
    --hidden-import=model.util.mask_process `
    --hidden-import=model.util.process_log `
    __main__.py
ls
rm -r -fo model
rm *.spec
ren model_source model