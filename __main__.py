import webview
from server import app
import argparse



parser = argparse.ArgumentParser()
parser.add_argument("-D", "--debug", action="store_true", help="open browser devtool")
args = parser.parse_args()



webview.create_window('rembg-gui', app)
webview.start(debug=args.debug)