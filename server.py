from flask import Flask, Response
from server_api import bp_api
import importlib


app = Flask(__name__)
app.register_blueprint(bp_api)

def get_file(filename):  # pragma: no cover
    try:
        src = importlib.resources.files("out").joinpath(filename)
        return src.read_bytes()
        
    except IOError as e:
        print("error:", str(e))
        return None
    except Exception as e:
        print("error:", str(e))
        return None


@app.route("/", methods=["GET"])
def index():

    file_content = get_file("index.html")
    return Response(file_content, mimetype="text/html")


@app.route("/<path:file>", methods=["GET"])
def static_root(file:str):
    # we can't set app = Flask(__name__ ,static_folder="out")
    # because it will not work in archive app to get static file
    file_content = get_file(file)

    if file_content is None:
        return None
    else:
        if file.endswith(".html"):
            return Response(file_content, mimetype="text/html")
        elif file.endswith(".js"):
            return Response(file_content, mimetype="application/javascript")
        elif file.endswith(".css"):
            return Response(file_content, mimetype="text/css")
        elif file.endswith(".png"):
            return Response(file_content, mimetype="image/png")
        elif file.endswith(".jpg"):
            return Response(file_content, mimetype="image/jpg")
        elif file.endswith(".svg"):
            return Response(file_content, mimetype="image/svg+xml")
        else:
            return Response(file_content)
