from setuptools import setup, Extension
from distutils import sysconfig
from Cython.Build import cythonize
from Cython.Distutils import build_ext
from distutils.command.build import build as _build
import os
from setuptools import find_namespace_packages
from PyInstaller.utils.hooks.conda import collect_dynamic_libs

source_dir = "model_source"
output_dir = "model"
# Override build command


class BuildCmd(_build):
    def initialize_options(self):
        super().initialize_options()
        self.build_lib = 'model'  # 輸出至model目錄


class ExtCmd(build_ext):
    def initialize_options(self):
        super().initialize_options()
        # python setup.py build_ext -c mingw32 -DMS_WIN64 --inplace
        self.build_temp = ""
        self.compiler = 'mingw32'
        self.define = 'MS_WIN64'
        self.inplace = 1
        build_py = self.get_finalized_command('build_py')
        build_py.package_dir = {"":""} # 調整pyd輸出目錄

    def get_ext_filename(self, ext_name):
        # 修改預設輸出pyd名稱
        filename = super().get_ext_filename(ext_name)
        suffix = sysconfig.get_config_var('EXT_SUFFIX')
        ext = os.path.splitext(filename)[1]
        return filename.replace(suffix, "") + ext

    # def finalize_options(self) -> None:
    #     super().finalize_options()
    #     from pprint import pprint
    #     pprint(self.__dict__)


c_sources = cythonize([
    Extension(f"{output_dir}.util.basic_tool", [f"{source_dir}/util/basic_tool.py"]),
    Extension(f"{output_dir}.util.add_box_prompt", [f"{source_dir}/util/add_box_prompt.py"]),
    Extension(f"{output_dir}.util.inputs_loader", [f"{source_dir}/util/inputs_loader.py"]),
    Extension(f"{output_dir}.util.process_log", [f"{source_dir}/util/process_log.py"]),
    Extension(f"{output_dir}.util.mask_process", [f"{source_dir}/util/mask_process.py"]),
    Extension(f"{output_dir}.hf_sam_mat", [f"{source_dir}/hf_sam_mat.py"]),
    Extension(f"{output_dir}.hq_sam_mat", [f"{source_dir}/hq_sam_mat.py"]),
    Extension(f"{output_dir}.rembg_mat", [f"{source_dir}/rembg_mat.py"]),
    Extension(f"{output_dir}.__init__", [f"{source_dir}/__init__.py"]),
])

pkgs = find_namespace_packages(where=source_dir)
pkgs.remove("util")
# print(pkgs)

setup(
    package_dir={'': f"{source_dir}"},  # 設置根目錄為source_dir
    packages=pkgs,
    ext_modules=c_sources,
    cmdclass={
        "build": BuildCmd,  # 設置輸出目錄為model
        "build_ext": ExtCmd,  # 修改預設輸出pyd名稱
    },
)
