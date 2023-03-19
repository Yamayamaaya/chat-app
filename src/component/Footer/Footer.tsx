import { chakra, Container, Flex, Link } from "@chakra-ui/react";

export const Footer = () => {
  return (
    <chakra.footer py={4} bgColor={"blue.600"} color={"white"}>
      <Container maxW={"container.lg"}>
        <Flex flexDirection={"column"} gap={2} alignItems={"start"}>
          <Link href="/" lineHeight={1}>
            トップページ
          </Link>
          <Link href="/signin" lineHeight={1}>
            サインイン
          </Link>
          <Link href="/signup" lineHeight={1}>
            サインアップ
          </Link>
          <Link href="/chat" lineHeight={1}>
            チャット
          </Link>
        </Flex>
      </Container>
    </chakra.footer>
  );
};
