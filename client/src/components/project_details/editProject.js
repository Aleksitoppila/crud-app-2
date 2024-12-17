import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Notification } from '../notification'
import { useNavigate } from 'react-router-dom';

export const EditProject = () => {
    const { id } = useParams();
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
    const navigate = useNavigate();

    useEffect(() => {
        if (isModalOpen) {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('No token found. Please log in first.');
                return;
            }

            axios
                .get('/api/usrs', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setUsers(response.data);
                })
                .catch((err) => {
                    console.error('Error fetching users', err);
                });
        }
    }, [isModalOpen]);

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
                const response = await fetch(`/api/prj/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setFormValue({
                        projectName: data.projectName,
                        description: data.description,
                        projectManager: data.projectManager,
                        contributor: data.contributor,
                        projectLink: data.projectLink,
                    });
                } else {
                    const data = await response.json();
                    setErrorMessage(data.message || 'Failed to fetch project');
                }
            } catch (error) {
                setErrorMessage('An error occurred while trying to fetch project.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id, navigate]);

    const showErrorNotification = () => {
        if (errorMessage) {
            return (
                <div className="error-notification">
                    <p>{errorMessage}</p>
                </div>
            );
        }
        return null;
    };

    const handleTabInsert = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault()

            const cursorPosition = e.target.selectionStart
            const newDescription = formValue.description.slice(0, cursorPosition) + '\t' + formValue.description.slice(cursorPosition)

            setFormValue({
                ...formValue,
                description: newDescription
            })

            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = cursorPosition + 1
            }, 0)
        }
    }

    const handleInput = (e) => {
        const { name, value } = e.target
        setFormValue({ ...formValue, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await axios.patch(`/api/prj/update/${id}`, formValue)

            if (response.status === 200) {
                setShowNotification(true)
                setIsModalOpen(false)
                window.location.reload()
            } else {
                alert('Something went wrong')
            }
        } catch (err) {
            alert('Error updating project')
        }

        setLoading(false)
    }

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    return (
        <>
            <div className='flex'>
                <div className="flex">
                    <button
                        className="bg-green-500 hover:bg-green-400 hover:scale-105 hover:-translate-y-[0,5] ease-in-out transition-all duration-75 active:bg-green-600 px-2 rounded-sm"
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
                                        <i className="duration-75 ease-in-out fi fi-rr-cross hover:text-red-500 hover:transition-all" />
                                    </button>
                                </div>
                                <h2 className="mb-4 text-xl font-bold">Edit Project</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4 group">
                                        <label className="font-bold transition-all duration-200 text-zinc-900 group-focus-within:text-teal-500">
                                            Project Name
                                        </label>
                                        <input
                                            type="text"
                                            name="projectName"
                                            value={formValue.projectName}
                                            onChange={handleInput}
                                            required
                                            className="w-full p-2 mt-2 border ring-2 ring-zinc-400 focus:ring-teal-500 focus:outline-none rounded-sm transition-color delay-[50] duration-75"
                                        />
                                    </div>
                                    <div className="relative mb-4 group">
                                        <label className="font-bold transition-all duration-200 text-zinc-900 group-focus-within:text-teal-500">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            id="description"
                                            value={formValue.description}
                                            onChange={handleInput}
                                            onKeyDown={handleTabInsert}
                                            required
                                            rows="4"
                                            className="w-full p-2 mt-2 border ring-2 ring-zinc-400 focus:ring-teal-500 focus:outline-none rounded-sm transition-colors delay-[50] duration-75 overflow-auto h-full resize-none"
                                        />
                                    </div>
                                    <div className="relative mb-4 group">
                                        <label className="font-bold transition-all duration-200 text-zinc-900 group-focus-within:text-teal-500">
                                            Project Manager
                                        </label>
                                        <select
                                            name="projectManager"
                                            value={formValue.projectManager}
                                            onChange={handleInput}
                                            required
                                            className="w-full p-2 mt-2 border ring-2 ring-zinc-400 focus:ring-teal-500 focus:outline-none rounded-sm transition-all delay-[50] duration-75"
                                        >
                                            <option value="">Select Project Manager</option>
                                            {users.map((user) => (
                                                <option key={user._id} value={user._id}>
                                                    {user.firstName} {user.lastName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="relative mb-4 group">
                                        <label className="font-bold transition-all duration-200 text-zinc-900 group-focus-within:text-teal-500">
                                            Contributors
                                        </label>
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
                                            className="w-full p-2 mt-2 border ring-2 ring-zinc-400 focus:ring-teal-500 focus:outline-none rounded-sm transition-all delay-[50] duration-75"
                                        >
                                            {users.map((user) => (
                                                <option key={user._id} value={user._id}>
                                                    {user.firstName} {user.lastName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="relative mb-4 group">
                                        <label className="font-bold transition-all duration-200 text-zinc-900 group-focus-within:text-teal-500">
                                            Project Link
                                        </label>
                                        <input
                                            type="text"
                                            name="projectLink"
                                            value={formValue.projectLink}
                                            onChange={handleInput}
                                            required
                                            className="w-full p-2 mt-2 border ring-2 ring-zinc-400 focus:ring-teal-500 focus:outline-none rounded-sm transition-all delay-[50] duration-75"
                                        />
                                    </div>
                                    <div className="flex justify-end mt-16">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-400"
                                            disabled={loading}
                                        >
                                            {loading ? 'Updating...' : 'Update Project'}
                                        </button>
                                    </div>
                                    <div className='pt-12'>
                                        {loading && <div>Loading...</div>}
                                        {showErrorNotification()}
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {showNotification && (
                        <Notification
                            message="Project was updated!"
                            onClose={() => setShowNotification(false)}
                            className="bg-green-500"
                        />
                    )}
                </div>
            </div>
        </>
    )
}