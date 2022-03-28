import re

def main():

    f = open("arqson.json")
    nf = open("newArqson.json", "w+", encoding='utf-8')

    nf.write('{\n"musicas": [\n')

    lines = f.readlines()

    idM = 0
    idP = 0
    provs = {}

    for line in lines[:-1]:

        prov = re.search(r'"prov":"([^,]+(\s+[^,])?)",', line)

        if prov[1] not in provs:
            provs[prov[1]] = idP
            idP += 1

        nf.write(line[:-2] + ',"idM":"' +  str(idM) + '","idP":"' + str(provs[prov[1]]) + '"},\n')
        idM += 1
    
    line = lines[-1]
    prov = re.search(r'"prov":"([^,]+(\s+[^,])?)",', line)
    if prov[1] not in provs:
        provs[prov[1]] = idP
        idP += 1

    nf.write(line[:-2] + ',"idM":"' +  str(idM) + '","idP":"' + str(provs[prov[1]]) + '"}\n')
    nf.write("]\n}")

if __name__ == "__main__":
    main()