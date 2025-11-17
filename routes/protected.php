<?php

declare(strict_types=1);

use App\Http\Controllers\Authentication\AuthenticationTerritoryController;
use App\Http\Controllers\Manufacturer\ManufacturerCloseController;
use App\Http\Controllers\Manufacturer\ManufacturerCreateController;
use App\Http\Controllers\Manufacturer\ManufacturerDestroyController;
use App\Http\Controllers\Manufacturer\ManufacturerListController;
use App\Http\Controllers\Manufacturer\ManufacturerReopenController;
use App\Http\Controllers\Manufacturer\ManufacturerUpdateController;
use App\Http\Controllers\Notification\NotificationDeleteController;
use App\Http\Controllers\Notification\NotificationListController;
use App\Http\Controllers\Notification\NotificationMarkAllAsReadController;
use App\Http\Controllers\Notification\NotificationMarkAsReadController;
use App\Http\Controllers\Notification\NotificationSendSampleController;
use App\Http\Controllers\Operator\OperatorCloseController;
use App\Http\Controllers\Operator\OperatorCreateController;
use App\Http\Controllers\Operator\OperatorDestroyController;
use App\Http\Controllers\Operator\OperatorListController;
use App\Http\Controllers\Operator\OperatorReopenController;
use App\Http\Controllers\Operator\OperatorSuspendController;
use App\Http\Controllers\Operator\OperatorUnsuspendController;
use App\Http\Controllers\Operator\OperatorUpdateController;
use App\Http\Controllers\Product\ProductCloseController;
use App\Http\Controllers\Product\ProductCreateController;
use App\Http\Controllers\Product\ProductDestroyController;
use App\Http\Controllers\Product\ProductListController;
use App\Http\Controllers\Product\ProductReinstateController;
use App\Http\Controllers\Product\ProductUpdateController;
use App\Http\Controllers\ProductType\ProductTypeCloseController;
use App\Http\Controllers\ProductType\ProductTypeCreateController;
use App\Http\Controllers\ProductType\ProductTypeDestroyController;
use App\Http\Controllers\ProductType\ProductTypeListController;
use App\Http\Controllers\ProductType\ProductTypeReopenController;
use App\Http\Controllers\ProductType\ProductTypeUpdateController;
use App\Http\Controllers\PushSubscription\PushSubscriptionCheckController;
use App\Http\Controllers\PushSubscription\PushSubscriptionCreateController;
use App\Http\Controllers\PushSubscription\PushSubscriptionDeleteController;
use App\Http\Controllers\Role\RoleCloseController;
use App\Http\Controllers\Role\RoleCreateController;
use App\Http\Controllers\Role\RoleDestroyController;
use App\Http\Controllers\Role\RoleListController;
use App\Http\Controllers\Role\RoleReopenController;
use App\Http\Controllers\Role\RoleUpdateController;
use App\Http\Controllers\Site\SiteCreateController;
use App\Http\Controllers\Site\SiteDetailController;
use App\Http\Controllers\Site\SiteListController;
use App\Http\Controllers\Snackware\SnackwareCloseController;
use App\Http\Controllers\Snackware\SnackwareCreateController;
use App\Http\Controllers\Snackware\SnackwareDestroyController;
use App\Http\Controllers\Snackware\SnackwareListController;
use App\Http\Controllers\Snackware\SnackwareReopenController;
use App\Http\Controllers\Snackware\SnackwareUpdateController;
use App\Http\Controllers\Territory\TerritoryCloseController;
use App\Http\Controllers\Territory\TerritoryCreateController;
use App\Http\Controllers\Territory\TerritoryDestroyController;
use App\Http\Controllers\Territory\TerritoryListController;
use App\Http\Controllers\Territory\TerritoryReopenController;
use App\Http\Controllers\Territory\TerritoryUpdateController;
use App\Http\Controllers\User\UserCloseController;
use App\Http\Controllers\User\UserCreateController;
use App\Http\Controllers\User\UserDestroyController;
use App\Http\Controllers\User\UserListController;
use App\Http\Controllers\User\UserPasswordController;
use App\Http\Controllers\User\UserReopenController;
use App\Http\Controllers\User\UserSuspendController;
use App\Http\Controllers\User\UserUnsuspendController;
use App\Http\Controllers\User\UserUpdateController;
use App\Http\Controllers\Wholesaler\WholesalerCloseController;
use App\Http\Controllers\Wholesaler\WholesalerCreateController;
use App\Http\Controllers\Wholesaler\WholesalerDestroyController;
use App\Http\Controllers\Wholesaler\WholesalerListController;
use App\Http\Controllers\Wholesaler\WholesalerReopenController;
use App\Http\Controllers\Wholesaler\WholesalerUpdateController;
use Illuminate\Support\Facades\Route;

