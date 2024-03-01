import json
from bson import ObjectId

def genreBuilder(jsonStruct):
    genres = {}
    genresIds = {}
    for lista in jsonStruct.values():
        for d in lista:
            if 'genres' in d.keys():
                for g in d['genres']:
                    if g not in genres:
                        newGenreId = str(ObjectId())
                        genres[g] = {}
                        genres[g]['id'] = newGenreId
                        genresIds[g] = newGenreId
                        genres[g]['name'] = g
                        genres[g]['movies'] = []
                    genres[g]['movies'].append({'id' : d['id'], 'title' : d['title']})
    formattedGenres = []
    for entry in genres.values():
        formattedGenres.append(entry)
    return formattedGenres,genresIds

def actorBuilder(jsonStruct):
    actors = {}
    actorsIds = {}
    for lista in jsonStruct.values():
        for d in lista:
            if 'cast' in d.keys():
                for a in d['cast']:
                    if a not in actors:
                        newActorId = str(ObjectId())
                        actors[a] = {}
                        actors[a]['id'] = f'A{newActorId}'
                        actorsIds[a] = f'A{newActorId}'
                        actors[a]['name'] = a
                        actors[a]['movies'] = []
                    actors[a]['movies'].append({'id' : d['id'], 'title' : d['title']})
    formattedActors = []
    for entry in actors.values():
        formattedActors.append(entry)

    return formattedActors,actorsIds

def setId(db):
    for lista in db.values():
        for d in lista:
            id = d['_id']['$oid']
            d.pop('_id')
            d['id'] = id
    return db    

def updateInfo(db,genresIds,actorsIds):
    for d in db['filmes']:
        if 'cast' in d.keys():
            newCast = []
            for actor in d['cast']:
                newCast.append({'actor' : actor, 'id' : actorsIds[actor]})
            d['cast'] = newCast
        if 'genres' in d.keys():
            newGenres = []
            for genre in d['genres']:
                newGenres.append({'genre' : genre, 'id' : genresIds[genre]})
            d['genres'] = newGenres
    return db

def main():
    lista = []
    with open('filmes.json','r') as file:
        for line in file:
            lista.append(line.strip())
    bd = '{ "filmes" : ['
    bd += f'{lista.pop(0)}\n'
    for line in lista:
        bd += f',{line}\n'
    bd += ']}'
    with open('dataset.json','w') as file:
        file.write(bd)

    db = None
    with open('dataset.json','r') as file:
        db = json.load(file)
    
    db = setId(db)

    genres,genresIds = genreBuilder(db)
    actors,actorsIds = actorBuilder(db)

    db = updateInfo(db,genresIds,actorsIds)

    fullJSONFile = {}
    fullJSONFile['movies'] = db['filmes']
    fullJSONFile['genres'] = genres
    fullJSONFile['actors'] = actors
    
    with open('dataset.json','w') as file:
        file.write(json.dumps(fullJSONFile,indent=2))

if __name__ == '__main__':
    main()