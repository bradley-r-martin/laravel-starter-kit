import { Actions } from '@/Components/Actions';
import Cast from '@/Components/Cast';
import Data from '@/Components/Data/Data';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { TransferInput } from '@/Components/Inputs/TransferInput';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import Navatar from '@/Components/Navatar';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Alert, Button, Stack } from '@mantine/core';
import { AlertCircleIcon, PackageIcon } from 'lucide-react';
import { useMemo } from 'react';

interface AvailableProduct {
    value: string;
    label: string;
    __cost_per_unit: number;
}

interface Props {
    snackware: Models.Snackware & { products?: string[] };
    availableProducts?: AvailableProduct[];
}

export default function ChangeProducts({
    snackware,
    availableProducts: propsAvailableProducts,
}: Props) {
    const modal = useModal();
    const page = usePage();
    const isClosed = !!snackware.closed_at;

    const form = useForm({
        products: snackware.products || ([] as string[]),
    });

    const { processing } = form;

    // Get availableProducts from props, modal props (for modals), or page props (fallback)
    const availableProducts =
        propsAvailableProducts ||
        (modal?.props?.availableProducts as AvailableProduct[]) ||
        (page.props.availableProducts as AvailableProduct[]) ||
        [];

    const priceRange = useMemo(() => {
        const selectedProducts = availableProducts.filter((product) =>
            form.data.products.includes(product.value)
        );

        if (selectedProducts.length === 0) {
            return { min: 0, max: 0 };
        }

        const costs = selectedProducts
            .map((product) => {
                const cost = product.__cost_per_unit;
                if (cost == null) return null;
                const numCost = typeof cost === 'string' ? parseFloat(cost) : cost;
                return isNaN(numCost) ? null : numCost;
            })
            .filter((cost): cost is number => cost !== null);

        if (costs.length === 0) {
            return { min: 0, max: 0 };
        }

        const min = Math.min(...costs);
        const max = Math.max(...costs);

        return { min, max };
    }, [form.data.products, availableProducts]);

    return (
        <>
            <Head title={`Change Products: ${snackware.name}`} />
            <Modal size="xl">
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Change products"
                        description={
                            <>
                                Change products for snackware: <strong>{snackware.name}</strong>
                            </>
                        }
                        icon={<PackageIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{
                                url: route('snackwares.change-products', snackware.id),
                                method: 'post',
                            }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                {isClosed && (
                                    <Alert
                                        variant="light"
                                        color="red"
                                        icon={<AlertCircleIcon className="size-5" />}
                                        title="Cannot Change Products"
                                        mb="md"
                                    >
                                        This snackware is closed and cannot be updated.
                                    </Alert>
                                )}

                                <Stack gap="md">
                                    <Field name="products" type="transfer">
                                        <Data parameter="availableProducts" property="items">
                                            <TransferInput
                                                label={
                                                    <div className="flex w-full items-center justify-between">
                                                        <span>Products</span>
                                                        <span>
                                                            <Cast.Currency>
                                                                {priceRange?.min}
                                                            </Cast.Currency>{' '}
                                                            -{' '}
                                                            <Cast.Currency>
                                                                {priceRange?.max}
                                                            </Cast.Currency>
                                                        </span>
                                                    </div>
                                                }
                                                className="max-h-[400px]"
                                                disabled={isClosed}
                                                renderItem={(item) => (
                                                    <span className="flex w-full flex-1 items-center justify-between space-x-2 overflow-hidden">
                                                        <div className="flex flex-1 overflow-hidden">
                                                            <Navatar name={item.label} size="xs" />
                                                        </div>

                                                        <span className="rounded border border-zinc-200 bg-zinc-100 p-0.5 px-1 text-xs text-zinc-500">
                                                            <Cast.Currency>
                                                                {item.__cost_per_unit}
                                                            </Cast.Currency>
                                                        </span>
                                                    </span>
                                                )}
                                            />
                                        </Data>
                                    </Field>
                                </Stack>
                            </ModalContent>

                            <Actions>
                                <Button
                                    onClick={() => modal?.close()}
                                    type="button"
                                    variant="subtle"
                                    color="zinc"
                                    data-testid="cancel-action"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" loading={processing} disabled={isClosed}>
                                    {processing ? 'Changing...' : 'Change Products'}
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
