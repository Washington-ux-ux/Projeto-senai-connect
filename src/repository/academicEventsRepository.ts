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

    