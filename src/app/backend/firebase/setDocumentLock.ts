import FirebaseDb from "@/app/backend/firebase/firebaseDb";
import { FIREBASE_DOCUMENT_LOCK_NAME } from "@/app/constants/FirebaseConstants";
import FirebaseDocumentLockCollection from "@/types/FirebaseDocumentLockCollection";
import { doc, setDoc } from "firebase/firestore";

export default async function setDocumentLock(
  documentId: string,
  state: boolean
) {
  const document: FirebaseDocumentLockCollection = { [documentId]: state };
  const result = await setDoc(
    doc(FirebaseDb, FIREBASE_DOCUMENT_LOCK_NAME, documentId),
    document,
    {
      merge: true,
    }
  );
  return result;
}
