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
        window.hidden = True

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
    hidden=True,
    on_top=True
    )

def toggleWindowVisibility():
    if window.hidden:
        moveWindow(window)
        window.show()
    else:
        window.hide()

    window.hidden = not window.hidden

keyboard.add_hotkey('ctrl+space', toggleWindowVisibility)


webview.start()
