import getDocument from "@/app/backend/firebase/getDocument";
import setDocument from "@/app/backend/firebase/setDocument";
import { PostPayload, PostResponse } from "@/types/DocApi";
import mergeDocs from "@/utils/mergeDocs";
import { NextRequest, NextResponse } from "next/server";
import PusherInstance from "@/app/backend/pusher/PusherInstance";
import { FIREBASE_DOCUMENT_ID } from "@/app/constants/FirebaseConstants";
import { PUSHER_CHANNEL, PUSHER_EVENT } from "@/app/constants/PusherConstants";
import getDocumentLock from "@/app/backend/firebase/getDocumentLock";
import setDocumentLock from "@/app/backend/firebase/setDocumentLock";

export async function GET() {
  try {
    const doc = await getDocument();
    const data: PostResponse = {
      doc: doc.content,
    };
    return NextResponse.json(data);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {},
      { status: 500, statusText: "An error occurred." }
    );
  }
}

const wait = async (delay = 1000) =>
  new Promise((r) => {
    setTimeout(r, delay);
  });

async function handleWrite(body: PostPayload) {
  const { doc, userId } = body;

  const documentLock = await getDocumentLock(FIREBASE_DOCUMENT_ID);
  if (documentLock[FIREBASE_DOCUMENT_ID] === true) {
    console.log("Document locked, waiting to retry...");
    await wait(10);
    return handleWrite(body);
  }

  await setDocumentLock(FIREBASE_DOCUMENT_ID, true);

  const currentDocument = await getDocument();
  const mergedDocument = mergeDocs(currentDocument.content, doc);
  await setDocument(mergedDocument, FIREBASE_DOCUMENT_ID);

  const pusherUpdate: PostPayload = {
    doc: mergedDocument,
    userId,
  };
  await PusherInstance.trigger(PUSHER_CHANNEL, PUSHER_EVENT, pusherUpdate);

  await setDocumentLock(FIREBASE_DOCUMENT_ID, false);

  return mergedDocument;
}

export async function POST(req: NextRequest) {
  try {
    const body: PostPayload = await req.json();
    const mergedDocument = await handleWrite(body);
    const data: PostResponse = {
      doc: mergedDocument,
    };
    return NextResponse.json({ data });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {},
      { status: 500, statusText: "An error occurred." }
    );
  }
}
