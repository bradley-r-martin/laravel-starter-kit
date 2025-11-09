import {
    Badge,
    Group,
    Input,
    InputWrapperProps,
    Stack,
    Text,
    TextInput,
    Tooltip,
} from '@mantine/core';
import {
    getCountries,
    getCountryCallingCode,
    isSupportedCountry,
    parsePhoneNumberFromString,
    type CountryCode,
    type NumberType,
} from 'libphonenumber-js';
import { Phone, PhoneMissedIcon } from 'lucide-react';
import { FunctionComponent, ReactNode, useEffect, useMemo, useState } from 'react';

export interface PhoneInputValue {
    country_code?: string | null;
    area_code?: string | null;
    number?: string | null;
    extension?: string | null;
    type?: string | null;
}

export interface PhoneInputProps extends Omit<InputWrapperProps, 'children'> {
    name: string;
    value?: PhoneInputValue | null;
    onChange?: (value: PhoneInputValue | null) => void;
    disabled?: boolean;
    defaultCountry?: CountryCode;
    /**
     * Country to assume when parsing national numbers. Accepts ISO alpha-2 (e.g. "AU")
     * or a country calling code (e.g. "+61", "61").
     */
    countryCode?: string | null;
    placeholder?: string;
    allowInternational?: boolean;
}

const PHONE_FIELDS: Array<keyof PhoneInputValue> = [
    'country_code',
    'area_code',
    'number',
    'extension',
    'type',
];

const isBlank = (value: string | null | undefined): boolean =>
    value === undefined || value === null || value.trim() === '';

const formatCountryCodeForDisplay = (value?: string | null): string | null => {
    if (!value) {
        return null;
    }

    return value.startsWith('+') ? value : `+${value}`;
};

const formatType = (type: NumberType | undefined): string | null => {
    if (!type) {
        return null;
    }

    return type.toLowerCase();
};

const formatDisplayValue = (value?: PhoneInputValue | null): string => {
    if (!value) {
        return '';
    }

    const normalizedArea =
        value.area_code && !isBlank(value.area_code)
            ? value.area_code.trim().replace(/^0+/, '') || value.area_code.trim()
            : null;

    const segments = [
        formatCountryCodeForDisplay(value.country_code),
        normalizedArea,
        value.number ? value.number.trim() : null,
    ].filter(Boolean);

    const base = segments.join(' ');

    if (value.extension && value.extension.trim() !== '') {
        return `${base} ext ${value.extension.trim()}`;
    }

    return base;
};

const humanizeType = (type?: string | null): string | null => {
    if (!type) {
        return null;
    }

    return type
        .split('_')
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(' ');
};

const toUpper = (value: string): string => value.toUpperCase();

const extractDigits = (value: string): string => value.replace(/\D/g, '');

const resolveCountryFromInput = (input?: string | null): CountryCode | undefined => {
    if (!input) {
        return undefined;
    }

    const trimmed = input.trim();

    if (trimmed === '') {
        return undefined;
    }

    const upper = toUpper(trimmed);

    if (/^[A-Z]{2}$/.test(upper) && isSupportedCountry(upper as CountryCode)) {
        return upper as CountryCode;
    }

    const digits = extractDigits(trimmed);

    if (!digits) {
        return undefined;
    }

    const countries = getCountries();

    return countries.find((country) => getCountryCallingCode(country) === digits);
};

