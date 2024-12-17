import { useEffect, useState } from 'react'
import { UserDetails } from '../components/user_details/userDetails'
import { useNavigate } from 'react-router-dom';

export const UsersManagement = () => {

    const [users, setUsers] = useState(null)
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setErrorMessage('No token found. Please log in first.');
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('/api/usrs', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    const data = await response.json();
                    setErrorMessage(data.message || 'Failed to fetch users');
                }
            } catch (error) {
                setErrorMessage('An error occurred while trying to fetch users.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    return (
        <div className="users">
            <div className='users'>
                {users && users.map((user) => (
                    <UserDetails key={user._id} user={user} />
                ))}
            </div>
        </div>
    )
};