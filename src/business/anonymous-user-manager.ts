import type { AnonymousUser } from "../models/anonymous-user";
import { v4 as uuidv4 } from 'uuid';

export class AnonymousUserManager {
    public static getUserId() {
        let storedUserString = localStorage.getItem('anonymous-user');
        let storedUser: AnonymousUser = storedUserString ? JSON.parse(storedUserString) : undefined;
        if (!storedUserString || !storedUser || !storedUser.userId) {
            storedUser = { userId: uuidv4() };
            localStorage.setItem('anonymous-user', JSON.stringify(storedUser));
        } 
        return storedUser.userId;
    }
}