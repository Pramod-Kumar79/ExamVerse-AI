export const getDocumentProxy = jest.fn(async () => ({
  numPages: 2,
}));

export const extractText = jest.fn(async () => ({
  text: ["Page 1 text", "Page 2 text"],
}));
