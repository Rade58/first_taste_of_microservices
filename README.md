# APP SETUP

Creating React Application with `create-react-app`

Creating Express based project for Posts Services

Creating Express based project for Comments Services

# CREATING REACT APP INSIDE EXISTING PROJECT (HER IN ROOT FOLDER)

- `npx create-react-app . --template typescript`

- `code package.json`

```json
      //  "start": "react-scripts start",
      "start": "BROWSER=none && react-scripts start",,
```

ADDING SOME DEV DEPENDANCIES (MOSTLY ESLINT RELATED): 

`yarn add eslint prettier eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser --dev`

# CREATING FOLDERS FOR SERVICES

- `mkdir posts`

- `mkdir comments`

# INSTALLING DEPENDANCIES INSIDE SERVICES FOLDERS

- `cd posts`

- `yarn init -y`

- `yarn add express cors axios nodemon`

- `cd ../comments`

- `yarn init -y`

- `yarn add express cors axios nodemon`



