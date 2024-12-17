import { useEffect, useState } from 'react';
import { ProjectTable } from '../components/project_table/projectTable';
import { useNavigate } from 'react-router-dom';

export const Projects = () => {
    const [projects, setProjects] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem('token');
    
            if (!token) {
                setErrorMessage('No token found. Please log in first.');
                navigate('/login');
                return;
            }
    
            try {
                const response = await fetch('/api/prj/getall', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data);
                } else {
                    const data = await response.json();
                    if (response.status === 401) {
                        setErrorMessage('Token expired. Please log in again.');
                        navigate('/login');
                    } else {
                        setErrorMessage(data.message || 'Failed to fetch projects');
                    }
                }
            } catch (error) {
                setErrorMessage('An error occurred while fetching projects.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchProjects();
    }, [navigate]);

    if (loading) {
        return <div>Loading projects...</div>;
    }

    return (
        <div className="projects">
            <div className="w-full project-list">
                {errorMessage && <p className="text-red-600">{errorMessage}</p>}
                {projects && <ProjectTable projects={projects} />}
            </div>
        </div>
    );
};