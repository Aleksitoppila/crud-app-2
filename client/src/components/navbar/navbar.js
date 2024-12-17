import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'use-debounce'

export const Navbar = () => {
    const [nav, setNav] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const navigate = useNavigate();

    const showNav = () => setNav(!nav)

    const closeNav = (e) => {
        if (!e.target.closest("nav") && !e.target.closest(".fi-rr-menu-burger") && !e.target.closest(".fi-rr-cross")) {
            setNav(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', closeNav)
        return () => document.removeEventListener('click', closeNav)
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('token') 
        if (token) {
            setIsAuthenticated(true)
        } else {
            setIsAuthenticated(false)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuthenticated(false)
        navigate('/')
    }

    return (
        <header className='sticky top-0 z-50 flex items-center justify-between w-full px-5 py-0 bg-teal-600 select-none md:py-1 lg:py-2'>
            <Link to='/'>
                <h1 className='text-3xl font-bold'>
                    APP
                </h1>
            </Link>
            <div className='flex invisible md:visible'>
                {isAuthenticated ? (
                    <div className='flex mx-auto nav-links'>
                        <Link to='/projects' className='bg-teal-700 mr-4 px-2 py-1 rounded-md hover:font-bold hover:scale-105 hover:-translate-y-[0,5] 
                                                        active:bg-teal-800 transition-all delay-[50] duration-75'>
                            <button>
                                Projects
                            </button>
                        </Link>
                        <Link to='/users' className='bg-teal-700 mr-4 px-2 py-1 rounded-md hover:font-bold hover:scale-105 hover:-translate-y-[0,5] 
                                                        active:bg-teal-800 transition-all delay-[50] duration-75'>
                            <button disabled>
                                Users
                            </button>
                        </Link>
                        <SearchBar />
                        <Link to='/logout' className='bg-teal-800 ml-4 px-2 py-1 rounded-md hover:font-bold hover:scale-105 hover:-translate-y-[0,5] 
                                                        active:bg-teal-900 transition-all delay-[50] duration-75'>
                            <button>
                                Log Out
                            </button>
                        </Link>
                    </div>
                ) : (
                    <Link to='/login' className='bg-teal-800 ml-4 px-2 py-1 rounded-md hover:font-bold hover:scale-105 hover:-translate-y-[0,5] 
                                                active:bg-teal-900 transition-all delay-[50] duration-75'>
                        <button>
                            Sign In
                        </button>
                    </Link>
                )}
            </div>

            <nav
                className={`h-[100vh] fixed top-0 right-0 flex flex-col pt-36 items-center w-full md:hidden text-white bg-zinc-900 z-40 transition-all ${nav ? '-translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className='flex flex-col w-full gap-12'>
                    {isAuthenticated ? (
                        <>
                            <SearchBar />
                            <Link to={'/'} className='flex justify-center w-4/5 mx-auto sm:w-3/4 md:w-fit'>
                                <button className="w-full py-2 text-white bg-teal-500 rounded-md hover:bg-teal-400 focus:outline-none">
                                    Home
                                </button>
                            </Link>
                            <Link to={'/Projects'} className='flex justify-center w-4/5 mx-auto sm:w-3/4 md:w-fit'>
                                <button className="w-full py-2 text-white bg-teal-500 rounded-md hover:bg-teal-400 focus:outline-none">
                                    Projects
                                </button>
                            </Link>

                            <Link to={'/Users'} className='flex justify-center w-4/5 mx-auto sm:w-3/4 md:w-fit'>
                                <button className="w-full py-2 text-white bg-teal-500 rounded-md hover:bg-teal-400 focus:outline-none">
                                    Users
                                </button>
                            </Link>
                            <Link to={'/logout'} className='flex justify-center w-4/5 mx-auto sm:w-3/4 md:w-fit'>
                                <button className="w-full py-2 text-white bg-teal-800 rounded-md hover:bg-teal-900 focus:outline-none"
                                        onClick={handleLogout}>
                                    Log Out
                                </button>
                            </Link>
                        </>
                    ) : (
                        <Link to='/login' className='flex justify-center w-4/5 mx-auto sm:w-3/4 md:w-fit'>
                            <button className="w-full py-2 text-white bg-teal-800 rounded-md hover:bg-teal-900 focus:outline-none">
                                Log In
                            </button>
                        </Link>
                    )}
                </div>
            </nav>

            {nav ? (
                <i
                    className="fi fi-rr-cross fixed flex items-center right-[30px]  text-2xl md:hidden z-50 cursor-pointer"
                    aria-hidden="true"
                    onClick={showNav}
                />
            ) : (
                <i
                    className="fi fi-rr-menu-burger fixed flex items-center right-[30px] text-3xl md:hidden z-50 cursor-pointer"
                    aria-hidden="true"
                    onClick={showNav}
                />
            )}
        </header>
    )
}

export const SearchBar = () => {
    const [input, setInput] = useState('')
    const [debouncedInput] = useDebounce(input, 200)
    const [suggestions, setSuggestions] = useState([])
    const [projects, setProjects] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem('token') 

            if (!token) {
                console.log('No token found');
                return;
            }

            const response = await fetch('/api/prj/getall', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            const json = await response.json()

            if (response.ok) {
                setProjects(json)
            } else {
                console.error('Error fetching projects:', json)
            }
        }

        fetchProjects()
    }, [])

    useEffect(() => {
        const pages = [
            { name: 'Home', route: '/', id: 'Page' },
            { name: 'Projects', route: '/projects', id: 'Page' },
        ]

        const allSuggestions = [
            ...pages,
            ...projects.map((project) => ({
                name: project.projectName,
                route: `/projects/${project._id}`,
                id: project._id
            })),
        ]

        if (debouncedInput) {
            const filteredSuggestions = allSuggestions.filter((suggestion) =>
                suggestion.name.toLowerCase().includes(debouncedInput.toLowerCase())
            )
            setSuggestions(filteredSuggestions)
        } else {
            setSuggestions([])
        }
    }, [debouncedInput, projects])

    const handleSuggestionClick = (route) => {
        navigate(route)
        setInput('')
        setSuggestions([])
    }

    return (
        <div className="relative z-10 flex items-center w-4/5 px-2 py-1 mx-auto bg-white rounded-none group input-wrapper sm:rounded-md sm:w-3/4 md:w-fit group-focus:text-zinc-600">
            <input
                type='search'
                placeholder="Type to Search"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="block outline-none text-zinc-900 text-left overflow-hidden text-ellipsis group-hover:placeholder:text-zinc-600 
                            placeholder:transition-colors placeholder:delay-[50] placeholder:duration-75 focus:placeholder:text-zinc-600
                            w-full search-cancel:appearance-none" required
            />
            <i className="fi fi-rr-search flex items-center text-zinc-400 text-sm group-hover:text-zinc-600 transition-colors delay-[50] duration-75 focus:text-zinc-600" />

            {suggestions.length > 0 && (
                <ul className="absolute right-0 z-30 min-w-full py-2 mt-1 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-md top-full w-fit text-zinc-900 shadow-zinc-900 max-h-80 [&::-webkit-scrollbar-thumb]:rounded-lg">
                    {suggestions.map((suggestion, index) => {
                        return (
                            <li
                                key={index}
                                className="p-2 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleSuggestionClick(suggestion.route)}
                            >
                                <div className="flex justify-between">
                                    <span className='mr-5 text-nowrap'>{suggestion.name}</span>
                                    {suggestion.id && <span className="block w-full px-2 py-1 overflow-hidden text-xs text-right text-gray-500 text-ellipsis whitespace-nowrap">{suggestion.id}</span>}
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
