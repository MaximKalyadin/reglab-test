import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Channel, User } from '@core/data-contracts/models';
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
}
