import json
import keyboard

# list = dict()
# list['sadge'] = 'https://cdn.7tv.app/emote/603cac391cd55c0014d989be/1x.webp'
# list['bedge'] = 'https://cdn.7tv.app/emote/60ae8d9ff39a7552b658b60d/4x.webp'

with open('temp.json') as f:
    global jsonData
    jsonData = json.load(f)

for i in jsonData:
    keyboard.add_abbreviation(i['name'].lower(), i['link'].replace('webp', 'gif'))

# for k,v in list.items():
#     keyboard.add_abbreviation(k, v)


# or this sadge 
while True:
    # Wait for the next event.
    event = keyboard.read_event()