export interface AcademicEvent {
  id: "uuid",
  title: "string",
  description: "text",
  date: "datetime",
  type: "ENUM", // ['EXAM', 'HOLIDAY', 'PRESENTATION', 'WORK']
  course_id: "id_fk",
  created_at: "datetime"
}