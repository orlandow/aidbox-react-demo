import type { Bundle, ResourceTypeMap, OperationResultMap, OperationName, Parameters } from '../types/fhir';

const AIDBOX_BASE_URL = 'http://localhost:8080';

class AidboxService {
  private baseUrl: string;

  constructor(baseUrl: string = AIDBOX_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async search<T extends keyof ResourceTypeMap>(
    resourceType: T,
    params?: Record<string, string | string[]>
  ): Promise<Bundle<ResourceTypeMap[T]>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, value);
        }
      });
    }
    
    return this.request<Bundle<ResourceTypeMap[T]>>(`/fhir/${resourceType}?${searchParams}`);
  }

  async read<T extends keyof ResourceTypeMap>(
    resourceType: T,
    id: string
  ): Promise<ResourceTypeMap[T]> {
    return this.request<ResourceTypeMap[T]>(`/fhir/${resourceType}/${id}`);
  }

  async create<T extends keyof ResourceTypeMap>(
    resourceType: T,
    resource: ResourceTypeMap[T]
  ): Promise<ResourceTypeMap[T]> {
    return this.request<ResourceTypeMap[T]>(`/fhir/${resourceType}`, {
      method: 'POST',
      body: JSON.stringify(resource),
    });
  }

  async update<T extends keyof ResourceTypeMap>(
    resourceType: T,
    id: string,
    resource: ResourceTypeMap[T]
  ): Promise<ResourceTypeMap[T]> {
    return this.request<ResourceTypeMap[T]>(`/fhir/${resourceType}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(resource),
    });
  }

  async delete<T extends keyof ResourceTypeMap>(
    resourceType: T,
    id: string
  ): Promise<void> {
    await this.request<void>(`/fhir/${resourceType}/${id}`, {
      method: 'DELETE',
    });
  }

  async op<T extends OperationName>(
    operation: T,
    params: Record<string, any> | Parameters
  ): Promise<OperationResultMap[T]> {
    const isParametersResource = params && typeof params === 'object' && 'resourceType' in params;
    
    if (isParametersResource) {
      // Use POST for FHIR Parameters resource
      return this.request<OperationResultMap[T]>(`/fhir/${operation}`, {
        method: 'POST',
        body: JSON.stringify(params),
      });
    } else {
      // Use GET for query parameters
      const searchParams = new URLSearchParams();
      if (params && typeof params === 'object') {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
      }
      
      const queryString = searchParams.toString();
      const url = queryString ? `${operation}?${queryString}` : operation;
      
      return this.request<OperationResultMap[T]>(`/fhir/${url}`);
    }
  }
}

export default new AidboxService();
