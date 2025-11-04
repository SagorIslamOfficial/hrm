import axios from 'axios';

export interface NotePayload {
    note: string;
    category?: string | null;
    is_private?: boolean;
}

export async function createNote(
    employeeId: string | number,
    payload: NotePayload,
) {
    return axios.post(`/dashboard/hr/employee/${employeeId}/notes`, payload);
}

export async function updateNote(
    employeeId: string | number,
    noteId: string | number,
    payload: NotePayload,
) {
    return axios.put(
        `/dashboard/hr/employee/${employeeId}/notes/${noteId}`,
        payload,
    );
}

export async function deleteNote(
    employeeId: string | number,
    noteId: string | number,
) {
    return axios.delete(`/dashboard/hr/employee/${employeeId}/notes/${noteId}`);
}

export default { createNote, updateNote, deleteNote };
