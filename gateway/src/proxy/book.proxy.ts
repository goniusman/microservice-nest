import { Injectable, UseGuards } from '@nestjs/common';
import axios from 'axios';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';



@Injectable()
export class BookProxy {
  private baseUrl = process.env.BOOK_SERVICE_URL;

  @UseGuards(JwtAuthGuard)
  create(data: any) {
    return axios.post(`${this.baseUrl}/books`, data).then(r => r.data);
  }

  findAll() {
    return axios.get(`${this.baseUrl}/books`).then(r => r.data);
  }

  findOne(id: string) {
    return axios.get(`${this.baseUrl}/books/${id}`).then(r => r.data);
  }

  update(id: string, data: any) {
    return axios.put(`${this.baseUrl}/books/${id}`, data).then(r => r.data);
  }

  delete(id: string) {
    return axios.delete(`${this.baseUrl}/books/${id}`).then(r => r.data);
  }
}