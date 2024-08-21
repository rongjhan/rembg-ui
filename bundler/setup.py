from setuptools import setup, Extension
from Cython.Build import cythonize
from distutils import sysconfig
from Cython.Distutils import build_ext
import os


class NoSuffixBuilder(build_ext):
    def get_ext_filename(self, ext_name):
        # 修改預設輸出pyd名稱
        filename = super().get_ext_filename(ext_name)
        suffix = sysconfig.get_config_var('EXT_SUFFIX')
        ext = os.path.splitext(filename)[1]
        return filename.replace(suffix, "") + ext
    

source_dir = "model_source"
output_dir = "model"
    
c_sources = cythonize([
    Extension(f"{output_dir}.util.basic_tool", [f"{source_dir}/util/basic_tool.py"]),
    Extension(f"{output_dir}.util.get_inputs", [f"{source_dir}/util/get_inputs.py"]),
    Extension(f"{output_dir}.util.process_log", [f"{source_dir}/util/process_log.py"]),
    Extension(f"{output_dir}.util.mask_process", [f"{source_dir}/util/mask_process.py"]),
    Extension(f"{output_dir}.hf_sam_mat", [f"{source_dir}/hf_sam_mat.py"]),
    Extension(f"{output_dir}.hq_sam_mat", [f"{source_dir}/hq_sam_mat.py"]),
    Extension(f"{output_dir}.rembg_mat", [f"{source_dir}/rembg_mat.py"]),
    Extension(f"{output_dir}.birefnet_mat", [f"{source_dir}/birefnet_mat.py"]),
    Extension(f"{output_dir}.__init__", [f"{source_dir}/__init__.py"]),
])




setup(
    ext_modules=c_sources,
    cmdclass={"build_ext": NoSuffixBuilder},
)

#python setup.py build_ext -c mingw32 -DMS_WIN64 --inplace