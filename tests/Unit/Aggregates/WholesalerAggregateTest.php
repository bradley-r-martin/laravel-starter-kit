<?php

declare(strict_types=1);

use App\Aggregates\WholesalerAggregate;
use App\Events\Wholesaler\WholesalerClosed;
use App\Events\Wholesaler\WholesalerCreated;
use App\Events\Wholesaler\WholesalerDestroyed;
use App\Events\Wholesaler\WholesalerReopened;
use App\Events\Wholesaler\WholesalerUpdated;

describe('Wholesaler Creation', function () {
    it('records wholesaler creation event', function () {
        $aggregate = WholesalerAggregate::retrieve('wholesaler-1')
            ->create(
                name: 'ABC Distributors'
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(WholesalerCreated::class)
            ->name->toBe('ABC Distributors');
    });

    it('records wholesaler creation with different name', function () {
        $aggregate = WholesalerAggregate::retrieve('wholesaler-2')
            ->create(
                name: 'XYZ Wholesale'
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(WholesalerCreated::class)
            ->name->toBe('XYZ Wholesale');
    });
});

describe('Wholesaler Update', function () {
    it('records wholesaler update event', function () {
        $aggregate = WholesalerAggregate::retrieve('wholesaler-3')
            ->update(
                name: 'Updated Wholesaler Name'
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(WholesalerUpdated::class)
            ->name->toBe('Updated Wholesaler Name');
    });

    it('can chain creation and update events', function () {
        $aggregate = WholesalerAggregate::retrieve('wholesaler-4')
            ->create(
                name: 'Original Wholesaler'
            )
            ->update(
                name: 'Updated Wholesaler'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);
        expect($events[0])->toBeInstanceOf(WholesalerCreated::class)
            ->name->toBe('Original Wholesaler');
        expect($events[1])->toBeInstanceOf(WholesalerUpdated::class)
            ->name->toBe('Updated Wholesaler');
    });

    it('records multiple update events', function () {
        $aggregate = WholesalerAggregate::retrieve('wholesaler-5')
            ->update(
                name: 'First Update'
            )
            ->update(
                name: 'Second Update'
            )
            ->update(
                name: 'Third Update'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(3);

        expect($events[0])->toBeInstanceOf(WholesalerUpdated::class)
            ->name->toBe('First Update');
        expect($events[1])->toBeInstanceOf(WholesalerUpdated::class)
            ->name->toBe('Second Update');
        expect($events[2])->toBeInstanceOf(WholesalerUpdated::class)
            ->name->toBe('Third Update');
    });
});

describe('Wholesaler Closure', function () {
    it('records wholesaler closure event', function () {
        $aggregate = WholesalerAggregate::retrieve('wholesaler-6')
            ->close(
                reason: 'Business discontinued'
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(WholesalerClosed::class)
            ->reason->toBe('Business discontinued');
    });

    it('can close a wholesaler after creation', function () {
        $aggregate = WholesalerAggregate::retrieve('wholesaler-7')
            ->create(
                name: 'Test Wholesaler'
            )
            ->close(
                reason: 'No longer needed'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);
        expect($events[0])->toBeInstanceOf(WholesalerCreated::class);
        expect($events[1])->toBeInstanceOf(WholesalerClosed::class)
            ->reason->toBe('No longer needed');
    });

    it('can close a wholesaler after update', function () {
        $aggregate = WholesalerAggregate::retrieve('wholesaler-8')
            ->create(
                name: 'Test Wholesaler'
            )
            ->update(
                name: 'Updated Wholesaler'
            )
            ->close(
                reason: 'Company merged'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(3);
        expect($events[0])->toBeInstanceOf(WholesalerCreated::class);
        expect($events[1])->toBeInstanceOf(WholesalerUpdated::class);
        expect($events[2])->toBeInstanceOf(WholesalerClosed::class)
            ->reason->toBe('Company merged');
    });
});

describe('Wholesaler Reopening', function () {
    it('records wholesaler reopening event', function () {
        $aggregate = WholesalerAggregate::retrieve('wholesaler-9')
            ->reopen(
                reason: 'Business resumed'
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(WholesalerReopened::class)
            ->reason->toBe('Business resumed');
    });

    it('can close and then reopen a wholesaler', function () {
        $aggregate = WholesalerAggregate::retrieve('wholesaler-10')
            ->close(
                reason: 'Temporary closure'
            )
            ->reopen(
                reason: 'Business reactivated'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);

        expect($events[0])->toBeInstanceOf(WholesalerClosed::class)
            ->reason->toBe('Temporary closure');
        expect($events[1])->toBeInstanceOf(WholesalerReopened::class)
            ->reason->toBe('Business reactivated');
    });

    it('can reopen a wholesaler after creation and closure', function () {
        $aggregate = WholesalerAggregate::retrieve('wholesaler-11')
            ->create(
                name: 'Test Wholesaler'
            )
            ->close(
                reason: 'Temporary closure'
            )
            ->reopen(
                reason: 'Reopened after review'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(3);
        expect($events[0])->toBeInstanceOf(WholesalerCreated::class);
        expect($events[1])->toBeInstanceOf(WholesalerClosed::class);
        expect($events[2])->toBeInstanceOf(WholesalerReopened::class)
            ->reason->toBe('Reopened after review');
    });
});

describe('Wholesaler Destruction', function () {
    it('records wholesaler destruction event', function () {
        $aggregate = WholesalerAggregate::retrieve('wholesaler-12')
            ->destroy(
                reason: 'Record no longer needed'
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(WholesalerDestroyed::class)
            ->reason->toBe('Record no longer needed');
    });

    it('can close and then destroy a wholesaler', function () {
        $aggregate = WholesalerAggregate::retrieve('wholesaler-13')
            ->close(
                reason: 'Business closed'
            )
            ->destroy(
                reason: 'Permanent removal requested'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);

        expect($events[0])->toBeInstanceOf(WholesalerClosed::class)
            ->reason->toBe('Business closed');
        expect($events[1])->toBeInstanceOf(WholesalerDestroyed::class)
            ->reason->toBe('Permanent removal requested');
    });

    it('can destroy a wholesaler after full lifecycle', function () {
        $aggregate = WholesalerAggregate::retrieve('wholesaler-14')
            ->create(
                name: 'Test Wholesaler'
            )
            ->update(
                name: 'Updated Wholesaler'
            )
            ->close(
                reason: 'Business closed for review'
            )
            ->destroy(
                reason: 'Final removal approved'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(4);
        expect($events[0])->toBeInstanceOf(WholesalerCreated::class);
        expect($events[1])->toBeInstanceOf(WholesalerUpdated::class);
        expect($events[2])->toBeInstanceOf(WholesalerClosed::class);
        expect($events[3])->toBeInstanceOf(WholesalerDestroyed::class)
            ->reason->toBe('Final removal approved');
    });
});

describe('Complex Wholesaler Workflows', function () {
    it('can handle multiple close and reopen cycles', function () {
        $aggregate = WholesalerAggregate::retrieve('wholesaler-15')
            ->create(
                name: 'Test Wholesaler'
            )
            ->close(
                reason: 'First closure'
            )
            ->reopen(
                reason: 'First reopening'
            )
            ->close(
                reason: 'Second closure'
            )
            ->reopen(
                reason: 'Second reopening'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(5);
        expect($events[0])->toBeInstanceOf(WholesalerCreated::class);
        expect($events[1])->toBeInstanceOf(WholesalerClosed::class);
        expect($events[2])->toBeInstanceOf(WholesalerReopened::class);
        expect($events[3])->toBeInstanceOf(WholesalerClosed::class);
        expect($events[4])->toBeInstanceOf(WholesalerReopened::class);
    });

    it('can chain all operations in sequence', function () {
        $aggregate = WholesalerAggregate::retrieve('wholesaler-16')
            ->create(
                name: 'Initial Name'
            )
            ->update(
                name: 'Updated Name'
            )
            ->close(
                reason: 'Closing reason'
            )
            ->reopen(
                reason: 'Reopening reason'
            )
            ->update(
                name: 'Final Name'
            )
            ->close(
                reason: 'Final closure'
            )
            ->destroy(
                reason: 'Final destruction'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(7);
        expect($events[0])->toBeInstanceOf(WholesalerCreated::class);
        expect($events[1])->toBeInstanceOf(WholesalerUpdated::class);
        expect($events[2])->toBeInstanceOf(WholesalerClosed::class);
        expect($events[3])->toBeInstanceOf(WholesalerReopened::class);
        expect($events[4])->toBeInstanceOf(WholesalerUpdated::class);
        expect($events[5])->toBeInstanceOf(WholesalerClosed::class);
        expect($events[6])->toBeInstanceOf(WholesalerDestroyed::class);
    });
});
