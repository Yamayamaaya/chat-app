import {
  Box,
  Button,
  Center,
  chakra,
  Container,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { FirebaseError } from "@firebase/util";
import { useRouter } from "next/router";


export const Page = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { push } = useRouter();
  const toast = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);
      setEmail("");
      toast({
        title: "確認メールを送信しました。",
        status: "success",
        position: "top",
      });
      setPassword("");
      updateProfile(userCredential.user, {
				displayName: displayName,
			})
      setDisplayName("");
      push("/chat");
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e);
        toast({
          title: "エラーが発生しました。",
          status: "error",
          position: "top",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container py={14}>
      <Heading>サインアップ</Heading>
      <chakra.form onSubmit={handleSubmit}>
        <Spacer height={8} aria-hidden />
        <Grid gap={4}>
          <Box display={"contents"}>
            <FormControl>
              <FormLabel>メールアドレス</FormLabel>
              <Input
                type={"email"}
                name={"email"}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>表示名</FormLabel>
              <Input
                name={"displayName"}
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>パスワード</FormLabel>
              <Input
                type={"password"}
                name={"password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </FormControl>
          </Box>
        </Grid>
        <Spacer height={4} aria-hidden />
        <Center>
          <Button type={"submit"} isLoading={isLoading}>
            アカウントを作成
          </Button>
        </Center>
      </chakra.form>
    </Container>
  );
};

export default Page;
