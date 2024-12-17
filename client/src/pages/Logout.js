import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom/dist/index.d.mts';

export const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        navigate('/login');
        window.location.reload();
    }, [navigate]);

    return (
        <div>
            Logging out...
        </div>
    );
};