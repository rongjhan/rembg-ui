from pathlib import Path
import json
from typing import Callable, Self
import os

DATA_DIR = Path.home()/".rembgui"
CONFIG_FILE = DATA_DIR/"config.json"

if not DATA_DIR.exists():
    os.makedirs(DATA_DIR)


def search_config_file(func: Callable) -> Callable:

    def wrapper(self):
        config_name = func.__name__
        config_value = None
        if CONFIG_FILE.exists():
            with CONFIG_FILE.open("rb") as f:
                configs = json.loads(f.read())
                config_value = configs.get(config_name)
        return func(self, config_value)

    return wrapper


def update_config_file(func: Callable, sideEffect: bool = False) -> Callable:
    def wrapper(self, new_val):
        config_name = func.__name__
        old_val = None
        if CONFIG_FILE.exists():
            # update json file
            with open(CONFIG_FILE,"r+") as jsonFile:
                jsonFile.seek(0)  # rewind
                data = json.load(jsonFile)
                old_val = data.get(config_name)
                data[config_name] = new_val

                jsonFile.seek(0)  # rewind
                json.dump(data, jsonFile)
                jsonFile.truncate()
        else:
            # create new json file
            with open(CONFIG_FILE, "x") as jsonFile:
                json.dump({config_name: new_val}, jsonFile)
        if sideEffect:
            func(self,new_val, old_val)
    return wrapper


class field(property):
    def __init__(self, fget, fset=None, fdel=None) -> None:
        self.name = fget.__name__
        self.get = search_config_file(fget)
        if fset:
            self.set = update_config_file(fset, True)
        else:
            self.set = update_config_file(fget)
        
    def __get__(self, owner_self, owner_cls):
        return self.get(owner_self)
    
    def __set__(self, owner_self, value):
        self.set(owner_self, value)
    
    def setter(self, func):
        if func.__name__ != self.name:
            raise ValueError("setter function should be the same as getter name")
        self.set = update_config_file(func, sideEffect=True)
        return self
    
    @classmethod
    def __call__(cls, func: Callable) -> Self:
        return cls(func)


class ConfigFields():
    @field
    def cache_dir(self, field_val) -> Path:
        # defined transform data and default value in this function 
        return Path(field_val) if field_val else Path.home()/".cache"/"rembgui_model"
    
    @cache_dir.setter
    def cache_dir(self, new_val, old_val):
        pass


Config = ConfigFields()
