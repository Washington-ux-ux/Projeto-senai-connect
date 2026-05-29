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
