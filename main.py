import webview
import keyboard
import time

window = None

class API:
    def testFunc1(self, link):
        print(f'{link}')
        window.hide()
        time.sleep(0.5)
        keyboard.write(link, 0.2)
        


# def test_js(window):
#     window.evaluate_js(
#         r"""
# function waitForElm(selector) {
#     return new Promise(resolve => {
#         if (document.querySelector(selector)) {
#             return resolve(document.querySelector(selector));
#         }

#         const observer = new MutationObserver(mutations => {
#             if (document.querySelector(selector)) {
#                 resolve(document.querySelector(selector));
#                 observer.disconnect();
#             }
#         });

#         observer.observe(document.body, {
#             childList: true,
#             subtree: true
#         });
#     });
# };
    
# waitForElm('a.thumbnail').then(a => {

#     console.log('ru');
#     window.pywebview.api.testFunc1("asd").then(r => console.log('asd' + r));

#     window.addEventListener('click', function(event) {
#         event.preventDefault();
#         event.stopPropagation();
#         window.pywebview.api.testFunc1(event.target?.src);
#     });

#     document.querySelectorAll('a.thumbnail').forEach(anchor => {
#         anchor.removeChild(anchor.querySelector('.caption'));
#     });
# });

#         """
#     )

# url = 'https://7tv.app/emotes?page=1'
# url = 'https://www.frankerfacez.com/emoticons/wall?q=&sort=count-desc&days=0'
url = 'index.html'
api = API()

window = webview.create_window(
    'Test', 
    url, 
    width=399, 
    height=394, 
    js_api=api,
    frameless=True,
    resizable=False,
    # hidden=True
    )

hidden = False

def toggle():
    global hidden
    if hidden:
        window.show()
        hidden = False
    else:
        window.hide()
        hidden = True

keyboard.add_hotkey('alt+space', toggle)


webview.start()
# webview.start(
#     # test_js, 
#     window,
#     # debug=True
#     )
