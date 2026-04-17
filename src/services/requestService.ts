import api from './api';

export interface DeliveryRequest {
    id: number;
    type: 'send' | 'buy';
    status: 'pending' | 'approved' | 'collected' | 'delivered';
    pickup_address: string;
    delivery_address: string;
    item_description: string;
    special_instructions?: string;
    store_name?: string;
    item_cost?: number;
    delivery_fee: number;
    latitude?: number;
    longitude?: number;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
        phone: string;
    };
}

export interface RequestStats {
    active: number;
    completed: number;
    totalDeliveries: number;
    totalSpent: number;
    admin?: {
        pending: number;
        approved: number;
        collected: number;
        delivered: number;
        total: number;
    };
}

export const requestService = {
    // Get all requests (admin only)
    getAllRequests: async () => {
        const response = await api.get('/requests');
        return response.data;
    },

    // Get current user's requests
    getUserRequests: async () => {
        const response = await api.get('/requests/my-requests');
        return response.data;
    },

    // Get single request
    getRequest: async (id: number) => {
        const response = await api.get(`/requests/${id}`);
        return response.data;
    },

    // Create new request
    createRequest: async (requestData: any) => {
        const response = await api.post('/requests', requestData);
        return response.data;
    },

    // Update request status (admin only)
    updateRequestStatus: async (id: number, status: string) => {
        const response = await api.put(`/requests/${id}/status`, { status });
        return response.data;
    },

    // Get stats
    getStats: async () => {
        const response = await api.get('/requests/stats');
        return response.data;
    }
};