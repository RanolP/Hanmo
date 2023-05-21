import { persistentAtom } from '@nanostores/persistent';

const input = document.getElementById(
  'playground-input',
) as HTMLTextAreaElement;

export const inputTextAtom = persistentAtom<string>('playgroundInputText', '');

input.value = inputTextAtom.get() ?? '';

input.addEventListener('input', () => {
  inputTextAtom.set(input.value);
});
