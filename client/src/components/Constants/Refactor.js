export const Refactor = (response) => {
  const { success, data, message } = response;

  if (!success) {
    return {
      success,
      error: message,
    };
  }

  return data;
};
