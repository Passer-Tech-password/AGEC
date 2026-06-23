import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { InvestmentPlan } from "./data";

// ==============================================
// TYPES & INTERFACES
// ==============================================

export interface UserData {
  uid: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: "user" | "admin";
  kycVerified: boolean;
  walletBalance: number;
  totalInvested: number;
  totalEarnings: number;
  totalWithdrawn: number;
  referralCode: string;
  referrerId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface InvestmentPlanData {
  id?: string;
  name: string;
  description: string;
  minInvestment: number;
  maxInvestment?: number;
  roiPercentage: number;
  durationDays: number;
  biWeeklyPayout: number;
  popular: boolean;
  featured: boolean;
  features: string[];
  active: boolean;
  createdAt: Timestamp;
}

export interface UserInvestment {
  id?: string;
  userId: string;
  planId: string;
  planName: string;
  amount: number;
  roiPercentage: number;
  startDate: Timestamp;
  maturityDate: Timestamp;
  status: "active" | "matured" | "cancelled";
  totalReturns: number;
  totalPaidOut: number;
  nextPayoutDate?: Timestamp;
  payouts: Array<{ amount: number; date: Timestamp }>;
  createdAt: Timestamp;
}

export interface FarmProject {
  id?: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  investmentAmount: number;
  roiPercentage: number;
  durationDays: number;
  spotsLeft: number;
  active: boolean;
  createdAt: Timestamp;
}

export interface Transaction {
  id?: string;
  userId: string;
  type: "deposit" | "withdrawal" | "return" | "investment" | "referral";
  amount: number;
  status: "pending" | "completed" | "failed" | "cancelled";
  reference?: string;
  description?: string;
  investmentId?: string;
  createdAt: Timestamp;
}

export interface WithdrawalRequest {
  id?: string;
  userId: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: "pending" | "approved" | "rejected" | "paid";
  adminNotes?: string;
  reference?: string;
  processedAt?: Timestamp;
  createdAt: Timestamp;
}

export interface DepositRequest {
  id?: string;
  userId: string;
  amount: number;
  paymentMethod: string;
  status: "pending" | "approved" | "rejected" | "completed";
  reference?: string;
  proofUrl?: string;
  processedAt?: Timestamp;
  createdAt: Timestamp;
}

export interface Referral {
  id?: string;
  referrerId: string;
  referredId: string;
  bonusAmount: number;
  status: "pending" | "credited";
  createdAt: Timestamp;
}

export interface KYCSubmission {
  id?: string;
  userId: string;
  idType: "nin" | "voter" | "driver" | "passport";
  idNumber: string;
  idImageUrl: string;
  selfieUrl: string;
  status: "pending" | "approved" | "rejected";
  adminNotes?: string;
  reviewedAt?: Timestamp;
  createdAt: Timestamp;
}

// ==============================================
// USER OPERATIONS
// ==============================================

/**
 * Create a new user document in Firestore
 */
export async function createUser(
  uid: string,
  email: string,
  fullName: string,
  phoneNumber?: string,
  referrerId?: string
): Promise<UserData> {
  try {
    // Generate referral code
    const referralCode = `AGE${uid.substring(0, 6).toUpperCase()}`;
    
    const userData: UserData = {
      uid,
      email,
      fullName,
      phoneNumber: phoneNumber || "",
      role: "user",
      kycVerified: false,
      walletBalance: 0,
      totalInvested: 0,
      totalEarnings: 0,
      totalWithdrawn: 0,
      referralCode,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Only include referrerId in the Firestore doc if it's defined
    const firestoreData: any = { ...userData };
    if (referrerId) {
      firestoreData.referrerId = referrerId;
    }

    await setDoc(doc(db, "users", uid), firestoreData);

    // If there's a referrer, create a referral record
    if (referrerId) {
      await addDoc(collection(db, "referrals"), {
        referrerId,
        referredId: uid,
        bonusAmount: 0,
        status: "pending",
        createdAt: Timestamp.now(),
      });
    }

    return userData;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

/**
 * Get user data by UID
 */
export async function getUserData(uid: string): Promise<UserData | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return { uid, ...userDoc.data() } as UserData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

/**
 * Update user data
 */
export async function updateUserData(
  uid: string,
  data: Partial<UserData>
): Promise<void> {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<UserData[]> {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "users"), orderBy("createdAt", "desc"))
    );
    return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserData));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// ==============================================
// INVESTMENT PLAN OPERATIONS
// ==============================================

/**
 * Get all active investment plans
 */
export async function getInvestmentPlans(): Promise<InvestmentPlanData[]> {
  try {
    // Try with orderBy first (requires index)
    let q = query(
      collection(db, "investmentPlans"),
      where("active", "==", true),
      orderBy("minInvestment", "asc")
    );
    let querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InvestmentPlanData));
  } catch (error: any) {
    // If that fails (missing index), try without orderBy
    if (error.message.includes("requires an index")) {
      try {
        const q = query(
          collection(db, "investmentPlans"),
          where("active", "==", true)
        );
        const querySnapshot = await getDocs(q);
        const plans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InvestmentPlanData));
        // Sort them client-side
        return plans.sort((a, b) => a.minInvestment - b.minInvestment);
      } catch (fallbackError) {
        console.error("Error fetching investment plans (fallback):", fallbackError);
        return [];
      }
    }
    console.error("Error fetching investment plans:", error);
    return [];
  }
}

