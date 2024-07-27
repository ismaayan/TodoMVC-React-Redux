const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/react-redux/dist/#/');
    await page.getByRole('heading', { name: 'todos' }).isVisible()

});
// Default todos list 
const TODO_ITEMS = [
    'Complete home assignment',
    'Water the plants',
    'Feed the dog'

];

test('new todo item can be added', async ({ page }) => {
    // Create a new todo locator.
    const newTodo = page.getByPlaceholder('What needs to be done?');

    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    await expect(page.getByTestId('todo-item')).toHaveText([
        TODO_ITEMS[0]
    ]);

    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // verify the 2 items has been added.
    await expect(page.getByTestId('todo-item')).toHaveText([
        TODO_ITEMS[0],
        TODO_ITEMS[1]
    ]);

});


test('an existing todo item can be edited', async ({ page }) => {
    await createDefaultTodos(page);

    const todoItems = page.getByTestId('todo-item');
    const secondTodo = todoItems.nth(1);
    await secondTodo.dblclick();
    await expect(secondTodo.getByTestId('text-input')).toHaveValue(TODO_ITEMS[1]);
    await secondTodo.getByTestId('text-input').fill('Go to the gym');
    await secondTodo.getByTestId('text-input').press('Enter');

    // Explicitly assert the new text value.
    await expect(todoItems).toHaveText([
        TODO_ITEMS[0],
        'Go to the gym',
        TODO_ITEMS[2]
    ]);
});


test('a todo item can be marked as completed.', async ({ page }) => {
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create two items.
    for (const item of TODO_ITEMS.slice(0, 2)) {
        await newTodo.fill(item);
        await newTodo.press('Enter');
    }

    // Mark first item as complete    
    const firstTodo = page.getByTestId('todo-item').nth(0);
    await firstTodo.getByRole('checkbox').check();
    await expect(firstTodo).toHaveClass('completed');

    // Mark scond item as complete
    const secondTodo = page.getByTestId('todo-item').nth(1);
    await expect(secondTodo).not.toHaveClass('completed');
    await secondTodo.getByRole('checkbox').check();

    // Assert completed class.
    await expect(firstTodo).toHaveClass('completed');
    await expect(secondTodo).toHaveClass('completed');

});


test('a todo item can be deleted', async ({ page }) => {
    await createDefaultTodos(page);
    const todoItem = page.getByTestId('todo-item').nth(1);

    // Delete item
    await todoItem.hover();
    await page.getByRole('button', { name: '×' }).click();

    // verify item doesn't appear on the list
    await expect(todoItem.locator('label', {
        hasText: TODO_ITEMS[1],
    })).not.toBeVisible();
});


test.describe('Filtering todos', () => {
    test.beforeEach(async ({ page }) => {
        await createDefaultTodos(page);
    });

    test('filter by Active items', async ({ page }) => {
        const todoItem = page.getByTestId('todo-item');
        await todoItem.nth(1).getByRole('checkbox').check();

        await page.getByRole('link', { name: 'Active' }).click();
        await expect(page.getByRole('link', { name: 'Active' })).toHaveClass('selected');
        await expect(todoItem).toHaveCount(2);
        await expect(todoItem).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
    });

    test('filter by All items', async ({ page }) => {
        const todoItem = page.getByTestId('todo-item');
        await todoItem.nth(1).getByRole('checkbox').check();


        await test.step('Showing all items', async () => {
            await page.getByRole('link', { name: 'All' }).click();
            await expect(page.getByRole('link', { name: 'All' })).toHaveClass('selected');
            await expect(todoItem).toHaveCount(3);
        });

    })

    test('filter by completed items', async ({ page }) => {
        await page.getByTestId('todo-item').nth(1).getByRole('checkbox').check();
        await page.getByRole('link', { name: 'Completed' }).click();
        await expect(page.getByRole('link', { name: 'Completed' })).toHaveClass('selected');
        await expect(page.getByTestId('todo-item')).toHaveCount(1);

    });

})


test('remove completed items when clicked', async ({ page }) => {
    await createDefaultTodos(page)
    const todoItems = page.getByTestId('todo-item');
    await todoItems.nth(1).getByRole('checkbox').check();
    await page.getByRole('button', { name: 'Clear completed' }).click();
    await expect(todoItems).toHaveCount(2);
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
});


// Create default todos list function
async function createDefaultTodos(page) {
    const newTodo = page.getByPlaceholder('What needs to be done?');

    for (const item of TODO_ITEMS) {
        await newTodo.fill(item);
        await newTodo.press('Enter');
    }


}
