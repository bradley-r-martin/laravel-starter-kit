<?php

declare(strict_types=1);

use App\Aggregates\ManufacturerAggregate;
use App\Events\Manufacturer\ManufacturerClosed;
use App\Events\Manufacturer\ManufacturerCreated;
use App\Events\Manufacturer\ManufacturerDestroyed;
use App\Events\Manufacturer\ManufacturerReopened;
use App\Events\Manufacturer\ManufacturerUpdated;

describe('Manufacturer Creation', function () {
    it('records manufacturer creation event', function () {
        $aggregate = ManufacturerAggregate::retrieve('manufacturer-1')
            ->create(
                name: 'ABC Manufacturing'
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(ManufacturerCreated::class)
            ->name->toBe('ABC Manufacturing');
    });

    it('records manufacturer creation with different name', function () {
        $aggregate = ManufacturerAggregate::retrieve('manufacturer-2')
            ->create(
                name: 'XYZ Industries'
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(ManufacturerCreated::class)
            ->name->toBe('XYZ Industries');
    });
});

describe('Manufacturer Update', function () {
    it('records manufacturer update event', function () {
        $aggregate = ManufacturerAggregate::retrieve('manufacturer-3')
            ->update(
                name: 'Updated Manufacturer Name'
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(ManufacturerUpdated::class)
            ->name->toBe('Updated Manufacturer Name');
    });

    it('can chain creation and update events', function () {
        $aggregate = ManufacturerAggregate::retrieve('manufacturer-4')
            ->create(
                name: 'Original Manufacturer'
            )
            ->update(
                name: 'Updated Manufacturer'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);
        expect($events[0])->toBeInstanceOf(ManufacturerCreated::class)
            ->name->toBe('Original Manufacturer');
        expect($events[1])->toBeInstanceOf(ManufacturerUpdated::class)
            ->name->toBe('Updated Manufacturer');
    });

    it('records multiple update events', function () {
        $aggregate = ManufacturerAggregate::retrieve('manufacturer-5')
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

        expect($events[0])->toBeInstanceOf(ManufacturerUpdated::class)
            ->name->toBe('First Update');
        expect($events[1])->toBeInstanceOf(ManufacturerUpdated::class)
            ->name->toBe('Second Update');
        expect($events[2])->toBeInstanceOf(ManufacturerUpdated::class)
            ->name->toBe('Third Update');
    });
});

describe('Manufacturer Closure', function () {
    it('records manufacturer closure event', function () {
        $aggregate = ManufacturerAggregate::retrieve('manufacturer-6')
            ->close(
                reason: 'Business discontinued'
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(ManufacturerClosed::class)
            ->reason->toBe('Business discontinued');
    });

    it('can close a manufacturer after creation', function () {
        $aggregate = ManufacturerAggregate::retrieve('manufacturer-7')
            ->create(
                name: 'Test Manufacturer'
            )
            ->close(
                reason: 'No longer needed'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);
        expect($events[0])->toBeInstanceOf(ManufacturerCreated::class);
        expect($events[1])->toBeInstanceOf(ManufacturerClosed::class)
            ->reason->toBe('No longer needed');
    });

    it('can close a manufacturer after update', function () {
        $aggregate = ManufacturerAggregate::retrieve('manufacturer-8')
            ->create(
                name: 'Test Manufacturer'
            )
            ->update(
                name: 'Updated Manufacturer'
            )
            ->close(
                reason: 'Company merged'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(3);
        expect($events[0])->toBeInstanceOf(ManufacturerCreated::class);
        expect($events[1])->toBeInstanceOf(ManufacturerUpdated::class);
        expect($events[2])->toBeInstanceOf(ManufacturerClosed::class)
            ->reason->toBe('Company merged');
    });
});

describe('Manufacturer Reopening', function () {
    it('records manufacturer reopening event', function () {
        $aggregate = ManufacturerAggregate::retrieve('manufacturer-9')
            ->reopen(
                reason: 'Business resumed'
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(ManufacturerReopened::class)
            ->reason->toBe('Business resumed');
    });

    it('can close and then reopen a manufacturer', function () {
        $aggregate = ManufacturerAggregate::retrieve('manufacturer-10')
            ->close(
                reason: 'Temporary closure'
            )
            ->reopen(
                reason: 'Business reactivated'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);

        expect($events[0])->toBeInstanceOf(ManufacturerClosed::class)
            ->reason->toBe('Temporary closure');
        expect($events[1])->toBeInstanceOf(ManufacturerReopened::class)
            ->reason->toBe('Business reactivated');
    });

    it('can reopen a manufacturer after creation and closure', function () {
        $aggregate = ManufacturerAggregate::retrieve('manufacturer-11')
            ->create(
                name: 'Test Manufacturer'
            )
            ->close(
                reason: 'Temporary closure'
            )
            ->reopen(
                reason: 'Reopened after review'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(3);
        expect($events[0])->toBeInstanceOf(ManufacturerCreated::class);
        expect($events[1])->toBeInstanceOf(ManufacturerClosed::class);
        expect($events[2])->toBeInstanceOf(ManufacturerReopened::class)
            ->reason->toBe('Reopened after review');
    });
});

describe('Manufacturer Destruction', function () {
    it('records manufacturer destruction event', function () {
        $aggregate = ManufacturerAggregate::retrieve('manufacturer-12')
            ->destroy(
                reason: 'Record no longer needed'
            );

        expect($aggregate->getRecordedEvents())->toHaveCount(1);

        $event = $aggregate->getRecordedEvents()[0];
        expect($event)->toBeInstanceOf(ManufacturerDestroyed::class)
            ->reason->toBe('Record no longer needed');
    });

    it('can close and then destroy a manufacturer', function () {
        $aggregate = ManufacturerAggregate::retrieve('manufacturer-13')
            ->close(
                reason: 'Business closed'
            )
            ->destroy(
                reason: 'Permanent removal requested'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(2);

        expect($events[0])->toBeInstanceOf(ManufacturerClosed::class)
            ->reason->toBe('Business closed');
        expect($events[1])->toBeInstanceOf(ManufacturerDestroyed::class)
            ->reason->toBe('Permanent removal requested');
    });

    it('can destroy a manufacturer after full lifecycle', function () {
        $aggregate = ManufacturerAggregate::retrieve('manufacturer-14')
            ->create(
                name: 'Test Manufacturer'
            )
            ->update(
                name: 'Updated Manufacturer'
            )
            ->close(
                reason: 'Business closed for review'
            )
            ->destroy(
                reason: 'Final removal approved'
            );

        $events = $aggregate->getRecordedEvents();
        expect($events)->toHaveCount(4);
        expect($events[0])->toBeInstanceOf(ManufacturerCreated::class);
        expect($events[1])->toBeInstanceOf(ManufacturerUpdated::class);
        expect($events[2])->toBeInstanceOf(ManufacturerClosed::class);
        expect($events[3])->toBeInstanceOf(ManufacturerDestroyed::class)
            ->reason->toBe('Final removal approved');
    });
});

describe('Complex Manufacturer Workflows', function () {
    it('can handle multiple close and reopen cycles', function () {
        $aggregate = ManufacturerAggregate::retrieve('manufacturer-15')
            ->create(
                name: 'Test Manufacturer'
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
        expect($events[0])->toBeInstanceOf(ManufacturerCreated::class);
        expect($events[1])->toBeInstanceOf(ManufacturerClosed::class);
        expect($events[2])->toBeInstanceOf(ManufacturerReopened::class);
        expect($events[3])->toBeInstanceOf(ManufacturerClosed::class);
        expect($events[4])->toBeInstanceOf(ManufacturerReopened::class);
    });

    it('can chain all operations in sequence', function () {
        $aggregate = ManufacturerAggregate::retrieve('manufacturer-16')
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
        expect($events[0])->toBeInstanceOf(ManufacturerCreated::class);
        expect($events[1])->toBeInstanceOf(ManufacturerUpdated::class);
        expect($events[2])->toBeInstanceOf(ManufacturerClosed::class);
        expect($events[3])->toBeInstanceOf(ManufacturerReopened::class);
        expect($events[4])->toBeInstanceOf(ManufacturerUpdated::class);
        expect($events[5])->toBeInstanceOf(ManufacturerClosed::class);
        expect($events[6])->toBeInstanceOf(ManufacturerDestroyed::class);
    });
});
