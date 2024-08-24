export interface User {
    id: number;
    username: string;
    password: string;
    is_online: boolean;
}

export interface Channel {
    id: number;
    name: string;
}

export interface Message {
    id: number;
    content: string;
    from_user: number;
    channel_id: number;
}

export interface UserChannel {
    user_id: number;
    channel_id: number;
}

export interface UsersRequest {
    username: string;
    password: string;
}
