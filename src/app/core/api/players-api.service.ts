import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { PlayerRecord } from '@core/models/tournament.model';
import { API_URL } from './api-url';

@Service()
export class PlayersApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/players`;

  list() {
    return this.http.get<PlayerRecord[]>(this.url);
  }

  create(player: Omit<PlayerRecord, 'id'>) {
    return this.http.post<PlayerRecord>(this.url, player);
  }

  update(id: string, changes: Partial<PlayerRecord>) {
    return this.http.patch<PlayerRecord>(`${this.url}/${id}`, changes);
  }
}
