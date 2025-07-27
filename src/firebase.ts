import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import type { InvoiceType } from "./types/invoice";

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

async function saveInvoice(invoice: InvoiceType) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  if (!invoice.invoiceNumber) {
    throw new Error("Invoice number is required");
  }
  addDoc(collection(db, `users/${user.uid}/invoices`), invoice);
}

async function listInvoices(): Promise<InvoiceType[]> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }
  const invoices: InvoiceType[] = [];
  getDocs(collection(db, `users/${user.uid}/invoices`)).then(
    (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        invoices.push(doc.data() as InvoiceType);
      });
    }
  );
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
