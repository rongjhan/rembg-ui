pip install nuitka
. ./bundler/out_dir.ps1
$out_dir = Get_outdir
nuitka --output-filename=rembgui `
    --output-dir=$out_dir"/dist" `
    --standalone `
    --enable-plugin=pywebview `
    --enable-plugin=numpy `
    --enable-plugin=torch `
    --include-data-dir={MAIN_DIRECTORY}/out=out `
    --noinclude-numba-mode=nofollow `
    --nofollow-import-to=cv2 `
    --nofollow-import-to=numpy `
    --nofollow-import-to=scipy `
    --nofollow-import-to=pymatting `
    --windows-console-mode=disable `
    --windows-icon-from-ico={MAIN_DIRECTORY}/out/favicon.ico