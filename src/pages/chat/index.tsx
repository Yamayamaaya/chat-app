import {
  Avatar,
  Box,
  Button,
  chakra,
  Container,
  Flex,
  Heading,
  Input,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { getDatabase, onChildAdded, push, ref } from "@firebase/database";
import { FirebaseError } from "@firebase/util";
import { AuthGuard } from "@src/feature/auth/component/AuthGuard/AuthGuard";
import { getAuth } from "firebase/auth";

type MessageProps = {
  message: string;
  displayName: string;
};

const Message = ({ message,displayName }: MessageProps) => {
  return (
    <Flex alignItems={"start"}>
      <Avatar />
      <Box ml={2}>
        <Text bgColor={"gray.200"} rounded={"md"} px={2} py={1}>
          {message}
        </Text>
        <p>{displayName}</p>
      </Box>
    </Flex>
  );
};


export const Page = () => {
  const messagesElementRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState<string>("");
  

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const db = getDatabase();
      const auth = getAuth();
      const dbRef = ref(db, "chat");
      await push(dbRef, {
        message,
        displayName: auth.currentUser?.displayName,
      });
      setMessage("");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e);
      }
    }
  };

  const [chats, setChats] = useState<{ message: string,displayName:string }[]>([]);

  useEffect(() => {
    try {
      const db = getDatabase();
      const dbRef = ref(db, "chat");
      return onChildAdded(dbRef, (snapshot) => {
        console.log(snapshot.val());
        const message = String(snapshot.val()["message"] ?? "");
        const displayName = String(snapshot.val()["displayName"] ?? "");
        setChats((prev) => [...prev, { message,displayName}]);
      });
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.error(e);
      }
      return;
    }
  }, []);

  useEffect(() => {
    messagesElementRef.current?.scrollTo({
      top: messagesElementRef.current.scrollHeight,
    });
  }, [chats]);

  return (
    <AuthGuard>
      <Container
        py={14}
        flex={1}
        display={"flex"}
        flexDirection={"column"}
        minHeight={0}
      >
        <Heading>チャット</Heading>
        {/* TODO:チャット送信者がわかる  */}
        <Spacer flex={"none"} height={4} aria-hidden />
        <Flex
          flexDirection={"column"}
          overflowY={"auto"}
          gap={2}
          ref={messagesElementRef}
        >
          {chats.map((chat, index) => (
            <Message message={chat.message} displayName = {chat.displayName} key={`ChatMessage_${index}`} />
          ))}
        </Flex>
        <Spacer aria-hidden />
        <Spacer height={2} aria-hidden flex={"none"} />
        <chakra.form display={"flex"} gap={2} onSubmit={handleSendMessage}>
          <Input value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button type={"submit"}>送信</Button>
        </chakra.form>
      </Container>
    </AuthGuard>
  );
};

export default Page;
