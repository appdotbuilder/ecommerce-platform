<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Voucher
 *
 * @property int $id
 * @property string $code
 * @property string $type
 * @property float $value
 * @property float|null $minimum_amount
 * @property float|null $maximum_discount
 * @property int|null $usage_limit
 * @property int $usage_count
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $starts_at
 * @property \Illuminate\Support\Carbon|null $expires_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Order> $orders
 * @property-read int|null $orders_count
 * @property-read bool $is_valid
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Voucher newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Voucher newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Voucher query()
 * @method static \Illuminate\Database\Eloquent\Builder|Voucher whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Voucher whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Voucher whereExpiresAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Voucher whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Voucher whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Voucher whereMaximumDiscount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Voucher whereMinimumAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Voucher whereStartsAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Voucher whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Voucher whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Voucher whereUsageCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Voucher whereUsageLimit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Voucher whereValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Voucher active()
 * @method static \Illuminate\Database\Eloquent\Builder|Voucher valid()
 * @method static \Database\Factories\VoucherFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Voucher extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'code',
        'type',
        'value',
        'minimum_amount',
        'maximum_discount',
        'usage_limit',
        'usage_count',
        'is_active',
        'starts_at',
        'expires_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'value' => 'decimal:2',
        'minimum_amount' => 'decimal:2',
        'maximum_discount' => 'decimal:2',
        'is_active' => 'boolean',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the orders that used this voucher.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Check if the voucher is currently valid.
     *
     * @return bool
     */
    public function getIsValidAttribute(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $now = now();

        if ($this->starts_at && $this->starts_at->isAfter($now)) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isBefore($now)) {
            return false;
        }

        if ($this->usage_limit && $this->usage_count >= $this->usage_limit) {
            return false;
        }

        return true;
    }

    /**
     * Calculate discount amount for a given subtotal.
     *
     * @param  float  $subtotal
     * @return float
     */
    public function calculateDiscount(float $subtotal): float
    {
        if (!$this->is_valid) {
            return 0;
        }

        if ($this->minimum_amount && $subtotal < $this->minimum_amount) {
            return 0;
        }

        $discount = $this->type === 'percentage' 
            ? $subtotal * ($this->value / 100)
            : $this->value;

        if ($this->maximum_discount) {
            $discount = min($discount, $this->maximum_discount);
        }

        return $discount;
    }

    /**
     * Scope a query to only include active vouchers.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include valid vouchers.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeValid($query)
    {
        $now = now();
        return $query->where('is_active', true)
            ->where(function ($query) use ($now) {
                $query->whereNull('starts_at')->orWhere('starts_at', '<=', $now);
            })
            ->where(function ($query) use ($now) {
                $query->whereNull('expires_at')->orWhere('expires_at', '>=', $now);
            })
            ->where(function ($query) {
                $query->whereNull('usage_limit')
                    ->orWhereRaw('usage_count < usage_limit');
            });
    }
}