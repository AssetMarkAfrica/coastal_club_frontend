# Booking App — API Reference

Base URL referenced below as `{{BOOKING_API}}`. All amounts are in
**pesewas** (GHS subunits) — divide by 100 to display as cedis.

All responses follow the shape:
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

---

## Customer Endpoints (Non-Member)

### 1. Book Reservation
`POST {{BOOKING_API}}/non-members/`

Creates a reservation and starts a Paystack checkout for the full intended
spend amount.

**Request body**
```json
{
  "reservation_date": "2026-07-15",
  "intended_spend_pesewas": 50000,
  "callback_url": "http://localhost:3000/bookings/verify"
}
```

**Response**
```json
{
  "success": true,
  "message": "Reservation checkout created.",
  "data": {
    "reservation_id": "596abe58-6096-44d4-a50a-9f4d3cd03777",
    "reservation_date": "2026-07-15",
    "intended_spend_pesewas": 50000,
    "authorization_url": "https://checkout.paystack.com/ohgc54g33zsdlfw",
    "reference": "CCN-4152E4ACCD6E43DE",
    "expires_at": "2026-06-26T16:44:37.977827Z"
  }
}
```

Next step: redirect the customer to `authorization_url` to pay.

---

### 1.1 Verify Payment
`POST {{BOOKING_API}}/non-members/verify/`

Call this after the customer returns from Paystack checkout, using the
`reference` from step 1.

**Request body**
```json
{
  "reference": "{{reservation_payment_reference}}"
}
```

**Response**
```json
{
  "success": true,
  "message": "Reservation payment verified.",
  "data": {
    "id": "596abe58-6096-44d4-a50a-9f4d3cd03777",
    "reservation_date": "2026-07-15",
    "status": "confirmed",
    "intended_spend_pesewas": 50000,
    "spend_credit_remaining_pesewas": 50000,
    "paystack_reference": "CCN-4152E4ACCD6E43DE",
    "payment_authorization_url": "https://checkout.paystack.com/ohgc54g33zsdlfw",
    "expires_at": "2026-06-26T16:44:37.977827Z",
    "paid_at": "2026-06-26T16:18:59.290794Z",
    "created_at": "2026-06-26T16:14:38.013038Z",
    "updated_at": "2026-06-26T16:18:59.295135Z"
  }
}
```

On success, `status` becomes `"confirmed"` and `spend_credit_remaining_pesewas`
is set equal to the full intended spend — this is the customer's usable
balance for the visit.

---

### 1.2 My Reservations
`GET {{BOOKING_API}}/non-members/me/`

Returns the logged-in customer's own reservations.

**Response**
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": "596abe58-6096-44d4-a50a-9f4d3cd03777",
      "reservation_date": "2026-07-15",
      "status": "confirmed",
      "intended_spend_pesewas": 50000,
      "spend_credit_remaining_pesewas": 0,
      "paystack_reference": "CCN-4152E4ACCD6E43DE",
      "payment_authorization_url": "https://checkout.paystack.com/ohgc54g33zsdlfw",
      "expires_at": "2026-06-26T16:44:37.977827Z",
      "paid_at": "2026-06-26T16:18:59.290794Z",
      "created_at": "2026-06-26T16:14:38.013038Z",
      "updated_at": "2026-06-26T16:32:54.868209Z"
    }
  ]
}
```

> Note `spend_credit_remaining_pesewas` here is `0` — this reservation's
> entire credit has since been used up by spend entries (see staff endpoints
> below). This field should always reflect the **live remaining balance**,
> not the original intended spend.

---

## Staff / Admin Endpoints

### 1. Get Reservations
`GET {{BOOKING_API}}/staff/reservations/`

Returns all reservations across all customers.

**Response**
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": "596abe58-6096-44d4-a50a-9f4d3cd03777",
      "user_id": "92da9262-ce6a-4089-8ac7-ccf2c6d0403a",
      "user_email": "haaris@coastalclub.com",
      "reservation_date": "2026-07-15",
      "status": "confirmed",
      "intended_spend_pesewas": 50000,
      "spend_credit_remaining_pesewas": 0,
      "paystack_reference": "CCN-4152E4ACCD6E43DE",
      "payment_authorization_url": "https://checkout.paystack.com/ohgc54g33zsdlfw",
      "expires_at": "2026-06-26T16:44:37.977827Z",
      "paid_at": "2026-06-26T16:18:59.290794Z",
      "created_at": "2026-06-26T16:14:38.013038Z",
      "updated_at": "2026-06-26T16:32:54.868209Z"
    }
  ]
}
```

