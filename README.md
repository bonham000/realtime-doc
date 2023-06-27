This is a rudimentary realtime document editing app.

It's deployed using Vercel here: https://realtime-doc.vercel.app

It uses Vercel's serverless API with NextJS routes API, Firebase, and Pusher.

The app does not handle multiple concurrent users pushing updates at the same time very well right now, because of race conditions in the asynchronous updates being propagated out to clients correctly. It also does not track the cursor position of concurrently editing users very well.