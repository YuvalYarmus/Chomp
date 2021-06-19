import Head from "next/head";
import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import init from "../../firebase/initFirebase";
import firebase from "firebase/app";
import { User, Room, Message } from "../../firebase/types";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import Auth from "../../components/authComponent";
import addUserToUsers from "../../firebase/addUser";
import addRoomUser from "../../firebase/addRoomUser";
import removeRoomUser from "../../firebase/RemoveRoomUser";
import removeUser from "../../firebase/RemoveUser";
import { addMessage } from "../../firebase/addMessage";
import getRoom from "../../firebase/getRoom";
import getUser from "../../firebase/getUser";

const Canvas = dynamic(() => import("../../components/multiplayerComponent"), {
  ssr: false,
});

type Props = {
  bool: boolean;
  room: Room;
  user: User;
  userIndex: number;
  errors: string;
};

function execCopy(route: string) {
  var input = document.createElement("input") as HTMLInputElement;
  var copyText = route;
  input.value = copyText;
  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, 99999);
  document.execCommand("copy");
  document.body.removeChild(input);
}

export default function uuid({ bool, room, user, userIndex, errors }: Props) {
  init();

  const router = useRouter();
  const [authUser, loading, error] = useAuthState(firebase.auth());
  const [sound, setSound] = useState(true);
  const [didCopy, setDidCopy] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const msgInputRef = useRef<HTMLInputElement>(null);
  const chatAudioRef = useRef<HTMLAudioElement>(null);

  console.log(`hello there! I am in page!`);
  console.log(
    `bool is: ${bool}, room: ${room}, user: ${user}, userIndex: ${userIndex}, errors: ${errors}`
  );
  if (!bool) {
    console.log(`in bool statement`);
    console.log(`${router.asPath}`);
    console.log(`auth user: ${authUser}, loading: ${JSON.stringify(loading)}`);
    useEffect(() => {
      console.log(
        `from use effect - auth user: ${authUser}, loading: ${JSON.stringify(
          loading
        )}`
      );
      if (authUser != null)
        (async () => {
          const name = authUser?.displayName as string;
          const userUuid = authUser.uid;
          const newUser: User = {
            id: userUuid,
            name: name,
            room: router.query.uuid as string,
          };
          console.log(`before addUserToUsers from useEffect`);
          const answer = await addRoomUser(newUser);
          console.log(`\nanwer from addRoomUser was: ${answer}\n`);
          if (answer === true) {
            await addUserToUsers(newUser);
            const named = name.trim().replace(/\s/g, "");
            // const url = `/room/${
            //   router.query.uuid as string
            // }?name=${named}&userId=${newUser.id}`;
            // console.log(`move to url: ${url}`);
            // router.push(url);
            router.replace({
              pathname: "/room/[uuid]",
              query: {
                name: named,
                userId: newUser.id,
                uuid: router.query.uuid as string,
              },
            });
          } else if (typeof answer === "string") {
            console.log(`found a user with that name already: ${name}`);
            alert(
              `a user with that name probably already exists choose a different one`
            );
            firebase.auth().signOut();
          } else {
            let updatedUser = answer as User;
            await addUserToUsers(newUser);
            const named = updatedUser.name.trim().replace(/\s/g, "");
            // const url = `/room/${
            //   router.query.uuid as string
            // }?name=${named}&userId=${updatedUser.id}`;
            // console.log(`move to url: ${url}`);
            router.replace({
              pathname: "/room/[uuid]",
              query: {
                name: named,
                userId: updatedUser.id,
                uuid: router.query.uuid as string,
              },
            });
          }
          return () => {
            (async () => {
              alert(`please don't leave :(`);
              await removeRoomUser(newUser);
              await removeUser(newUser);
            })();
          };
        })();
      return;
    });
    return (
      <>
        {loading && <h4>Loading...</h4>}
        {!authUser && (
          <div className="flex flex-col items-center mt-10">
            <Auth path={router.asPath} />
          </div>
        )}
        {errors && <h1>{errors}</h1>}
        {authUser && (
          <>
            <h1>{authUser?.displayName}</h1>
            <h1>{authUser?.photoURL as string}</h1>
            <img src={authUser?.photoURL as string}></img>
          </>
        )}
      </>
    );
  } else {
    console.log(`passed bool`);
    const roomKeys = Object.keys(room);
    const roomValues = Object.values(room);
    const roomList = roomKeys.map((element, index) => {
      if (element != "users")
        return (
          <li key={element}>
            {element}: {roomValues[index]}
          </li>
        );
      return (
        <li key={element}>
          {element}: {roomValues[index]?.toString()}
        </li>
      );
    });
    console.log(`user is: ${JSON.stringify(user)}`);
    console.log(`room is: ${JSON.stringify(room)}`);
    useEffect(() => {
      console.log(`IN SECOND USE EFFECT ON PAGE`);
      // making the next js div take the size of the entire screen
      document.getElementById(`__next`)!.classList.add(`w-screen`);
      document.getElementById(`__next`)!.classList.add(`h-screen`);

      // listen to changes in the room's chat subcollection
      firebase
        .firestore()
        .collection(`rooms`)
        .doc(`${user.room}`)
        .collection(`chat`)
        .orderBy("time", "asc")
        .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
          const changes = snapshot.docChanges();
          console.log(
            `got changes in the chat collection - pending: ${snapshot.metadata.hasPendingWrites}`
          );
          changes.forEach((change) => {
            console.log(`change of type: ${change.type}`);
            console.log(change.doc.data());
            const message = change.doc.data() as Message;
            if (change.type === "added") {
              if (message.message != "" && message.time != null) {
                setMessages((oldMessages) => [...oldMessages, message]);
                chatAudioRef.current!.play();
              }
            } else if (change.type === "modified") {
              setMessages((oldMessages) => [...oldMessages, message]);
              chatAudioRef.current!.play();
            }
            const chatMessages = document.querySelector(".chat-messages")!;
            chatMessages.scrollTop = chatMessages.scrollHeight;
          });
        });
      // listen to changes in the room (in order to capture a new user joining)
      firebase
        .firestore()
        .collection(`rooms`)
        .doc(`${user.room}`)
        .onSnapshot({ includeMetadataChanges: true }, (doc) => {
          const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
          console.log(
            `doc was updated and pending is: ${doc.metadata.hasPendingWrites} so from ${source}`
          );
          console.table(doc.data());
          if (doc.data()) {
            const newUsers: User[] = (doc.data() as Room).users;
            if (newUsers) {
              setUsers((oldUsers) => {
                const oldUsersIds = oldUsers.map((user) => user.id);
                const newUsersIds = newUsers.map((user) => user.id);

                const joinedUsers = newUsers.filter(
                  (user) => !oldUsersIds.includes(user.id)
                );
                const leavingUsers = oldUsers.filter(
                  (user) => !newUsersIds.includes(user.id)
                );

                for (const user of joinedUsers) {
                  setMessages((oldMessages) => [
                    ...oldMessages,
                    {
                      message: `${user.name} joined the room!`,
                      sender: "Server",
                      time: new Date().toLocaleTimeString(),
                    } as Message,
                  ]);
                }

                for (const user of leavingUsers) {
                  setMessages((oldMessages) => [
                    ...oldMessages,
                    {
                      message: `${user.name} left the room.`,
                      sender: "Server",
                      time: new Date().toLocaleTimeString(),
                    } as Message,
                  ]);
                }
                chatAudioRef.current!.play();

                return newUsers;
              });
            }
          }
        });
    }, []);

    return (
      <>
        <Head>
          <title>SoloChomp</title>
          <link rel="stylesheet" href="/css/chat.css" />
        </Head>

        <div id="soundControl">
          <audio src="/chat.mp3" muted={!sound} ref={chatAudioRef} />
        </div>
        <div
          className="mt-8 ml-8 mr-8 h-5/6 w-auto flex flex-1 flex-col md:flex-row"
          id="flexWrap"
        >
          <Canvas
            roomId={user.room}
            userId={user.id}
            userIndex={userIndex}
            n={room.n}
            m={room.m}
            class="w-3/6 "
            id="canvas"
          />
          <>
            <div className="chat-container w-3/6 h-auto rounded-md">
              <header className="chat-header" id="chat-header">
                <h1>
                  <i className="fas fa-smile"></i> ChompChat
                </h1>
                <h1>
                  Sound:{" "}
                  <div id="soundControl">
                    <label className="switch">
                      <input
                        id="soundSett"
                        type="checkbox"
                        defaultChecked
                        onChange={() => setSound((prevSound) => !prevSound)}
                      ></input>
                    </label>
                    <span className="slider"></span>
                  </div>
                </h1>
                <div className="tooltip">
                  <button
                    id="copyBtn"
                    onClick={() => {
                      execCopy(
                        `${window.location.href.split("?")[0] as string}`
                      );
                      setDidCopy(true);
                      setTimeout(() => {
                        setDidCopy(false);
                      }, 1500);
                    }}
                  >
                    <span className="btn text-black tooltiptext" id="myTooltip">
                      {didCopy
                        ? `Copied to clipboard`
                        : "Invite a friend! (Copy to clipboard)"}
                    </span>
                  </button>
                </div>
                <div>
                  <a
                    id="leaveRoom"
                    onClick={async () => {
                      await removeRoomUser(user);
                      await removeUser(user);
                      router.replace("/");
                    }}
                    className="btn text-black"
                  >
                    Leave Room
                  </a>
                </div>
              </header>
              <div className="chat-main w-auto h-4/5">
                <div className="chat-sidebar">
                  <h2>
                    <i className="fas fa-users"></i> Users:
                  </h2>
                  <ul id="users">
                    {users.map((user, i) => {
                      return <li key={i}>{user.name}</li>;
                    })}
                  </ul>
                </div>
                <div className="chat-messages">
                  {messages.map((msg) => {
                    return (
                      <div className="message">
                        <p className="meta">
                          <span>
                            {msg.time.toDate
                              ? (msg.time.toDate() as Date).toLocaleTimeString()
                              : msg.time}
                          </span>
                        </p>
                        <p className="text text-gray-100">{msg.message}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="chat-form-container">
                <form
                  id="chat-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    addMessage(
                      msgInputRef.current!.value,
                      user.name,
                      user.room
                    );
                    msgInputRef.current!.value = "";
                    msgInputRef.current!.focus();
                  }}
                >
                  <input
                    id="msg"
                    type="text"
                    placeholder="Enter Message"
                    required
                    autoComplete="off"
                    className="mt-16 md:mt-auto"
                    ref={msgInputRef}
                  />
                  <button
                    id="submitBtn"
                    className="btn text-black mt-16 md:mt-auto"
                  >
                    <i className="fas fa-paper-plane"></i> Send
                  </button>
                </form>
              </div>
            </div>
          </>
        </div>
      </>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  try {
    const id = params?.uuid,
      userId = query?.userId;
    init();
    if (!id || !userId) return { props: { bool: false } };
    else console.log(`uuid is: ${id} and userId is : ${userId}`);

    // use onsnapshot only on the client side as it opens a socket
    const room: Room | null = await getRoom(id);
    const user: User | null = await getUser(userId);

    if (!room || !user) return { props: { bool: false } };

    // the server timestamp is a unix time object which can not be serialized as json
    // therefor we have to change it so that it can be passed to the room in the props
    console.log(`room var is: ${JSON.stringify(room)}\nuser: ${user}`);
    room.created = JSON.stringify(room.created.toDate());
    room.users.forEach(
      (user: User) => (user.created = JSON.stringify(user.created.toDate()))
    );
    user.created = JSON.stringify(user.created.toDate());
    const userIndex = (() => {
      for (let i = 0; i < room.users.length; i++) {
        if (room.users[i].id === user.id) return i;
      }
      return -1;
    })();
    return {
      props: {
        bool: true,
        room: room,
        user: user,
        userIndex: userIndex,
        errors: null,
      },
    };
  } catch (err) {
    console.log(`server side props failed with: ${err}`);
    return {
      props: { bool: false, errors: err.message, room: null, user: null },
    };
  }
};
