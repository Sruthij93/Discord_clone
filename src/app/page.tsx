"use client";

import { useState } from "react";
//by default next.js tries to render everythig on the server.
//however, using a hook like useState, those make components interactive, it has to run on the client. it has to be made a client component

import {
  useQuery,
  useMutation,
  Authenticated,
  Unauthenticated,
} from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignInButton } from "@clerk/nextjs";

// create messages UI that can be connected to the database
// interface Message {
//   sender: string;
//   content: string;
// }
//commenting the above since the types will come directly from the database. (that's after adding the convex components)

export default function Home() {
  //Once we try to get messages from convex, we can take the below part out
  // const [messages, setMessages] = useState<Message[]>([
  //   { sender: "Alice", content: "Hey There!!" },
  //   { sender: "Bob", content: "Hello, how are you?" },
  // ]);

  const messages = useQuery(api.functions.message.list);
  const createMessage = useMutation(api.functions.message.create);
  const [input, setInput] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); //prevents page from refreshing on submit
    createMessage({ sender: "Alice", content: input });
    //setMessages([...messages, { sender: "Alice", content: input }]); //setting the messages to all the previous messages + a new message
    setInput(""); //setting the input to an empty string
  };

  return (
    <>
      <Authenticated>
        <div>
          {messages?.map((messages, index) => (
            <div key={index}>
              <strong>{messages.sender}</strong>: {messages.content}
            </div>
          ))}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="message"
              id="message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </Authenticated>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
    </>
  );
}
