import AppLayout from '@/Layouts/AppLayout';

import ActionWell from '@/Components/ActionWell';
import Cast from '@/Components/Cast';
import DescriptionList from '@/Components/DescriptionList';
import Navigate from '@/Components/Navigate';
import { Page } from '@/Components/Page';
import { InertiaView } from '@/Types';
import { ActionIcon, Badge, Button, Progress, Stack, Tooltip } from '@mantine/core';
import { ArrowLeftIcon, RefreshCcw } from 'lucide-react';

interface Site {
    id: string;
    name: string;
    address: Domain.Address | null;
    closed_at: string | null;
    created_at: string;
    manager_code: string;
    __realised_revenue: number;
    __deferred_revenue: number;
    __route_name: string;
    __shrinkage_value: number;
    __shrinkage_percentage: number;
    __stock_damaged_value: number;
    __card_revenue: number;
    __cash_revenue: number;
}

interface DetailProps {
    site: Site;
}

const Detail: InertiaView<DetailProps> = (props) => {
    const { site } = props;

    return (
        <Page>
            <Page.Header>
                <Navigate type="page" href={'/sites'}>
                    <Button
                        color="gray"
                        variant="subtle"
                        size="xs"
                        radius="xl"
                        ml={-10}
                        leftSection={<ArrowLeftIcon className="size-4" />}
                    >
                        Back
                    </Button>
                </Navigate>
                <Page.Header.Title>{site.name}</Page.Header.Title>
                <Page.Header.Description className="flex items-center gap-2 pt-2 text-xs">
                    <Badge
                        color={site.closed_at ? 'red' : 'green'}
                        variant="outline"
                        size="sm"
                        radius="xl"
                    >
                        {site.closed_at ? 'Closed' : 'Open'}
                    </Badge>
                    <span>
                        <Cast.Datetime>{site.created_at}</Cast.Datetime>
                    </span>
                </Page.Header.Description>
            </Page.Header>

            <Page.Content split>
                <Page.Content.Main>
                    {/* <SiteDetailPlacementsView />
                    <SiteDetailContactsView />
                    <SiteDetailResuppliesView />
                    <SiteDetailTransactionsView /> */}
                </Page.Content.Main>
                <Page.Content.Aside>
                    <div className="flex text-center *:flex-1">
                        <div className="space-y-1 text-zinc-950/60">
                            <div className="text-lg font-bold">
                                <Cast.Currency>{site.__realised_revenue}</Cast.Currency>
                            </div>
                            <div className="text-xs uppercase">Realised revenue</div>
                        </div>
                        <div className="space-y-1 text-zinc-950/60">
                            <div className="text-lg font-bold">
                                <Cast.Currency>{site.__deferred_revenue}</Cast.Currency>
                            </div>
                            <div className="text-xs uppercase">Deferred revenue</div>
                        </div>
                    </div>
                    <ActionWell>
                        <ActionWell.Row>
                            <Navigate type="modal" href={route('sites.update', site.id)}>
                                <Button>Update details</Button>
                            </Navigate>
                        </ActionWell.Row>
                        <ActionWell.Row>
                            <Button variant="light" color="zinc">
                                Change route
                            </Button>

                            <ActionWell.Divider />
                            {site.closed_at ? (
                                <Navigate type="modal" href={route('sites.reopen', site.id)}>
                                    <Button variant="light" color="green">
                                        Reinstate site
                                    </Button>
                                </Navigate>
                            ) : (
                                <Navigate type="modal" href={route('sites.close', site.id)}>
                                    <Button variant="light" color="red">
                                        Close site
                                    </Button>
                                </Navigate>
                            )}
                        </ActionWell.Row>
                    </ActionWell>
                    <Stack>
                        <DescriptionList>
                            <DescriptionList.Title>Details</DescriptionList.Title>
                            <DescriptionList.Items>
                                <DescriptionList.Item>
                                    <DescriptionList.Item.Label>
                                        Manager code
                                    </DescriptionList.Item.Label>
                                    <DescriptionList.Item.Value>
                                        <div className="flex gap-1.5 select-none">
                                            {site.manager_code?.split('').map((c, index) => (
                                                <span
                                                    key={index}
                                                    className="flex w-7 shrink-0 items-center justify-center overflow-hidden rounded bg-zinc-950/5 p-0.5 tracking-widest tabular-nums"
                                                >
                                                    {c}
                                                </span>
                                            ))}
                                            <Tooltip withArrow label="Refresh manager code">
                                                <Navigate
                                                    type="modal"
                                                    href={route(
                                                        'sites.refresh-manager-code',
                                                        site.id
                                                    )}
                                                >
                                                    <ActionIcon color="zinc" variant="subtle">
                                                        <RefreshCcw className="size-4" />
                                                    </ActionIcon>
                                                </Navigate>
                                            </Tooltip>
                                        </div>
                                    </DescriptionList.Item.Value>
                                </DescriptionList.Item>
                                <DescriptionList.Item>
                                    <DescriptionList.Item.Label>Address</DescriptionList.Item.Label>
                                    <DescriptionList.Item.Value className="whitespace-pre-wrap">
                                        <Cast.Address format="envelope">
                                            {site.address}
                                        </Cast.Address>
                                    </DescriptionList.Item.Value>
                                </DescriptionList.Item>
                                <DescriptionList.Item>
                                    <DescriptionList.Item.Label>Route</DescriptionList.Item.Label>
                                    <DescriptionList.Item.Value>
                                        {site.__route_name}
                                    </DescriptionList.Item.Value>
                                </DescriptionList.Item>
                            </DescriptionList.Items>
                        </DescriptionList>
                        <DescriptionList>
                            <DescriptionList.Title>Performance</DescriptionList.Title>
                            <DescriptionList.Items>
                                <DescriptionList.Item>
                                    <DescriptionList.Item.Label>
                                        Shrinkage
                                    </DescriptionList.Item.Label>
                                    <DescriptionList.Item.Value>
                                        <Tooltip
                                            label={
                                                <Cast.Currency rightSection=" lost revenue">
                                                    {site.__shrinkage_value}
                                                </Cast.Currency>
                                            }
                                        >
                                            <span>
                                                <Cast.Percentage>
                                                    {site.__shrinkage_percentage}
                                                </Cast.Percentage>
                                            </span>
                                        </Tooltip>
                                    </DescriptionList.Item.Value>
                                </DescriptionList.Item>
                                <DescriptionList.Item>
                                    <DescriptionList.Item.Label>Damage</DescriptionList.Item.Label>
                                    <DescriptionList.Item.Value>
                                        <Cast.Currency>{site.__stock_damaged_value}</Cast.Currency>
                                    </DescriptionList.Item.Value>
                                </DescriptionList.Item>
                                <DescriptionList.Item>
                                    <DescriptionList.Item.Label>
                                        Settlement Mix
                                    </DescriptionList.Item.Label>
                                    <DescriptionList.Item.Value>
                                        <Progress.Root size={20}>
                                            <Tooltip
                                                label={
                                                    <Cast.Currency rightSection=" card revenue">
                                                        {site.__card_revenue}
                                                    </Cast.Currency>
                                                }
                                            >
                                                <Progress.Section
                                                    value={site.__card_revenue}
                                                    color="cyan"
                                                >
                                                    <Progress.Label>Card</Progress.Label>
                                                </Progress.Section>
                                            </Tooltip>

                                            <Tooltip
                                                label={
                                                    <Cast.Currency rightSection=" cash revenue">
                                                        {site.__cash_revenue}
                                                    </Cast.Currency>
                                                }
                                            >
                                                <Progress.Section
                                                    value={site.__cash_revenue}
                                                    color="pink"
                                                >
                                                    <Progress.Label>Cash</Progress.Label>
                                                </Progress.Section>
                                            </Tooltip>
                                        </Progress.Root>
                                    </DescriptionList.Item.Value>
                                </DescriptionList.Item>
                            </DescriptionList.Items>
                        </DescriptionList>
                    </Stack>
                </Page.Content.Aside>
            </Page.Content>
        </Page>
    );
};

Detail.layout = [AppLayout];

export default Detail;
