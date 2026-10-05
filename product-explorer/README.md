# Product Explorer Dashboard

A lightweight mini e-commerce dashboard built with HTML, CSS, and vanilla JavaScript. Browse the product catalog, open product details, track recently viewed products, and manage cart changes with Undo and Redo.

## Challenge 3: Recently Viewed Products

### Problem Statement

Whenever a user opens/views a product, it should be added to a Recently Viewed Products section.

### Requirements

- Show the most recently viewed product first.
- Do not allow duplicate products.
- Keep a maximum of 5 recently viewed products.
- When a sixth product is viewed, remove the oldest product.
- Provide a Clear History option.
- Show an appropriate empty state when there are no recently viewed products.

**Example:**

Laptop → Mouse → Keyboard → Laptop

**Expected Recently Viewed order:**

Laptop → Keyboard → Mouse

### Features

- Viewing a product from the catalog adds it to Recently Viewed.
- Recently viewed history is ordered newest first, de-duplicates products by ID, and is limited to a maximum of 5 products.
- Viewing a product already in history moves it to the front.
- Select a recently viewed item to open its product details again.
- Clear History empties the list, which displays an empty state.

## Challenge 4: Undo/Redo Cart

### Problem Statement

The shopping cart should support Undo and Redo operations for cart actions.

### Requirements

- Add products to cart.
- Remove products from cart.
- Undo the most recent cart action.
- Redo an undone cart action.
- Use Stack data structure for Undo/Redo.
- Maintain `undoStack` and `redoStack`.
- A new cart action should clear the redo stack.
- Disable Undo when there is nothing to undo.
- Disable Redo when there is nothing to redo.
- Show an empty-cart state when the cart is empty.

**Example:**

Add Laptop → Add Mouse → Remove Mouse

- Undo → Mouse is added back
- Undo → Mouse is removed
- Redo → Mouse is added again

### Features

- Add products to the cart and remove them from the cart.
- Undo and Redo use Stack (LIFO) behavior through `undoStack` and `redoStack`.
- A new cart action clears the redo stack.
- Undo and Redo controls are disabled when their respective stacks are empty.
- The cart displays its items, quantities, total, and an empty-cart state when no items remain.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript

## Project Structure

```text
product-explorer/
├── assets/
│   └── products/
│       ├── headphones.jpg
│       ├── keyboard.jpg
│       ├── laptop.jpg
│       ├── monitor.jpg
│       ├── mouse.jpg
│       ├── phone.jpg
│       └── smart-watch.jpg
├── data.js
├── index.html
├── script.js
├── style.css
└── README.md
```

## Run the Project

1. Open the `product-explorer` folder in VS Code or your preferred editor.
2. Open `index.html` in a web browser.

This is a static project with no package installation or build step required.

## Challenge Status

| Challenge | Status |
| --- | --- |
| Challenge 3 — Recently Viewed Products | Completed |
| Challenge 4 — Undo/Redo Cart | Completed |
