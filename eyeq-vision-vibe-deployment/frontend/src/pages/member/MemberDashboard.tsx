import React, { useEffect, useState } from 'react';
import { fetchMemberQueries } from '../../services/apiService';
import QueryItem from '../../components/QueryItem';

const MemberDashboard = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getQueries = async () => {
            try {
                const data = await fetchMemberQueries();
                setQueries(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getQueries();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Member Dashboard</h1>
            <h2>Your Queries</h2>
            {queries.length === 0 ? (
                <p>No queries found.</p>
            ) : (
                <ul>
                    {queries.map(query => (
                        <QueryItem key={query.id} query={query} />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MemberDashboard;