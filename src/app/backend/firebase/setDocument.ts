import FirebaseDb from "@/app/backend/firebase/firebaseDb";
import { FIREBASE_COLLECTION_NAME } from "@/app/constants/FirebaseConstants";
import FirebaseDocCollection from "@/types/FirebaseDocCollection";
import { doc, setDoc } from "firebase/firestore";

export default async function setDocument(text: string, documentId: string) {
  const document: FirebaseDocCollection = { content: text };
  const result = await setDoc(
    doc(FirebaseDb, FIREBASE_COLLECTION_NAME, documentId),
    document,
    {
      merge: true,
    }
  );
  return result;
}
