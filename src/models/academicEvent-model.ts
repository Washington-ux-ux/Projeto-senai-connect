export interface AcademicEvent {
  id: "uuid",
  title: "string",
  description: "text",
  type: "ENUM", // ['EXAM', 'HOLIDAY', 'PRESENTATION', 'WORK', 'EVENT']
  startDate: "timestamp",
  endDate: "timestamp",
  location: "string",
  author_id: "id_fk",
  author_name: "string",
  created_at: "datetime"
}