/**
 * Create a new investment plan (admin only)
 */
export async function createInvestmentPlan(
  data: Omit<InvestmentPlanData, "id" | "createdAt">
): Promise<InvestmentPlanData> {
  try {
    const planData: Omit<InvestmentPlanData, "id"> = {
      ...data,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, "investmentPlans"), planData);
    return { id: docRef.id, ...planData };
  } catch (error) {
    console.error("Error creating investment plan:", error);
    throw error;
  }
}

// ==============================================
// INVESTMENT OPERATIONS
// ==============================================

/**
 * Create a new investment
 */
export async function createInvestment(
  userId: string,
  plan: InvestmentPlanData,
  amount: number
): Promise<UserInvestment> {
  try {
    const now = Timestamp.now();
    const startDate = new Date();
    const maturityDate = new Date(startDate);
    maturityDate.setDate(startDate.getDate() + plan.durationDays);
    
    const nextPayoutDate = new Date(startDate);
    nextPayoutDate.setDate(startDate.getDate() + 14); // 2 weeks
    
    const totalReturns = amount + (amount * plan.roiPercentage / 100);

    const investment: Omit<UserInvestment, "id"> = {
      userId,
      planId: plan.id!,
      planName: plan.name,
      amount,
      roiPercentage: plan.roiPercentage,
      startDate: now,
      maturityDate: Timestamp.fromDate(maturityDate),
      status: "active",
      totalReturns,
      totalPaidOut: 0,
      nextPayoutDate: Timestamp.fromDate(nextPayoutDate),
      payouts: [],
      createdAt: now,
    };

    // Get user and check balance
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data() as UserData;
    if (userData.walletBalance < amount) {
      throw new Error("Insufficient balance");
    }

    // Create investment document
    const investmentRef = await addDoc(collection(db, "investments"), investment);

    // Update user wallet
    await updateDoc(userRef, {
      walletBalance: userData.walletBalance - amount,
      totalInvested: userData.totalInvested + amount,
      updatedAt: Timestamp.now(),
    });

    // Create transaction record
    await addDoc(collection(db, "transactions"), {
      userId,
      type: "investment",
      amount,
      status: "completed",
      description: `Investment in ${plan.name}`,
      investmentId: investmentRef.id,
      createdAt: now,
    });

    return { id: investmentRef.id, ...investment };
  } catch (error) {
    console.error("Error creating investment:", error);
    throw error;
  }
}

/**
 * Get user's investments
 */
export async function getUserInvestments(userId: string): Promise<UserInvestment[]> {
  try {
    const q = query(
      collection(db, "investments"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserInvestment));
  } catch (error) {
    console.error("Error fetching user investments:", error);
    return [];
  }
}

/**
 * Get all investments (admin only)
 */
