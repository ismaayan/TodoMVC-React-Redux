# TodoMVC Tests With Playwright

This repository contains a set of automated tests for the TodoMVC application using Playwright. The tests cover various functionalities such as adding, editing, completing, deleting, and filtering todo items.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Playwright](https://playwright.dev/) (installed via npm)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ismaayan/TodoMVC-React-Redux.git
   cd your-repository

2. Install the dependencies:

    ```bash
    npm install

## Running Tests

To run the tests, use the following command:

   
    npx playwright test
    
    

## Helper Functions

* `createDefaultTodos(page)`: A helper function to add a predefined list of todo items to the application.

## Configuration

The tests use Playwright's built-in configuration, which can be customized by editing the `playwright.config.js` file if needed.