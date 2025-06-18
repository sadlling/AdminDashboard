/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  Input,
  Stack,
  Field,
  Fieldset,
  Center,
  Spinner,
  Alert,
} from "@chakra-ui/react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { getCurrentRate, updateRate } from "../../api/rateApi";
import { toaster, Toaster } from "../ui/toaster";
import type { TokenRate } from "../../types/domain";

interface RateFormValues {
  newRate: number;
}

const RateSection: React.FC = () => {
  const [currentRate, setCurrentRate] = useState<TokenRate | null>(null);
  const [isLoadingRate, setIsLoadingRate] = useState<boolean>(true);
  const [rateError, setRateError] = useState<string | null>(null);

  const {
    control: rateControl,
    handleSubmit: handleRateSubmit,
    formState: { errors: rateErrors, isSubmitting: isRateSubmitting },
    setValue: setRateFormValue,
  } = useForm<RateFormValues>({
    mode: "onChange",
  });

  const fetchRate = useCallback(async () => {
    setIsLoadingRate(true);
    setRateError(null);
    try {
      const data = await getCurrentRate();
      setCurrentRate(data);
      setRateFormValue("newRate", data.rate);
    } catch (error: any) {
      setRateError(error.message || "Не удалось загрузить текущий курс.");
      toaster.create({
        title: "Ошибка загрузки курса",
        description: error.message,
        type: "warning",
      });
    } finally {
      setIsLoadingRate(false);
    }
  }, [setRateFormValue]);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  const onRateSubmitHandler: SubmitHandler<RateFormValues> = async (data) => {
    try {
      const updatedRateData = await updateRate(Number(data.newRate));
      setCurrentRate(updatedRateData);
      setRateFormValue("newRate", updatedRateData.rate);
      toaster.create({
        title: "Курс обновлен",
        description: `Новый курс: ${updatedRateData.rate}`,
        type: "success",
      });
    } catch (error: any) {
      toaster.create({
        title: "Ошибка обновления курса",
        description: error.message,
        type: "warning",
      });
    }
  };

  return (
    <Box
      p={5}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="base"
      id="rate-section"
    >
      <Heading size="md" mb={4}>
        Курс токенов
      </Heading>
      {isLoadingRate && (
        <Center my={4}>
          <Spinner />
        </Center>
      )}
      {rateError && !isLoadingRate && (
        <Alert.Root status="warning" mb={4}>
          <Alert.Indicator /> <Alert.Title>{rateError}</Alert.Title>{" "}
        </Alert.Root>
      )}
      {!isLoadingRate && !rateError && currentRate && (
        <Text fontSize="xl" fontWeight="medium" mb={4}>
          Текущий курс:{" "}
          <Text as="span" fontWeight="bold" color="blue.500">
            {currentRate.rate}
          </Text>
        </Text>
      )}
      <form onSubmit={handleRateSubmit(onRateSubmitHandler)}>
        <Fieldset.Root disabled={isRateSubmitting || isLoadingRate}>
          <Fieldset.Content>
            <Stack direction={{ base: "column", sm: "row" }} align="flex-end">
              <Field.Root
                id="newRate-field"
                invalid={!!rateErrors.newRate}
                flex={1}
                required
              >
                <Field.Label>Новый курс</Field.Label>
                <Controller
                  name="newRate"
                  control={rateControl}
                  rules={{
                    required: "Укажите курс",
                    min: {
                      value: 0.000001,
                      message: "Курс должен быть положительным",
                    },
                    pattern: {
                      value: /^[0-9]+([,.][0-9]+)?$/,
                      message: "Введите корректное число",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      inputMode="decimal"
                      placeholder="Введите новый курс"
                    />
                  )}
                />
                {rateErrors.newRate && (
                  <Field.ErrorText>
                    {rateErrors.newRate.message}
                  </Field.ErrorText>
                )}
              </Field.Root>
              <Button
                type="submit"
                colorScheme="green"
                variant="outline"
                loading={isRateSubmitting}
                loadingText="Обновление..."
              >
                Обновить курс
              </Button>
            </Stack>
          </Fieldset.Content>
        </Fieldset.Root>
      </form>
      <Toaster />
    </Box>
  );
};

export default RateSection;
