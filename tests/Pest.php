<?php

declare(strict_types=1);

use App\Models\Role;
/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

use Illuminate\Support\Sleep;

pest()->extend(Tests\TestCase::class)
    ->use(Illuminate\Foundation\Testing\RefreshDatabase::class)
    ->beforeEach(function () {
        Str::createRandomStringsNormally();
        Str::createUuidsNormally();
        Http::preventStrayRequests();
        Sleep::fake();

        $this->freezeTime();
    })
    ->in('Browser', 'Feature', 'Unit');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

/**
 * Create a test operator
 */
function createOperator(string $name = 'Test Operator', string $email = 'operator@example.com'): App\Models\Operator
{
    return App\Models\Operator::create([
        'name' => $name,
        'email' => $email,
    ]);
}

/**
 * Create a test territory
 */
function createTerritory(App\Models\Operator $operator, string $name = 'Test Territory'): App\Models\Territory
{
    return App\Models\Territory::create([
        'operator_id' => $operator->id,
        'name' => $name,
    ]);
}

/**
 * Create a test user
 */
function createUser(
    App\Models\Operator $operator,
    string $firstName = 'Test',
    string $lastName = 'User',
    string $email = 'test@example.com',
    string $password = 'password',
    ?string $roleId = null
): App\Models\User {
    return App\Models\User::create([
        'operator_id' => $operator->id,
        'role_id' => $roleId,
        'first_name' => $firstName,
        'last_name' => $lastName,
        'email' => $email,
        'password' => bcrypt($password),
    ]);
}

/**
 * Create a test role
 */
function createRole(
    string $name = 'Manager',
    string $description = 'Manager role',
    bool $hidden = false,
    ?string $id = null
): Role {
    return App\Actions\RoleActions::create([
        'id' => $id,
        'name' => $name,
        'description' => $description,
        'hidden' => $hidden,
    ]);
}

/**
 * Create a complete test environment with operator, territory, and user
 */
function createTestEnvironment(): array
{
    $operator = createOperator();
    $territory = createTerritory($operator);
    $role = createRole();
    $user = createUser($operator, roleId: $role->id);

    return compact('operator', 'territory', 'user', 'role');
}
