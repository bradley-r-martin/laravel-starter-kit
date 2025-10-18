<?php

declare(strict_types=1);

use App\Aggregates\ProductAggregate;
use App\Events\Product\ProductClosed;
use App\Events\Product\ProductCreated;
use App\Events\Product\ProductDestroyed;
use App\Events\Product\ProductReinstated;
use App\Events\Product\ProductUpdated;
use Illuminate\Support\Str;

it('can create a product', function () {
    $productId = (string) Str::ulid();

    $aggregate = ProductAggregate::retrieve($productId)
        ->create(
            productTypeId: 'product-type-id',
            manufacturerId: 'manufacturer-id',
            name: 'Test Product',
            sku: 'TEST-001',
            units: 12,
            cost: 100,
            price: 200,
            rebate: 0.05,
            royalty: 0.10,
            avatar: null,
        );

    $events = $aggregate->getRecordedEvents();
    expect($events)->toHaveCount(1);

    $event = $events[0];
    expect($event)->toBeInstanceOf(ProductCreated::class);
    expect($event->productTypeId)->toBe('product-type-id');
    expect($event->manufacturerId)->toBe('manufacturer-id');
    expect($event->name)->toBe('Test Product');
    expect($event->sku)->toBe('TEST-001');
    expect($event->units)->toBe(12);
    expect($event->cost)->toBe(100);
    expect($event->price)->toBe(200);
    expect($event->rebate)->toBe(0.05);
    expect($event->royalty)->toBe(0.10);
});

it('can update a product', function () {
    $productId = (string) Str::ulid();

    $aggregate = ProductAggregate::retrieve($productId)
        ->create(
            productTypeId: 'product-type-id',
            manufacturerId: 'manufacturer-id',
            name: 'Test Product',
            sku: 'TEST-001',
            units: 12,
            cost: 100,
            price: 200,
            rebate: 0.05,
            royalty: 0.10,
        )
        ->update(
            name: 'Updated Product',
            price: 250,
        );

    $events = $aggregate->getRecordedEvents();
    expect($events)->toHaveCount(2);

    $event = $events[1];
    expect($event)->toBeInstanceOf(ProductUpdated::class);
    expect($event->name)->toBe('Updated Product');
    expect($event->price)->toBe(250);
});

it('can close a product', function () {
    $productId = (string) Str::ulid();

    $aggregate = ProductAggregate::retrieve($productId)
        ->create(
            productTypeId: 'product-type-id',
            manufacturerId: 'manufacturer-id',
            name: 'Test Product',
            sku: 'TEST-001',
            units: 12,
            cost: 100,
            price: 200,
            rebate: 0.05,
            royalty: 0.10,
        )
        ->close(reason: 'Discontinued');

    $events = $aggregate->getRecordedEvents();
    expect($events)->toHaveCount(2);

    $event = $events[1];
    expect($event)->toBeInstanceOf(ProductClosed::class);
    expect($event->reason)->toBe('Discontinued');
});

it('can reinstate a product', function () {
    $productId = (string) Str::ulid();

    $aggregate = ProductAggregate::retrieve($productId)
        ->create(
            productTypeId: 'product-type-id',
            manufacturerId: 'manufacturer-id',
            name: 'Test Product',
            sku: 'TEST-001',
            units: 12,
            cost: 100,
            price: 200,
            rebate: 0.05,
            royalty: 0.10,
        )
        ->close(reason: 'Discontinued')
        ->reinstate(reason: 'Back in stock');

    $events = $aggregate->getRecordedEvents();
    expect($events)->toHaveCount(3);

    $event = $events[2];
    expect($event)->toBeInstanceOf(ProductReinstated::class);
    expect($event->reason)->toBe('Back in stock');
});

it('can destroy a product', function () {
    $productId = (string) Str::ulid();

    $aggregate = ProductAggregate::retrieve($productId)
        ->create(
            productTypeId: 'product-type-id',
            manufacturerId: 'manufacturer-id',
            name: 'Test Product',
            sku: 'TEST-001',
            units: 12,
            cost: 100,
            price: 200,
            rebate: 0.05,
            royalty: 0.10,
        )
        ->destroy(reason: 'Obsolete');

    $events = $aggregate->getRecordedEvents();
    expect($events)->toHaveCount(2);

    $event = $events[1];
    expect($event)->toBeInstanceOf(ProductDestroyed::class);
    expect($event->reason)->toBe('Obsolete');
});

it('tracks aggregate state correctly', function () {
    $productId = (string) Str::ulid();

    $aggregate = ProductAggregate::retrieve($productId);

    // Call the apply method directly to verify state
    $event = new ProductCreated(
        productTypeId: 'product-type-id',
        manufacturerId: 'manufacturer-id',
        name: 'Test Product',
        sku: 'TEST-001',
        units: 12,
        cost: 100,
        price: 200,
        rebate: 0.05,
        royalty: 0.10,
    );

    // Use reflection to call the private apply method
    $reflector = new ReflectionClass($aggregate);
    $method = $reflector->getMethod('applyProductCreated');
    $method->setAccessible(true);
    $method->invoke($aggregate, $event);

    expect($aggregate->name)->toBe('Test Product');
    expect($aggregate->sku)->toBe('TEST-001');
    expect($aggregate->productTypeId)->toBe('product-type-id');
    expect($aggregate->manufacturerId)->toBe('manufacturer-id');
});
