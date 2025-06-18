import React, { useEffect } from "react";
import {
  Text,
  Box,
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
  Center,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { PasswordInput } from "../components/ui/password-input"; // Путь теперь относительный
import { ColorModeButton } from "../components/ui/color-mode";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader } from "../components/common/Loader";
import { Toaster, toaster } from "../components/ui/toaster";
import type { LoginUserData } from "../types/auth";

type FormValues = LoginUserData;

export const LoginPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: "onTouched",
    defaultValues: {
      email: "admin@mirra.dev",
      password: "admin123",
    },
  });

  const navigate = useNavigate();
  const { login, isAuthenticated, isLoggingIn, authError, clearAuthError } =
    useAuth();

  const pageIsLoading = isSubmitting || isLoggingIn;

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 1000); // Уменьшил задержку
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (authError) {
      toaster.create({
        title: "Ошибка входа",
        description: authError,
        type: "warning",
        duration: 5000,
      });
      clearAuthError();
    }
  }, [authError, clearAuthError]);

  const onSubmitHandler: SubmitHandler<FormValues> = async (data) => {
    try {
      const loginSuccess = await login(data);
      if (loginSuccess) {
        toaster.create({
          title: "Вход выполнен успешно!",
          description: "Перенаправляем на дашборд...",
          type: "success",
          duration: 1000, // Уменьшил, чтобы быстрее исчез перед редиректом
        });
      }
    } catch (err) {
      // toaster.create({
      //   title: "Ошибка входа",
      //   description: (err as Error).message || "Проверьте данные!",
      //   type: "error",
      //   duration: 1500,
      // });
      console.error("Login submission failed:", err);
    }
  };

  return (
    <Center
      minH={{ base: "calc(100vh - 80px)", md: "calc(100vh - 120px)" }}
      p={{ base: 2, sm: 4 }}
    >
      {pageIsLoading && (
        <Flex
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={{ base: "gray.300", _dark: "gray.800" }}
          opacity={0.8}
          zIndex={"max"}
          alignItems="center"
          justifyContent="center"
        >
          <Loader />
        </Flex>
      )}
      <Box
        w={{ base: "100%", sm: "420px" }}
        p={{ base: 5, sm: 6, md: 8 }}
        borderWidth={1}
        borderRadius="xl"
        boxShadow="lg"
        bg="chakra-body-bg"
      >
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <Fieldset.Root>
            <Stack mb={6} textAlign="center">
              <Fieldset.Legend as={Heading} fontWeight="semibold">
                Вход в Панель
              </Fieldset.Legend>
              <Text
                fontSize="sm"
                color="gray.500"
                _dark={{ color: "gray.400" }}
              >
                Используйте email и пароль для доступа.
              </Text>
            </Stack>

            <Fieldset.Content>
              <Stack>
                <Field.Root id="email-field" invalid={!!errors.email} required>
                  <Field.Label>Email</Field.Label>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email обязателен для входа",
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="example@mail.com"
                        autoComplete="email"
                      />
                    )}
                  />
                  {errors.email && (
                    <Field.ErrorText>{errors.email.message}</Field.ErrorText>
                  )}
                </Field.Root>

                <Field.Root
                  id="password-field"
                  invalid={!!errors.password}
                  required
                >
                  <Field.Label>Пароль</Field.Label>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: "Пароль не может быть пустым",
                    }}
                    render={({ field }) => (
                      <PasswordInput
                        {...field}
                        id="password"
                        placeholder="Введите ваш пароль"
                        autoComplete="current-password"
                      />
                    )}
                  />
                  {errors.password && (
                    <Field.ErrorText>{errors.password.message}</Field.ErrorText>
                  )}
                </Field.Root>

                <Button
                  type="submit"
                  colorPalette="blue"
                  width="full"
                  loading={pageIsLoading}
                  size="lg"
                  mt={3}
                  variant={"outline"}
                >
                  Войти
                </Button>
              </Stack>
            </Fieldset.Content>
          </Fieldset.Root>
        </form>
      </Box>
      <Box position="fixed" top={4} right={4}>
        <ColorModeButton />
      </Box>
      <Toaster />
    </Center>
  );
};
