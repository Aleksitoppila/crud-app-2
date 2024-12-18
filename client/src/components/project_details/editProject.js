import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export const EditProject = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formValue, setFormValue] = useState({
        projectName: '',
        description: '',
        projectManager: '',
        contributor: [],
        projectLink: '',
    });

    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found. Please log in first.');
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('/api/usrs', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setUsers(response.data);
            } catch (err) {
                console.error('Error fetching users:', err);
                if (err.response && err.response.status === 401) {
                    setErrorMessage('Session expired. Please log in again.');
                    navigate('/login');
                } else {
                    setErrorMessage('Failed to fetch users. Please try again.');
                }
            }
        };

        fetchUsers();
    }, [navigate]);

    useEffect(() => {
        const fetchProject = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setErrorMessage('No token found. Please log in first.');
                navigate('/login');
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(`/api/prj/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (response.status === 200) {
                    setFormValue(response.data);
                } else {
                    setErrorMessage('Failed to fetch project.');
                }
            } catch (error) {
                setErrorMessage('An error occurred while fetching the project.');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id, navigate]);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormValue((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleTabInsert = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const cursorPosition = e.target.selectionStart;
            const newDescription = formValue.description.slice(0, cursorPosition) + '\t' + formValue.description.slice(cursorPosition);
            setFormValue({
                ...formValue,
                description: newDescription,
            });

            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = cursorPosition + 1;
            }, 0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem('token');
        if (!token) {
            alert('No token found. Please log in first.');
            return;
        }

        try {
            const response = await axios.patch(`/api/prj/update/${id}`, formValue, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.status === 200) {
                setShowNotification(true);

                setTimeout(() => {
                    setShowNotification(false);
                    setIsModalOpen(false);
                    navigate(`/projects/${id}`);
                }, 1000);
            } else {
                setErrorMessage('Something went wrong');
            }
        } catch (err) {
            setErrorMessage('Error updating project');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <div className="flex">
                <div>
                    <button
                        className="px-2 py-2 transition-all duration-75 ease-in-out bg-green-500 rounded-sm hover:bg-green-400 hover:scale-105 hover:translate-y-[0.5] active:bg-green-600"
                        onClick={openModal}
                    >
                        <i className="pr-2 text-xs fi fi-rr-edit" />
                        Edit
                    </button>

                    {isModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="w-4/12 p-6 bg-white text-zinc-900">
                                <div className="flex justify-end mt-2">
                                    <button onClick={closeModal}>
                                        <i className="fi fi-rr-cross hover:text-red-500" />
                                    </button>
                                </div>
                                <h2 className="mb-4 text-xl font-bold">Edit Project</h2>
                                <form onSubmit={handleSubmit}>

                                    <div className="mb-4">
                                        <label className="font-bold text-zinc-900">Project Name</label>
                                        <input
                                            type="text"
                                            name="projectName"
                                            value={formValue.projectName}
                                            onChange={handleInput}
                                            required
                                            className="w-full p-2 mt-2 border rounded-sm focus:ring-teal-500 focus:outline-none"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="font-bold text-zinc-900">Description</label>
                                        <textarea
                                            name="description"
                                            value={formValue.description}
                                            onChange={handleInput}
                                            onKeyDown={handleTabInsert}
                                            required
                                            rows="4"
                                            className="w-full p-2 mt-2 border rounded-sm focus:ring-teal-500 focus:outline-none"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="font-bold text-zinc-900">Project Manager</label>
                                        <select
                                            name="projectManager"
                                            value={formValue.projectManager}
                                            onChange={handleInput}
                                            required
                                            className="w-full p-2 mt-2 border rounded-sm focus:ring-teal-500 focus:outline-none"
                                        >
                                            <option value="">Select Project Manager</option>
                                            {users.map((user) => (
                                                <option key={user._id} value={user._id}>
                                                    {user.firstName} {user.lastName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="font-bold text-zinc-900">Contributors</label>
                                        <select
                                            name="contributor"
                                            value={formValue.contributor}
                                            onChange={(e) =>
                                                handleInput({
                                                    target: {
                                                        name: 'contributor',
                                                        value: Array.from(e.target.selectedOptions, (option) => option.value),
                                                    },
                                                })
                                            }
                                            multiple
                                            required
                                            className="w-full p-2 mt-2 border rounded-sm focus:ring-teal-500 focus:outline-none"
                                        >
                                            {users.map((user) => (
                                                <option key={user._id} value={user._id}>
                                                    {user.firstName} {user.lastName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label className="font-bold text-zinc-900">Project Link</label>
                                        <input
                                            type="text"
                                            name="projectLink"
                                            value={formValue.projectLink}
                                            onChange={handleInput}
                                            required
                                            className="w-full p-2 mt-2 border rounded-sm focus:ring-teal-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="flex justify-end mt-4">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-400"
                                            disabled={loading}
                                        >
                                            {loading ? 'Updating...' : 'Update Project'}
                                        </button>
                                    </div>

                                    {loading && <div className="mt-2 text-center">Loading...</div>}
                                    {errorMessage && <div className="mt-2 text-red-500">{errorMessage}</div>}
                                </form>
                            </div>
                        </div>
                    )}

                    {showNotification && (
                        <div className="fixed p-4 text-white transform -translate-x-1/2 bg-green-500 rounded-md bottom-4 left-1/2">
                            Project updated successfully!
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
