import json

def main():
    compositores = None
    with open('compositores.json','r') as file:
        obj = json.load(file)
        compositores = list(obj.values())[0]
        
    for dic in compositores:
        keys = dic.keys()
        if 'id' not in keys or 'nome' not in keys or 'bio' not in keys or 'dataNasc' not in keys or  'dataObito' not in keys or 'periodo' not in keys:
            compositores.remove(dic)

    periodosDic = {}
    index = 1
    for dic in compositores:
        periodo = dic['periodo']
        if periodo not in periodosDic.keys():
            newDic = { 'id' : f'P{index}','nome' : periodo, 'compositores' : []}
            periodosDic[periodo] = newDic
            index += 1
        periodosDic[periodo]['compositores'].append({'id' : dic['id'] , 'nome' : dic['nome']})
        dic['periodo'] = {'id' : periodosDic[periodo]['id'], 'name' : periodo}
        
    periodos = []
    for dic in periodosDic.values():
        periodos.append(dic)
    
    newJSON = {"compositores" : compositores , "periodos" : periodos}
    with open('dataset.json', 'w') as file:
        json.dump(newJSON,file,indent=2)
    

            

if __name__ == '__main__':
    main()