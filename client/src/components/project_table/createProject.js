import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Notification } from '../notification'
import { useNavigate } from 'react-router-dom'

export const CreateProject = () => {
    const [formValue, setFormValue] = useState({
        projectName: '',
        description: '',
        projectManager: '',
        contributor: [],
        projectLink: '',
    })

    const [users, setUsers] = useState([])
    const [showNotification, setShowNotification] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('');
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
                const response = await axios.get('/api/usrs', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                if (error.response && error.response.status === 401) {
                    setErrorMessage('Session expired. Please log in again.');
                    navigate('/login');
                } else {
                    setErrorMessage('Failed to fetch users. Please try again.');
                }
            }
        };
    
        if (isModalOpen) {
            fetchUsers();
        }
    }, [isModalOpen, navigate]);

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
        e.preventDefault();
    
        const token = localStorage.getItem('token');
    
        if (!token) {
            alert('No token found. Please log in first.');
            return;
        }
    
        try {
            const response = await axios.post('/api/prj/add', formValue, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.status === 201) {
                setShowNotification(true);
                setIsModalOpen(false);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                alert('Something went wrong');
            }
        } catch (err) {
            alert('Error creating project');
            console.error('Error:', err);
        }
    };

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    return (
        <div className='flex'>
            {errorMessage && (
                <div className="p-2 mb-4 text-white bg-red-500 rounded-md error-message">
                    {errorMessage}
                </div>
            )}
            <button onClick={openModal}
                className='flex items-center w-fit px-2 py-1 bg-green-500 hover:bg-green-400 hover:scale-105 hover:-translate-y-[0,5]
                            ease-in-out transition-all duration-75 active:bg-green-600 rounded-sm text-xs sm:text-sm md:text-lg'>
                <i className="flex items-center pr-2 fi fi-rs-add" />
                Create Project
            </button>

            {isModalOpen && (
                <div className='fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='w-4/12 p-6 bg-white text-zinc-900'>
                        <div className="flex justify-end mt-2">
                            <button onClick={closeModal}>
                                <i className="duration-75 ease-in-out fi fi-rr-cross hover:text-red-500 hover:transition-all" />
                            </button>
                        </div>
                        <h2 className='mb-4 text-xl font-bold'>Create New Project</h2>

                        <form onSubmit={handleSubmit}>
                            <div className='mb-4 group'>
                                <label className='font-bold transition-all duration-200 text-zinc-900 group-focus-within:text-teal-500'>Project Name</label>
                                <input
                                    type='text'
                                    name='projectName'
                                    value={formValue.projectName}
                                    onChange={handleInput}
                                    required
                                    className='w-full p-2 mt-2 border ring-2 ring-zinc-400 focus:ring-teal-500 focus:outline-none rounded-sm transition-color delay-[50] duration-75'
                                />
                            </div>
                            <div className='relative mb-4 group'>
                                <label className='font-bold transition-all duration-200 text-zinc-900 group-focus-within:text-teal-500'>Description</label>
                                <textarea
                                    name='description'
                                    id='description'
                                    value={formValue.description}
                                    onChange={handleInput}
                                    onKeyDown={handleTabInsert}
                                    required
                                    rows='4'
                                    className='w-full p-2 mt-2 border ring-2 ring-zinc-400 focus:ring-teal-500 focus:outline-none rounded-sm transition-colors delay-[50] duration-75 overflow-auto h-full resize-none'
                                />
                            </div>
                            <div className='relative mb-4 group'>
                                <label className='font-bold transition-all duration-200 text-zinc-900 group-focus-within:text-teal-500'>Project Manager</label>
                                <select
                                    name='projectManager'
                                    value={formValue.projectManager}
                                    onChange={handleInput}
                                    required
                                    className='w-full p-2 mt-2 border ring-2 ring-zinc-400 focus:ring-teal-500 focus:outline-none rounded-sm transition-all delay-[50] duration-75'
                                >
                                    <option value=''>Select Project Manager</option>
                                    {users.map(user => (
                                        <option key={user._id} value={user._id}>
                                            {user.firstName} {user.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='relative mb-4 group'>
                                <label className='font-bold transition-all duration-200 text-zinc-900 group-focus-within:text-teal-500'>contributors</label>
                                <select
                                    name='contributor'
                                    value={formValue.contributor}
                                    onChange={(e) => handleInput({ target: { name: 'contributor', value: Array.from(e.target.selectedOptions, option => option.value) } })}
                                    multiple
                                    required
                                    className='w-full p-2 mt-2 border ring-2 ring-zinc-400 focus:ring-teal-500 focus:outline-none rounded-sm transition-all delay-[50] duration-75'
                                >
                                    {users.map(user => (
                                        <option key={user._id} value={user._id}>
                                            {user.firstName} {user.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='relative mb-4 group'>
                                <label className='font-bold transition-all duration-200 text-zinc-900 group-focus-within:text-teal-500'>Project Link</label>
                                <input
                                    type='text'
                                    name='projectLink'
                                    value={formValue.projectLink}
                                    onChange={handleInput}
                                    required
                                    className='w-full p-2 mt-2 border ring-2 ring-zinc-400 focus:ring-teal-500 focus:outline-none rounded-sm transition-all delay-[50] duration-75'
                                />
                            </div>
                            <div className="flex justify-end mt-16">
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-400"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showNotification && (
                <Notification
                    message="Project was created!"
                    onClose={() => setShowNotification(false)}
                    className="bg-green-500"
                />
            )}
        </div>
    )
}