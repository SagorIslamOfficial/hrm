import axios from 'axios';

export interface NotePayload {
    title: string;
    note: string;
    category?: string | null;
    is_private?: boolean;
}

export async function createNote(
    branchId: string | number,
    payload: NotePayload,
) {
    return axios.post(
        `/dashboard/hr/organization/branches/${branchId}/notes`,
        payload,
    );
}

export async function updateNote(
    branchId: string | number,
    noteId: string | number,
    payload: NotePayload,
) {
    return axios.put(
        `/dashboard/hr/organization/branches/${branchId}/notes/${noteId}`,
        payload,
    );
}

export async function deleteNote(
    branchId: string | number,
    noteId: string | number,
) {
    return axios.delete(
        `/dashboard/hr/organization/branches/${branchId}/notes/${noteId}`,
    );
}

export default { createNote, updateNote, deleteNote };
