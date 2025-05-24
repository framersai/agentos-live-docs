// File: frontend/src/services/apiService.ts
/**
 * @fileoverview Centralized API service for handling HTTP requests to the backend.
 * Manages base URL, default headers, authentication tokens, and standardized error handling.
 * This service is designed to be the single point of interaction for all backend API calls.
 * @module services/apiService
 */
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { storageService, StorageType } from './storageService';
import { AppError, ApiErrorResponse } from '../types/api.types'; // Ensure these types are well-defined

/**
 * Key used for storing the authentication token in browser storage.
 * @constant {string}
 */
export const AUTH_TOKEN_STORAGE_KEY = 'appAuthToken'; // More specific key name

/**
 * Represents the configuration options for the ApiService.
 * @interface ApiServiceConfig
 */
export interface ApiServiceConfig {
  /** The base URL for all API requests (e.g., "http://localhost:3001/api/v1"). */
  baseURL: string;
  /** Request timeout in milliseconds. Defaults to 30000 (30 seconds). */
  timeout?: number;
  /**
   * Optional callback function to be invoked when a 401 Unauthorized response is received.
   * This is typically used to trigger a global logout action.
   */
  onUnauthorized?: () => void;
}

/**
 * Interface for the API Service, defining its public contract.
 * @interface IApiService
 */
export interface IApiService {
  /** The underlying Axios instance used by the service. Exposed for advanced use cases if necessary. */
  readonly axiosInstance: AxiosInstance;

  /**
   * Sets the authentication token to be used for subsequent API requests.
   * The token is also persisted in browser storage.
   * @param {string | null} token - The authentication token, or null to clear it.
   * @param {boolean} [rememberMe=false] - If true, store token in localStorage; otherwise, use sessionStorage.
   */
  setAuthToken(token: string | null, rememberMe?: boolean): void;

  /**
   * Retrieves the current authentication token from memory.
   * @returns {string | null} The current token, or null if not set.
   */
  getAuthToken(): string | null;

  /**
   * Performs a GET request.
   * @template TRes - The expected type of the response data.
   * @param {string} url - The URL endpoint (relative to baseURL).
   * @param {AxiosRequestConfig} [config] - Optional Axios request configuration.
   * @returns {Promise<TRes>} A promise that resolves with the response data.
   * @throws {AppError} If the request fails.
   */
  get<TRes = any>(url: string, config?: AxiosRequestConfig): Promise<TRes>;

  /**
   * Performs a POST request.
   * @template TRes - The expected type of the response data.
   * @template TReq - The type of the request body data.
   * @param {string} url - The URL endpoint.
   * @param {TReq} [data] - The request body data.
   * @param {AxiosRequestConfig} [config] - Optional Axios request configuration.
   * @returns {Promise<TRes>} A promise that resolves with the response data.
   */
  post<TRes = any, TReq = any>(url: string, data?: TReq, config?: AxiosRequestConfig): Promise<TRes>;

  /**
   * Performs a PUT request.
   * @template TRes - The expected type of the response data.
   * @template TReq - The type of the request body data.
   * @param {string} url - The URL endpoint.
   * @param {TReq} [data] - The request body data.
   * @param {AxiosRequestConfig} [config] - Optional Axios request configuration.
   * @returns {Promise<TRes>} A promise that resolves with the response data.
   */
  put<TRes = any, TReq = any>(url: string, data?: TReq, config?: AxiosRequestConfig): Promise<TRes>;

  /**
   * Performs a DELETE request.
   * @template TRes - The expected type of the response data.
   * @param {string} url - The URL endpoint.
   * @param {AxiosRequestConfig} [config] - Optional Axios request configuration.
   * @returns {Promise<TRes>} A promise that resolves with the response data.
   */
  delete<TRes = any>(url: string, config?: AxiosRequestConfig): Promise<TRes>;

  /**
   * Performs a PATCH request.
   * @template TRes - The expected type of the response data.
   * @template TReq - The type of the request body data.
   * @param {string} url - The URL endpoint.
   * @param {TReq} [data] - The request body data.
   * @param {AxiosRequestConfig} [config] - Optional Axios request configuration.
   * @returns {Promise<TRes>} A promise that resolves with the response data.
   */
  patch<TRes = any, TReq = any>(url: string, data?: TReq, config?: AxiosRequestConfig): Promise<TRes>;
}

/**
 * Implements `IApiService` using Axios for making HTTP requests.
 * Handles token management, request/response interception, and standardized error wrapping.
 * @class ApiService
 * @implements {IApiService}
 */
class ApiService implements IApiService {
  public readonly axiosInstance: AxiosInstance;
  private currentAuthToken: string | null = null;
  private onUnauthorizedCallback?: () => void;

