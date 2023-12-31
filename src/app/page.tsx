"use client";

import PusherClient from "@/app/client/PusherClient";
import { BACKEND_API_URL } from "@/app/constants/BackendApiUrl";
import { LOCAL_STORAGE_USER_ID_KEY } from "@/app/constants/LocalStorageUserIdKey";
import { PUSHER_CHANNEL, PUSHER_EVENT } from "@/app/constants/PusherConstants";
import { PostPayload, PostResponse } from "@/types/DocApi";
import { Nullable } from "@/types/Nullable";
import { PusherResponse } from "@/types/PusherResponse";
import axios from "axios";
import { nanoid } from "nanoid";
import {
  ChangeEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useLocalStorage from "use-local-storage";

const getDoc = async () => {
  try {
    const url = `${BACKEND_API_URL}/doc`;
    const response = await axios.get<PostResponse>(url);
    return response.data.doc;
  } catch (err) {
    console.log(err);
    return "";
  }
};

const postDoc = async (text: string, userId: string) => {
  try {
    const url = `${BACKEND_API_URL}/doc`;
    const payload: PostPayload = { doc: text, userId };
    const response = await axios.post<PostResponse>(url, payload);
    return response.data.doc;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default function Home() {
  const [initializing, setInitializing] = useState(true);
  const [doc, setDoc] = useState("");
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [userId] = useLocalStorage(LOCAL_STORAGE_USER_ID_KEY, nanoid());
  const [cursorPosition, setCursorPosition] = useState<
    [Nullable<number>, Nullable<number>]
  >([null, null]);
  const textareaRef = useRef() as MutableRefObject<HTMLTextAreaElement>;

  useEffect(() => {
    const handleFetch = async () => {
      const doc = await getDoc();
      setDoc(doc);
      setInitializing(false);
    };

    handleFetch();
  }, []);

  useEffect(() => {
    const channel = PusherClient.subscribe(PUSHER_CHANNEL);
    channel.bind(PUSHER_EVENT, function (data: PusherResponse) {
      if (data.userId !== userId && data.timestamp > lastUpdateTime) {
        const caretStart = textareaRef.current.selectionStart;
        const caretEnd = textareaRef.current.selectionEnd;
        setCursorPosition([caretStart, caretEnd]);
        setDoc(data.doc);
        setLastUpdateTime(data.timestamp);
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const [caretStart, caretEnd] = cursorPosition;
    if (caretStart != null && caretEnd != null) {
      textareaRef.current.setSelectionRange(caretStart, caretEnd);
      setCursorPosition([null, null]);
    }
  }, [doc, cursorPosition]);

  const handleUpdateDoc = useCallback(
    async (event: ChangeEvent<HTMLTextAreaElement>) => {
      setDoc(event.target.value);
      const mergedDocs = await postDoc(event.target.value, userId);
      if (mergedDocs != null) {
        setDoc(mergedDocs);
      }
    },
    [userId, setDoc]
  );

  return (
    <main className="p-8 flex flex-col justify-center items-center h-screen">
      <h1 className="text-3xl mb-8">Realtime Doc! 📝</h1>
      <textarea
        className="textarea w-full h-full text-lg border-teal-400 mr-4"
        disabled={initializing}
        onChange={handleUpdateDoc}
        placeholder={initializing ? "Initializing..." : "Start typing..."}
        ref={textareaRef}
        value={doc}
      />
    </main>
  );
}
