from PyInstaller.utils.hooks.conda import PackagePath
import os

share_lib_dir = PackagePath("bin").locate()

datas = []
for dll in os.listdir(share_lib_dir):
    if "nvrtc-builtins64" in dll:
        datas.append((os.path.join(share_lib_dir, dll), "."))

print("model.robust_sam_mat implicitly add datas:", datas , " as dependencies")