  /**
   * Creates an instance of ApiService.
   * @param {ApiServiceConfig} config - Configuration for the ApiService.
   */
  constructor(config: ApiServiceConfig) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.onUnauthorizedCallback = config.onUnauthorized;
    this.loadTokenFromStorage(); // Attempt to load token on instantiation
    this.initializeInterceptors();
  }

  private loadTokenFromStorage(): void {
    const token = storageService.get<string>(StorageType.Local, AUTH_TOKEN_STORAGE_KEY) ||
                  storageService.get<string>(StorageType.Session, AUTH_TOKEN_STORAGE_KEY);
    if (token) {
      this.setAuthToken(token); // Use setAuthToken to update instance and headers
    }
  }

  private initializeInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.currentAuthToken && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${this.currentAuthToken}`;
        }
        // You can add other request transformations here, e.g., request logging
        return config;
      },
      (error: AxiosError) => {
        console.error('[ApiService] Request Interceptor Error:', error);
        return Promise.reject(this.normalizeError(error));
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response.data, // Return data directly for convenience
      (error: AxiosError<ApiErrorResponse>) => { // Specify type for error.response.data
        const appError = this.normalizeError(error);
        if (appError.statusCode === 401 && this.onUnauthorizedCallback) {
          this.onUnauthorizedCallback();
        }
        return Promise.reject(appError);
      }
    );
  }

  /**
   * Normalizes an AxiosError into a standardized AppError.
   * @param {AxiosError<ApiErrorResponse>} error - The Axios error.
   * @returns {AppError} The normalized application error.
   */
  private normalizeError(error: AxiosError<ApiErrorResponse>): AppError {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { data, status } = error.response;
      const message = data?.message || error.message || 'An unknown API error occurred.';
      const code = data?.error || `HTTP_${status}`; // Use backend error code or generate one
      return {
        code,
        message,
        statusCode: status,
        details: data?.details,
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to the server. Please check your network connection.',
        details: error.message,
      };
    } else {
      // Something happened in setting up the request that triggered an Error
      return {
        code: 'REQUEST_SETUP_ERROR',
        message: `An error occurred while setting up the request: ${error.message}`,
      };
    }
  }

  /** @inheritdoc */
  public setAuthToken(token: string | null, rememberMe: boolean = false): void {
    this.currentAuthToken = token;
    if (token) {
      this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const storageType = rememberMe ? StorageType.Local : StorageType.Session;
      storageService.set(storageType, AUTH_TOKEN_STORAGE_KEY, token);
      // Ensure token is not in the other storage type
      const otherStorageType = rememberMe ? StorageType.Session : StorageType.Local;
      storageService.remove(otherStorageType, AUTH_TOKEN_STORAGE_KEY);
    } else {
      delete this.axiosInstance.defaults.headers.common['Authorization'];
      storageService.remove(StorageType.Local, AUTH_TOKEN_STORAGE_KEY);
      storageService.remove(StorageType.Session, AUTH_TOKEN_STORAGE_KEY);
    }
  }

  /** @inheritdoc */
  public getAuthToken(): string | null {
    return this.currentAuthToken;
  }

  /** @inheritdoc */
  public async get<TRes = any>(url: string, config?: AxiosRequestConfig): Promise<TRes> {
    return this.axiosInstance.get<TRes>(url, config);
  }

  /** @inheritdoc */
  public async post<TRes = any, TReq = any>(url: string, data?: TReq, config?: AxiosRequestConfig): Promise<TRes> {
    return this.axiosInstance.post<TRes>(url, data, config);
  }

  /** @inheritdoc */
  public async put<TRes = any, TReq = any>(url: string, data?: TReq, config?: AxiosRequestConfig): Promise<TRes> {
    return this.axiosInstance.put<TRes>(url, data, config);
  }

  /** @inheritdoc */
  public async delete<TRes = any>(url: string, config?: AxiosRequestConfig): Promise<TRes> {
    return this.axiosInstance.delete<TRes>(url, config);
  }

  /** @inheritdoc */
  public async patch<TRes = any, TReq = any>(url: string, data?: TReq, config?: AxiosRequestConfig): Promise<TRes> {
    return this.axiosInstance.patch<TRes>(url, data, config);
  }
}

/**
 * Default API base URL from Vite environment variables, with a fallback.
 * Ensure `VITE_API_BASE_URL` is defined in your `.env` files (e.g., `.env.development`, `.env.production`).
 * Example: `VITE_API_BASE_URL=http://localhost:3001/api/v1`
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'; // Fallback for safety

/**
 * Singleton instance of the `ApiService`.
 * This instance should be used for all backend API interactions.
 * The `onUnauthorized` callback will be set up in `main.ts` or an auth store.
 * @type {IApiService}
 */
export const apiService: IApiService = new ApiService({
  baseURL: API_BASE_URL,
});