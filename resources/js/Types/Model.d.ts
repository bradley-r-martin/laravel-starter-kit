declare namespace Domain {
    export type Address = {
        place_id?: string;
        building_name?: string;
        lot_no?: string;
        country?: string;
        level?: string;
        postcode?: string;
        state?: string;
        street_name?: string;
        street_number?: string;
        street_type?: string;
        street_suffix?: string;
        suburb?: string;
        unit?: string;
        latitude?: number;
        longitude?: number;
    };

    export type File = {
        path?: string;
        disk?: string;
        mime_type?: string;
        size?: number;
        filename?: string;
    };

    export type Phone = {
        country_code?: string;
        area_code?: string;
        number?: string;
        extension?: string;
        type?: string;
    };

    export type Entity = {
        id?: string;
        type?: string;
    };

    export type Schedule = {
        rrule: string;
    };
}

declare namespace Models {
    export type Contact = {
        id: string;
        operator_id?: string;
        territory_id?: string;
        site_id?: string;
        first_name: string;
        last_name: string;
        email: string;
        phone?: Domain.Phone;
        image?: string;
        closed_at?: string;
        created_at?: string;
        updated_at?: string;
    };

    export type Customer = {
        id: string;
        first_name: string;
        last_name: string;
        email?: string;
        phone?: Domain.Phone;
        address?: Domain.Address;
        image?: string;
        created_at?: string;
        updated_at?: string;
    };

    export type Expense = {
        id: string;
        invoice_no: string;
        invoice_date: string;
        wholesaler_id: string;
        operator_id: string;
        pages: string[];
        completed_at: string;
        created_at: string;
        updated_at: string;
        __wholesaler_name: string;
        __cost: number;
        __rebate: number;
        __royalty: number;
    };

    export type ExpenseItem = {
        id: string;
        item: string;
        units: number;
        cost: number;
        rebate: number;
        royalty: number;
        quantity: number;
        price: number;
        product_id: string;
        expense_id: string;
        refreshed_at: string;
        completed_at: string;
        created_at: string;
        updated_at: string;
        __product_name: string;
    };

    export type Manufacturer = {
        id: string;
        name: string;
        closed_at: string;
        created_at: string;
        updated_at: string;
        __products_count: number;
    };

    export type MerchantAccount = {
        id: string;
        provider: string;
        operator_id: string;
        credentials: Record<string, unknown>;
        created_at: string;
        updated_at: string;
    };

    export type Operator = {
        id: string;
        name: string;
        email: string;
        address: Domain.Address;
        phone: Domain.Phone;
        entity: Domain.Entity;
        image: Domain.File;
        closed_at: string;
        suspended_at: string;
        created_at: string;
        updated_at: string;
        __territories_count: number;
        __last_transaction_at: string;
    };

    export type Placement = {
        id: string;
        site_id: string;
        operator_id?: string;
        territory_id: string;
        snackware_id: string;
        qr_code_id: string;
        location: string;
        note: string;
        closed_at: string;
        created_at: string;
        updated_at: string;
        __unit_count: number;
        __qr_code_code: string;
        __snackware_name: string;
        __expected_revenue: number;
        __deferred_revenue: number;
        __realised_revenue: number;
        __shrinkage_value: number;
        __shrinkage_percentage: number;
    };

    export type Policy = {
        id: string;
        role_id: string;
        policy: string;
        ability: string;
        description: string;
        hidden: boolean;
        created_at: string;
        updated_at: string;
        __roles_count: number;
        __users_count: number;
    };

    export type Product = {
        id: string;
        product_type_id: string;
        manufacturer_id: string;
        name?: string;
        sku: string;
        units: number;
        cost: number;
        price: number;
        rebate: number;
        royalty: number;
        avatar: Domain.File | null;
        closed_at: string;
        created_at: string;
        updated_at: string;
        __cost_per_unit: number;
        __product_type_name: string;
        __manufacturer_name: string;
    };

    export type ProductType = {
        id: string;
        name: string;
        short_name: string;
        closed_at: string;
        created_at: string;
        updated_at: string;
        __products_count: number;
    };

    export type QrCode = {
        id: string;
        code: string;
        operator_id: string;
        placement_id: string;
        last_printed_at: string;
        closed_at: string;
        created_at: string;
        updated_at: string;
        __deferred_revenue: number;
        __realised_revenue: number;
        __last_transaction_at: string;
        __site_name: string;
        __site_id: string;
    };

