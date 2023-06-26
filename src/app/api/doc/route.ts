import getDocument from "@/app/backend/firebase/getDocument";
import setDocument from "@/app/backend/firebase/setDocument";
import { PostPayload, PostResponse } from "@/types/DocApi";
import mergeDocs from "@/utils/mergeDocs";
import { NextRequest, NextResponse } from "next/server";
import PusherInstance from "@/app/backend/pusher/PusherInstance";
import { FIREBASE_DOCUMENT_ID } from "@/app/constants/FirebaseConstants";
import { PUSHER_CHANNEL, PUSHER_EVENT } from "@/app/constants/PusherConstants";

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

export async function POST(req: NextRequest) {
  try {
    const body: PostPayload = await req.json();
    const { doc, userId } = body;

    const currentDocument = await getDocument();
    const mergedDocument = mergeDocs(currentDocument.content, doc);
    await setDocument(mergedDocument, FIREBASE_DOCUMENT_ID);

    const pusherUpdate: PostPayload = {
      doc: mergedDocument,
      userId,
    };
    await PusherInstance.trigger(PUSHER_CHANNEL, PUSHER_EVENT, pusherUpdate);

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
