<?php

declare(strict_types=1);

use App\Aggregates\WholesalerAggregate;
use App\Models\Wholesaler;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Wholesaler Creation Projection', function () {
    it('creates a wholesaler in the database when WholesalerCreated event occurs', function () {
        WholesalerAggregate::retrieve('wholesaler-test-1')
            ->create(name: 'ABC Distributors')
            ->persist();

        $wholesaler = Wholesaler::find('wholesaler-test-1');

        expect($wholesaler)->not->toBeNull()
            ->id->toBe('wholesaler-test-1')
            ->name->toBe('ABC Distributors')
            ->closed_at->toBeNull();
    });
});

describe('Wholesaler Update Projection', function () {
    it('updates a wholesaler in the database when WholesalerUpdated event occurs', function () {
        WholesalerAggregate::retrieve('wholesaler-test-2')
            ->create(name: 'Original Name')
            ->persist();

        $wholesaler = Wholesaler::find('wholesaler-test-2');
        expect($wholesaler->name)->toBe('Original Name');

        WholesalerAggregate::retrieve('wholesaler-test-2')
            ->update(name: 'Updated Name')
            ->persist();

        $wholesaler->refresh();
        expect($wholesaler->name)->toBe('Updated Name');
    });
});

describe('Wholesaler Closure Projection', function () {
    it('marks wholesaler as closed when WholesalerClosed event occurs', function () {
        WholesalerAggregate::retrieve('wholesaler-test-3')
            ->create(name: 'Test Wholesaler')
            ->persist();

        $wholesaler = Wholesaler::find('wholesaler-test-3');
        expect($wholesaler->closed_at)->toBeNull();

        WholesalerAggregate::retrieve('wholesaler-test-3')
            ->close(reason: 'Business discontinued')
            ->persist();

        $wholesaler->refresh();
        expect($wholesaler->closed_at)->not->toBeNull();
    });
});

describe('Wholesaler Reopening Projection', function () {
    it('marks wholesaler as reopened when WholesalerReopened event occurs', function () {
        WholesalerAggregate::retrieve('wholesaler-test-4')
            ->create(name: 'Test Wholesaler')
            ->close(reason: 'Temporary closure')
            ->persist();

        $wholesaler = Wholesaler::find('wholesaler-test-4');
        expect($wholesaler->closed_at)->not->toBeNull();

        WholesalerAggregate::retrieve('wholesaler-test-4')
            ->reopen(reason: 'Business resumed')
            ->persist();

        $wholesaler->refresh();
        expect($wholesaler->closed_at)->toBeNull();
    });
});

describe('Wholesaler Destruction Projection', function () {
    it('deletes wholesaler when WholesalerDestroyed event occurs', function () {
        WholesalerAggregate::retrieve('wholesaler-test-5')
            ->create(name: 'Test Wholesaler')
            ->close(reason: 'Final closure')
            ->persist();

        expect(Wholesaler::find('wholesaler-test-5'))->not->toBeNull();

        WholesalerAggregate::retrieve('wholesaler-test-5')
            ->destroy(reason: 'Record no longer needed')
            ->persist();

        expect(Wholesaler::find('wholesaler-test-5'))->toBeNull();
    });
});

describe('Complete Wholesaler Lifecycle Projection', function () {
    it('handles complete lifecycle from creation to destruction', function () {
        // Create
        WholesalerAggregate::retrieve('wholesaler-test-6')
            ->create(name: 'Lifecycle Wholesaler')
            ->persist();

        $wholesaler = Wholesaler::find('wholesaler-test-6');
        expect($wholesaler)->not->toBeNull()
            ->name->toBe('Lifecycle Wholesaler')
            ->closed_at->toBeNull();

        // Update
        WholesalerAggregate::retrieve('wholesaler-test-6')
            ->update(name: 'Updated Lifecycle Wholesaler')
            ->persist();

        $wholesaler->refresh();
        expect($wholesaler->name)->toBe('Updated Lifecycle Wholesaler');

        // Close
        WholesalerAggregate::retrieve('wholesaler-test-6')
            ->close(reason: 'Temporary closure')
            ->persist();

        $wholesaler->refresh();
        expect($wholesaler->closed_at)->not->toBeNull();

        // Reopen
        WholesalerAggregate::retrieve('wholesaler-test-6')
            ->reopen(reason: 'Business resumed')
            ->persist();

        $wholesaler->refresh();
        expect($wholesaler->closed_at)->toBeNull();

        // Close again
        WholesalerAggregate::retrieve('wholesaler-test-6')
            ->close(reason: 'Final closure')
            ->persist();

        $wholesaler->refresh();
        expect($wholesaler->closed_at)->not->toBeNull();

        // Destroy
        WholesalerAggregate::retrieve('wholesaler-test-6')
            ->destroy(reason: 'Final removal')
            ->persist();

        expect(Wholesaler::find('wholesaler-test-6'))->toBeNull();
    });
});
