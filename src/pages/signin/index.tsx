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
import { FirebaseError } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FormEvent, useState } from "react";

export const Page = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
      toast({
        title: "ログインしました。",
        status: "success",
        position: "top",
      });
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container py={14}>
      <Heading>サインイン</Heading>
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
            ログイン
          </Button>
        </Center>
      </chakra.form>
    </Container>
  );
};

export default Page;
