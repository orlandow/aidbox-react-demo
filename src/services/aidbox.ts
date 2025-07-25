import type { Bundle, FHIRResourceMap } from '../types';

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

  async search<T extends keyof FHIRResourceMap>(
    resourceType: T,
    params?: Record<string, string>
  ): Promise<Bundle<FHIRResourceMap[T]>> {
    const searchParams = new URLSearchParams(params);
    return this.request<Bundle<FHIRResourceMap[T]>>(`/fhir/${resourceType}?${searchParams}`);
  }

  async read<T extends keyof FHIRResourceMap>(
    resourceType: T,
    id: string
  ): Promise<FHIRResourceMap[T]> {
    return this.request<FHIRResourceMap[T]>(`/fhir/${resourceType}/${id}`);
  }
}

export default new AidboxService();
