import React from "react";
import { Flex, Heading, HStack, Button } from "@chakra-ui/react";
import { ColorModeButton } from "../ui/color-mode";
interface DashboardHeaderProps {
  onLogout: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onLogout }) => {
  return (
    <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={2}>
      <Heading as="h1" size="lg">
        Панель Управления
      </Heading>
      <HStack>
        <ColorModeButton />
        <Button
          colorScheme="red"
          variant="outline"
          onClick={onLogout}
          size="sm"
        >
          Выйти
        </Button>
      </HStack>
    </Flex>
  );
};

export default DashboardHeader;
