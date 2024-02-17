import xml.etree.ElementTree as ET
import os
import re

def xmlTagtoHtmlTag(tag:str):
    returnString = None
    if tag == '<para>':
        returnString = '<p>'
    elif tag == '</para>':
        returnString = '</p>'
    elif re.match(r'<[a-z]*>',tag):
        returnString = '<b>'
    elif re.match(r'</[a-z]*>',tag):
        returnString = '</b>'

    return returnString
    
def buildHouse(root):
    html = '' 
    html += '<h2>Casas</h2>'

    for child in root.findall('./corpo/lista-casas/casa'):
        html += '<ul>'
            
        linha = ET.tostring(child,encoding='utf-8').decode('utf-8')
        lista = [item for item in re.split(r'(</?[a-zÀ-ú =ç"]*>)|\n[ ]*',linha) if item]
        for item in lista:
            html += f'{item} '
        html+= '</ul>'

    return html

def buildImage(root,filepath):
    html = ''
    html += '<h2> Visão original</h2>'
    
    for child in root.findall('./corpo/figura'):
        html += '<img '
        for info in child.iter():
            if info.tag == 'imagem':
                html += f'src="{list(info.attrib.values())[0]}" width=600 height=300 '
            elif info.tag == 'legenda':
                html += f'alt="{info.text}"'
        html += '>'
        
    html += '<h2> Visão atual</h2>'
    fileNumber = filepath.split('/')[-1].split('-')[1]
    fileNumber = str(int(fileNumber))
        
    images = [file for file in os.listdir('MapaRuas-materialBase/atual') if file.split('-')[0] == fileNumber]

    for image in images:
        html += f'<img src="../atual/{image}" width=600 height=300 alt={image.split('-')[2]}>'
    
    return html

def buildText(root):
    html = ''
    for child in root.findall('./corpo/para'):    
        linha = ET.tostring(child,encoding='utf-8').decode()

        lista = re.split(r'(</?[a-z]*>)',linha)
        lista.pop(0)

        flag = True
        for item in lista:
            if flag:
                html += xmlTagtoHtmlTag(item)
            else:
                html += f'{item} '
            flag = not flag
    
    return html


def createBase(filepath):

    html = """ <!DOCTYPE html>
        <html lang='pt-PT'>
        <head>
            <title>Rua</title>
            <meta charset="utf-8"/>
        <body>
        """

    with open(filepath) as file:
        tree = ET.parse(file)
        root = tree.getroot()
    
        # parse meta
        html += '<h1>'
    
        for child in root.find('meta'):
            html += f'{child.text} '
    
        html += '</h1>'

        #parse corpo

        order = []
        for child in root.findall('corpo'):
            for i in child:
                if i.tag not in order:
                    order.append(i.tag)
        
        for tag in order:
            if tag == 'figura':
                    html +=  buildImage(root,filepath)
            elif tag == 'para':
                    html += buildText(root)
            elif tag == 'lista-casas':
                    html += buildHouse(root)


    html += '<h6><a href="../mainPage.html">Voltar</a></h6>'

    html += "</body>"
    newHTMLFile = f'MapaRuas-materialBase/html/{os.path.basename(filepath).split('.')[0]}.html'
    with open(newHTMLFile,"w") as ficheiroHTML:
        ficheiroHTML.write(html)
    

def BuildPages(dirPath):
    files = os.listdir(dirPath)

    for file in files:
        filepath = os.path.join(dirPath,file)

        if os.path.isfile(filepath):
            createBase(filepath)

def buildMainPage():
    with open('MapaRuas-materialbase/mainPage.html','w') as file:
    
        html = """ <!DOCTYPE html>
            <html lang='pt-PT'>
            <head>
                <title>Main Page</title>
                <meta charset="utf-8"/>
            <body>
            """
    
        files = [(name,(name.split('-')[-1].strip('.html'))) for name in os.listdir('MapaRuas-materialBase/html')]
        files = [(fileName,' '.join([name for name in re.findall(r'[A-Z][a-z]*',streetName)])) for fileName,streetName in files]
        files.sort(key=lambda tup: tup[1])


        html += '<ul>'
        for filename,streetName in files:
            html += f'<li><a href="html/{filename}">{streetName}</a></li>'
    
        html += '</ul>'

        html += '</body>'
        file.write(html)

dirPath = 'MapaRuas-materialBase/texto'
BuildPages(dirPath)
buildMainPage()
