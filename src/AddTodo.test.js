import { render, screen, fireEvent } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('test that App component renders Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });
  const dueDate = "05/30/2023";

  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  const check = screen.getByText(/History Test/i);
  const checkDate = screen.getByText(/Due: 5\/30\/2023/i);
  expect(check).toBeInTheDocument();
  expect(checkDate).toBeInTheDocument();
});

test('test that App component doesn\'t render duplicate Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });
  const dueDate = "06/30/2023";

  // Add first task
  fireEvent.change(inputTask, { target: { value: "Unique Task" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  // Attempt to add duplicate task
  fireEvent.change(inputTask, { target: { value: "Unique Task" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  const tasks = screen.getAllByText(/Unique Task/i);
  expect(tasks.length).toBe(1);
});

test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });
  const dueDate = "06/30/2023";

  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  const task = screen.queryByText(/06\/30\/2023/i);
  expect(task).toBeNull();
});

test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const element = screen.getByRole('button', { name: /Add/i });

  fireEvent.change(inputTask, { target: { value: "Task Without Due Date" } });
  fireEvent.click(element);

  const task = screen.queryByText(/Task Without Due Date/i);
  expect(task).toBeNull();
});

test('test that App component can delete task through checkbox', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });
  const dueDate = "06/30/2023";

  fireEvent.change(inputTask, { target: { value: "Task To Be Deleted" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  const task = screen.queryByText(/Task To Be Deleted/i);
  expect(task).toBeNull();
});

test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });
  const dueDate = "01/01/2022"; // Past date

  fireEvent.change(inputTask, { target: { value: "Late Task" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);

  const taskCard = screen.getByTestId(/Late Task/i);
  expect(taskCard.style.backgroundColor).toBe('rgb(255, 204, 204)'); // Assuming overdue color is #ffcccc
});
