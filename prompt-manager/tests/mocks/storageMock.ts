// Mock implementation of @plasmohq/storage/hook
export const useStorage = jest.fn().mockImplementation((key, initialValue) => {
    return [initialValue, jest.fn()]
  })