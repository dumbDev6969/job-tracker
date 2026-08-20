---
name: backend
description: Use this skill whenever building or reviewing a Laravel 13 backend, especially a decoupled/API-only backend consumed by a separate frontend (React, Vue, mobile). Trigger on migrations, models, controllers, Form Requests, API Resources, Eloquent, Sanctum auth, enums, policies, or any "is this the right Laravel way to do X" question — even if the user doesn't say "Laravel 13" explicitly. Also trigger when the user is deciding whether to add a package, abstraction, or pattern to a Laravel backend, since this skill includes a fit/necessity checklist for that.

---
name: laravel-13-backend
description: Use this skill whenever building or reviewing a Laravel 13 backend, especially a decoupled/API-only backend consumed by a separate frontend (React, Vue, mobile). Trigger on migrations, models, controllers, Form Requests, API Resources, Eloquent, Sanctum auth, enums, policies, or any "is this the right Laravel way to do X" question — even if the user doesn't say "Laravel 13" explicitly. Also trigger when the user is deciding whether to add a package, abstraction, or pattern to a Laravel backend, since this skill includes a fit/necessity checklist for that.
---

# Laravel 13 Backend (API/Decoupled)

Senior-dev-review mindset: for every recommendation below, ask **"does this fit the stack?"** (is it the Laravel-native way, or a foreign pattern bolted on) and **"do we need this yet?"** (is it solving a real problem at the project's current size, or pre-optimizing for scale that doesn't exist). Call out when a "best practice" is overkill for a single-tenant / early-stage project, and say so.

## 1. Laravel 13 baseline facts

Laravel 13 shipped March 17, 2026. Requires **PHP 8.3+** (supports 8.3–8.5). Framework-level things that are new or changed vs. 11/12 and actually matter day-to-day:

- **`bootstrap/app.php` is the only place middleware/exceptions/routing get configured.** `app/Http/Kernel.php` is gone (removed, not just deprecated). If you see a project with `Kernel.php`, it's pre-13 code being upgraded — migrate that config into `bootstrap/app.php`.
- **PHP Attributes are now a first-class alternative to fluent/property config** in controllers, jobs, and Eloquent models — e.g. `#[Middleware('auth')]` and `#[Authorize('update', Post::class)]` on controller methods, `#[Tries(3)]` / `#[Backoff(10)]` / `#[Timeout(30)]` on jobs, and `#[Fillable([...])]` / `#[Guarded]` / `#[Hidden]` / `#[Table]` / `#[Appends]` / `#[Touches]` / `#[ObservedBy]` / `#[ScopedBy]` on models. These are **optional**, not a replacement requirement — don't rewrite working code just to use them.
  - **Caution on `#[Fillable]` specifically**: Laravel 13.0.0 shipped with a confirmed bug where the attribute wasn't honored by `Model::query()->create()`, throwing `MassAssignmentException` even when declared correctly (laravel/framework#59270, since closed/patched). Mass assignment is a security-sensitive surface — stick with `protected $fillable = [...]` property syntax until you've confirmed the patch version in use is clean, rather than adopting the new syntax for cosmetic reasons alone.
  - For everything else (controller/job attributes), safe to use on new code when it reads cleaner than the fluent equivalent.
- **`PreventRequestForgery`** formalizes and replaces the old CSRF middleware naming, adding origin-aware verification. Token-based CSRF (what Sanctum SPA auth relies on) still works the same way — no action needed for existing Sanctum setups.
- **First-party JSON:API resource support** exists now (`toJsonApiResource()` style responses) if you want spec-compliant output. Plain `JsonResource` (see §3) is still the default and is what most projects should use — don't reach for JSON:API compliance unless a consumer actually requires that spec.
- **`Queue::route(ProcessPodcast::class, connection: 'redis', queue: 'podcasts')`** — centralizes queue/connection routing by job class instead of setting it per-job. Nice for larger apps with many job classes; irrelevant if you have zero or one queued job.
- **`Cache::touch($key, $seconds)`** — extends a cache item's TTL without re-fetching/re-storing the value. Use this instead of `Cache::get()` + `Cache::put()` when you just need to bump expiry (e.g. sliding-window rate limits).
- **Removed in 13** (will hard-fail if present in upgraded code): `Route::controller()` (use `Route::resource()` or explicit routes), `$request->has()` with array syntax (use `hasAny()`), `Model::unguard()` (use `preventSilentlyDiscardingAttributes()`), `Str::slug()` custom separator as positional arg (use named arg).

