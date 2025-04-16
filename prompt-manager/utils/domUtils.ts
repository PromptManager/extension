/**
 * Finds the primary input element (textarea or contenteditable div) on the page
 * based on a provided selector.
 * @param selector The CSS selector for the target input element.
 * @returns The found HTMLElement or null.
 */
export const findInputElement = (selector: string): HTMLElement | null => {
  const element = document.querySelector(selector) as HTMLElement | null;

  if (!element) {
    console.warn(`Prompt Manager (domUtils): Element not found using selector "${selector}".`);
  }

  return element;
}

/**
 * Programmatically sets the value/content of the target input element
 * and dispatches an 'input' event to ensure frameworks recognize the change.
 * @param element The HTMLTextAreaElement or contenteditable HTMLElement to modify.
 * @param value The string value to insert into the element.
 */
export const setElementValue = (element: HTMLElement, value: string): void => {
  let inputEventDispatched = false;

  if (element instanceof HTMLTextAreaElement) {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    inputEventDispatched = true;
  } else if (element.isContentEditable) {
    element.textContent = value;
    try {
      const inputEventInit: InputEventInit = {
        bubbles: true,
        inputType: 'insertText',
        data: value
      };
      element.dispatchEvent(new InputEvent('input', inputEventInit));
      inputEventDispatched = true;
    } catch (error) {
      console.error(
        "Prompt Manager (domUtils): Error dispatching InputEvent.",
        {
          error,
          elementTag: element.tagName,
          elementId: element.id || "N/A",
          elementClass: element.className || "N/A",
          value
        }
      );
      element.dispatchEvent(new Event('input', { bubbles: true }));
      inputEventDispatched = true;
    }
  } else {
    console.error("Prompt Manager (domUtils): Target element is neither textarea nor contenteditable.");
    return;
  }

  if (inputEventDispatched) {
    element.focus();
  }
}

/**
 * Simulates an 'Enter' key press on the provided element.
 * @param element The element to dispatch the event on.
 */
export const simulateEnterKey = (element: HTMLElement): void => {
  const keyEventInit: KeyboardEventInit = {
    bubbles: true,
    cancelable: true,
    key: 'Enter',
    code: 'Enter'
  };
  element.dispatchEvent(new KeyboardEvent('keydown', keyEventInit));
}
