# PromptManager Extension
PromptManager is a web browser extension that allows you to manage your prompts. It is a simple and easy-to-use tool that helps you keep track of all the prompts you receive on various websites. With PromptManager, you can easily view, edit, and delete prompts, as well as create new prompts. You can also organize your prompts into different categories and add notes to them. PromptManager is a great tool for anyone who likes to use multiple of the same prompts across different providers.

> Extension code is found in `prompt-manager`

## Branching Strategy

- **Main Branch**
  - Deploys to main
- **Dev Branch**
  - Deploys to dev 
  - Merged into main by pull request after **testing**
- **Other Branches**
  - Named in this format [issue#]-[description of feature]
  - Merged into dev by pull request
  

## Folders

- `prompt-manager`: Contains the main code for the extension.
- `pipeline`: Contains CICD workflow.
- TODO....
