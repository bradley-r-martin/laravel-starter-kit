import Header, { HeaderProps } from '@/Parts/Header';
import { Paginated } from '@/Types';
import { Pagination } from '../Pagination';
import ResourceListTable, { TableColumn } from './ResourceListTable';

interface ResourceListProps<T> {
    columns: TableColumn<T>[];
    data: Paginated<T>;
    headerProps?: HeaderProps;
    resource: string;
}

export default function ResourceList<T = unknown>(props: ResourceListProps<T>) {
    const { headerProps, data, resource, columns } = props;
    return (
        <>
            <Header {...(headerProps ?? {})} />
            <div className="container mx-auto mt-5 pb-[800px]">
                <ResourceListTable data={data} columns={columns} />
                <Pagination data={data} attribute={resource} />
            </div>
        </>
    );
}
