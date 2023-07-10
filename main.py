import webview
import keyboard
import time
import pyautogui
import ctypes
import json

window = None
rdata = None
jdata = None

with open('recent.json') as f:
    rdata = f.read()
with open('fav.json') as f:
    fdata = f.read()

def moveWindow(win):
    x, y = pyautogui.position()

    #https://stackoverflow.com/a/59628224
    scaleFactor = ctypes.windll.shcore.GetScaleFactorForDevice(0) / 100

    win.move(x/scaleFactor, y/scaleFactor)

def evaluate_js(win):
    win.evaluate_js(
        f"""
        console.log('setting');
        //localStorage.setItem('recent', {rdata});
        //localStorage.setItem('fav', {fdata});
        window.dispatchEvent(new CustomEvent('previousDataReady', {{detail: {{recent : {rdata}, fav: {fdata}}}}}));
        """
    )



class API:
    def testFunc1(self, link):
        print(f'{link}')
        
        window.hide()
        window.hidden = True

        time.sleep(0.1)
        keyboard.write(link)

    # def on_closed():
    #     print('done')

    # def on_loaded(t):
    #     with open('recent.json') as f:
    #         rdata = f.read()
    #     with open('fav.json') as f:
    #         fdata = f.read()

    #     return [rdata, fdata] 
        

    def saveJson(self, filename, data):
        with open(f'{filename}.json', 'w') as f:
            json.dump(data, f, indent=2)

    
        


url = './assets/index.html'
api = API()

window = webview.create_window(
    'Test', 
    url, 
    width=500, 
    height=500, 
    js_api=api,
    frameless=True,
    resizable=False,
    hidden=True,
    on_top=True
    )

# window.events.closed += api.on_closed
# window.events.loaded += api.on_loaded

def toggleWindowVisibility():
    if window.hidden:
        moveWindow(window)
        window.show()
    else:
        window.hide()

    window.hidden = not window.hidden

keyboard.add_hotkey('ctrl+space', toggleWindowVisibility)


webview.start(
    evaluate_js, window
    # ,debug=True
    )
