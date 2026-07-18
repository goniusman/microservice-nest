import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthProxy {
  private baseUrl =
    process.env.AUTH_SERVICE_URL;

  async register(data: any) {
    const res = await axios.post(
      `${this.baseUrl}/auth/register`,
      data,
    );
    return res.data;
  }

  async login(data: any) {
    const res = await axios.post(
      `${this.baseUrl}/auth/login`,
      data,
    );
    return res.data;
  }

  async refresh(data: any) {
    const res = await axios.post(
      `${this.baseUrl}/auth/refresh`,
      data,
    );
    return res.data;
  }

  async profile(token: string) {
    const res = await axios.get(
      `${this.baseUrl}/auth/profile`,
      {
        headers: {
          Authorization: token,
        },
      },
    );
    return res.data;
  }

  async logout(token: string) {
    const res = await axios.get(
      `${this.baseUrl}/auth/logout`,
      {
        headers: {
          Authorization: token,
        },
      },
    );
    return res.data;
  }

}