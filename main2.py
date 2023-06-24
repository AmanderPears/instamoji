import requests
import unicodedata
import codecs
import keyboard

txtFile = requests.get('https://unicode.org/Public/emoji/latest/emoji-sequences.txt').text

lines = []

def expandRange(line):
    tmpAry = line.strip().split('..')
    start = int(f'0x{tmpAry[0]}', 16)
    end = int(f'0x{tmpAry[1]}', 16)
    tmpAry.clear()
    for r in range(start, end + 1):
        tmpAry.append(hex(r).upper().replace('0X',''))
    return tmpAry

for line in txtFile.splitlines():
    if len(line) == 0 or line[0] == '#' or line.count(';') == 0:
        continue
    
    line = line.split(';')[0]

    if line.count('..') > 0:
        lines.extend(expandRange(line))
        continue

    lines.append(line.strip())



def transform(e):
    ls = e.split(' ')
    s = []
    for l in ls:
        s.append(rf'\U{l.zfill(8)}')
    return codecs.decode(''.join(s), encoding='unicode-escape')


lines = list(map(transform, lines))


def transform2(e):
    name = None
    try:
        name = unicodedata.name(e).lower()
    except:
        name = '-'
    return {'name': name, 'value': e}

lines = list(map(transform2, lines))

# def filter(e):
#     return e['name'].count(' ') == 0

lines = list(filter(lambda e: e['name'].count(' ') == 0, lines))

# print(lines[:10])
print(list(map(lambda l: l['name'],lines)))
##############################################
# print(len(lines))
# for i in lines:
#     keyboard.add_abbreviation(i['name'], i['value'])


################################################


# or this sadge 
word = ''
while True:
    # Wait for the next event.
    event = keyboard.read_event()
    if event.event_type == keyboard.KEY_DOWN:
        if event.name != 'space':

            if event.name == 'backspace':
                word = word[:-1]
            else:
                word = word + event.name
        else:
            word = word.lower()

            try:
                replacement = next(x for x in lines if x['name'] == word)['value']
                
                for n in range(len(word) + 1):
                    keyboard.send('backspace')
                keyboard.write(replacement)

            except StopIteration:
                pass

            # print(word)
            word = ''