export async function getAllInvestments(): Promise<UserInvestment[]> {
  try {
    const q = query(
      collection(db, "investments"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserInvestment));
  } catch (error) {
    console.error("Error fetching investments:", error);
    return [];
  }
}

// ==============================================
// FARM PROJECTS OPERATIONS
// ==============================================

/**
 * Get all active farm projects
 */
export async function getFarmProjects(): Promise<FarmProject[]> {
  try {
    // Try with orderBy first (requires index)
    let q = query(
      collection(db, "farmProjects"),
      where("active", "==", true),
      orderBy("createdAt", "desc")
    );
    let querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FarmProject));
  } catch (error: any) {
    // If that fails (missing index), try without orderBy
    if (error.message.includes("requires an index")) {
      try {
        const q = query(
          collection(db, "farmProjects"),
          where("active", "==", true)
        );
        const querySnapshot = await getDocs(q);
        const projects = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FarmProject));
        // Sort them client-side by createdAt descending
        return projects.sort((a, b) => {
          const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return bTime - aTime;
        });
      } catch (fallbackError) {
        console.error("Error fetching farm projects (fallback):", fallbackError);
        return [];
      }
    }
    console.error("Error fetching farm projects:", error);
    return [];
  }
}

/**
 * Create a new farm project (admin only)
 */
export async function createFarmProject(
  data: Omit<FarmProject, "id" | "createdAt">
): Promise<FarmProject> {
  try {
    const projectData: Omit<FarmProject, "id"> = {
      ...data,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, "farmProjects"), projectData);
    return { id: docRef.id, ...projectData };
  } catch (error) {
    console.error("Error creating farm project:", error);
    throw error;
  }
}

// ==============================================
// TRANSACTION OPERATIONS
// ==============================================

/**
 * Get user's transactions
 */
