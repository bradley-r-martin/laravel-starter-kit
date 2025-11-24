import Table from '@/Components/Table/Table';
import { FunctionComponent } from 'react';

const ExpenseTableHeaders: FunctionComponent = () => {
    return (
        <>
            <Table.Thead.Tr>
                <Table.Th rowSpan={2} className="w-0 font-semibold text-slate-600 uppercase">
                    #
                </Table.Th>
                <Table.Th rowSpan={2} className="font-semibold text-slate-600 uppercase">
                    Item
                </Table.Th>
                <Table.Th colSpan={2} className="text-xs font-normal text-slate-500">
                    From expense
                </Table.Th>
                <Table.Th colSpan={4} className="text-xs font-normal text-slate-500">
                    From product
                </Table.Th>
            </Table.Thead.Tr>
            <Table.Thead.Tr className="*:p-2 *:px-3">
                <Table.Th className="w-20 font-semibold text-slate-600 uppercase">Qty</Table.Th>
                <Table.Th className="w-32 font-semibold text-slate-600 uppercase">Price</Table.Th>
                <Table.Th className="w-20 font-semibold text-slate-600 uppercase">Units</Table.Th>
                <Table.Th className="w-24 font-semibold text-slate-600 uppercase">RRP</Table.Th>
                <Table.Th className="w-24 font-semibold text-slate-600 uppercase">Royalty</Table.Th>
                <Table.Th className="w-24 font-semibold text-slate-600 uppercase">Rebate</Table.Th>
            </Table.Thead.Tr>
        </>
    );
};

export default ExpenseTableHeaders;
