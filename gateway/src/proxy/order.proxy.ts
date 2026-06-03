import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OrderProxy {
  private baseUrl = process.env.Order_SERVICE_URL;

  create(data: any) {
    return axios.post(`${this.baseUrl}/Orders`, data).then(r => r.data);
  }

  findAll() {
    return axios.get(`${this.baseUrl}/Orders`).then(r => r.data);
  }

  findOne(id: string) {
    return axios.get(`${this.baseUrl}/Orders/${id}`).then(r => r.data);
  }

  update(id: string, data: any) {
    return axios.put(`${this.baseUrl}/Orders/${id}`, data).then(r => r.data);
  }

  delete(id: string) {
    return axios.delete(`${this.baseUrl}/Orders/${id}`).then(r => r.data);
  }
}