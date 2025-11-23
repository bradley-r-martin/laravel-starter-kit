import { Actions } from '@/Components/Actions';
import Field from '@/Components/Field';
import Form from '@/Components/Form';
import FormErrorSound from '@/Components/FormErrorSound';
import { Modal } from '@/Components/Modal';
import { ModalContent } from '@/Components/ModalContent';
import ModalHeader from '@/Components/ModalHeader';
import useInvoiceAnalysis from '@/Hooks/useInvoiceAnalysis';
import { Head, useForm } from '@inertiajs/react';
import { useModal } from '@inertiaui/modal-react';
import { Alert, Button, FileInput, Select, Stack, Text, TextInput } from '@mantine/core';
import { AlertCircle, FileText, PlusIcon, Upload } from 'lucide-react';

interface Wholesaler {
    id: string;
    name: string;
}

interface CreateProps {
    wholesalers: Wholesaler[];
}

interface AnalysisResponse {
    invoice_no?: string;
    invoice_date?: string;
    wholesaler_id?: string;
    wholesaler_name?: string;
    expense_items?: Array<{
        item: string | null;
        quantity: number;
        units: number;
        cost: number;
        rebate: number;
        royalty: number;
        price: number;
    }>;
}

export default function Create({ wholesalers }: CreateProps) {
    const modal = useModal();
    const form = useForm({
        invoice_no: '',
        invoice_date: null as string | null,
        wholesaler_id: '',
    });
    const { processing } = form;

    const {
        error: analysisError,
        status: analysisStatus,
        upload: analyzeInvoice,
    } = useInvoiceAnalysis<AnalysisResponse>();

    const handleFileChange = async (file: File | null) => {
        if (!file) return;

        try {
            const response = await analyzeInvoice(file);
            if (response?.data) {
                // Auto-fill the form with analyzed data
                if (response.data.invoice_no) {
                    form.setData('invoice_no', response.data.invoice_no);
                }
                if (response.data.invoice_date) {
                    form.setData('invoice_date', response.data.invoice_date);
                }
                if (response.data.wholesaler_id) {
                    form.setData('wholesaler_id', response.data.wholesaler_id);
                }
            }
        } catch (error) {
            // Error is already handled by the hook
            console.error('Invoice analysis failed:', error);
        }
    };

    const isAnalyzing = analysisStatus === 'analysing' || analysisStatus === 'loading';

    return (
        <>
            <Head title="Create Expense" />
            <Modal>
                <Modal.Body>
                    <ModalHeader
                        hero
                        title="Create expense"
                        description="Add a new expense to the system"
                        icon={<PlusIcon className="size-6" />}
                        color="blue"
                    />

                    <FormErrorSound>
                        <Form
                            form={form}
                            action={{ url: route('expenses.store'), method: 'post' }}
                            onSuccess={() => modal?.close()}
                        >
                            <ModalContent>
                                <Stack>
                                    <FileInput
                                        label="Upload Invoice"
                                        placeholder="Select PDF or image file"
                                        description="Upload an invoice to automatically extract data"
                                        accept="application/pdf,image/jpeg,image/png"
                                        leftSection={<Upload className="size-4" />}
                                        onChange={handleFileChange}
                                        disabled={isAnalyzing}
                                        clearable
                                    />

                                    {isAnalyzing && (
                                        <Alert color="blue" icon={<FileText className="size-4" />}>
                                            <Text size="sm">Analyzing invoice...</Text>
                                        </Alert>
                                    )}

                                    {analysisStatus === 'complete' && (
                                        <Alert color="green" icon={<FileText className="size-4" />}>
                                            <Text size="sm">Invoice analyzed successfully!</Text>
                                        </Alert>
                                    )}

                                    {analysisError && (
                                        <Alert
                                            color="red"
                                            icon={<AlertCircle className="size-4" />}
                                        >
                                            <Text size="sm">{analysisError}</Text>
                                        </Alert>
                                    )}

                                    <Field name="invoice_no">
                                        <TextInput
                                            label="Invoice No"
                                            name="invoice_no"
                                            placeholder="Enter invoice number"
                                            required
                                        />
                                    </Field>

                                    <Field name="invoice_date">
                                        <TextInput
                                            label="Invoice Date"
                                            name="invoice_date"
                                            type="date"
                                            placeholder="Select invoice date"
                                        />
                                    </Field>

                                    <Field name="wholesaler_id" type="select">
                                        <Select
                                            label="Wholesaler"
                                            name="wholesaler_id"
                                            placeholder="Select wholesaler"
                                            data={wholesalers.map((wholesaler) => ({
                                                value: wholesaler.id,
                                                label: wholesaler.name,
                                            }))}
                                            searchable
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
                                <Button type="submit" loading={processing} disabled={isAnalyzing}>
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
