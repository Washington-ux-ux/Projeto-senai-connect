import fs from 'fs';
import path from 'path';

const linksFilePath = path.join(__dirname, '../data/links.json');

const readLinksJson = (): any[] => {
    const data = fs.readFileSync(linksFilePath, 'utf-8');
    return JSON.parse(data);
};

const writeLinksJson = (data: any[]): void => {
    fs.writeFileSync(linksFilePath, JSON.stringify(data, null, 2));
};

export const getLinks = async () => {
    return readLinksJson();
}

export const createLink = async (linkData: any) => {
    const links = readLinksJson();
    const newLink = {
        id: String(links.length + 1),
        name: linkData.name,
        description: linkData.description,
        url: linkData.url,
        createdAt: new Date().toISOString()
    }
    links.push(newLink);
    writeLinksJson(links);
    return newLink
}

export const updateLink = async (id: string, linkData: any) => {
    const links = readLinksJson();
    const index = links.findIndex((link: any) => link.id === id)
    if (index === -1) {
        throw new Error('Link not found')
    }
    
    links[index] = {
        ...links[index],
        name: linkData.name,
        description: linkData.description,
        url: linkData.url
    }
    writeLinksJson(links);
    return links[index]
}

export const deleteLink = async (id: string) => {
    const links = readLinksJson();
    const index = links.findIndex((link: any) => link.id === id)
    if (index === -1) {
        throw new Error('Link not found')
    }
    
    const deletedLink = links[index]
    links.splice(index, 1);
    writeLinksJson(links);
    return deletedLink
}