    export type Resupply = {
        id: string;
        run_id: string;
        placement_id: string;
        route_id: string;
        territory_id: string;
        operator_id: string;
        site_id: string;
        snackware_id: string;
        stock_opening: number;
        stock_remaining: number;
        stock_damaged: number;
        average_unit_price: number;
        completed_at: string;
        created_at: string;
        updated_at: string;
        __revenue: number;
        __card_revenue: number;
        __cash_revenue: number;
        __snackware_name: string;
        __units_paid_for: number;
        __shrinkage_units: number;
        __shrinkage_value: number;
        __shrinkage_percentage: number;
    };

    export type Role = {
        id: string;
        name: string;
        description: string;
        closed_at: string;
        hidden: boolean;
        created_at: string;
        updated_at: string;
        __users_count: number;
    };

    export type Route = {
        id: string;
        territory_id: string;
        name: string;
        schedule?: Domain.Schedule;
        closed_at: string;
        skipped_until: string;
        created_at: string;
        updated_at: string;
        __sites_count: number;
        __next_run_at: string;
        __last_run_at: string;
        __last_run_id: string;
        __latitude: number;
        __longitude: number;
        __radius: number;
        __deferred_revenue: number;
        __realised_revenue: number;
    };

    export type Run = {
        id: string;
        route_id: string;
        operator_id: string;
        territory_id: string;
        type: string;
        start_at: string;
        end_at: string;
        completed_at: string;
        created_at: string;
        updated_at: string;
        __sites_count: number;
        __revenue: number;
        __cash_revenue: number;
        __card_revenue: number;
        __expected_revenue: number;
        __units_taken: number;
        __shrinkage_value: number;
        __shrinkage_percentage: number;
    };

    export type Site = {
        id: string;
        territory_id: string;
        operator_id: string;
        route_id: string;
        order: number;
        name: string;
        address: Domain.Address | null;
        opening_hours: Record<string, unknown>;
        manager_code: string;
        closed_at: string;
        created_at: string;
        updated_at: string;
        __placements_count?: number;
        __deferred_revenue: number;
        __realised_revenue: number;
        __card_revenue: number;
        __cash_revenue: number;
        __stock_damaged_value: number;
        __shrinkage_value: number;
        __shrinkage_percentage?: number;
        __next_run_at: string;
        __last_run_at: string;
        __last_run_id: string;
        __route_name: string;
    };

    export type Snackware = {
        id: string;
        territory_id: string;
        operator_id: string;
        name: string;
        type: string;
        icon: string;
        price: number;
        closed_at: string;
        created_at: string;
        updated_at: string;
        __product_count?: number;
        __placements_count?: number;
        __wholesale_from?: number;
        __wholesale_to?: number;
    };

    export type Territory = {
        id: string;
        operator_id: string;
        merchant_account_id: string;
        name: string;
        closed_at: string;
        created_at: string;
        updated_at: string;
        __operator_name: string;
        __last_transaction_at: string;
    };

    export type Transaction = {
        id: string;
        type: string;
        method: string;
        placement_id: string;
        resupply_id: string;
        customer_id: string;
        qr_code_id?: string;
        merchant_account_id: string;
        site_id: string;
        snackware_id: string;
        run_id: string;
        operator_id: string;
        territory_id: string;
        amount: number;
        merchant_fee: number;
        expected_revenue: number;
        card_revenue?: number;
        details: Record<string, unknown>;
        created_at: string;
        updated_at: string;
        refunded_at: string;
    };

    export type User = {
        id: string;
        operator_id: string;
        role_id: string;
        first_name: string;
        last_name: string;
        phone: Domain.Phone | null;
        address: Domain.Address | null;
        email: string;
        email_verified_at: string;
        password: string;
        avatar: Domain.File | null;
        closed_at: string;
        suspended_at: string;
        remember_token: string | null;
        created_at: string;
        updated_at: string;
        __operator_name: string;
        __role_name: string;
        __last_login_at: string;
        __last_login_ip: string;
        __last_login_user_agent: string;
        __last_active_at: string;
    };

    export type Wholesaler = {
        id: string;
        name: string;
        closed_at: string;
        created_at: string;
        updated_at: string;
        __expenses_count: number;
    };
}
