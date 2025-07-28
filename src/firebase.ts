import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import type { InvoiceType, InvoiceTypePreview } from "./types/invoice";

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
});

const auth = getAuth(app);
const db = getFirestore(app);

async function continueWithGoogle() {
  signInWithPopup(auth, new GoogleAuthProvider())
    .then((result) => {
      const user = result.user;
      console.log(user);
    })
    .catch((error) => {
      console.log(error);
    });
}

// There are 2 Collections
// users -> stores randomly generated invoiceId, date and total of invoices as an array again the user ID
// invoices -> stores the InvoiceType object agains the invoiceId

async function saveInvoice(invoice: InvoiceType) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  if (!invoice.invoiceNumber) {
    throw new Error("Invoice number is required");
  }
  if (!invoice.date) {
    throw new Error("Date is required");
  }
  if (!invoice.total) {
    throw new Error("Amount is required");
  }
}

async function listInvoices(): Promise<InvoiceTypePreview[]> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  const invoices: InvoiceTypePreview[] = [];
  return invoices;
}

async function getInvoice(invoiceNumber: string): Promise<InvoiceType> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  let invoice: InvoiceType | undefined = undefined;
  getDocs(collection(db, `users/${user.uid}/invoices`)).then(
    (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().invoiceNumber === invoiceNumber) {
          invoice = doc.data() as InvoiceType;
        }
      });
    }
  );
  if (!invoice) {
    throw new Error("Invoice not found");
  }
  return invoice;
}

export { auth, db, continueWithGoogle, saveInvoice, listInvoices, getInvoice };
export default app;
