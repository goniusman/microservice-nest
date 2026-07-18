import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OrderProxy {
  private baseUrl = process.env.ORDER_SERVICE_URL;

  create(data: any) {
    return axios.post(`${this.baseUrl}/orders`, data).then(r => r.data);
  }

  findAll() {
    return axios.get(`${this.baseUrl}/orders`).then(r => r.data);
  }

  findOne(id: string) {
    return axios.get(`${this.baseUrl}/orders/${id}`).then(r => r.data);
  }

  update(id: string, data: any) {
    return axios.put(`${this.baseUrl}/orders/${id}`, data).then(r => r.data);
  }

  delete(id: string) {
    return axios.delete(`${this.baseUrl}/orders/${id}`).then(r => r.data);
  }
}