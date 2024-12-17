import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom/dist/index.d.mts'
import axios from 'axios'
import { Notification } from '../notification'

export const DeleteProject = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [showModal, setShowModal] = useState(false)
    const [showNotification, setShowNotification] = useState(false)
    const [loading, setLoading] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [projectData, setProjectData] = useState(null)
    const [notificationType, setNotificationType] = useState('')

    useEffect(() => {
        const fetchProject = async () => {
            const token = localStorage.getItem('token'); 
            if (!token) {
                console.error('No token found. Please log in first.');
                return; 
            }
            try {
                const response = await axios.get(`/api/prj/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    setProjectData(response.data);
                } else {
                    alert('Error fetching project data');
                }
            } catch (err) {
                console.error('Error fetching project data:', err);
            }
        };
        fetchProject();
    }, [id]);

    const openModal = () => setShowModal(true)

    const closeModal = () => setShowModal(false)

    const handleDelete = async () => {
        if (projectName !== `remove ${projectData?.projectName}`) {
            alert('Project name does not match. Please type the correct project name to confirm deletion.')
            return
        }

        setLoading(true)

        try {
            const response = await axios.delete(`/api/prj/delete/${id}`)
            if (response.status === 200) {
                setShowNotification(true)
                setNotificationType('delete')
                setShowModal(false)
                setTimeout(() => {
                    navigate('/projects')
                }, 1500)
            } else {
                alert('Something went wrong while deleting the project')
            }
        } catch (err) {
            console.error('Error deleting project:', err)
            alert('Error deleting project')
        }

        setLoading(false)
    }

    return (
        <div className="flex">
            <button
                className="bg-red-500 hover:bg-red-400 hover:scale-105 hover:-translate-y-[0,5] ease-in-out transition-all duration-75 active:bg-red-600 px-2 rounded-sm"
                onClick={openModal}
            >
                <i className="pr-2 text-xs fi fi-rr-trash" />
                Delete
            </button>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-6 bg-white w-96 text-zinc-900">
                        <h2 className="mb-4 text-xl font-bold">Confirm Deletion</h2>
                        <p>
                            To confirm the deletion of the project, please type{' '}
                            <span className="font-semibold">"remove {projectData?.projectName}"</span>.<br />
                            This action cannot be undone.
                        </p>
                        <div className="mt-4">
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="w-full p-2 border rounded-sm ring-2 ring-zinc-400 focus:ring-teal-500 focus:outline-none"
                                placeholder={`Type "remove ${projectData?.projectName}"`}
                            />
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 mr-2 text-white bg-red-500 rounded hover:bg-red-400"
                                disabled={loading || projectName !== `remove ${projectData?.projectName}`}
                            >
                                {loading ? 'Deleting...' : 'Delete Project'}
                            </button>
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showNotification && (
                <Notification
                    message="Project was deleted successfully!"
                    onClose={() => setShowNotification(false)}
                    className={notificationType === 'delete' ? 'bg-red-500' : 'bg-green-500'}
                />
            )}
        </div>
    )
}