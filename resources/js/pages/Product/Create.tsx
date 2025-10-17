import { Actions } from '@/components/Actions';
import Field from '@/components/Field';
import Form from '@/components/Form';
import FormErrorSound from '@/components/FormErrorSound';
import { Modal } from '@/components/Modal';
import { ModalContent } from '@/components/ModalContent';
import ModalHeader from '@/components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, NumberInput, Select, Stack, Stepper, TextInput } from '@mantine/core';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

interface ProductType {
    id: string;
    name: string;
    icon: string | null;
}

interface Manufacturer {
    id: string;
    name: string;
}

interface CreateProps {
    product_types: ProductType[];
    manufacturers: Manufacturer[];
}

export default function Create({ product_types, manufacturers }: CreateProps) {
    const modal = useModal();
    const form = useForm({
        product_type_id: '',
        manufacturer_id: '',
        name: '',
        sku: '',
        units: '',
        cost: 0,
        price: 0,
        rebate: '',
        royalty: '',
        avatar: null,
    });
    const { processing } = form;

    const [active, setActive] = useState(0);
    const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    return (
        <>
            <Head title="Create Product" />
            <Modal size="lg">
                <ModalHeader
                    hero
                    title="Create product"
                    description="Add a new product to the system"
                    icon={<PlusIcon className="size-6" />}
                    color="blue"
                />

                <FormErrorSound>
                    <Form
                        form={form}
                        action={{ url: route('products.store'), method: 'post' }}
                        onSuccess={() => modal?.close()}
                    >
                        <ModalContent>
                            <Stepper size="xs" color="zinc" active={active} onStepClick={setActive}>
                                <Stepper.Step label="Details">
                                    <Stack>
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
                                    </Stack>
                                </Stepper.Step>
                                <Stepper.Step label="Pricing">
                                    <Stack>
                                        <Field name="units" type="number">
                                            <NumberInput
                                                label="Units"
                                                name="units"
                                                placeholder="Enter number of units (default: 1)"
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
                                            <NumberInput
                                                label="Rebate"
                                                name="rebate"
                                                placeholder="Enter rebate (default: 0.00)"
                                            />
                                        </Field>

                                        <Field name="royalty" type="number">
                                            <NumberInput
                                                label="Royalty"
                                                name="royalty"
                                                placeholder="Enter royalty (default: 0.00)"
                                            />
                                        </Field>
                                    </Stack>
                                </Stepper.Step>
                            </Stepper>
                        </ModalContent>

                        <Actions>
                            {active === 0 && (
                                <Button
                                    onClick={() => modal?.close()}
                                    type="button"
                                    variant="subtle"
                                    color="zinc"
                                >
                                    Cancel
                                </Button>
                            )}
                            {active === 1 && (
                                <Button
                                    type="button"
                                    variant="subtle"
                                    color="zinc"
                                    onClick={prevStep}
                                >
                                    Back
                                </Button>
                            )}
                            {active === 0 && (
                                <Button type="button" onClick={nextStep}>
                                    Next
                                </Button>
                            )}
                            {active === 1 && (
                                <Button type="submit" loading={processing}>
                                    Create
                                </Button>
                            )}
                        </Actions>
                    </Form>
                </FormErrorSound>
            </Modal>
        </>
    );
}
