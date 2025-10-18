import { Actions } from '@/components/Actions';
import AvatarInput from '@/components/AvatarInput';
import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { ModalContent } from '@/components/ModalContent';
import ModalHeader from '@/components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import { PencilIcon } from 'lucide-react';

interface ProductType {
    id: string;
    name: string;
    icon: string | null;
}

interface Manufacturer {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    sku: string;
    product_type_id: string;
    manufacturer_id: string;
    units: number;
    cost: number;
    price: number;
    rebate: string;
    royalty: string;
    avatar: string | null;
}

interface UpdateProps {
    product: Product;
    product_types: ProductType[];
    manufacturers: Manufacturer[];
}

export default function Update({ product, product_types, manufacturers }: UpdateProps) {
    const modal = useModal();
    const form = useForm({
        product_type_id: product.product_type_id,
        manufacturer_id: product.manufacturer_id,
        name: product.name,
        sku: product.sku,
        units: product.units,
        cost: product.cost,
        price: product.price,
        rebate: product.rebate,
        royalty: product.royalty,
        avatar: product.avatar,
    });
    const { processing } = form;

    return (
        <>
            <Head title={`Update Product: ${product.name}`} />
            <Modal>
                <ModalHeader
                    hero
                    title="Update product"
                    description={
                        <>
                            You are updating: <strong>{product.name}</strong>
                        </>
                    }
                    icon={<PencilIcon className="size-6" />}
                    color="blue"
                />

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{
                            url: route('products.update', product.id),
                            method: 'post',
                        }}
                        onSuccess={() => modal?.close()}
                    >
                        <ModalContent>
                            <Stack>
                                <Field name="avatar" type="file">
                                    <AvatarInput label="Image" name="avatar" />
                                </Field>
                                <Field name="name">
                                    <TextInput
                                        label="Name"
                                        name="name"
                                        placeholder="Enter product name"
                                    />
                                </Field>

                                <Field name="sku">
                                    <TextInput
                                        label="SKU"
                                        name="sku"
                                        placeholder="Enter product SKU"
                                    />
                                </Field>

                                <Field name="product_type_id" type="select">
                                    <Select
                                        label="Product Type"
                                        name="product_type_id"
                                        placeholder="Select product type"
                                        data={product_types.map((type) => ({
                                            value: type.id,
                                            label: type.name,
                                        }))}
                                        searchable
                                    />
                                </Field>

                                <Field name="manufacturer_id" type="select">
                                    <Select
                                        label="Manufacturer"
                                        name="manufacturer_id"
                                        placeholder="Select manufacturer"
                                        data={manufacturers.map((manufacturer) => ({
                                            value: manufacturer.id,
                                            label: manufacturer.name,
                                        }))}
                                        searchable
                                    />
                                </Field>

                                <Field name="units" type="number">
                                    <NumberInput
                                        label="Units"
                                        name="units"
                                        placeholder="Enter number of units"
                                        min={1}
                                    />
                                </Field>

                                <Field name="cost" type="number">
                                    <NumberInput
                                        label="Cost (cents)"
                                        name="cost"
                                        placeholder="Enter cost in cents"
                                        min={0}
                                    />
                                </Field>

                                <Field name="price" type="number">
                                    <NumberInput
                                        label="Price (cents)"
                                        name="price"
                                        placeholder="Enter price in cents"
                                        min={0}
                                    />
                                </Field>

                                <Field name="rebate" type="number">
                                    <TextInput
                                        label="Rebate"
                                        name="rebate"
                                        placeholder="Enter rebate (e.g. 0.05)"
                                    />
                                </Field>

                                <Field name="royalty" type="number">
                                    <TextInput
                                        label="Royalty"
                                        name="royalty"
                                        placeholder="Enter royalty (e.g. 0.10)"
                                    />
                                </Field>
                            </Stack>
                        </ModalContent>

                        <Actions>
                            <Button
                                onClick={() => modal?.close()}
                                type="button"
                                variant="subtle"
                                color="zinc"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" loading={processing}>
                                {processing ? 'Updating...' : 'Update Product'}
                            </Button>
                        </Actions>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
