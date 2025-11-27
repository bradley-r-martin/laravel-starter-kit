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
import { Alert, Button, Divider, FileInput, Select, Stack, Text, TextInput } from '@mantine/core';
import { AlertCircle, FileText, PlusIcon, Upload } from 'lucide-react';
import { useState } from 'react';

interface CreateProps {
    wholesalers: Models.Wholesaler[];
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
    pages?: Array<{
        path: string;
        disk: string;
        mime_type: string;
        size: number;
        filename: string;
    }>;
}

export default function Create({ wholesalers }: CreateProps) {
    const modal = useModal();
    const form = useForm({
        invoice_no: '',
        invoice_date: null as string | null,
        wholesaler_id: '',
        pages: [] as Array<{
            path: string;
            disk: string;
            mime_type: string;
            size: number;
            filename: string;
        }>,
        expense_items: [] as Array<{
            item: string | null;
            quantity: number;
            units: number;
            cost: number;
            rebate: number;
            royalty: number;
            price: number;
        }>,
    });
    const { processing } = form;
    const [showManualEntry, setShowManualEntry] = useState(false);
    const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);

    const {
        error: analysisError,
        status: analysisStatus,
        upload: analyzeInvoice,
    } = useInvoiceAnalysis<AnalysisResponse>();

    const handleFileChange = async (file: File | null) => {
        if (!file) {
            setAnalysisData(null);
            form.setData('pages', []);
            form.setData('expense_items', []);
            return;
        }

        try {
            const response = await analyzeInvoice(file);
            if (response?.data) {
                setAnalysisData(response.data);
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
                if (response.data.pages) {
                    form.setData('pages', response.data.pages);
                }
                if (response.data.expense_items) {
                    form.setData('expense_items', response.data.expense_items);
                }
            }
        } catch (error) {
            // Error is already handled by the hook
            console.error('Invoice analysis failed:', error);
        }
    };

    const isAnalyzing = analysisStatus === 'analysing' || analysisStatus === 'loading';

    // Determine which fields are missing after analysis
    const missingFields = {
        invoice_no: !analysisData?.invoice_no,
        invoice_date: !analysisData?.invoice_date,
        wholesaler_id: !analysisData?.wholesaler_id,
    };

    const hasAnalysisData = analysisStatus === 'complete' && analysisData;
    const hasMissingFields =
        hasAnalysisData &&
        (missingFields.invoice_no || missingFields.invoice_date || missingFields.wholesaler_id);
    const shouldShowForm = showManualEntry || hasMissingFields;

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

                                    {analysisStatus === 'complete' && !hasMissingFields && (
                                        <Alert color="green" icon={<FileText className="size-4" />}>
                                            <Text size="sm">
                                                Invoice analyzed successfully! All fields have been
                                                filled.
                                            </Text>
                                        </Alert>
                                    )}

                                    {hasMissingFields && (
                                        <Alert
                                            color="yellow"
                                            icon={<AlertCircle className="size-4" />}
                                        >
                                            <Text size="sm">
                                                Please complete the missing fields below:
                                            </Text>
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

                                    {!hasAnalysisData && !showManualEntry && (
                                        <Divider
                                            label={
                                                <Button
                                                    variant="subtle"
                                                    size="xs"
                                                    onClick={() => setShowManualEntry(true)}
                                                >
                                                    or enter manually
                                                </Button>
                                            }
                                            labelPosition="center"
                                        />
                                    )}

                                    {shouldShowForm && (
                                        <Stack>
                                            {(showManualEntry || missingFields.invoice_no) && (
                                                <Field name="invoice_no">
                                                    <TextInput
                                                        label="Invoice No"
                                                        name="invoice_no"
                                                        placeholder="Enter invoice number"
                                                        required
                                                    />
                                                </Field>
                                            )}

                                            {(showManualEntry || missingFields.invoice_date) && (
                                                <Field name="invoice_date">
                                                    <TextInput
                                                        label="Invoice Date"
                                                        name="invoice_date"
                                                        type="date"
                                                        placeholder="Select invoice date"
                                                    />
                                                </Field>
                                            )}

                                            {(showManualEntry || missingFields.wholesaler_id) && (
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
                                            )}
                                        </Stack>
                                    )}
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
