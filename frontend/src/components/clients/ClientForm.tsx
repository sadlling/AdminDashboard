/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import {
  Dialog,
  Portal,
  Button,
  Stack,
  Field,
  Input,
  CloseButton,
} from "@chakra-ui/react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import type { Client } from "../../types/domain";

export interface ClientFormData {
  name: string;
  email: string;
  balanceT: number | undefined | "";
}

interface ClientFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ClientFormData) => Promise<any | null | undefined>;
  initialData?: Client | null;
  isSubmitting?: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  isSubmitting = false,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ClientFormData>({
    defaultValues: {
      name: "",
      email: "",
      balanceT: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name || "",
          email: initialData.email || "",
          balanceT:
            initialData.balanceT === null || initialData.balanceT === undefined
              ? ""
              : initialData.balanceT,
        });
      } else {
        reset({ name: "", email: "", balanceT: "" });
      }
    } else {
      reset({ name: "", email: "", balanceT: "" }, { keepErrors: false });
    }
  }, [initialData, isOpen, reset]);

  const handleFormSubmitWithApiErrors: SubmitHandler<ClientFormData> = async (
    formData
  ) => {
    const dataToSend = {
      ...formData,
      balanceT:
        formData.balanceT === "" ? undefined : Number(formData.balanceT),
    };

    const apiErrors = await onSubmit(dataToSend);

    if (apiErrors) {
      Object.keys(apiErrors).forEach((key) => {
        const fieldName = (key.charAt(0).toLowerCase() +
          key.slice(1)) as keyof ClientFormData;
        const messages = apiErrors[key as keyof typeof apiErrors];
        if (messages && messages.length > 0) {
          setError(fieldName, {
            type: "server",
            message: messages.join("; "),
          });
        }
      });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={() => onOpenChange(false)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            as="form"
            onSubmit={handleSubmit(handleFormSubmitWithApiErrors)}
            width={{ base: "90%", md: "xl" }}
          >
            <Dialog.Header>
              <Dialog.Title>
                {initialData
                  ? "Редактировать клиента"
                  : "Добавить нового клиента"}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack>
                <Field.Root
                  id="client-name-field"
                  invalid={!!errors.name}
                  required
                >
                  <Field.Label>Имя</Field.Label>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Имя обязательно" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder="Полное имя"
                      />
                    )}
                  />
                  {errors.name && (
                    <Field.ErrorText>{errors.name.message}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root
                  id="client-email-field"
                  invalid={!!errors.email}
                  required
                >
                  <Field.Label>Email</Field.Label>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email обязателен",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Некорректный email адрес",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value || ""} // Гарантируем, что value всегда строка
                        type="email"
                        placeholder="example@mail.com"
                      />
                    )}
                  />
                  {errors.email && (
                    <Field.ErrorText>{errors.email.message}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root
                  id="client-balanceT-field"
                  invalid={!!errors.balanceT}
                >
                  <Field.Label>Баланс (Токены)</Field.Label>
                  <Controller
                    name="balanceT"
                    control={control}
                    rules={{
                      validate: (value) => {
                        if (
                          value === undefined ||
                          value === null ||
                          String(value).trim() === ""
                        )
                          return true;
                        const num = parseFloat(String(value).replace(",", "."));
                        if (isNaN(num)) return "Введите корректное число";
                        if (num < 0)
                          return "Баланс не может быть отрицательным";
                        return true;
                      },
                    }}
                    render={({
                      field: { onChange, onBlur, value, name, ref },
                    }) => (
                      <Input
                        name={name}
                        ref={ref}
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={value || ""}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          onChange(inputValue);
                        }}
                        onBlur={onBlur}
                      />
                    )}
                  />
                  {errors.balanceT && (
                    <Field.ErrorText>{errors.balanceT.message}</Field.ErrorText>
                  )}
                </Field.Root>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <Button
                  variant="outline"
                  mr={3}
                  disabled={isSubmitting}
                  onClick={() => onOpenChange(false)}
                >
                  Отмена
                </Button>
              </Dialog.CloseTrigger>
              <Button colorScheme="blue" type="submit" disabled={isSubmitting}>
                {initialData ? "Сохранить изменения" : "Добавить клиента"}
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild position="absolute" top="3" right="3">
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ClientForm;
