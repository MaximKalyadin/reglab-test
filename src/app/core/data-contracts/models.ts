export interface User {
    id?: string;
    username: string;
    password: string;
    is_online: boolean;
}

export interface Channel {
    id?: string;
    name: string;
}

export interface Message {
    id?: string;
    content: string;
    from_user: string;
    channel_id: string;
    // добавил новое поле, только для того, чтобы группировать сообщения по дате
    // дата в формате iso
    date: string;
}

export interface UserChannel {
    id?: string;
    user_id: string;
    channel_id: string;
}

export interface UsersRequest {
    username: string;
    password: string;
}
