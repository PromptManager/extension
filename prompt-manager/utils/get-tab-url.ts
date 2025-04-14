//export const getCurrentTabUrl = (): Promise<string> => {
//  return new Promise((resolve, reject) => {
//    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//      const tab = tabs[0];
//      if (tab?.url) {
//        resolve(tab.url);
//      } else {
//        reject("No active tab URL found.");
//      }
//    });
//  });
//};
