import linksJson from '../data/links.json'
import * as fs from 'fs'
import * as path from 'path'

export const getLinks = async () => {
    return linksJson
}

export const createLink = async (linkData: any) => {
    const newLink = {
        id: String(linksJson.length + 1),
        name: linkData.name,
        description: linkData.description,
        url: linkData.url,
        createdAt: new Date().toISOString()
    }
    linksJson.push(newLink)
    
    const filePath = path.join(__dirname, '../data/links.json')
    fs.writeFileSync(filePath, JSON.stringify(linksJson, null, 2))
    
    return newLink
}

export const updateLink = async (id: string, linkData: any) => {
    const index = linksJson.findIndex((link: any) => link.id === id)
    if (index === -1) {
        throw new Error('Link not found')
    }
    
    linksJson[index] = {
        ...linksJson[index],
        name: linkData.name,
        description: linkData.description,
        url: linkData.url
    }
    
    const filePath = path.join(__dirname, '../data/links.json')
    fs.writeFileSync(filePath, JSON.stringify(linksJson, null, 2))
    
    return linksJson[index]
}

export const deleteLink = async (id: string) => {
    const index = linksJson.findIndex((link: any) => link.id === id)
    if (index === -1) {
        throw new Error('Link not found')
    }
    
    const deletedLink = linksJson[index]
    linksJson.splice(index, 1)
    
    const filePath = path.join(__dirname, '../data/links.json')
    fs.writeFileSync(filePath, JSON.stringify(linksJson, null, 2))
    
    return deletedLink
}
