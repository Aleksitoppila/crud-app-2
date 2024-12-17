import React from "react"
import { Link } from "react-router-dom/dist/index.d.mts"

export const Home = () => {
    return (
        <div className="Home">
            <div className="relative w-full h-[75vh]">
                <img
                    className="object-cover w-full h-full bg-fixed"
                    src="./img/bg-picture.png"
                    alt="Background"
                />
                <div className="absolute text-4xl font-bold text-center text-white transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <div className="mb-12">
                        <h1 className="text-5xl">Create and manage your projects easily!</h1>
                    </div>
                    <div className="flex justify-center gap-8 mx-auto">
                        <Link to='/login'>
                            <button className="px-6 py-2 bg-teal-400 rounded-3xl hover:bg-teal-500 active:bg-teal-600">
                            Sign In
                            </button>
                        </Link>
                        <button className="px-6 py-2 bg-teal-400 rounded-3xl hover:bg-teal-500 active:bg-teal-600">
                            Learn more
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="grid w-full grid-cols-1 gap-6 mt-12 mb-12 sm:grid-cols-2 justify-items-center text-zinc-900">
                <div className="max-w-sm p-6 text-center bg-white shadow-md cursor-default h-[700px]">
                    <h2 className="mb-4 text-3xl font-semibold text-center">
                        Manage Projects
                    </h2>
                    <span className="block w-24 mx-auto mb-4 border-b-2 border-zinc-900"></span>
                    <p className="text-zinc-700">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>
                <div className="max-w-sm p-6 text-center bg-white shadow-md cursor-default">
                    <h2 className="mb-4 text-3xl font-semibold text-center">
                        Manage Users
                    </h2>
                    <span className="block w-24 mx-auto mb-4 border-b-2 border-zinc-900"></span>
                    <p className="text-zinc-700">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>
            </div>
        </div>
    )
};