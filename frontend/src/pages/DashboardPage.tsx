// src/pages/private/DashboardPage.tsx
import React from "react";
import { Box, VStack, Grid, GridItem } from "@chakra-ui/react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import ClientsSection from "../components/dashboard/ClientsSection";
import PaymentsSection from "../components/dashboard/PaymentsSection";
import RateSection from "../components/dashboard/RateSection";
import { useAuth } from "../contexts/AuthContext";

const DashboardPage: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // navigate('/login'); // Если AuthContext.logout не делает редирект, а должен роутер
  };

  return (
    <Box p={{ base: 4, md: 8 }} maxWidth={"90vw"} mx="auto">
      <DashboardHeader onLogout={handleLogout} />
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        <GridItem>
          <VStack align="stretch">
            <ClientsSection />
            <PaymentsSection />
          </VStack>
        </GridItem>

        <GridItem>
          <Box position="sticky" top={{ base: "70px", md: "80px" }}>
            <RateSection />
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
