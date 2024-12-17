import { DeleteProject } from './deleteProject'
import { EditProject } from './editProject'

export const ProjectDetails = ({ project }) => {
    return (
        <div className="w-full mx-auto mt-24 text-center project-details md:w-3/4 lg:w-2/4">
            <div className="flex">
                <div className="flex w-1/2 text-3xl sm:text-4xl">
                    Project Details
                </div>
                <div className="flex justify-end w-1/2 gap-2 buttons">
                    <EditProject />
                    <DeleteProject />
                </div>
            </div>
            <div className="block mt-2">
                <h1 className="py-2 text-5xl bg-teal-600">
                    {project.projectName}
                </h1>
                <div className="grid grid-cols-2 bg-[#f2f2f2] text-zinc-900 py-4">
                    <div className="h-full px-4 mx-2 shadow-sm col-1 shadow-zinc-300">
                        <strong>
                            Project Description
                        </strong>
                        <div className="mt-1 mb-8 text-left whitespace-pre-wrap">
                            {project.description}
                        </div>
                    </div>
                    <div className="px-4 mx-2 shadow-sm col-2 shadow-zinc-300 h-fit">
                        <strong>
                            Project Manager
                        </strong>
                        <p className="mt-1 mb-8">
                            {project.projectManager ? `${project.projectManager.firstName} ${project.projectManager.lastName}` : 'N/A'}
                        </p>
                        <strong>
                            Contributors
                        </strong>
                        <p className="mt-1 mb-8">
                            {project.contributor && project.contributor.length > 0 ? (
                                project.contributor.map((contributor, index) => (
                                    <span key={index}>{`${contributor.firstName} ${contributor.lastName}`}{index < project.contributor.length - 1 ? ', ' : ''}</span>
                                ))
                            ) : (
                                'No contributors'
                            )}
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <h1 className="mt-4 text-2xl bg-teal-600">Tasks</h1>
                <ul className="bg-[#f2f2f2] text-zinc-500">
                    <li className="py-1"> Tasks coming later... </li>
                </ul>
            </div>
        </div>
    )
}