Route::get('/territory', [AuthenticationTerritoryController::class, 'view'])->name('territory');
Route::post('/territory', [AuthenticationTerritoryController::class, 'process'])->name('territory.process');

Route::middleware('territory')->group(function () {
    Route::prefix('territories')->name('territories.')->group(function () {
        Route::get('/', [TerritoryListController::class, 'view'])->name('index');
        Route::get('/create', [TerritoryCreateController::class, 'view'])->name('create');
        Route::post('/create', [TerritoryCreateController::class, 'process'])->name('store');
        Route::get('/{territory}/update', [TerritoryUpdateController::class, 'view'])->name('update');
        Route::post('/{territory}/update', [TerritoryUpdateController::class, 'process'])->name('update');
        Route::get('/{territory}/close', [TerritoryCloseController::class, 'view'])->name('close');
        Route::post('/{territory}/close', [TerritoryCloseController::class, 'process'])->name('close');
        Route::get('/{territory}/reopen', [TerritoryReopenController::class, 'view'])->name('reopen');
        Route::post('/{territory}/reopen', [TerritoryReopenController::class, 'process'])->name('reopen');
        Route::get('/{territory}/destroy', [TerritoryDestroyController::class, 'view'])->name('destroy');
        Route::delete('/{territory}/destroy', [TerritoryDestroyController::class, 'process'])->name('destroy');
    });

    Route::prefix('operators')->name('operators.')->group(function () {
        Route::get('/', [OperatorListController::class, 'view'])->name('index');
        Route::get('/create', [OperatorCreateController::class, 'view'])->name('create');
        Route::post('/create', [OperatorCreateController::class, 'process'])->name('store');
        Route::get('/{operator}/update', [OperatorUpdateController::class, 'view'])->name('update');
        Route::post('/{operator}/update', [OperatorUpdateController::class, 'process'])->name('update');
        Route::get('/{operator}/close', [OperatorCloseController::class, 'view'])->name('close');
        Route::post('/{operator}/close', [OperatorCloseController::class, 'process'])->name('close');
        Route::get('/{operator}/suspend', [OperatorSuspendController::class, 'view'])->name('suspend');
        Route::post('/{operator}/suspend', [OperatorSuspendController::class, 'process'])->name('suspend');
        Route::get('/{operator}/unsuspend', [OperatorUnsuspendController::class, 'view'])->name('unsuspend');
        Route::post('/{operator}/unsuspend', [OperatorUnsuspendController::class, 'process'])->name('unsuspend');
        Route::get('/{operator}/reopen', [OperatorReopenController::class, 'view'])->name('reopen');
        Route::post('/{operator}/reopen', [OperatorReopenController::class, 'process'])->name('reopen');
        Route::get('/{operator}/destroy', [OperatorDestroyController::class, 'view'])->name('destroy');
        Route::delete('/{operator}/destroy', [OperatorDestroyController::class, 'process'])->name('destroy');
    });

    Route::prefix('roles')->name('roles.')->group(function () {
        Route::get('/', [RoleListController::class, 'view'])->name('index');
        Route::get('/create', [RoleCreateController::class, 'view'])->name('create');
        Route::post('/create', [RoleCreateController::class, 'process'])->name('store');
        Route::get('/{role}/update', [RoleUpdateController::class, 'view'])->name('update');
        Route::put('/{role}/update', [RoleUpdateController::class, 'process'])->name('update');
        Route::get('/{role}/close', [RoleCloseController::class, 'view'])->name('close');
        Route::post('/{role}/close', [RoleCloseController::class, 'process'])->name('close');
        Route::get('/{role}/reopen', [RoleReopenController::class, 'view'])->name('reopen');
        Route::post('/{role}/reopen', [RoleReopenController::class, 'process'])->name('reopen');
        Route::get('/{role}/destroy', [RoleDestroyController::class, 'view'])->name('destroy');
        Route::delete('/{role}/destroy', [RoleDestroyController::class, 'process'])->name('destroy');
    });

    Route::prefix('snackwares')->name('snackwares.')->group(function () {
        Route::get('/', [SnackwareListController::class, 'view'])->name('index');
        Route::get('/create', [SnackwareCreateController::class, 'view'])->name('create');
        Route::post('/create', [SnackwareCreateController::class, 'process'])->name('store');
        Route::get('/{snackware}/update', [SnackwareUpdateController::class, 'view'])->name('update');
        Route::put('/{snackware}/update', [SnackwareUpdateController::class, 'process'])->name('update');
        Route::get('/{snackware}/close', [SnackwareCloseController::class, 'view'])->name('close');
        Route::post('/{snackware}/close', [SnackwareCloseController::class, 'process'])->name('close');
        Route::get('/{snackware}/reopen', [SnackwareReopenController::class, 'view'])->name('reopen');
        Route::post('/{snackware}/reopen', [SnackwareReopenController::class, 'process'])->name('reopen');
        Route::get('/{snackware}/destroy', [SnackwareDestroyController::class, 'view'])->name('destroy');
        Route::delete('/{snackware}/destroy', [SnackwareDestroyController::class, 'process'])->name('destroy');
    });

    Route::prefix('sites')->name('sites.')->group(function () {
        Route::get('/', [SiteListController::class, 'view'])->name('index');
        Route::get('/create', [SiteCreateController::class, 'view'])->name('create');
        Route::post('/create', [SiteCreateController::class, 'process'])->name('store');
        Route::get('/{site}', [SiteDetailController::class, 'view'])->name('show');
    });

    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserListController::class, 'view'])->name('index');
        Route::get('/create', [UserCreateController::class, 'view'])->name('create');
        Route::post('/create', [UserCreateController::class, 'process'])->name('store');
        Route::get('/{user}/update', [UserUpdateController::class, 'view'])->name('update');
        Route::post('/{user}/update', [UserUpdateController::class, 'process'])->name('update');
        Route::get('/{user}/password', [UserPasswordController::class, 'view'])->name('password');
        Route::put('/{user}/password', [UserPasswordController::class, 'process'])->name('password');
        Route::get('/{user}/suspend', [UserSuspendController::class, 'view'])->name('suspend');
        Route::post('/{user}/suspend', [UserSuspendController::class, 'process'])->name('suspend');
        Route::get('/{user}/unsuspend', [UserUnsuspendController::class, 'view'])->name('unsuspend');
        Route::post('/{user}/unsuspend', [UserUnsuspendController::class, 'process'])->name('unsuspend');
        Route::get('/{user}/close', [UserCloseController::class, 'view'])->name('close');
        Route::post('/{user}/close', [UserCloseController::class, 'process'])->name('close');
        Route::get('/{user}/reopen', [UserReopenController::class, 'view'])->name('reopen');
        Route::post('/{user}/reopen', [UserReopenController::class, 'process'])->name('reopen');
        Route::get('/{user}/destroy', [UserDestroyController::class, 'view'])->name('destroy');
        Route::delete('/{user}/destroy', [UserDestroyController::class, 'process'])->name('destroy');
    });

    Route::prefix('wholesalers')->name('wholesalers.')->group(function () {
        Route::get('/', [WholesalerListController::class, 'view'])->name('index');
        Route::get('/create', [WholesalerCreateController::class, 'view'])->name('create');
        Route::post('/create', [WholesalerCreateController::class, 'process'])->name('store');
        Route::get('/{wholesaler}/update', [WholesalerUpdateController::class, 'view'])->name('update');
        Route::post('/{wholesaler}/update', [WholesalerUpdateController::class, 'process'])->name('update');
        Route::get('/{wholesaler}/close', [WholesalerCloseController::class, 'view'])->name('close');
        Route::post('/{wholesaler}/close', [WholesalerCloseController::class, 'process'])->name('close');
        Route::get('/{wholesaler}/reopen', [WholesalerReopenController::class, 'view'])->name('reopen');
        Route::post('/{wholesaler}/reopen', [WholesalerReopenController::class, 'process'])->name('reopen');
        Route::get('/{wholesaler}/destroy', [WholesalerDestroyController::class, 'view'])->name('destroy');
        Route::delete('/{wholesaler}/destroy', [WholesalerDestroyController::class, 'process'])->name('destroy');
    });

    Route::prefix('manufacturers')->name('manufacturers.')->group(function () {
        Route::get('/', [ManufacturerListController::class, 'view'])->name('index');
        Route::get('/create', [ManufacturerCreateController::class, 'view'])->name('create');
        Route::post('/create', [ManufacturerCreateController::class, 'process'])->name('store');
        Route::get('/{manufacturer}/update', [ManufacturerUpdateController::class, 'view'])->name('update');
        Route::post('/{manufacturer}/update', [ManufacturerUpdateController::class, 'process'])->name('update');
        Route::get('/{manufacturer}/close', [ManufacturerCloseController::class, 'view'])->name('close');
        Route::post('/{manufacturer}/close', [ManufacturerCloseController::class, 'process'])->name('close');
        Route::get('/{manufacturer}/reopen', [ManufacturerReopenController::class, 'view'])->name('reopen');
        Route::post('/{manufacturer}/reopen', [ManufacturerReopenController::class, 'process'])->name('reopen');
        Route::get('/{manufacturer}/destroy', [ManufacturerDestroyController::class, 'view'])->name('destroy');
        Route::delete('/{manufacturer}/destroy', [ManufacturerDestroyController::class, 'process'])->name('destroy');
    });

    Route::prefix('product-types')->name('product-types.')->group(function () {
        Route::get('/', [ProductTypeListController::class, 'view'])->name('index');
        Route::get('/create', [ProductTypeCreateController::class, 'view'])->name('create');
        Route::post('/create', [ProductTypeCreateController::class, 'process'])->name('store');
        Route::get('/{product_type}/update', [ProductTypeUpdateController::class, 'view'])->name('update');
        Route::post('/{product_type}/update', [ProductTypeUpdateController::class, 'process'])->name('update');
        Route::get('/{product_type}/close', [ProductTypeCloseController::class, 'view'])->name('close');
        Route::post('/{product_type}/close', [ProductTypeCloseController::class, 'process'])->name('close');
        Route::get('/{product_type}/reopen', [ProductTypeReopenController::class, 'view'])->name('reopen');
        Route::post('/{product_type}/reopen', [ProductTypeReopenController::class, 'process'])->name('reopen');
        Route::get('/{product_type}/destroy', [ProductTypeDestroyController::class, 'view'])->name('destroy');
        Route::delete('/{product_type}/destroy', [ProductTypeDestroyController::class, 'process'])->name('destroy');
    });

    Route::prefix('products')->name('products.')->group(function () {
        Route::get('/', [ProductListController::class, 'view'])->name('index');
        Route::get('/create', [ProductCreateController::class, 'view'])->name('create');
        Route::post('/create', [ProductCreateController::class, 'process'])->name('store');
        Route::get('/{product}/update', [ProductUpdateController::class, 'view'])->name('update');
        Route::post('/{product}/update', [ProductUpdateController::class, 'process'])->name('update');
        Route::get('/{product}/close', [ProductCloseController::class, 'view'])->name('close');
        Route::post('/{product}/close', [ProductCloseController::class, 'process'])->name('close');
        Route::get('/{product}/reinstate', [ProductReinstateController::class, 'view'])->name('reinstate');
        Route::post('/{product}/reinstate', [ProductReinstateController::class, 'process'])->name('reinstate');
        Route::get('/{product}/destroy', [ProductDestroyController::class, 'view'])->name('destroy');
        Route::delete('/{product}/destroy', [ProductDestroyController::class, 'process'])->name('destroy');
    });

    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationListController::class, 'view'])->name('index');
        Route::post('/{notification}/mark-as-read', [NotificationMarkAsReadController::class, 'process'])->name('mark-as-read');
        Route::post('/mark-all-as-read', [NotificationMarkAllAsReadController::class, 'process'])->name('mark-all-as-read');
        Route::post('/send-sample', [NotificationSendSampleController::class, 'process'])->name('send-sample');
        Route::delete('/{notification}', [NotificationDeleteController::class, 'process'])->name('delete');
    });

    Route::prefix('push-subscriptions')->name('push-subscriptions.')->group(function () {
        Route::post('/', [PushSubscriptionCreateController::class, 'process'])->name('create');
        Route::post('/check', [PushSubscriptionCheckController::class, 'process'])->name('check');
        Route::delete('/', [PushSubscriptionDeleteController::class, 'process'])->name('delete');
    });

    Route::get('/dashboard', function () {
        return inertia('Dashboard');
    })->name('dashboard');
});
