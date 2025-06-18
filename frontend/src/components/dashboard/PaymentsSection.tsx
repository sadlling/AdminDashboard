/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Table,
  Tag,
  Center,
  Alert,
} from "@chakra-ui/react";
import PaginationControls from "../common/PaginationControls";
import { toaster, Toaster } from "../ui/toaster";
import type { PaginatedResponse, Payment } from "../../types/domain";
import { getPayments, type GetPaymentsParams } from "../../api/paymentsApi";

const ITEMS_PER_PAGE_PAYMENTS = 5;

const PaymentsSection: React.FC = () => {
  const [paymentsData, setPaymentsData] =
    useState<PaginatedResponse<Payment> | null>(null);
  const [isLoadingPayments, setIsLoadingPayments] = useState<boolean>(true);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPayments = useCallback(async (page: number, pageSize: number) => {
    setIsLoadingPayments(true);
    setPaymentsError(null);
    try {
      const params: GetPaymentsParams = { page, pageSize };
      const data = await getPayments(params);
      setPaymentsData(data);
    } catch (error: any) {
      setPaymentsError(error.message || "Не удалось загрузить платежи.");
      toaster.create({
        title: "Ошибка загрузки платежей",
        description: error.message,
        type: "warning",
      });
    } finally {
      setIsLoadingPayments(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments(currentPage, ITEMS_PER_PAGE_PAYMENTS);
  }, [fetchPayments, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box
      p={5}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="base"
      id="payments-section"
    >
      <Heading size="md" mb={4}>
        Последние платежи
      </Heading>
      {isLoadingPayments && (
        <Center my={4}>
          <Spinner />
        </Center>
      )}
      {paymentsError && !isLoadingPayments && (
        <Alert.Root status="warning" mb={4}>
          <Alert.Indicator /> <Alert.Title>{paymentsError}</Alert.Title>{" "}
        </Alert.Root>
      )}
      {!isLoadingPayments &&
        !paymentsError &&
        (!paymentsData || paymentsData.items.length === 0) && (
          <Text>Платежей не найдено.</Text>
        )}
      {!isLoadingPayments &&
        !paymentsError &&
        paymentsData &&
        paymentsData.items.length > 0 && (
          <>
            <Table.Root variant="line" size="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>ID</Table.ColumnHeader>
                  <Table.ColumnHeader>Клиент</Table.ColumnHeader>
                  <Table.ColumnHeader>Сумма</Table.ColumnHeader>
                  <Table.ColumnHeader>Дата</Table.ColumnHeader>
                  <Table.ColumnHeader>Описание</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {paymentsData.items.map((payment) => (
                  <Table.Row key={payment.id}>
                    <Table.Cell>
                      <Text fontSize="xs" color="gray.500">
                        {payment.id}
                      </Text>
                    </Table.Cell>
                    <Table.Cell>
                      {payment.clientName || `ID: ${payment.clientId}`}
                    </Table.Cell>
                    <Table.Cell>
                      {payment.amount.toLocaleString()}
                      {payment.currency && (
                        <Tag.Root
                          size="sm"
                          variant={"subtle"}
                          ml={2}
                          colorPalette={
                            payment.currency === "TOKENS" ? "purple" : "green"
                          }
                        >
                          <Tag.Label> {payment.currency}</Tag.Label>
                        </Tag.Root>
                      )}
                    </Table.Cell>
                    <Table.Cell>{formatDate(payment.timestamp)}</Table.Cell>
                    <Table.Cell>{payment.description || "-"}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
            <PaginationControls
              currentPage={paymentsData.page}
              totalPages={paymentsData.totalPages}
              onPageChange={handlePageChange}
              pageSize={paymentsData.pageSize}
              totalCount={paymentsData.totalCount}
              isDisabled={isLoadingPayments}
            />
          </>
        )}
      <Toaster />
    </Box>
  );
};

export default PaymentsSection;
