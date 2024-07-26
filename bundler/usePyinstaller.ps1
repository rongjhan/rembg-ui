# ensure pyinstaller, cython and c compiler was installed before
. ./bundler/out_dir.ps1
$out_dir = Get_outdir
ren model model_source
python ./bundler/setup.py build_ext -c mingw32 -DMS_WIN64 --inplace
pyinstaller -y --log-level=WARN `
    --name=rembgui `
    --add-data="out;out" `
    --windowed `
    --icon=./out/favicon.ico `
    --distpath=$out_dir"/dist" `
    --workpath=$out_dir"/build" `
    --hidden-import=numpy `
    --hidden-import=pymatting `
    --hidden-import=torch `
    --hidden-import=cv2 `
    --hidden-import=PIL `
    --hidden-import=rembg `
    --hidden-import=segment_anything_hq `
    --hidden-import=matplotlib `
    --hidden-import=requests `
    --hidden-import=model.hf_sam_mat `
    --hidden-import=model.hq_sam_mat `
    --hidden-import=model.rembg_mat `
    --hidden-import=model.util.basic_tool `
    --hidden-import=model.util.get_inputs `
    --hidden-import=model.util.mask_process `
    --hidden-import=model.util.process_log `
    __main__.py
rm -r -fo model
rm -r -fo build
rm *.spec
ren model_source model