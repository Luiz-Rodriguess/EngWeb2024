from lxml import etree
import os
from colorama import Fore,Style

class Validator:
    
    def __init__(self,xsdPath: str):
        xsdTree = etree.parse(xsdPath)
        self.xmlSchema = etree.XMLSchema(xsdTree)

    def validate(self,xmlPath: str):
        xmlTree = etree.parse(xmlPath)
        return self.xmlSchema.validate(xmlTree)
    
def validate(dirPath):
    validator = Validator('MapaRuas-materialBase/MRB-rua.xsd')
    
    files = os.listdir(dirPath)

    for file in files:
        filepath = os.path.join(dirPath,file)
        if validator.validate(filepath):
            print(Fore.GREEN + filepath)
            print(Style.RESET_ALL,end='')
        else:
            print(Fore.RED + filepath)
            print(Style.RESET_ALL,end='')