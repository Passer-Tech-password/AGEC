# AGEC Firestore Database Structure

This document describes the Firestore database structure for the Agro Elite Community (AGEC) platform.

## Overview

The database consists of the following main collections:

1. **users** - User profiles and account information
2. **investmentPlans** - Available investment plans (Starter, Bronze, Silver, etc.)
3. **investments** - User investments in plans/projects
4. **farmProjects** - Featured farm projects
5. **transactions** - All financial transactions (deposits, withdrawals, returns)
6. **withdrawals** - Withdrawal requests
7. **deposits** - Deposit requests
8. **referrals** - Referral relationships and bonuses
9. **kycSubmissions** - KYC verification submissions

---

## 1. Collection: `users`

Stores user profile and account information.

**Document ID**: User's Firebase Auth UID

**Fields**:
| Field               | Type       | Description                                           |
|---------------------|------------|-------------------------------------------------------|
| `email`             | String     | User's email address                                  |
| `fullName`          | String     | User's full name                                      |
| `phoneNumber`       | String     | User's phone number                                   |
| `role`              | String     | User role: 'user' or 'admin'                          |
| `kycVerified`       | Boolean    | Whether KYC is verified (default: false)              |
| `walletBalance`     | Number     | Available wallet balance (₦)                          |
| `totalInvested`     | Number     | Total amount invested (₦)                            |
| `totalEarnings`     | Number     | Total earnings from investments (₦)                   |
| `totalWithdrawn`    | Number     | Total amount withdrawn (₦)                           |
| `referralCode`      | String     | User's unique referral code                          |
| `referrerId`        | String?    | UID of the user who referred this user (if any)       |
| `createdAt`         | Timestamp  | Account creation date                                 |
| `updatedAt`         | Timestamp  | Last update date                                      |

