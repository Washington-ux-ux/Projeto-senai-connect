import pool from '../config/database';

export const getLinks = async () => {
  const result = await pool.query('SELECT * FROM links ORDER BY "createdat" DESC');
  return result.rows;
}

export const createLink = async (linkData: any) => {
  const linkId = linkData.id || Math.floor(Math.random() * 1000000000);
  const result = await pool.query(
    `INSERT INTO links (id, name, description, url, "createdat")
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      linkId,
      linkData.name,
      linkData.description,
      linkData.url,
      new Date().toISOString()
    ]
  );
  
  return result.rows[0];
}

export const updateLink = async (id: string, linkData: any) => {
  const result = await pool.query(
    'UPDATE links SET name = $1, description = $2, url = $3 WHERE id = $4 RETURNING *',
    [linkData.name, linkData.description, linkData.url, id]
  );
  
  if (result.rows.length === 0) {
    throw new Error('Link not found');
  }
  
  return result.rows[0];
}

export const deleteLink = async (id: string) => {
  const result = await pool.query('DELETE FROM links WHERE id = $1 RETURNING *', [id]);
  
  if (result.rows.length === 0) {
    throw new Error('Link not found');
  }
  
  return result.rows[0];
}
