import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

import React from "react";
export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

### annotations

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | int8        | number | true     |
| created_at | timestamptz | string | true     |
| quality    | text        | string | false    |
| image_name | text        | string | false    |

*/

// Hooks for annotations table
export const useAnnotations = () => useQuery({
    queryKey: ['annotations'],
    queryFn: () => fromSupabase(supabase.from('annotations').select('*'))
});

export const useAnnotation = (id) => useQuery({
    queryKey: ['annotations', id],
    queryFn: () => fromSupabase(supabase.from('annotations').select('*').eq('id', id).single())
});

export const useAddAnnotation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newAnnotation) => fromSupabase(supabase.from('annotations').insert([newAnnotation])),
        onSuccess: () => {
            queryClient.invalidateQueries('annotations');
        },
    });
};

export const useUpdateAnnotation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('annotations').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('annotations');
        },
    });
};

export const useDeleteAnnotation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('annotations').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('annotations');
        },
    });
};