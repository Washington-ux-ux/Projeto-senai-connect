import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const academicEventsFilePath = path.join(__dirname, '../data/academicEvent.json');

const readAcademicEventsJson = (): any[] => {
    const data = fs.readFileSync(academicEventsFilePath, 'utf-8');
    return JSON.parse(data);
};

const writeAcademicEventsJson = (data: any[]): void => {
    fs.writeFileSync(academicEventsFilePath, JSON.stringify(data, null, 2));
};

export const getAllAcademicEvents = async () => {
    return readAcademicEventsJson();
}

export const getAcademicEventByDate = async (date: string) => {
    const events = readAcademicEventsJson().filter((event: any) => event.date.startsWith(date));
    if (events.length === 0) {
        throw new Error('No events found for the given date');
    }
    return events;
}

export const createAcademicEvent = async (eventData: any) => {
    const events = readAcademicEventsJson();
    const newEvent = {
        id: String(events.length + 1),
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        type: eventData.type || 'EVENT',
        location: eventData.location || '',
        isHoliday: eventData.isHoliday || false
    }
    events.push(newEvent);
    writeAcademicEventsJson(events);
    return newEvent
}

export const deleteAcademicEvent = async (id: string) => {
    const events = readAcademicEventsJson();
    const index = events.findIndex((event: any) => event.id === id)
    if (index === -1) {
        throw new Error('Event not found')
    }
    const deletedEvent = events.splice(index, 1)[0];
    writeAcademicEventsJson(events);
    return deletedEvent
}

    