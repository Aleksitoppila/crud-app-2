import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectDetails } from '../components/project_details/projectDetails';

export const ProjectManagement = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setErrorMessage('No token found. Please log in first.');
                return;
            }

            try {
                const response = await fetch(`/api/prj/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const json = await response.json();

                if (response.ok) {
                    setProject(json);
                } else {
                    setErrorMessage(json.message || 'Failed to fetch project data.');
                }
            } catch (error) {
                setErrorMessage('An error occurred while fetching the project.');
                console.error(error);
            }
        };

        fetchProject();

    }, [id]);

    return (
        <div className="project">
            <div className="project-information">
                {errorMessage && <div className="text-center text-red-600 error-message">{errorMessage}</div>}
                {project && <ProjectDetails project={project} />}
            </div>
        </div>
    );
};