export async function getUserTransactions(userId: string, limitCount?: number): Promise<Transaction[]> {
  try {
    let q = query(
      collection(db, "transactions"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    if (limitCount) {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

/**
 * Create a transaction
 */
export async function createTransaction(
  data: Omit<Transaction, "id" | "createdAt">
): Promise<Transaction> {
  try {
    const transactionData: Omit<Transaction, "id"> = {
      ...data,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, "transactions"), transactionData);
    return { id: docRef.id, ...transactionData };
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}

// ==============================================
// WITHDRAWAL OPERATIONS
// ==============================================

/**
 * Request a withdrawal
 */
export async function requestWithdrawal(
  userId: string,
  amount: number,
  bankName: string,
  accountNumber: string,
  accountName: string
): Promise<WithdrawalRequest> {
  try {
    const now = Timestamp.now();
    
    // Check user balance
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userDoc.data() as UserData;
    if (userData.walletBalance < amount) {
      throw new Error("Insufficient balance");
    }

    const withdrawal: Omit<WithdrawalRequest, "id"> = {
      userId,
      amount,
      bankName,
      accountNumber,
      accountName,
      status: "pending",
      createdAt: now,
    };

    const withdrawalRef = await addDoc(collection(db, "withdrawals"), withdrawal);
    
    // Create pending transaction
    await addDoc(collection(db, "transactions"), {
      userId,
      type: "withdrawal",
      amount: -amount,
      status: "pending",
      description: "Withdrawal request",
      createdAt: now,
    });

    return { id: withdrawalRef.id, ...withdrawal };
  } catch (error) {
    console.error("Error requesting withdrawal:", error);
    throw error;
  }
}

/**
 * Get user's withdrawals
 */
export async function getUserWithdrawals(userId: string): Promise<WithdrawalRequest[]> {
  try {
    const q = query(
      collection(db, "withdrawals"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WithdrawalRequest));
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return [];
  }
}

/**
 * Get all withdrawals (admin only)
 */
export async function getAllWithdrawals(): Promise<WithdrawalRequest[]> {
  try {
    const q = query(
      collection(db, "withdrawals"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WithdrawalRequest));
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return [];
  }
}

/**
 * Update withdrawal status (admin only)
 */
export async function updateWithdrawalStatus(
  withdrawalId: string,
  status: "approved" | "rejected" | "paid",
  adminNotes?: string
): Promise<void> {
  try {
    const withdrawalRef = doc(db, "withdrawals", withdrawalId);
    const withdrawalDoc = await getDoc(withdrawalRef);
    
    if (!withdrawalDoc.exists()) {
      throw new Error("Withdrawal not found");
    }
    
    const withdrawal = withdrawalDoc.data() as WithdrawalRequest;
    const updateData: any = { status };
    
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    
    if (status === "approved" || status === "paid") {
      updateData.processedAt = Timestamp.now();
    }
    
    // If paid, update user wallet
    if (status === "paid") {
      const userRef = doc(db, "users", withdrawal.userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        await updateDoc(userRef, {
          walletBalance: userData.walletBalance - withdrawal.amount,
          totalWithdrawn: userData.totalWithdrawn + withdrawal.amount,
          updatedAt: Timestamp.now(),
        });
        
        // Update transaction to completed
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", withdrawal.userId),
          where("type", "==", "withdrawal"),
          where("status", "==", "pending"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          await updateDoc(snapshot.docs[0].ref, { status: "completed" });
        }
      }
    }
    
    await updateDoc(withdrawalRef, updateData);
  } catch (error) {
    console.error("Error updating withdrawal status:", error);
    throw error;
  }
}

// ==============================================
// DEPOSIT OPERATIONS
// ==============================================

/**
 * Request a deposit
 */
export async function requestDeposit(
  userId: string,
  amount: number,
  paymentMethod: string,
  proofUrl?: string
): Promise<DepositRequest> {
  try {
    const deposit: Omit<DepositRequest, "id"> = {
      userId,
      amount,
      paymentMethod,
      status: "pending",
      proofUrl,
      createdAt: Timestamp.now(),
    };

    const depositRef = await addDoc(collection(db, "deposits"), deposit);
    return { id: depositRef.id, ...deposit };
  } catch (error) {
    console.error("Error requesting deposit:", error);
    throw error;
  }
}

/**
 * Get user's deposits
 */
export async function getUserDeposits(userId: string): Promise<DepositRequest[]> {
  try {
    const q = query(
      collection(db, "deposits"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DepositRequest));
  } catch (error) {
    console.error("Error fetching deposits:", error);
    return [];
  }
}

/**
 * Get all deposits (admin only)
 */
export async function getAllDeposits(): Promise<DepositRequest[]> {
  try {
    const q = query(
      collection(db, "deposits"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DepositRequest));
  } catch (error) {
    console.error("Error fetching deposits:", error);
    return [];
  }
}

/**
 * Update deposit status (admin only)
 */
export async function updateDepositStatus(
  depositId: string,
  status: "approved" | "rejected" | "completed",
  adminNotes?: string
): Promise<void> {
  try {
    const depositRef = doc(db, "deposits", depositId);
    const depositDoc = await getDoc(depositRef);
    
    if (!depositDoc.exists()) {
      throw new Error("Deposit not found");
    }
    
    const deposit = depositDoc.data() as DepositRequest;
    const updateData: any = { status };
    
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    
    if (status === "approved" || status === "completed") {
      updateData.processedAt = Timestamp.now();
    }
    
    // If completed, credit user wallet
    if (status === "completed") {
      const userRef = doc(db, "users", deposit.userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        await updateDoc(userRef, {
          walletBalance: userData.walletBalance + deposit.amount,
          updatedAt: Timestamp.now(),
        });
        
        // Create transaction
        await addDoc(collection(db, "transactions"), {
          userId: deposit.userId,
          type: "deposit",
          amount: deposit.amount,
          status: "completed",
          description: "Deposit credited",
          createdAt: Timestamp.now(),
        });
      }
    }
    
    await updateDoc(depositRef, updateData);
  } catch (error) {
    console.error("Error updating deposit status:", error);
    throw error;
  }
}

// ==============================================
// KYC OPERATIONS
// ==============================================

/**
 * Submit KYC documents
 */
export async function submitKYC(
  userId: string,
  idType: "nin" | "voter" | "driver" | "passport",
  idNumber: string,
  idImageUrl: string,
  selfieUrl: string
): Promise<KYCSubmission> {
  try {
    const kyc: Omit<KYCSubmission, "id"> = {
      userId,
      idType,
      idNumber,
      idImageUrl,
      selfieUrl,
      status: "pending",
      createdAt: Timestamp.now(),
    };

    const kycRef = await addDoc(collection(db, "kycSubmissions"), kyc);
    
    // Update user KYC status
    await updateDoc(doc(db, "users", userId), {
      kycVerified: false,
      updatedAt: Timestamp.now(),
    });
    
    return { id: kycRef.id, ...kyc };
  } catch (error) {
    console.error("Error submitting KYC:", error);
    throw error;
  }
}

/**
 * Get user's KYC submission
 */
export async function getUserKYC(userId: string): Promise<KYCSubmission | null> {
  try {
    const q = query(
      collection(db, "kycSubmissions"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as KYCSubmission;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching KYC:", error);
    return null;
  }
}

/**
 * Get all KYC submissions (admin only)
 */
export async function getAllKYCs(): Promise<KYCSubmission[]> {
  try {
    const q = query(
      collection(db, "kycSubmissions"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as KYCSubmission));
  } catch (error) {
    console.error("Error fetching KYCs:", error);
    return [];
  }
}

/**
 * Update KYC status (admin only)
 */
export async function updateKYCStatus(
  kycId: string,
  status: "approved" | "rejected",
  adminNotes?: string
): Promise<void> {
  try {
    const kycRef = doc(db, "kycSubmissions", kycId);
    const kycDoc = await getDoc(kycRef);
    
    if (!kycDoc.exists()) {
      throw new Error("KYC submission not found");
    }
    
    const kyc = kycDoc.data() as KYCSubmission;
    const updateData: any = { status, reviewedAt: Timestamp.now() };
    
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    
    await updateDoc(kycRef, updateData);
    
    // Update user's KYC status
    await updateDoc(doc(db, "users", kyc.userId), {
      kycVerified: status === "approved",
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating KYC status:", error);
    throw error;
  }
}

// ==============================================
// REFERRAL OPERATIONS
// ==============================================

/**
 * Get user's referrals
 */
export async function getUserReferrals(userId: string): Promise<Referral[]> {
  try {
    const q = query(
      collection(db, "referrals"),
      where("referrerId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Referral));
  } catch (error) {
    console.error("Error fetching referrals:", error);
    return [];
  }
}

// ==============================================
// DASHBOARD STATS (ADMIN)
// ==============================================

export interface DashboardStats {
  totalUsers: number;
  totalInvested: number;
  totalWithdrawn: number;
  totalEarnings: number;
  pendingWithdrawals: number;
  pendingDeposits: number;
  pendingKYCs: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [usersSnapshot, investmentsSnapshot, withdrawalsSnapshot, depositsSnapshot, kycsSnapshot] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "investments")),
      getDocs(query(collection(db, "withdrawals"), where("status", "==", "pending"))),
      getDocs(query(collection(db, "deposits"), where("status", "==", "pending"))),
      getDocs(query(collection(db, "kycSubmissions"), where("status", "==", "pending"))),
    ]);

    let totalInvested = 0;
    let totalWithdrawn = 0;
    let totalEarnings = 0;

    usersSnapshot.docs.forEach(doc => {
      const user = doc.data() as UserData;
      totalInvested += user.totalInvested || 0;
      totalWithdrawn += user.totalWithdrawn || 0;
      totalEarnings += user.totalEarnings || 0;
    });

    return {
      totalUsers: usersSnapshot.size,
      totalInvested,
      totalWithdrawn,
      totalEarnings,
      pendingWithdrawals: withdrawalsSnapshot.size,
      pendingDeposits: depositsSnapshot.size,
      pendingKYCs: kycsSnapshot.size,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalUsers: 0,
      totalInvested: 0,
      totalWithdrawn: 0,
      totalEarnings: 0,
      pendingWithdrawals: 0,
      pendingDeposits: 0,
      pendingKYCs: 0,
    };
  }
}
