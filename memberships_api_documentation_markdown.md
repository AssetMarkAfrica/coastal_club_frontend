# Memberships API Documentation

## Base Variables

```env
MEMBERSHIP_API=http://localhost:81/api/memberships
```

---

# Membership Lifecycle Flow

```text
1. Member views available plans
2. Member submits membership application
3. Member pays application fee
4. Admin reviews application
5. Admin approves application
6. Membership contract is generated
7. Member views contract
8. Member accepts contract terms
9. Payment authorization URL becomes available
10. Member completes payment
11. Membership becomes active
```

---

# 1. Get Membership Plans

## Endpoint

```http
GET {{MEMBERSHIP_API}}/plans/
```

## Description

Returns all available membership plans and benefits.

## Request Body

None.

## Response

```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": 1,
      "tier": "social",
      "name": "Social Plan",
      "annual_fee_pesewas": 180000,
      "club_maintenance_fee_pesewas": 17500,
      "signup_bonus_spend_credit_pesewas": 50000,
      "initiation_fee_pesewas": 120000,
      "fb_minimum_pesewas": 7500,
      "points_multiplier": "1.0",
      "guest_passes_per_visit": 2,
      "benefits": [
        {
          "id": 1,
          "benefit_type": "standard",
          "title": "Weekend Lounge Access",
          "description": "Access to social lounges, rooftop spaces, and networking areas during operating hours.",
          "festive_name": "",
          "festive_start_date": null,
          "festive_end_date": null,
          "sort_order": 0,
          "is_active": true,
          "is_currently_available": true
        }
      ]
    },
    {
      "id": 2,
      "tier": "sports",
      "name": "Sports Plan",
      "annual_fee_pesewas": 360000,
      "club_maintenance_fee_pesewas": 35000,
      "signup_bonus_spend_credit_pesewas": 75000,
      "initiation_fee_pesewas": 250000,
      "fb_minimum_pesewas": 15000,
      "points_multiplier": "1.5",
      "guest_passes_per_visit": 4
    },
    {
      "id": 3,
      "tier": "premier",
      "name": "Premier Plan",
      "annual_fee_pesewas": 720000,
      "club_maintenance_fee_pesewas": 65000,
      "signup_bonus_spend_credit_pesewas": 100000,
      "initiation_fee_pesewas": 600000,
      "fb_minimum_pesewas": 30000,
      "points_multiplier": "2.0",
      "guest_passes_per_visit": 99
    },
    {
      "id": 4,
      "tier": "corporate",
      "name": "Corporate Plan",
      "annual_fee_pesewas": 1500000,
      "club_maintenance_fee_pesewas": 137500,
      "signup_bonus_spend_credit_pesewas": 150000,
      "initiation_fee_pesewas": 1000000,
      "fb_minimum_pesewas": 0,
      "points_multiplier": "2.0",
      "guest_passes_per_visit": 99
    }
  ]
}
```

---

# 2. Submit Membership Application

## Endpoint

```http
POST {{MEMBERSHIP_API}}/applications/
```

## Description

Submits a membership application for a selected plan.

## Request Body

```json
{
  "plan_tier": "premier",
  "callback_url": "http://localhost:3000/payment/callback"
}
```

## Response

```json
{
  "success": true,
  "message": "Application submitted. Please pay the application fee to continue.",
  "data": {
    "application_id": "a0ef4ad8-38e3-4caa-b4bf-a57dc65333e9",
    "application_fee_pesewas": 50000,
    "authorization_url": "https://checkout.paystack.com/tbjyis5f3di1ugb",
    "reference": "CCA-C42C9B81F5364098"
  }
}
```

---

# 3. Verify Application Fee Payment

## Endpoint

```http
GET {{MEMBERSHIP_API}}/verify/?reference={{reference}}
```

## Example

```http
GET {{MEMBERSHIP_API}}/verify/?reference=CCA-C42C9B81F5364098
```

## Description

Verifies application fee payment status.

## Request Body

None.

---

# 4. Admin - View Membership Applications

## Endpoint

```http
GET {{MEMBERSHIP_API}}/admin/applications/
```

## Description

Returns all submitted membership applications for admin review.

## Request Body

None.

## Response

```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": "b1269cb0-2cb2-4202-8d87-8c04985d9fe2",
      "status": "pending_review",
      "application_fee_reference": "CCA-F0EB9B37CC4A40AC",
      "application_fee_paid_at": "2026-05-12T14:00:47.484077Z",
      "approved_at": null,
      "admin_notes": "",
      "created_at": "2026-05-12T13:59:53.014409Z",
      "updated_at": "2026-05-12T14:00:47.491870Z",
      "applicant": {
        "id": "e8911d8f-c3fa-4b53-96b3-2b621ccfabbd",
        "email": "haaris@coastalclub.com",
        "username": "haaris",
        "first_name": "Haaris",
        "last_name": "Waqas"
      },
      "plan": {
        "id": 3,
        "tier": "premier",
        "name": "Premier Plan"
      }
    }
  ]
}
```

---

# 5. Admin - Approve Membership Application

## Endpoint

```http
POST {{MEMBERSHIP_API}}/admin/applications/approve/
```

## Description

Approves a pending membership application and generates a membership contract.

## Request Body

```json
{
  "application_id": "{{application_id}}",
  "callback_url": "http://localhost:3000/payment/callback",
  "admin_notes": "Approved after review"
}
```

## Response

