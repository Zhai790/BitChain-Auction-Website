import { useState } from 'react';
import { GRAPHQL_ENDPOINT } from '../config/env';
import type { User } from '../types/user';
import { ADD_FUNDS_MUTATION } from '../graphql/mutations/userMutation';

type UseAddFundsReturn = {
    addFunds: (userId: number, amount: number) => Promise<User>;
    loading: boolean;
    error: string | null;
};

export function useAddFunds(): UseAddFundsReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function addFunds(userId: number, amount: number): Promise<User> {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(GRAPHQL_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: ADD_FUNDS_MUTATION,
                    variables: { userId, amount },
                }),
            });

            const json = await res.json();

            if (json.errors && json.errors.length > 0) {
                throw new Error(json.errors[0].message);
            }

            return json.data.addFunds as User;
        } catch (err: any) {
            setError(err.message || 'Failed to add funds.');
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return { addFunds, loading, error };
}
