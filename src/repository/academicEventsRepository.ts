import pool from '../config/database';

export const getAllAcademicEvents = async () => {
    const result = await pool.query('SELECT * FROM academic_events ORDER BY "startDate" ASC');
    return result.rows;
}

export const getAcademicEventByDate = async (date: string) => {
    const result = await pool.query(
        'SELECT * FROM academic_events WHERE DATE("startDate") = $1 ORDER BY "startDate" ASC',
        [date]
    );
    
    if (result.rows.length === 0) {
        throw new Error('No events found for the given date');
    }
    
    return result.rows;
}

export const createAcademicEvent = async (eventData: any) => {
    const result = await pool.query(
        `INSERT INTO academic_events (id, title, description, type, "startDate", "endDate", location, author_id, author_name, "createdat")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
            eventData.id,
            eventData.title,
            eventData.description || '',
            eventData.type || 'EVENT',
            eventData.startDate,
            eventData.endDate || null,
            eventData.location || '',
            eventData.authorId || null,
            eventData.authorName || null,
            new Date().toISOString()
        ]
    );
    
    return result.rows[0];
}

export const deleteAcademicEvent = async (id: string) => {
    const result = await pool.query('DELETE FROM academic_events WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
        throw new Error('Event not found');
    }
    
    return result.rows[0];
}

    