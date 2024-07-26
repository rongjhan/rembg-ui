# make sure you activate python env for this project
# and cd to the project folder, and exeute this script
# output archive will be generted in the same folder with project

. ./bundler/out_dir.ps1
$out_dir = Get_outdir
$projectName = Split-Path -Path (Get-Location) -Leaf

echo $null | Out-File -Encoding "UTF8" ./out/__init__.py
cd ..
$allPython = where.exe python
$pyPath = ($allPython -split "\n")[0]
python -m zipapp -p $pyPath -c -o $out_dir"\$projectName.pyz" $projectName
cd $projectName
rm ./out/__init__.py