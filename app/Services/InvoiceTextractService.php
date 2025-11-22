<?php

declare(strict_types=1);

namespace App\Services;

use Aws\Exception\AwsException;
use Aws\Result;
use Aws\Textract\TextractClient;
use Carbon\Carbon;
use DateTimeImmutable;
use Exception;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;
use RuntimeException;

/**
 * Service for extracting expense data from invoice images using AWS Textract.
 */
final readonly class InvoiceTextractService
{
    /**
     * @phpstan-ignore-next-line
     */
    private TextractClient $textractClient;

    public function __construct()
    {
        /** @phpstan-ignore-next-line */
        $this->textractClient = new TextractClient([
            'version' => 'latest',
            'region' => config('services.aws.region', 'us-east-1'),
            'credentials' => [
                'key' => config('services.aws.key'),
                'secret' => config('services.aws.secret'),
            ],
        ]);
    }

    /**
     * Analyze invoice images and extract expense data.
     *
     * @param  array<string>  $imagePaths  Array of PNG image file paths (local paths or storage paths)
     * @return array{
     *     invoice_no: string|null,
     *     invoice_date: DateTimeImmutable|null,
     *     wholesaler_name: string|null,
     *     expense_items: array<int, array{
     *         item: string|null,
     *         quantity: int,
     *         units: int,
     *         cost: int,
     *         rebate: int,
     *         royalty: int,
     *         price: int
     *     }>,
     *     raw_data: array<mixed>
     * }
     */
    public function analyzeInvoice(array $imagePaths): array
    {
        if ($imagePaths === []) {
            throw new InvalidArgumentException('At least one image path is required');
        }

        // Prepare documents for Textract
        $documents = [];
        foreach ($imagePaths as $imagePath) {
            $imageContent = $this->getImageContent($imagePath);
            $documents[] = [
                'Bytes' => $imageContent,
            ];
        }

        try {
            // Process all pages
            /** @var array<mixed> $allResults */
            $allResults = [];
            foreach ($documents as $document) {
                /** @phpstan-ignore-next-line */
                $result = $this->textractClient->analyzeExpense([
                    'Document' => $document,
                ]);
                $allResults[] = $result;
            }

            return $this->extractExpenseData($allResults);
            /** @phpstan-ignore-next-line */
        } catch (AwsException $e) {
            /** @phpstan-ignore-next-line */
            $message = $e->getMessage();
            throw new RuntimeException('Failed to analyze invoice with Textract: '.$message, 0, $e);
        }
    }

    /**
     * Get image content from path (handles both local and storage paths).
     */
    private function getImageContent(string $imagePath): string
    {
        // Check if it's a storage path
        if (Storage::exists($imagePath)) {
            $content = Storage::get($imagePath);
            if ($content === null) {
                throw new RuntimeException("Failed to read image file from storage: {$imagePath}");
            }

            return $content;
        }

        // Check if it's a local file path
        if (file_exists($imagePath)) {
            $content = file_get_contents($imagePath);
            if ($content === false) {
                throw new RuntimeException("Failed to read image file: {$imagePath}");
            }

            return $content;
        }

        throw new RuntimeException("Image file not found: {$imagePath}");
    }

    /**
     * Extract and normalize expense data from Textract results.
     *
     * @param  array<mixed>  $textractResults
     * @return array{
     *     invoice_no: string|null,
     *     invoice_date: DateTimeImmutable|null,
     *     wholesaler_name: string|null,
     *     expense_items: array<int, array{
     *         item: string|null,
     *         quantity: int,
     *         units: int,
     *         cost: int,
     *         rebate: int,
     *         royalty: int,
     *         price: int
     *     }>,
     *     raw_data: array<mixed>
     * }
     */
    private function extractExpenseData(array $textractResults): array
    {
        $invoiceNo = null;
        $invoiceDate = null;
        $wholesalerName = null;
        $expenseItems = [];
        $rawData = [];
        $summaryFieldsExtracted = false;

        // Process each page result
        foreach ($textractResults as $result) {
            // Convert Result object to array for storage and access
            /** @phpstan-ignore-next-line */
            $resultArray = $result instanceof Result ? $result->toArray() : (is_array($result) ? $result : []);
            if (! is_array($resultArray)) {
                $resultArray = [];
            }
            $rawData[] = $resultArray;
            if (! isset($resultArray['ExpenseDocuments'])) {
                continue;
            }
            if (! is_array($resultArray['ExpenseDocuments'])) {
                continue;
            }

            foreach ($resultArray['ExpenseDocuments'] as $expenseDocument) {
                if (! is_array($expenseDocument)) {
                    continue;
                }

                // Extract summary fields only from the first page (they should be consistent across pages)
                if (! $summaryFieldsExtracted && isset($expenseDocument['SummaryFields']) && is_array($expenseDocument['SummaryFields'])) {
                    foreach ($expenseDocument['SummaryFields'] as $field) {
                        if (! is_array($field)) {
                            continue;
                        }

                        $fieldTypeText = null;
                        if (isset($field['Type']) && is_array($field['Type']) && isset($field['Type']['Text']) && is_string($field['Type']['Text'])) {
                            $fieldTypeText = $field['Type']['Text'];
                        }

                        $fieldValueText = null;
                        if (isset($field['ValueDetection']) && is_array($field['ValueDetection']) && isset($field['ValueDetection']['Text']) && is_string($field['ValueDetection']['Text'])) {
                            $fieldValueText = $field['ValueDetection']['Text'];
                        }
                        if ($fieldTypeText === null) {
                            continue;
                        }
                        if ($fieldValueText === null) {
                            continue;
                        }

                        $fieldTypeLower = mb_strtolower($fieldTypeText);

                        match (true) {
                            str_contains($fieldTypeLower, 'invoice_receipt_id') || str_contains($fieldTypeLower, 'invoice_id') || str_contains($fieldTypeLower, 'receipt_id') => $invoiceNo = $this->normalizeInvoiceNumber($fieldValueText),
                            str_contains($fieldTypeLower, 'invoice_receipt_date') || str_contains($fieldTypeLower, 'invoice_date') || str_contains($fieldTypeLower, 'receipt_date') => $invoiceDate = $this->parseDate($fieldValueText),
                            str_contains($fieldTypeLower, 'vendor_name') || str_contains($fieldTypeLower, 'merchant_name') || str_contains($fieldTypeLower, 'supplier_name') => $wholesalerName = $this->normalizeWholesalerName($fieldValueText),
                            default => null,
                        };
                    }
                    $summaryFieldsExtracted = true;
                }

                // Extract line items from all pages
                if (isset($expenseDocument['LineItemGroups']) && is_array($expenseDocument['LineItemGroups'])) {
                    foreach ($expenseDocument['LineItemGroups'] as $lineItemGroup) {
                        if (! is_array($lineItemGroup)) {
                            continue;
                        }
                        if (! isset($lineItemGroup['LineItems'])) {
                            continue;
                        }
                        if (! is_array($lineItemGroup['LineItems'])) {
                            continue;
                        }
                        foreach ($lineItemGroup['LineItems'] as $lineItem) {
                            if (! is_array($lineItem)) {
                                continue;
                            }

                            $expenseItem = $this->extractLineItem($lineItem);
                            if ($expenseItem !== null) {
                                $expenseItems[] = $expenseItem;
                            }
                        }
                    }
                }
            }
        }

        return [
            'invoice_no' => $invoiceNo,
            'invoice_date' => $invoiceDate,
            'wholesaler_name' => $wholesalerName,
            'expense_items' => $expenseItems,
            'raw_data' => $rawData,
        ];
    }

    /**
     * Extract data from a single line item.
     *
     * @param  array<mixed>  $lineItem
     * @return array{
     *     item: string|null,
     *     quantity: int,
     *     units: int,
     *     cost: int,
     *     rebate: int,
     *     royalty: int,
     *     price: int
     * }|null
     */
    private function extractLineItem(array $lineItem): ?array
    {
        if (! isset($lineItem['LineItemExpenseFields']) || ! is_array($lineItem['LineItemExpenseFields'])) {
            return null;
        }

        $item = null;
        $quantity = 0;
        $units = 1;
        $cost = 0;
        $rebate = 0;
        $royalty = 0;
        $price = 0;

        foreach ($lineItem['LineItemExpenseFields'] as $field) {
            if (! is_array($field)) {
                continue;
            }

            $fieldTypeText = null;
            if (isset($field['Type']) && is_array($field['Type']) && isset($field['Type']['Text']) && is_string($field['Type']['Text'])) {
                $fieldTypeText = $field['Type']['Text'];
            }

            $fieldValueText = null;
            if (isset($field['ValueDetection']) && is_array($field['ValueDetection']) && isset($field['ValueDetection']['Text']) && is_string($field['ValueDetection']['Text'])) {
                $fieldValueText = $field['ValueDetection']['Text'];
            }
            if ($fieldTypeText === null) {
                continue;
            }
            if ($fieldValueText === null) {
                continue;
            }

            $fieldTypeLower = mb_strtolower($fieldTypeText);

            match (true) {
                str_contains($fieldTypeLower, 'item') || str_contains($fieldTypeLower, 'description') || str_contains($fieldTypeLower, 'product') => $item = mb_trim($fieldValueText),
                str_contains($fieldTypeLower, 'quantity') || str_contains($fieldTypeLower, 'qty') => $quantity = $this->parseInteger($fieldValueText),
                str_contains($fieldTypeLower, 'unit') && ! str_contains($fieldTypeLower, 'price') => $units = $this->parseInteger($fieldValueText, 1),
                str_contains($fieldTypeLower, 'cost') || str_contains($fieldTypeLower, 'amount') => $cost = $this->parsePrice($fieldValueText),
                str_contains($fieldTypeLower, 'rebate') || str_contains($fieldTypeLower, 'discount') => $rebate = $this->parsePrice($fieldValueText),
                str_contains($fieldTypeLower, 'royalty') || str_contains($fieldTypeLower, 'fee') => $royalty = $this->parsePrice($fieldValueText),
                str_contains($fieldTypeLower, 'price') || str_contains($fieldTypeLower, 'total') => $price = $this->parsePrice($fieldValueText),
                default => null,
            };
        }

        // If no item name found, skip this line item
        if ($item === null || $item === '' || $item === '0') {
            return null;
        }

        return [
            'item' => $item,
            'quantity' => $quantity,
            'units' => $units,
            'cost' => $cost,
            'rebate' => $rebate,
            'royalty' => $royalty,
            'price' => $price,
        ];
    }

    /**
     * Normalize invoice number.
     */
    private function normalizeInvoiceNumber(string $value): string
    {
        // Remove common prefixes and clean up
        $trimmed = mb_trim($value);
        $normalized = preg_replace('/^(invoice|inv|receipt|rec)[\s#:]*/i', '', $trimmed);
        if ($normalized === null) {
            return $trimmed;
        }

        $normalized = preg_replace('/[^\w\-]/', '', $normalized);
        if ($normalized === null) {
            return $trimmed;
        }

        return $normalized !== '' && $normalized !== '0' ? $normalized : $trimmed;
    }

    /**
     * Normalize wholesaler name.
     */
    private function normalizeWholesalerName(string $value): string
    {
        return mb_trim($value);
    }

    /**
     * Parse date string to DateTimeImmutable.
     */
    private function parseDate(?string $dateString): ?DateTimeImmutable
    {
        if ($dateString === null || $dateString === '' || $dateString === '0') {
            return null;
        }

        // Try common date formats
        $formats = [
            'Y-m-d',
            'm/d/Y',
            'd/m/Y',
            'Y/m/d',
            'M d, Y',
            'F d, Y',
            'd M Y',
            'Y-m-d H:i:s',
        ];

        foreach ($formats as $format) {
            $date = DateTimeImmutable::createFromFormat($format, mb_trim($dateString));
            if ($date !== false) {
                return $date->setTime(0, 0, 0);
            }
        }

        // Try Carbon's flexible parser as fallback
        try {
            $carbon = Carbon::parse($dateString);

            return DateTimeImmutable::createFromMutable($carbon->startOfDay()->toDateTime());
        } catch (Exception) {
            return null;
        }
    }

    /**
     * Parse price string to integer (cents).
     */
    private function parsePrice(?string $priceString): int
    {
        if ($priceString === null || $priceString === '' || $priceString === '0') {
            return 0;
        }

        // Remove currency symbols and whitespace
        $trimmed = mb_trim($priceString);
        $cleaned = preg_replace('/[^\d.,\-]/', '', $trimmed);
        if ($cleaned === null) {
            return 0;
        }

        // Handle different decimal separators
        $cleaned = str_replace(',', '', $cleaned);

        // Parse as float and convert to cents
        $floatValue = (float) $cleaned;

        return (int) round($floatValue * 100);
    }

    /**
     * Parse integer value.
     */
    private function parseInteger(?string $value, int $default = 0): int
    {
        if ($value === null || $value === '' || $value === '0') {
            return $default;
        }

        // Remove non-numeric characters except minus sign
        $cleaned = preg_replace('/[^\d\-]/', '', mb_trim($value));

        return (int) $cleaned !== 0 ? (int) $cleaned : $default;
    }
}