## 2. Decoupled API project structure

For a Laravel backend serving a separate SPA/mobile client (no Blade views), scaffold with `--api`:

```bash
php artisan make:model ModelName -mcr --api
php artisan make:resource ModelNameResource
```

- `-m` migration, `-c` controller, `-r` makes it a resource controller, `--api` strips `create`/`edit` (no views to render).
- Skip `-a`/`--all`'s auto-generated **Policy** unless the app is genuinely multi-user/multi-tenant with per-user authorization logic. A Policy on a single-owner resource is a permanently-true `authorize()` check — dead code. Add it later when multi-user is real; it's a small addition, not a refactor.
- Do generate **Form Requests** (`StoreXRequest`/`UpdateXRequest`) regardless of user count — validation belongs out of the controller no matter what.

## 3. Default to API Resources for anything the frontend consumes long-term

Not a hard technical requirement — `return $model` works, Eloquent serializes fine, nothing breaks. But `return $model` makes your **database schema the API contract**: every column ships over the wire, including ones you never meant to expose (`user_id`, internal flags, anything added later gets leaked automatically with zero code change, silently).

```php
// app/Http/Resources/JobApplicationResource.php
class JobApplicationResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'company' => $this->company,
            'status' => $this->status->value, // enum -> string for JSON
            'applied_date' => $this->applied_date?->toDateString(),
        ];
    }
}
```

Controller returns `JobApplicationResource::collection($applications)` or `new JobApplicationResource($application)`. This is the seam where you control exactly what the frontend sees, and it's the contract a TS type on the frontend should match against — a raw model dump is not a stable contract.

**When it's fine to skip:** quick internal/admin-only endpoints you alone consume, throwaway prototyping routes, or a genuinely tiny model with nothing sensitive that you're confident won't grow (rare in practice — models grow).

**When skipping it actually bites you:** anything the frontend consumes long-term, any model with `user_id`/tokens/internal fields, anything where the TS type needs to match the API shape exactly. For most decoupled apps, the cost (one small class per model) is low enough that defaulting to "always use a Resource for user-facing endpoints" is the right call rather than deciding case-by-case.

## 4. Enums: PHP native, not database enums

