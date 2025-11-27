import { Actions } from '@/Components/Actions';
import Data from '@/Components/Data/Data';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import AvatarInput from '@/Components/Inputs/AvatarInput';
import CurrencyInput from '@/Components/Inputs/CurrencyInput/CurrencyInput';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Button, Group, NumberInput, Select, Stack, TextInput } from '@mantine/core';
import { PlusIcon } from 'lucide-react';


export default function Create() {
    const modal = useModal();
    const form = useForm({
        product_type_id: '',
        manufacturer_id: '',
        name: '',
        sku: '',
        units: '',
        cost: 0,
        price: 0,
        rebate: 0,
        royalty: 0,
        avatar: null,
    });
    const { processing } = form;

    return (
        <>
            <Head title="Create Product" />
            <Modal>
                <Modal.Body>
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
                                <Stack>
                                    <Field name="avatar" type="file">
                                        <AvatarInput label="Image" name="avatar" />
                                    </Field>
                                    <Group wrap="nowrap">
                                        <Field name="name">
                                            <TextInput label="Name" name="name" className="w-2/3" />
                                        </Field>

                                        <Field name="sku">
                                            <TextInput label="SKU" name="sku" className="w-1/3" />
                                        </Field>
                                    </Group>

                                    <Group grow>
                                        <Field name="product_type_id" type="select">
                                            <Data
                                                parameter="product_types"
                                                map={(i: Models.ProductType) => ({
                                                    value: i.id,
                                                    label: i.name,
                                                })}
                                            >
                                                <Select
                                                    label="Product Type"
                                                    name="product_type_id"
                                                    searchable
                                                />
                                            </Data>
                                        </Field>

                                        <Field name="manufacturer_id" type="select">
                                            <Data
                                                parameter="manufacturers"
                                                map={(i: Models.Manufacturer) => ({
                                                    value: i.id,
                                                    label: i.name,
                                                })}
                                            >
                                                <Select
                                                    label="Manufacturer"
                                                    name="manufacturer_id"
                                                    searchable
                                                />
                                            </Data>
                                        </Field>
                                    </Group>

                                    <Group wrap="nowrap">
                                        <Field name="units" type="number">
                                            <NumberInput
                                                label="Units"
                                                name="units"
                                                min={1}
                                                className="w-1/5"
                                            />
                                        </Field>
                                        <Field name="cost" type="number">
                                            <CurrencyInput>
                                                <NumberInput
                                                    label="Cost"
                                                    name="cost"
                                                    min={0}
                                                    prefix="$"
                                                    decimalScale={2}
                                                    decimalSeparator="."
                                                    thousandSeparator=","
                                                    hideControls
                                                    className="w-2/5"
                                                />
                                            </CurrencyInput>
                                        </Field>

                                        <Field name="price" type="number">
                                            <CurrencyInput>
                                                <NumberInput
                                                    label="Price"
                                                    name="price"
                                                    min={0}
                                                    prefix="$"
                                                    decimalScale={2}
                                                    decimalSeparator="."
                                                    thousandSeparator=","
                                                    hideControls
                                                    className="w-2/5"
                                                />
                                            </CurrencyInput>
                                        </Field>
                                    </Group>

                                    <Group grow>
                                        <Field name="rebate" type="number">
                                            <NumberInput
                                                label="Rebate"
                                                name="rebate"
                                                suffix="%"
                                                decimalScale={2}
                                                decimalSeparator="."
                                                min={0}
                                                max={100}
                                                hideControls
                                            />
                                        </Field>

                                        <Field name="royalty" type="number">
                                            <NumberInput
                                                label="Royalty"
                                                name="royalty"
                                                suffix="%"
                                                decimalScale={2}
                                                decimalSeparator="."
                                                min={0}
                                                max={100}
                                                hideControls
                                            />
                                        </Field>
                                    </Group>
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
                                    Create
                                </Button>
                            </Actions>
                        </Form>
                    </FormErrorSound>
                </Modal.Body>
            </Modal>
        </>
    );
}
