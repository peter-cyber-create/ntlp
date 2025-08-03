/**
 * API Client for NTLP Conference Frontend
 * Connects to Express Backend at http://localhost:5000
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  details?: string[];
  timestamp?: string;
}

export interface Registration {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  institution: string;
  phone?: string;
  position?: string;
  country?: string;
  session_track?: string;
  registration_type: 'academic' | 'industry' | 'student';
  dietary_requirements?: string;
  special_needs?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
  payment_status?: 'unpaid' | 'paid' | 'refunded';
  created_at?: string;
  updated_at?: string;
}

export interface Abstract {
  id?: number;
  title: string;
  abstract: string;
  authors: Array<{
    name: string;
    email: string;
    affiliation: string;
  }>;
  keywords: string[];
  track: string;
  type: 'research' | 'industry' | 'poster' | 'demo';
  status?: 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'revision_required';
  submission_date?: string;
  file_path?: string;
  created_at?: string;
  updated_at?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || 'An error occurred',
          details: data.details,
          timestamp: data.timestamp,
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string; service: string; version: string }>> {
    return this.request('/health');
  }

  // Registrations
  async getRegistrations(): Promise<ApiResponse<Registration[]>> {
    return this.request('/api/registrations');
  }

  async createRegistration(registration: Omit<Registration, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Registration>> {
    return this.request('/api/registrations', {
      method: 'POST',
      body: JSON.stringify(registration),
    });
  }

  // Abstracts
  async getAbstracts(): Promise<ApiResponse<Abstract[]>> {
    return this.request('/api/abstracts');
  }

  async createAbstract(abstract: Omit<Abstract, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Abstract>> {
    return this.request('/api/abstracts', {
      method: 'POST',
      body: JSON.stringify(abstract),
    });
  }

  // Reviews
  async getReviews(): Promise<ApiResponse<any[]>> {
    return this.request('/api/reviews');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
