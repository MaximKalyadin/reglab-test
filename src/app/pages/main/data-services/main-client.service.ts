import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Channel, User, UserChannel } from '@core/data-contracts/models';
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

    getUserChannel(user_id: number): Observable<UserChannel[]> {
        return this.http.get<UserChannel[]>(
            `${environment.baseUrl}/user_channels`,
            {
                params: {
                    user_id: user_id,
                },
            }
        );
    }

    getChannel(id: number): Observable<Channel[]> {
        return this.http.get<Channel[]>(`${environment.baseUrl}/channels/`, {
            params: {
                id,
            },
        });
    }
}