Never use `$table->enum('status', [...])` for anything with app-level meaning (status flags, types, categories). A DB enum duplicates the source of truth across DB + PHP + (if there's a TS frontend) TS, and changing a value later means an `ALTER TABLE` migration — genuinely painful on Postgres.

```php
// Migration
$table->string('status')->default('applied');

// app/Enums/ApplicationStatus.php
enum ApplicationStatus: string
{
    case Applied = 'applied';
    case Interviewing = 'interviewing';
    case Offered = 'offered';
    case Rejected = 'rejected';
}

// Model
protected function casts(): array
{
    return ['status' => ApplicationStatus::class];
}
```

PHP enum + `casts()` is the single source of truth; DB just stores the string. If there's a TypeScript frontend, mirror the enum as a TS union manually or generate it — don't let the DB enum be the contract.

For simple yes/no flags (not a real multi-value enum), use `boolean`, not `enum('yes','no')`.

## 5. Auth: Sanctum SPA vs. Sanctum tokens — pick based on client, not habit

- **Sanctum SPA (cookie-based) auth**: use when the frontend is a first-party SPA served from a domain you control (even a different subdomain/port), e.g. React app talking to your own Laravel API. Requires `stateful` domains config, CSRF cookie fetch (`/sanctum/csrf-cookie`) before login, `withCredentials`/`credentials: 'include'` on the frontend's HTTP client. This is the right default for "my own React app talks to my own Laravel API."
- **Sanctum API tokens (Bearer)**: use for mobile apps, third-party API consumers, or CLI tools — anything that isn't a browser-based first-party SPA and can't rely on cookies.

Don't mix both into one app without a reason — pick the one that matches the actual client, and don't add token auth "just in case" if there's only ever one first-party SPA consuming the API.

## 6. Migrations checklist (fit/necessity pass before running one)

- Column names: snake_case, no hyphens, no reserved words.
- Booleans for genuine yes/no; strings + PHP enum cast for anything with more than two states or that might grow states later.
- `text()` not `string()` for free-form/long content (notes, descriptions) — `string()` is `VARCHAR(255)` and truncates silently in some drivers.
- Add an index on columns you'll actually filter/sort by in real queries (e.g. `['user_id', 'status']`), not speculatively on every column.
- Foreign keys: `foreignId('x_id')->constrained()->onDelete(...)` — decide cascade vs. restrict deliberately, don't default to cascade without thinking about whether losing child rows silently is actually desired.
- Ask: does this need a DB-level constraint, or is app-level validation (Form Request) enough? Constraints are for data integrity guarantees the app can't be trusted to enforce alone (uniqueness, FK integrity); everything else can live in a Form Request.

## 7. Common N+1 trap in API responses

If a Resource or controller accesses a relationship (`$this->user->name`) inside a loop over a collection, that's N+1 queries. Eager-load in the controller before passing to the Resource:

```php
$applications = JobApplication::with('user')->paginate(20);
return JobApplicationResource::collection($applications);
```

Check this whenever an API Resource touches a relationship — it's the single most common perf bug in Laravel APIs and is invisible until the table has more than a handful of rows.

## 8. Error responses: keep them consistent

Decoupled frontends need predictable error shapes to handle them generically (e.g. one Axios interceptor). Laravel's default validation error response (422, `{"message": ..., "errors": {...}}`) from Form Requests is already consumer-friendly — don't build a custom wrapper unless the frontend genuinely needs a different shape. Customize the exception handler in `bootstrap/app.php`'s `->withExceptions()` only for cases the default doesn't cover well (e.g. converting 500s to a safe generic JSON error in production).

## 9. Before adding any package or pattern, run this checklist

1. Does Laravel already do this out of the box? (Form Requests already validate; `casts()` already type-casts; Eloquent already eager-loads — don't add a package to re-solve a solved problem.)
2. Does this match a pattern already established elsewhere in the project, or does it introduce a second way of doing the same thing?
3. Is this solving a problem the project has *right now*, at its current scale/user count — or is it speculative ("might need this later")?
4. If skipped now, how expensive is it to add later? (Policies, queue routing, and caching are all cheap to bolt on later — auth strategy and DB schema decisions are not. Spend caution where it's expensive to undo.)

## 10. Further reading (fetch when the task actually needs it)

Sections above are deliberately thin on features most API projects touch rarely. Fetch these only when the task calls for them, rather than assuming from memory — they're new/evolving enough that specifics are worth confirming live:

- Sanctum SPA auth setup end-to-end: https://laravel.com/docs/13.x/sanctum#spa-authentication
- Eloquent API Resources (full options — conditional attributes, pagination, wrapping): https://laravel.com/docs/13.x/eloquent-resources
- JSON:API-spec resources (only if a consumer requires the actual spec): https://laravel.com/docs/13.x/eloquent-resources#jsonapi-resources
- Laravel AI SDK (text/image/audio/embeddings, provider-agnostic): https://laravel.com/docs/13.x/ai-sdk
- Semantic/vector search (pgvector-backed): https://laravel.com/docs/13.x/search#semantic-vector-search
- Full 13.x release notes / upgrade guide: https://laravel.com/docs/13.x/releases
- Queues (attributes, routing, failed jobs): https://laravel.com/docs/13.x/queues
- Validation rules reference: https://laravel.com/docs/13.x/validation#available-validation-rules

---

<!-- Tip: Use /create-skill in chat to generate content with agent assistance -->

Define the functionality provided by this skill, including detailed instructions and examples