**Example Document**:
```javascript
{
  email: "john@example.com",
  fullName: "John Doe",
  phoneNumber: "+2348000000000",
  role: "user",
  kycVerified: false,
  walletBalance: 50000,
  totalInvested: 350000,
  totalEarnings: 120000,
  totalWithdrawn: 75000,
  referralCode: "AGE123XYZ",
  referrerId: "abc123",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 2. Collection: `investmentPlans`

Stores all available investment plans.

**Document ID**: Auto-generated or plan name (e.g., "starter", "bronze")

**Fields**:
| Field               | Type       | Description                                           |
|---------------------|------------|-------------------------------------------------------|
| `name`              | String     | Plan name (e.g., "Starter Plan")                      |
| `description`       | String     | Plan description                                      |
| `minInvestment`     | Number     | Minimum investment amount (₦)                         |
| `maxInvestment`     | Number?    | Maximum investment amount (₦, optional)              |
| `roiPercentage`     | Number     | ROI percentage (e.g., 18 for 18%)                     |
| `durationDays`      | Number     | Investment duration in days                           |
| `biWeeklyPayout`    | Number     | Bi-weekly payout amount or percentage                 |
| `popular`           | Boolean    | Mark as popular plan                                  |
| `featured`          | Boolean    | Mark as featured (premium) plan                       |
| `features`          | Array      | List of plan features                                 |
| `active`            | Boolean    | Whether the plan is active and accepting investments  |
| `createdAt`         | Timestamp  | Creation date                                         |

**Example Document**:
```javascript
{
  name: "Starter Plan",
  description: "Perfect for new investors",
  minInvestment: 20000,
  maxInvestment: 49999,
  roiPercentage: 18,
  durationDays: 90,
  biWeeklyPayout: 1500,
  popular: false,
  featured: false,
  features: ["18% ROI", "3 Months Duration", "Bi-weekly Payouts"],
  active: true,
  createdAt: Timestamp
}
```

---

## 3. Collection: `investments`

Stores individual user investments.

**Document ID**: Auto-generated

**Fields**:
| Field               | Type       | Description                                           |
|---------------------|------------|-------------------------------------------------------|
| `userId`            | String     | UID of the investor                                   |
| `planId`            | String     | ID of the investment plan                             |
| `planName`          | String     | Name of the investment plan                           |
| `amount`            | Number     | Investment amount (₦)                                 |
| `roiPercentage`     | Number     | ROI percentage for this investment                    |
| `startDate`         | Timestamp  | Investment start date                                 |
| `maturityDate`      | Timestamp  | Investment maturity date                              |
| `status`            | String     | Status: 'active', 'matured', 'cancelled'              |
| `totalReturns`      | Number     | Expected total returns (₦)                            |
| `totalPaidOut`      | Number     | Total amount paid out so far (₦)                      |
| `nextPayoutDate`    | Timestamp? | Next payout date                                      |
| `payouts`           | Array      | List of payouts made for this investment              |
| `createdAt`         | Timestamp  | Creation date                                         |

**Example Document**:
```javascript
{
  userId: "user123",
  planId: "starter",
  planName: "Starter Plan",
  amount: 20000,
  roiPercentage: 18,
  startDate: Timestamp,
  maturityDate: Timestamp,
  status: "active",
  totalReturns: 23600,
  totalPaidOut: 0,
  nextPayoutDate: Timestamp,
  payouts: [],
  createdAt: Timestamp
}
```

---

## 4. Collection: `farmProjects`

Stores featured farm projects.

**Document ID**: Auto-generated

**Fields**:
| Field               | Type       | Description                                           |
|---------------------|------------|-------------------------------------------------------|
| `name`              | String     | Project name (e.g., "Poultry Farm")                  |
| `location`          | String     | Project location                                      |
| `description`       | String     | Project description                                   |
| `imageUrl`          | String     | Project image URL                                     |
| `investmentAmount`  | Number     | Investment amount (₦)                                 |
| `roiPercentage`     | Number     | ROI percentage                                        |
| `durationDays`      | Number     | Project duration in days                              |
| `spotsLeft`         | Number     | Number of spots left                                  |
| `active`            | Boolean    | Whether the project is active                         |
| `createdAt`         | Timestamp  | Creation date                                         |

**Example Document**:
```javascript
{
  name: "Poultry Farm",
  location: "Ogun State",
  description: "Invest in our poultry farm project",
  imageUrl: "https://example.com/image.jpg",
  investmentAmount: 500000,
  roiPercentage: 78,
  durationDays: 24,
  spotsLeft: 12,
  active: true,
  createdAt: Timestamp
}
```

---

## 5. Collection: `transactions`

Stores all financial transactions (deposits, withdrawals, returns).

**Document ID**: Auto-generated

**Fields**:
| Field               | Type       | Description                                           |
|---------------------|------------|-------------------------------------------------------|
| `userId`            | String     | UID of the user                                       |
| `type`              | String     | Transaction type: 'deposit', 'withdrawal', 'return'   |
| `amount`            | Number     | Transaction amount (₦)                                |
| `status`            | String     | Status: 'pending', 'completed', 'failed', 'cancelled'|
| `reference`         | String     | Payment reference or transaction ID                   |
| `description`       | String     | Transaction description                               |
| `investmentId`      | String?    | Related investment ID (if applicable)                 |
| `createdAt`         | Timestamp  | Transaction date                                      |

**Example Document**:
```javascript
{
  userId: "user123",
  type: "deposit",
  amount: 50000,
  status: "completed",
  reference: "PAY-123456",
  description: "Wallet deposit via Paystack",
  createdAt: Timestamp
}
```

---

## 6. Collection: `withdrawals`

Stores withdrawal requests.

**Document ID**: Auto-generated

**Fields**:
| Field               | Type       | Description                                           |
|---------------------|------------|-------------------------------------------------------|
| `userId`            | String     | UID of the user                                       |
| `amount`            | Number     | Withdrawal amount (₦)                                 |
| `bankName`          | String     | Bank name                                             |
| `accountNumber`     | String     | Bank account number                                   |
| `accountName`       | String     | Bank account name                                     |
| `status`            | String     | Status: 'pending', 'approved', 'rejected', 'paid'     |
| `adminNotes`        | String?    | Notes from admin (optional)                           |
| `reference`         | String?    | Payment reference                                     |
| `processedAt`       | Timestamp? | Date when processed (if applicable)                   |
| `createdAt`         | Timestamp  | Request date                                          |

**Example Document**:
```javascript
{
  userId: "user123",
  amount: 20000,
  bankName: "GTBank",
  accountNumber: "0123456789",
  accountName: "John Doe",
  status: "pending",
  createdAt: Timestamp
}
```

---

## 7. Collection: `deposits`

Stores deposit requests.

**Document ID**: Auto-generated

**Fields**:
| Field               | Type       | Description                                           |
|---------------------|------------|-------------------------------------------------------|
| `userId`            | String     | UID of the user                                       |
| `amount`            | Number     | Deposit amount (₦)                                    |
| `paymentMethod`     | String     | Payment method (e.g., "Paystack", "Flutterwave")     |
| `status`            | String     | Status: 'pending', 'approved', 'rejected', 'completed'|
| `reference`         | String?    | Payment reference                                     |
| `proofUrl`          | String?    | Payment proof URL (if applicable)                     |
| `processedAt`       | Timestamp? | Date when processed (if applicable)                   |
| `createdAt`         | Timestamp  | Request date                                          |

---

## 8. Collection: `referrals`

Stores referral relationships and bonuses.

**Document ID**: Auto-generated

**Fields**:
| Field               | Type       | Description                                           |
|---------------------|------------|-------------------------------------------------------|
| `referrerId`        | String     | UID of the referrer                                   |
| `referredId`        | String     | UID of the referred user                              |
| `bonusAmount`       | Number     | Bonus amount earned (₦)                               |
| `status`            | String     | Status: 'pending', 'credited'                         |
| `createdAt`         | Timestamp  | Creation date                                         |

---

## 9. Collection: `kycSubmissions`

Stores KYC verification submissions.

**Document ID**: Auto-generated

**Fields**:
| Field               | Type       | Description                                           |
|---------------------|------------|-------------------------------------------------------|
| `userId`            | String     | UID of the user                                       |
| `idType`            | String     | ID type: 'nin', 'voter', 'driver', 'passport'        |
| `idNumber`          | String     | ID number                                             |
| `idImageUrl`        | String     | ID image URL                                          |
| `selfieUrl`         | String     | Selfie image URL                                      |
| `status`            | String     | Status: 'pending', 'approved', 'rejected'             |
| `adminNotes`        | String?    | Notes from admin (optional)                           |
| `reviewedAt`        | Timestamp? | Date when reviewed (if applicable)                    |
| `createdAt`         | Timestamp  | Submission date                                       |

---

## Setup Instructions

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create/Select your project**
3. **Enable Firestore Database**
4. **Deploy Security Rules**: Copy `firestore.rules` to Firebase Console > Firestore Database > Rules
5. **Deploy Indexes**: Use Firebase CLI or copy `firestore.indexes.json` to Firebase Console > Firestore Database > Indexes
6. **Initialize Database**: You can manually create initial documents (e.g., investment plans) or use a script

## Firebase CLI Setup (Optional)

To deploy rules and indexes using Firebase CLI:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy rules and indexes
firebase deploy --only firestore
```
