import { format } from 'date-fns'
import { Link } from 'react-router-dom/dist/index.d.mts'
import { ColumnFilter, includesFilter, dateFilter, dateFilterLogic } from './filters'

export const PROJECT_COLUMNS = [
    {
        Header: 'ID',
        accessor: '_id',
        Cell: ({ cell: { value }, row: { original } }) => (
            <Link to={`/projects/${original._id}`} target='_blank' rel='noreferrer'>{value}</Link>
        )
    },
    {
        Header: 'Project Name',
        accessor: 'projectName',
    },
    {
        Header: 'Description',
        accessor: 'description',
        Cell: props => <span
                            className='items-center block overflow-hidden text-ellipsis whitespace-nowrap max-w-fit'>
                                {props.value}
                        </span>
    },
    {
        Header: 'Created Date',
        accessor: 'createdDate',
        Filter: dateFilter,
        filter: dateFilterLogic,
        Cell: ({ value }) => {
            return format(new Date(value), 'dd/MM/yy HH:mm')
        }
    },
    {
        Header: 'Project Manager',
        accessor: 'projectManager',
        Filter: ColumnFilter,
        filter: includesFilter,
        Cell: ({ value }) => {
            if (value) {
                return `${value.firstName} ${value.lastName}`
            }
            return ''
        }
    },
    {
        Header: 'Contributors',
        accessor: 'contributor',
        Filter: ColumnFilter,
        filter: includesFilter,
        Cell: ({ value }) => {
            if (value && Array.isArray(value)) {
                return value.map(contributor => `${contributor.firstName} ${contributor.lastName}`).join(', ')
            }
            return ''
        }
    },
    {
        Header: 'Link',
        accessor: 'projectLink',
        Cell: props => <a   href={props.value} 
                            target='_blank' 
                            rel='noreferrer' 
                            className='font-bold text-blue-800'>
                                {props.value}
                        </a>
    },
]