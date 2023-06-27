import webview
import keyboard
import time
import pyautogui

window = None

def moveWindow(win):
    x, y = pyautogui.position()
    win.move(x, y)



class API:
    def testFunc1(self, link):
        print(f'{link}')
        window.hide()
        time.sleep(0.3)
        keyboard.write(link)
        


url = './assets/index.html'
api = API()

window = webview.create_window(
    'Test', 
    url, 
    width=410, 
    height=394, 
    js_api=api,
    frameless=True,
    resizable=False,
    # hidden=True,
    on_top=True
    )

hidden = False

def toggle():
    global hidden
    if hidden:
        moveWindow(window)
        window.show()
        hidden = False
    else:
        window.hide()
        hidden = True

keyboard.add_hotkey('ctrl+space', toggle)


webview.start()
