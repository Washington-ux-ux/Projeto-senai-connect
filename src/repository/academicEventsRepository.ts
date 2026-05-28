import academicEvents from '../data/academicEvent.json'

export const getAllAcademicEvents = async () => {
    return academicEvents
}

export const getAcademicEventByDate = async (date: string) => {
    const events = academicEvents.filter((event: any) => event.date.startsWith(date));
    if (events.length === 0) {
        throw new Error('No events found for the given date');
    }
    return events;
}

export const createAcademicEvent = async (eventData: any) => {
    const newEvent = {
        id: String(academicEvents.length + 1),
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        type: eventData.type || 'EVENT',
        location: eventData.location || '',
        isHoliday: eventData.isHoliday || false
    }
    academicEvents.push(newEvent)
    return newEvent
}

export const deleteAcademicEvent = async (id: string) => {
    const index = academicEvents.findIndex((event: any) => event.id === id)
    if (index === -1) {
        throw new Error('Event not found')
    }
    const deletedEvent = academicEvents.splice(index, 1)[0]
    return deletedEvent
}

    