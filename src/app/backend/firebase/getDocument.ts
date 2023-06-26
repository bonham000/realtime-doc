import FirebaseDb from "@/app/backend/firebase/firebaseDb";
import {
  FIREBASE_COLLECTION_NAME,
  FIREBASE_DOCUMENT_ID,
} from "@/app/constants/FirebaseConstants";
import FirebaseDocCollection from "@/types/FirebaseDocCollection";
import { doc, getDoc } from "firebase/firestore";

export default async function getDocument(
  documentId = FIREBASE_DOCUMENT_ID
): Promise<FirebaseDocCollection> {
  const result = await getDoc(
    doc(FirebaseDb, FIREBASE_COLLECTION_NAME, documentId)
  );
  return result.data() as FirebaseDocCollection;
}
