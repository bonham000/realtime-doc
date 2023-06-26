import FirebaseDb from "@/app/backend/firebase/firebaseDb";
import { FIREBASE_DOCUMENT_LOCK_NAME } from "@/app/constants/FirebaseConstants";
import FirebaseDocumentLockCollection from "@/types/FirebaseDocumentLockCollection";
import { doc, getDoc } from "firebase/firestore";

export default async function getDocumentLock(
  documentId: string
): Promise<FirebaseDocumentLockCollection> {
  const result = await getDoc(
    doc(FirebaseDb, FIREBASE_DOCUMENT_LOCK_NAME, documentId)
  );
  return result.data() as FirebaseDocumentLockCollection;
}
