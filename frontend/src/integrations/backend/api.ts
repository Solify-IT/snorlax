import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class Api {
  private api: AxiosInstance;

  public constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.api = axios.create(config);
    this.api.interceptors.request.use((param: AxiosRequestConfig) => ({
      baseURL,
      ...param,
    }));
  }

  public async get<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<[AxiosResponse<R> | undefined, Error | undefined]> {
    try {
      const res = await this.api.get<R>(url, config);
      return [res, undefined];
    } catch (e) {
      return [undefined, e.response];
    }
  }

  public async delete<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<[AxiosResponse<R> | undefined, Error | undefined]> {
    try {
      const res = await this.api.delete<R>(url, config);
      return [res, undefined];
    } catch (e) {
      return [undefined, e.response];
    }
  }

  public async post<T, B, R = AxiosResponse<T>>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig,
  ): Promise<[AxiosResponse<R> | undefined, Error | undefined]> {
    try {
      const res = await this.api.post<R>(url, data, config);
      return [res, undefined];
    } catch (e) {
      return [undefined, e.response];
    }
  }

  public async patch<T, B, R = AxiosResponse<T>>(
    url: string,
    data?: B,
    config?: AxiosRequestConfig,
  ): Promise<[AxiosResponse<R> | undefined, Error | undefined]> {
    try {
      const res = await this.api.patch<R>(url, data, config);
      return [res, undefined];
    } catch (e) {
      return [undefined, e.response];
    }
  }
}

export default Api;
