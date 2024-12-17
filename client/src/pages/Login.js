import { useState } from 'react';
import { useNavigate } from 'react-router-dom/dist/index.d.mts';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/usrs/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                navigate('/projects');
                window.location.reload();
            } else {
                const data = await response.json();
                setErrorMessage(data.message || 'Login failed');
            }
        } catch (error) {
            setErrorMessage('An error occurred while trying to log in.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="relative items-center px-8 mx-auto my-24 bg-white w-fit h-96 text-zinc-900">
                <h1 className="pt-8 text-3xl font-bold text-center cursor-default">Sign In</h1>
                {errorMessage && (
                    <div role="alert" className="text-center text-red-600">
                        {errorMessage}
                    </div>
                )}
                <form
                    className="grid justify-center grid-flow-row grid-cols-1 gap-8 mx-auto mt-8"
                    onSubmit={handleSubmit}
                >
                    <div className="flex items-center border border-zinc-500">
                        <label className="px-1 font-bold select-none" htmlFor="email">
                            Email:{' '}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            pattern=".+@example\.com"
                            size="30"
                            className="w-full py-1 outline-none"
                            required
                        />
                    </div>
                    <div className="flex items-center border border-zinc-500">
                        <label className="px-1 font-bold select-none" htmlFor="password">
                            Password:{' '}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            className="w-full py-1 outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-teal-600 text-white mr-4 px-2 py-1 rounded-md hover:font-bold hover:scale-105 hover:-translate-y-[0.5] active:bg-teal-800 transition-all delay-[50] duration-75"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};