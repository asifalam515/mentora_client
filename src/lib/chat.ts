export const isValidChatBookingId = (value?: string | null) =>
  Boolean(value && value !== "undefined" && value !== "null");

export const resolveChatBookingId = (
  ...values: Array<string | null | undefined>
) => values.find((value) => isValidChatBookingId(value));
