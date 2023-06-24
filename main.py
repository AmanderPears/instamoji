import requests
import win32clipboard
from PIL import Image
from io import BytesIO
import keyboard

list = dict()
list['sadge'] = 'https://cdn.7tv.app/emote/603cac391cd55c0014d989be/1x.webp'

list2 = dict()
list2['brown'] = '🟫'
list2['fox'] = '🦊'
list2['lazy'] = '🦥'
list2['dog'] = '🐶'
list2['cat'] = '🐈'
list2['time'] = '⏲'
list2['test'] = '\U0001F1E8\U0001F1E6'

def setupNormalEmoji():
    for k,v in list2.items():
        keyboard.add_abbreviation(k, v + ' ')

def getEmoteFromURL(url):
    return requests.get(url).content

def copyToClipboard(type, data):
    win32clipboard.OpenClipboard()
    win32clipboard.EmptyClipboard()
    try:
        win32clipboard.SetClipboardData(type, data)
    finally:
        win32clipboard.CloseClipboard()

def webpTobmp(webp):
    tmp = Image.open(BytesIO(webp))
    bg = Image.new('RGB', tmp.size, 'black')
    bg.paste(tmp, tmp)
    bmp = BytesIO()
    bg.convert('RGB').save(bmp, 'BMP')
    bmpData = bmp.getvalue()[14:]
    bmp.close()
    copyToClipboard(win32clipboard.CF_DIB, bmpData)
    # tmp.save('test.webp')x


def getEmoji(key):
    webpTobmp(getEmoteFromURL(list[key]))
    for n in range(len(key) + 1):
        keyboard.send('backspace')
    keyboard.send('ctrl+v')

keyboard.add_word_listener('sadge', lambda : getEmoji('sadge'))

# The quick brown fox jumps over the lazy dog.
# THe quick 🟤 🦊 jumps over the 🦥 🐶.
setupNormalEmoji()


# or this sadge 
while True:
    # Wait for the next event.
    event = keyboard.read_event()