/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  HStack,
  Flex,
  Table,
  IconButton,
  Alert,
  Center,
  Dialog,
  Portal,
  CloseButton,
  Loader,
} from "@chakra-ui/react";
import {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  type GetClientsParams,
  type CreateClientPayload,
} from "../../api/clientsApi";
import PaginationControls from "../common/PaginationControls";
import { toaster, Toaster } from "../ui/toaster";
import type { Client, PaginatedResponse } from "../../types/domain";
import { IoMdAdd } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import ClientForm from "../clients/ClientForm";

const ITEMS_PER_PAGE_CLIENTS = 5; // Количество клиентов на странице

const ClientsSection: React.FC = () => {
  const [clientsData, setClientsData] =
    useState<PaginatedResponse<Client> | null>(null);
  const [isLoadingClients, setIsLoadingClients] = useState<boolean>(true);
  const [clientsError, setClientsError] = useState<string | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState(1);

  // Client Form Dialog
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const handleClientFormOpenChange = (open: boolean) => {
    setIsClientFormOpen(open);
    if (!open) setEditingClient(null);
  };

  // Delete Confirmation Dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const fetchClients = useCallback(
    async (pageNumber: number, pageSize: number) => {
      setIsLoadingClients(true);
      setClientsError(null);
      try {
        const params: GetClientsParams = { pageNumber, pageSize };
        const data = await getClients(params);
        setClientsData(data);
      } catch (error: any) {
        setClientsError(
          error.message || "Не удалось загрузить список клиентов."
        );
        toaster.create({
          title: "Ошибка загрузки клиентов",
          description: error.message,
          type: "warning",
        });
      } finally {
        setIsLoadingClients(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchClients(currentPage, ITEMS_PER_PAGE_CLIENTS);
  }, [fetchClients, currentPage]);

  const handleAddClientClick = () => {
    setEditingClient(null);
    setIsClientFormOpen(true);
  };

  const handleEditClientClick = (client: Client) => {
    setEditingClient(client);
    setIsClientFormOpen(true);
  };

  const handleDeleteClientClick = (client: Client) => {
    setClientToDelete(client);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;
    setIsSubmittingForm(true);
    try {
      await deleteClient(clientToDelete.id);
      toaster.create({ title: "Клиент удален", type: "info" });
      if (clientsData && clientsData.items.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchClients(currentPage, ITEMS_PER_PAGE_CLIENTS);
      }
    } catch (error: any) {
      toaster.create({
        title: "Ошибка удаления",
        description: error.message,
        type: "warning",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setClientToDelete(null);
      setIsSubmittingForm(false);
    }
  };

  const handleClientFormSubmit = async (data: {
    name: string;
    email: string;
    balanceT?: number;
  }): Promise<any | null | undefined> => {
    setIsSubmittingForm(true);
    try {
      let responseMessage = "";
      if (editingClient) {
        await updateClient(editingClient.id, {
          name: data.name,
          email: data.email,
          balanceT:
            data.balanceT === undefined
              ? editingClient.balanceT || 0
              : data.balanceT,
        });
        responseMessage = "Клиент обновлен";
      } else {
        const payload: CreateClientPayload = {
          name: data.name,
          email: data.email,
          balanceT: data.balanceT === undefined ? 0 : data.balanceT,
        };
        await createClient(payload);
        responseMessage = "Клиент добавлен";
      }
      toaster.create({
        title: responseMessage,
        type: "success",
        duration: 3000,
      });
      fetchClients(editingClient ? currentPage : 1, ITEMS_PER_PAGE_CLIENTS);
      setIsClientFormOpen(false); // Закрываем диалог
    } catch (error: any) {
      let mainErrorMessage = editingClient
        ? "Ошибка обновления клиента"
        : "Ошибка добавления клиента";
      let errorDetails = "Пожалуйста, проверьте введенные данные.";

      if (
        error.response &&
        error.response.data &&
        error.response.status === 422
      ) {
        const validationErrors = error.response.data;
        mainErrorMessage = validationErrors.title || mainErrorMessage;

        const fieldErrorMessages: string[] = [];
        Object.keys(validationErrors).forEach((key) => {
          if (
            key !== "type" &&
            key !== "title" &&
            key !== "status" &&
            key !== "detail" &&
            Array.isArray(validationErrors[key])
          ) {
            const fieldErrors = validationErrors[key].join(" ");
            fieldErrorMessages.push(`${key}: ${fieldErrors}`);
          }
        });

        if (fieldErrorMessages.length > 0) {
          errorDetails = fieldErrorMessages.join("\n");
        } else if (validationErrors.detail) {
          errorDetails = validationErrors.detail;
        }
      } else if (error.message) {
        errorDetails = error.message;
      }

      toaster.create({
        title: mainErrorMessage,
        description: errorDetails,
        type: "warning",
        duration: 7000,
      });
      // console.error(
      //   "Client form submission error:",
      //   error.response?.data || error
      // );
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <Box
      p={5}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="base"
      id="clients-section"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md">Клиенты</Heading>
        <IconButton
          colorPalette="teal"
          variant={"outline"}
          size="sm"
          onClick={handleAddClientClick}
        >
          <IoMdAdd />
        </IconButton>
      </Flex>

      {isLoadingClients && (
        <Center my={4}>
          <Loader />
        </Center>
      )}
      {clientsError && !isLoadingClients && (
        <Alert.Root status="warning" mb={4}>
          <Alert.Indicator /> <Alert.Title>{clientsError}</Alert.Title>{" "}
        </Alert.Root>
      )}
      {!isLoadingClients &&
        !clientsError &&
        (!clientsData || clientsData.items.length === 0) && (
          <Text>Список клиентов пуст.</Text>
        )}
      {!isLoadingClients &&
        !clientsError &&
        clientsData &&
        clientsData.items.length > 0 && (
          <>
            <Table.Root variant="line" size="sm">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Имя</Table.ColumnHeader>
                  <Table.ColumnHeader>Email</Table.ColumnHeader>
                  <Table.ColumnHeader>Баланс (Т)</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">
                    Действия
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {clientsData.items.map((client) => (
                  <Table.Row key={client.id}>
                    <Table.Cell>{client.name}</Table.Cell>
                    <Table.Cell>{client.email}</Table.Cell>
                    <Table.Cell>{client.balanceT.toLocaleString()}</Table.Cell>
                    <Table.Cell textAlign="right">
                      <HStack justify="flex-end">
                        <IconButton
                          aria-label="Редактировать клиента"
                          size="sm"
                          variant="ghost"
                          colorPalette="yellow"
                          onClick={() => handleEditClientClick(client)}
                        >
                          <FaEdit />
                        </IconButton>
                        <IconButton
                          aria-label="Удалить клиента"
                          size="sm"
                          variant="ghost"
                          colorPalette="red"
                          onClick={() => handleDeleteClientClick(client)}
                        >
                          <MdDeleteOutline />
                        </IconButton>
                      </HStack>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
            <PaginationControls
              currentPage={clientsData.page}
              totalPages={clientsData.totalPages}
              onPageChange={handlePageChange}
              pageSize={clientsData.pageSize}
              totalCount={clientsData.totalCount}
              isDisabled={isLoadingClients}
            />
          </>
        )}
      <ClientForm
        isOpen={isClientFormOpen}
        onOpenChange={handleClientFormOpenChange}
        onSubmit={handleClientFormSubmit}
        initialData={editingClient}
        isSubmitting={isSubmittingForm}
      />
      <Dialog.Root
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Удалить клиента</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                Вы уверены, что хотите удалить клиента "{clientToDelete?.name}"?
                Это действие необратимо.
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <Button variant="ghost">Отмена</Button>
                </Dialog.CloseTrigger>
                <Button
                  colorScheme="red"
                  onClick={confirmDeleteClient}
                  ml={3}
                  loading={isSubmittingForm}
                >
                  Удалить
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger
                asChild
                position="absolute"
                top="3"
                right="3"
              >
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      <Toaster></Toaster>
    </Box>
  );
};

export default ClientsSection;
