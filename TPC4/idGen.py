import sys
import json
from random import randint

def main(argv):
    numberOfIds = int(argv[1])
    alreadyRegistered = set()
    newIds = set()
    with open('dataset.json','r') as file:
        aux = json.load(file)
        for dic in aux['compositores']:
            alreadyRegistered.add(dic['id'])

    keepGenerating = True
    while keepGenerating:
        newId = f'C{randint(1,10000)}'
        if newId not in newIds and newId not in alreadyRegistered:
            newIds.add(newId)
            alreadyRegistered.add(newId)
        if len(newIds) == numberOfIds:
            keepGenerating = False
    
    print('Novos ids: ')
    for id in newIds:
        print(id)


if __name__ == '__main__':
    main(sys.argv)