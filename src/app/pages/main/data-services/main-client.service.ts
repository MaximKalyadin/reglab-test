import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    Channel,
    Message,
    User,
    UserChannel,
} from '@core/data-contracts/models';
import { environment } from '@env/environment';

@Injectable()
export class MainClientService {
    constructor(private readonly http: HttpClient) {}

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${environment.baseUrl}/users`);
    }

    addNewUser(user: User): Observable<User> {
        return this.http.post<User>(`${environment.baseUrl}/users`, {
            ...user,
        });
    }

    addNewChannel(channel: Channel): Observable<Channel> {
        return this.http.post<Channel>(`${environment.baseUrl}/channels`, {
            ...channel,
        });
    }

    addNewUSerChannel(userChannel: UserChannel): Observable<UserChannel> {
        return this.http.post<UserChannel>(
            `${environment.baseUrl}/user_channels`,
            {
                ...userChannel,
            }
        );
    }

    getUserChannel(user_id: string): Observable<UserChannel[]> {
        return this.http.get<UserChannel[]>(
            `${environment.baseUrl}/user_channels`,
            {
                params: {
                    user_id: user_id,
                },
            }
        );
    }

    getChannel(id: string): Observable<Channel[]> {
        return this.http.get<Channel[]>(`${environment.baseUrl}/channels/`, {
            params: {
                id,
            },
        });
    }

    getMessages(channel: Channel): Observable<Message[]> {
        return this.http.get<Message[]>(`${environment.baseUrl}/messages`, {
            params: {
                channel_id: channel.id || '',
            },
        });
    }

    addMessage(message: Message): Observable<Message> {
        return this.http.post<Message>(`${environment.baseUrl}/messages`, {
            ...message,
        });
    }
}
