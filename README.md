# PromptManager Extension
PromptManager is a web browser extension that allows you to manage your prompts. It is a simple and easy-to-use tool that helps you keep track of all the prompts you receive on various websites. With PromptManager, you can easily view, edit, and delete prompts, as well as create new prompts. You can also organize your prompts into different categories and add notes to them. PromptManager is a great tool for anyone who likes to use multiple of the same prompts across different providers.

> Extension code is found in `prompt-manager`

## Branching Strategy

- **Main Branch**
  - Deploys to main
- **Dev Branch**
  - Deploys to dev 
  - Merged into main by pull request after **testing**
- **Feature Branches**
  - Named in this format [issue#]-[description of feature]
  - Merged into dev by pull request
  - Then delete feature branch after merge
  

## Folders

- `prompt-manager`: Contains the main code for the extension.
- `website`: Contains code for the public website (including privacy policy for Chrome Web Store)
- `.github/workflows`: Contains CICD workflow.

