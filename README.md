# llm-dataset-reviewer
Review and edit JSON datasets row by row, optimized for LLM training data

## Clone and Setup

```
git clone git@github.com:Israel-Laguan/llm-dataset-reviewer.git
cd llm-dataset-reviewer
nvm use # 20 by default
npm install
# rm -rf node_modules package-lock.json # if needed
```

Development

```
# Start compilation in watch mode
npm run watch
```

In VS Code, press F5 to start debugging, Or use the "Run and Debug" sidebar (Ctrl+Shift+D)

Then you can open the Palette and search one of the commands available.

# Testing

```
# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

# Building

```
# Create production build
npm run package
```

# Publishing

```
# Install VS Code Extension development tool
npm install -g @vscode/vsce

# Package extension
vsce package

# Publish to OpenVSX
npx ovsx publish
```
