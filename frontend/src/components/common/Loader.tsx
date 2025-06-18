import { Flex, Text, useToken } from "@chakra-ui/react";
import { useColorMode } from "../ui/color-mode.tsx";
import { Bouncy } from "ldrs/react";
import "ldrs/react/Bouncy.css";

export const Loader = () => {
  const { colorMode } = useColorMode();

  const [lightColor, darkColor] = useToken("colors", [
    "gray.800", // Светлая тема
    "gray.300", // Темная тема
  ]);

  return (
    <Flex justifyContent="center" alignItems="center">
      <Bouncy
        size="45"
        speed="1.75"
        color={colorMode === "light" ? lightColor : darkColor}
      />
      <Text textAlign={"center"} fontSize={"4xl"} ml={3}>
        Loading, please wait...
      </Text>
    </Flex>
  );
};
