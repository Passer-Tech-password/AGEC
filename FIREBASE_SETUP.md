# AGEC Firebase Setup Guide

This guide will help you set up Firebase for the Agro Elite Community (AGEC) platform.

## Prerequisites
- Node.js installed
- Firebase account (https://firebase.google.com/)
- npm or yarn package manager

## Step 1: Create a Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: "agro-elite-community" or similar
4. Follow the setup wizard to create your project

## Step 2: Configure Firebase for Web App

1. From the Firebase Console, select your project
2. Click the "Web" icon (</>) to add a web app
3. Register your app with a nickname (e.g., "agec-web")
4. Check "Also set up Firebase Hosting" (optional but recommended)
5. Click "Register app"
6. Copy the Firebase SDK configuration (we'll need this later)

## Step 3: Enable Services

### Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable "Email/Password" provider
4. Click "Save"

### Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode" (you can change this later)
4. Select your location
5. Click "Enable"

### Storage (Optional, for KYC documents)
1. Go to "Storage"
2. Click "Get started"
3. Follow setup wizard

## Step 4: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Replace the values with the configuration you copied in Step 2.

## Step 5: Deploy Firestore Security Rules

The security rules are defined in `firestore.rules`. You can deploy them in two ways:

### Option A: Firebase Console (Manual)
1. Go to "Firestore Database" → "Rules"
2. Copy the contents of `firestore.rules`
3. Paste into the rules editor
4. Click "Publish"

### Option B: Firebase CLI (Recommended)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize Firebase
firebase init

# Select Firestore, Hosting (optional)
# Use the existing project

# Deploy rules
firebase deploy --only firestore:rules
```

## Step 6: Set Up Firestore Indexes (Optional but Recommended)

For better query performance:

1. Go to "Firestore Database" → "Indexes"
2. Click "Add index"
3. Create the indexes from `firestore.indexes.json`:

### Index 1:
- Collection ID: `investments`
- Fields:
  - `userId`: Ascending
  - `createdAt`: Descending

### Index 2:
- Collection ID: `transactions`
- Fields:
  - `userId`: Ascending
  - `createdAt`: Descending

### Index 3:
- Collection ID: `withdrawals`
- Fields:
  - `userId`: Ascending
  - `createdAt`: Descending

### Index 4:
- Collection ID: `deposits`
- Fields:
  - `userId`: Ascending
  - `createdAt`: Descending

## Step 7: Seed Initial Data

To populate the initial investment plans and farm projects, you can:

### Option A: Manually via Firebase Console
1. Go to "Firestore Database"
2. Create the collections:
   - `investmentPlans`
   - `farmProjects`
3. Add documents using the data from `src/lib/seedData.ts`

### Option B: Create a Seed Script (Advanced)
Create a temporary script to initialize data using the Firebase admin SDK.

## Step 8: Create Admin User

1. Go to "Authentication" → "Users"
2. Click "Add user"
3. Enter email (e.g., admin@agec.com) and password
4. After user is created, go to "Firestore Database"
5. Create a document in the `users` collection with the user's UID as the document ID:

```javascript
{
  email: "admin@agec.com",
  fullName: "Administrator",
  phoneNumber: "+2348000000000",
  role: "admin",
  kycVerified: true,
  walletBalance: 0,
  totalInvested: 0,
  totalEarnings: 0,
  totalWithdrawn: 0,
  referralCode: "AGEADMIN",
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now()
}
```

## Step 9: Test the Setup

1. Start the development server:
```bash
npm run dev
```

2. Go to http://localhost:3000
3. Try registering an account
4. Verify the user document is created in Firestore
5. Login and test the features

## Database Structure Overview

### Collections:
- `users` - User profiles and account information
- `investmentPlans` - Available investment plans
- `investments` - User investment records
- `farmProjects` - Featured farm projects
- `transactions` - All financial transactions
- `withdrawals` - Withdrawal requests
- `deposits` - Deposit requests
- `referrals` - Referral relationships
- `kycSubmissions` - KYC verification documents

## Security Rules Summary

The security rules enforce:
- Users can read/write their own documents
- Users can read all investment plans and farm projects
- Only admins can write investment plans and farm projects
- Only admins can manage all users, investments, withdrawals, deposits, and KYC submissions

## Next Steps

1. Set up payment integration (Paystack or Flutterwave)
2. Configure Firebase Storage for KYC documents
3. Set up email notifications (Firebase Cloud Functions)
4. Deploy to production (Vercel, Firebase Hosting, or your own server)

## Troubleshooting

### Firestore Rules Not Working
- Make sure you've published the rules in Firebase Console
- Check the "Rules Playground" in Firebase Console to test queries

### Authentication Issues
- Verify your Firebase config in `.env.local` is correct
- Check that email/password provider is enabled in Firebase Console

### Queries Returning Errors
- Make sure indexes are set up correctly for your queries
- Check the browser console for error messages

## Useful Links

- Firebase Documentation: https://firebase.google.com/docs
- Firestore Security Rules: https://firebase.google.com/docs/rules
- Firebase Authentication: https://firebase.google.com/docs/auth