const PhoneInput: FunctionComponent<PhoneInputProps> = (props) => {
    const {
        name,
        value,
        onChange,
        disabled = false,
        label,
        defaultCountry = 'US' as CountryCode,
        countryCode,
        placeholder = '',
        allowInternational = true,
        error,
        description,
        ...restWrapperProps
    } = props;
    const [inputValue, setInputValue] = useState(() => formatDisplayValue(value));
    const [parseError, setParseError] = useState<string | null>(null);

    const resolvedCountry = useMemo<CountryCode | undefined>(() => {
        return (
            resolveCountryFromInput(countryCode) ??
            (defaultCountry && isSupportedCountry(defaultCountry) ? defaultCountry : undefined)
        );
    }, [countryCode, defaultCountry]);

    const resolvedCallingCode = useMemo<string | undefined>(() => {
        if (countryCode) {
            const digits = extractDigits(countryCode);
            if (digits) {
                return digits;
            }
        }

        if (resolvedCountry) {
            return getCountryCallingCode(resolvedCountry);
        }

        return undefined;
    }, [countryCode, resolvedCountry]);

    useEffect(() => {
        const formatted = formatDisplayValue(value);
        setInputValue((current) => (current === formatted ? current : formatted));
    }, [value]);

    const parsedValue = useMemo<PhoneInputValue | null>(() => value ?? null, [value]);

    const handleValidParse = (phoneNumber: ReturnType<typeof parsePhoneNumberFromString>) => {
        if (!phoneNumber) {
            return;
        }

        const nationalNumber = phoneNumber.nationalNumber ? String(phoneNumber.nationalNumber) : '';
        const nationalFormat = phoneNumber.formatNational();

        let areaCode: string | null = null;
        let subscriberNumber = nationalNumber;

        if (nationalFormat) {
            const blocks = nationalFormat
                .split(/[^\d]+/)
                .map((part) => part.trim())
                .filter(Boolean);

            if (blocks.length > 1) {
                const rawArea = blocks[0];
                const normalizedArea = rawArea.replace(/^0+/, '') || rawArea;

                if (!isBlank(normalizedArea)) {
                    areaCode = normalizedArea;

                    if (subscriberNumber.startsWith(normalizedArea)) {
                        subscriberNumber = subscriberNumber.slice(normalizedArea.length);
                    } else if (rawArea && subscriberNumber.startsWith(rawArea)) {
                        subscriberNumber = subscriberNumber.slice(rawArea.length);
                    }
                }
            }
        }

        const nextValue: PhoneInputValue = {
            country_code: phoneNumber.countryCallingCode ?? null,
            area_code: areaCode,
            number: subscriberNumber || nationalNumber || null,
            extension: phoneNumber.ext ?? null,
            type: formatType(phoneNumber.getType()),
        };

        onChange?.(nextValue);
    };

    const handleChange = (nextRawValue: string) => {
        setInputValue(nextRawValue);

        if (isBlank(nextRawValue)) {
            setParseError(null);
            onChange?.(null);
            return;
        }

        const trimmed = nextRawValue.trim();

        // When international numbers are disallowed we enforce default country unless user begins with +
        try {
            const countryForParsing =
                allowInternational && trimmed.startsWith('+')
                    ? undefined
                    : (resolvedCountry ?? defaultCountry);
            const parsed = parsePhoneNumberFromString(trimmed, countryForParsing);

            if (parsed && parsed.isValid()) {
                setParseError(null);
                handleValidParse(parsed);
            } else {
                // If parsing fails and we have a known calling code, attempt a synthetic E.164 parse
                if (resolvedCallingCode) {
                    const extensionMatch = trimmed.match(/(?:ext\.?|x)\s*(\d+)$/i);
                    const mainPortion = extensionMatch
                        ? trimmed.slice(0, extensionMatch.index).trim()
                        : trimmed;
                    const digits = extractDigits(mainPortion);

                    if (digits) {
                        const withoutTrunk = digits.replace(/^0+/, '') || digits;
                        let synthetic = `+${resolvedCallingCode}${withoutTrunk}`;

                        if (extensionMatch?.[1]) {
                            synthetic += ` x${extensionMatch[1]}`;
                        }

                        const fallbackParsed = parsePhoneNumberFromString(synthetic);

                        if (fallbackParsed && fallbackParsed.isValid()) {
                            setParseError(null);
                            handleValidParse(fallbackParsed);
                            return;
                        }
                    }
                }

                setParseError('Enter a valid phone number');
            }
        } catch {
            setParseError('Enter a valid phone number');
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(event.currentTarget.value);
    };

    const hasParsedValue =
        parsedValue !== null &&
        PHONE_FIELDS.some((field) => !isBlank(parsedValue?.[field] ?? null));

    const parsedDetailsTooltip = useMemo(() => {
        if (!parsedValue) {
            return null;
        }

        const details: ReactNode[] = [];

        if (parsedValue.country_code) {
            const formattedCountryCode = formatCountryCodeForDisplay(parsedValue.country_code);
            if (formattedCountryCode) {
                details.push(
                    <Text key="country" size="xs">
                        <Text span fw={600}>
                            Country code:
                        </Text>{' '}
                        {formattedCountryCode}
                    </Text>
                );
            }
        }

        if (parsedValue.area_code) {
            details.push(
                <Text key="area" size="xs">
                    <Text span fw={600}>
                        Area code:
                    </Text>{' '}
                    {parsedValue.area_code}
                </Text>
            );
        }

        if (parsedValue.number) {
            details.push(
                <Text key="number" size="xs">
                    <Text span fw={600}>
                        Number:
                    </Text>{' '}
                    {parsedValue.number}
                </Text>
            );
        }

        if (parsedValue.extension) {
            details.push(
                <Text key="extension" size="xs">
                    <Text span fw={600}>
                        Extension:
                    </Text>{' '}
                    {parsedValue.extension}
                </Text>
            );
        }

        const readableType = humanizeType(parsedValue.type);

        if (details.length === 0 && !readableType) {
            return null;
        }

        return (
            <Stack gap={4}>
                {details}
                {readableType && (
                    <Badge size="xs" color="blue" radius="sm">
                        {readableType}
                    </Badge>
                )}
            </Stack>
        );
    }, [parsedValue]);

    return (
        <Input.Wrapper label={label} error={error} description={description} {...restWrapperProps}>
            <Stack gap="xs">
                <Group justify="space-between" align="center" gap="xs">
                    <TextInput
                        name={`${name}[raw]`}
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoComplete="tel"
                        className="flex-1"
                        rightSection={
                            <Tooltip
                                label={parsedDetailsTooltip}
                                withArrow
                                multiline
                                withinPortal
                                position="top-end"
                                w={260}
                                disabled={!hasParsedValue || !parsedDetailsTooltip}
                            >
                                <span>
                                    {parseError && (
                                        <PhoneMissedIcon className="size-3 text-zinc-500" />
                                    )}
                                    {!parseError && (
                                        <Phone
                                            className={`size-3 ${hasParsedValue && parsedDetailsTooltip ? 'text-zinc-800' : 'text-zinc-300'}`}
                                        />
                                    )}
                                </span>
                            </Tooltip>
                        }
                    />
                </Group>
            </Stack>
        </Input.Wrapper>
    );
};

export default PhoneInput;