```json
{
  "success": true,
  "message": "Application approved. Contract is now available for member acceptance.",
  "data": {
    "application": {
      "id": "b1269cb0-2cb2-4202-8d87-8c04985d9fe2",
      "status": "approved",
      "contract_id": "ec9423e5-81ad-41d2-8a85-5cfb9eec4477",
      "contract_status": "pending",
      "approved_at": "2026-05-12T14:02:18.964725Z",
      "admin_notes": "Approved after review"
    },
    "contract": {
      "id": "ec9423e5-81ad-41d2-8a85-5cfb9eec4477",
      "status": "pending",
      "contract_version": "v1.0",
      "currency": "GHS",
      "application_fee_paid_pesewas": "GHc500.00",
      "initiation_fee_pesewas": "GHc6000.00",
      "annual_fee_pesewas": "GHc7200.00",
      "total_due_now_pesewas": "GHc13200.00",
      "monthly_maintenance_fee_pesewas": "GHc650.00",
      "accepted_terms": false,
      "accepted_privacy": false,
      "accepted_club_rules": false,
      "accepted_at": null
    }
  }
}
```

---

# 6. Member - View Membership Contract

## Endpoint

```http
GET {{MEMBERSHIP_API}}/contracts/me/
```

## Description

Returns the authenticated member's contract.

## Request Body

None.

## Response

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": "ec9423e5-81ad-41d2-8a85-5cfb9eec4477",
    "status": "pending",
    "contract_version": "v1.0",
    "currency": "GHS",
    "application_fee_paid_pesewas": "GHc500.00",
    "initiation_fee_pesewas": "GHc6000.00",
    "annual_fee_pesewas": "GHc7200.00",
    "total_due_now_pesewas": "GHc13200.00",
    "monthly_maintenance_fee_pesewas": "GHc650.00",
    "accepted_terms": false,
    "accepted_privacy": false,
    "accepted_club_rules": false,
    "accepted_at": null
  }
}
```

---

# 7. Accept Membership Contract

## Endpoint

```http
POST {{MEMBERSHIP_API}}/contracts/{{membership_contract_id}}/accept/
```

## Description

Accepts the membership contract terms and generates the final payment authorization URL.

> **Important:** The payment authorization URL only becomes available after the member accepts all contract terms.

## Request Body

```json
{
  "accept_terms": true,
  "accept_privacy": true,
  "accept_club_rules": true
}
```

## Response

```json
{
  "success": true,
  "message": "Contract accepted. Payment link is now available.",
  "data": {
    "contract": {
      "id": "ec9423e5-81ad-41d2-8a85-5cfb9eec4477",
      "status": "accepted",
      "paystack_reference": "CC-BF062E8037554827",
      "payment_authorization_url": "https://checkout.paystack.com/lcl6dglkwgndml0",
      "accepted_terms": true,
      "accepted_privacy": true,
      "accepted_club_rules": true,
      "accepted_at": "2026-05-12T14:04:35.444953Z"
    },
    "payment": {
      "authorization_url": "https://checkout.paystack.com/lcl6dglkwgndml0",
      "reference": "CC-BF062E8037554827",
      "billing_cycle": "annual",
      "cycle_dues_pesewas": 720000,
      "annual_dues_pesewas": 720000,
      "signup_bonus_spend_credit_pesewas": 100000,
      "total_due_now_pesewas": 1320000
    }
  }
}
```

---

# 8. Verify Membership Payment & Activate Membership

## Endpoint

```http
GET {{MEMBERSHIP_API}}/verify/?reference={{payment_reference}}
```

## Description

Verifies the final membership payment and activates the membership.

## Request Body

None.

## Response

```json
{
  "success": true,
  "message": "Membership activated.",
  "data": {
    "id": "302a9ed7-3fd8-49b9-ba48-017e011e2339",
    "status": "active",
    "is_active": true,
    "billing_cycle": "annual",
    "current_period_start": "2026-05-12T14:16:30.308971Z",
    "current_period_end": "2027-05-12T14:16:30.308971Z",
    "fb_spend_this_month_pesewas": 0,
    "monthly_spend_credit_pesewas": 100000,
    "spend_credit_remaining_pesewas": 100000,
    "maintenance_fee_due_pesewas": 65000,
    "maintenance_fee_status": "bonus_active",
    "is_maintenance_fee_paid_current_month": false,
    "is_signup_bonus_active": true,
    "signup_bonus_expires_on": "2026-05-31",
    "maintenance_fee_paid_through_month": null,
    "maintenance_fee_paid_at": null,
    "created_at": "2026-05-12T14:04:35.451450Z",
    "plan": {
      "id": 3,
      "tier": "premier",
      "name": "Premier Plan"
    }
  }
}
```

---

# Membership Status Flow

| Stage | Status |
|---|---|
| Application Submitted | `pending_review` |
| Admin Approved | `approved` |
| Contract Generated | `pending` |
| Contract Accepted | `accepted` |
| Membership Activated | `active` |

---

# Important Notes

## Payment Flow

- Application fee payment is required before admin review.
- Contract payment authorization URL is generated only after contract acceptance.
- Membership becomes active only after successful payment verification.

## Currency

All monetary values are stored in **pesewas**.

Example:

```text
100000 pesewas = GHc1000.00
```

## Membership Verification Endpoint

The same verification endpoint is used for:

1. Application fee verification
2. Final membership payment verification

```http
GET {{MEMBERSHIP_API}}/verify/?reference={{reference}}
```