Supports filtering (per the backend's documented query params): `status` and
`date`.

---

### 1.1 Get Reservation by ID
`GET {{BOOKING_API}}/staff/reservations/{{reservation_id}}/`

**Response**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": "596abe58-6096-44d4-a50a-9f4d3cd03777",
    "user_id": "92da9262-ce6a-4089-8ac7-ccf2c6d0403a",
    "user_email": "haaris@coastalclub.com",
    "reservation_date": "2026-07-15",
    "status": "confirmed",
    "intended_spend_pesewas": 50000,
    "spend_credit_remaining_pesewas": 0,
    "paystack_reference": "CCN-4152E4ACCD6E43DE",
    "payment_authorization_url": "https://checkout.paystack.com/ohgc54g33zsdlfw",
    "expires_at": "2026-06-26T16:44:37.977827Z",
    "paid_at": "2026-06-26T16:18:59.290794Z",
    "created_at": "2026-06-26T16:14:38.013038Z",
    "updated_at": "2026-06-26T16:32:54.868209Z"
  }
}
```

---

### 2. Get Spend Entries
`GET {{BOOKING_API}}/staff/spend-entries/`

Returns all spend entries across all customers and staff.

**Response**
```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": "97c328f0-aab8-42c7-a068-2d433388ea58",
      "customer_type": "non_member",
      "customer_id": "92da9262-ce6a-4089-8ac7-ccf2c6d0403a",
      "customer_email": "haaris@coastalclub.com",
      "staff_user_id": "2eda309d-214f-426f-8e5e-7b9b9015178c",
      "staff_user_email": "jane@coastalclub.com",
      "member_subscription": null,
      "non_member_reservation": "596abe58-6096-44d4-a50a-9f4d3cd03777",
      "amount_spent_pesewas": 60000,
      "credit_applied_pesewas": 20000,
      "amount_due_pesewas": 40000,
      "status": "pending_payment",
      "paystack_reference": "CCS-200C667F0D7F4224",
      "payment_authorization_url": "https://checkout.paystack.com/43x36wlfg6nquq1",
      "settled_at": null,
      "created_at": "2026-06-26T16:32:54.885251Z",
      "updated_at": "2026-06-26T16:32:55.680965Z"
    },
    {
      "id": "c7c99c02-6e70-49e9-a9ba-5b638cabcf7d",
      "customer_type": "non_member",
      "customer_id": "92da9262-ce6a-4089-8ac7-ccf2c6d0403a",
      "customer_email": "haaris@coastalclub.com",
      "staff_user_id": "2eda309d-214f-426f-8e5e-7b9b9015178c",
      "staff_user_email": "jane@coastalclub.com",
      "member_subscription": null,
      "non_member_reservation": "596abe58-6096-44d4-a50a-9f4d3cd03777",
      "amount_spent_pesewas": 30000,
      "credit_applied_pesewas": 30000,
      "amount_due_pesewas": 0,
      "status": "settled",
      "paystack_reference": null,
      "payment_authorization_url": "",
      "settled_at": "2026-06-26T16:31:21.259493Z",
      "created_at": "2026-06-26T16:31:21.286209Z",
      "updated_at": "2026-06-26T16:31:21.286219Z"
    }
  ]
}
```

Supports filtering (per the backend's documented query params): `status` and
`customer_type`.

---

### 2.1 Get Spend Entry by ID
`GET {{BOOKING_API}}/staff/spend-entries/{{spend_entry_id}}/`

**Response**
```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": "97c328f0-aab8-42c7-a068-2d433388ea58",
    "customer_type": "non_member",
    "customer_id": "92da9262-ce6a-4089-8ac7-ccf2c6d0403a",
    "customer_email": "haaris@coastalclub.com",
    "staff_user_id": "2eda309d-214f-426f-8e5e-7b9b9015178c",
    "staff_user_email": "jane@coastalclub.com",
    "member_subscription": null,
    "non_member_reservation": "596abe58-6096-44d4-a50a-9f4d3cd03777",
    "amount_spent_pesewas": 60000,
    "credit_applied_pesewas": 20000,
    "amount_due_pesewas": 40000,
    "status": "pending_payment",
    "paystack_reference": "CCS-200C667F0D7F4224",
    "payment_authorization_url": "https://checkout.paystack.com/43x36wlfg6nquq1",
    "settled_at": null,
    "created_at": "2026-06-26T16:32:54.885251Z",
    "updated_at": "2026-06-26T16:32:55.680965Z"
  }
}
```

---

### 3. Log Spend Entry
`POST {{BOOKING_API}}/staff/spend/`

Staff logs a bill against a customer's reservation. The backend
automatically calculates how much is covered by remaining reservation
credit, and how much (if any) shortfall the customer must pay.

**Request body**
```json
{
  "customer_type": "non_member",
  "reservation_id": "{{reservation_id}}",
  "amount_spent_pesewas": 60000,
  "callback_url": "http://localhost:3000/spend/verify"
}
```

**Response — no shortfall (fully covered by credit)**
```json
{
  "success": true,
  "message": "Spend entry created.",
  "data": {
    "id": "c7c99c02-6e70-49e9-a9ba-5b638cabcf7d",
    "customer_type": "non_member",
    "customer": "92da9262-ce6a-4089-8ac7-ccf2c6d0403a",
    "staff_user": "2eda309d-214f-426f-8e5e-7b9b9015178c",
    "member_subscription": null,
    "non_member_reservation": "596abe58-6096-44d4-a50a-9f4d3cd03777",
    "amount_spent_pesewas": 30000,
    "credit_applied_pesewas": 30000,
    "amount_due_pesewas": 0,
    "status": "settled",
    "paystack_reference": null,
    "payment_authorization_url": "",
    "settled_at": "2026-06-26T16:31:21.259493Z",
    "created_at": "2026-06-26T16:31:21.286209Z",
    "updated_at": "2026-06-26T16:31:21.286219Z"
  }
}
```
`status` is immediately `"settled"`; no payment step needed.

**Response — shortfall (credit doesn't cover the full bill)**
```json
{
  "success": true,
  "message": "Spend entry created.",
  "data": {
    "id": "97c328f0-aab8-42c7-a068-2d433388ea58",
    "customer_type": "non_member",
    "customer": "92da9262-ce6a-4089-8ac7-ccf2c6d0403a",
    "staff_user": "2eda309d-214f-426f-8e5e-7b9b9015178c",
    "member_subscription": null,
    "non_member_reservation": "596abe58-6096-44d4-a50a-9f4d3cd03777",
    "amount_spent_pesewas": 60000,
    "credit_applied_pesewas": 20000,
    "amount_due_pesewas": 40000,
    "status": "pending_payment",
    "paystack_reference": "CCS-200C667F0D7F4224",
    "payment_authorization_url": "https://checkout.paystack.com/43x36wlfg6nquq1",
    "settled_at": null,
    "created_at": "2026-06-26T16:32:54.885251Z",
    "updated_at": "2026-06-26T16:32:55.680965Z"
  }
}
```
`status` is `"pending_payment"` and `amount_due_pesewas` is the shortfall to
collect.

> **Design requirement:** when a shortfall exists, `payment_authorization_url`
> must be rendered as a **scannable QR code** on the staff device, so the
> staff member can show it to the customer and the customer pays the
> shortfall on their own phone — not the staff member's.

---

### 3.1 Verify Payment (Shortfall)
`POST {{BOOKING_API}}/staff/spend/verify/`

Call once the customer has paid the shortfall via the QR/payment link, to
confirm and settle the spend entry.

**Request body**
```json
{
  "reference": "{{shortfall_payment_reference}}"
}
```

**Response**
```json
{
  "success": true,
  "message": "Spend payment verified.",
  "data": {
    "id": "97cc3e97-31f3-4b47-bb70-74c16da595c1",
    "customer_type": "non_member",
    "customer": "b76ced22-14ec-4681-bf66-8755e728f356",
    "staff_user": "2eda309d-214f-426f-8e5e-7b9b9015178c",
    "member_subscription": null,
    "non_member_reservation": "f3f9d94f-7ee7-4384-b1d1-9c594365f869",
    "amount_spent_pesewas": 5000,
    "credit_applied_pesewas": 0,
    "amount_due_pesewas": 5000,
    "status": "settled",
    "paystack_reference": "CCS-6E4C95795A3E4493",
    "payment_authorization_url": "https://checkout.paystack.com/61zmp7a203fj13t",
    "settled_at": "2026-06-30T11:50:15.524441Z",
    "created_at": "2026-06-30T11:45:23.374687Z",
    "updated_at": "2026-06-30T11:50:15.528532Z"
  }
}
```
`status` becomes `"settled"` and `settled_at` is populated.

---

## Endpoint Summary

| # | Method | Endpoint | Role | Purpose |
|---|--------|----------|------|---------|
| 1 | POST | `/non-members/` | Customer | Create reservation + start checkout |
| 1.1 | POST | `/non-members/verify/` | Customer | Verify reservation payment |
| 1.2 | GET | `/non-members/me/` | Customer | List own reservations |
| 1 | GET | `/staff/reservations/` | Staff/Admin | List all reservations |
| 1.1 | GET | `/staff/reservations/{id}/` | Staff/Admin | Get one reservation |
| 2 | GET | `/staff/spend-entries/` | Staff/Admin | List all spend entries |
| 2.1 | GET | `/staff/spend-entries/{id}/` | Staff/Admin | Get one spend entry |
| 3 | POST | `/staff/spend/` | Staff | Log a bill against a reservation |
| 3.1 | POST | `/staff/spend/verify/` | Staff | Verify shortfall payment |
