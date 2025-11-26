const todoRepository = require('../repositories/todoRepository');

class TodoService {
  async createTodo(userId, todoData) {
    // Business rule: dueDate must be after startDate
    if (todoData.startDate && todoData.dueDate && new Date(todoData.dueDate) < new Date(todoData.startDate)) {
      throw new Error('Due date cannot be before start date');
    }
    return await todoRepository.createTodo({ ...todoData, userId });
  }

  async getTodos(userId, filters) {
    return await todoRepository.findTodos(userId, filters);
  }

  async getTodoById(todoId, userId) {
    const todo = await todoRepository.findTodoById(todoId, userId);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return todo;
  }

  async updateTodo(todoId, userId, todoData) {
    const existingTodo = await this.getTodoById(todoId, userId); // Check ownership and existence

    // Business rule: dueDate must be after startDate
    const newStartDate = todoData.startDate || existingTodo.startDate;
    const newDueDate = todoData.dueDate || existingTodo.dueDate;
    if (newStartDate && newDueDate && new Date(newDueDate) < new Date(newStartDate)) {
      throw new Error('Due date cannot be before start date');
    }

    return await todoRepository.updateTodo(todoId, userId, todoData);
  }

  async softDeleteTodo(todoId, userId) {
    await this.getTodoById(todoId, userId); // Check ownership and existence
    return await todoRepository.deleteTodo(todoId, userId);
  }

  async restoreTodo(todoId, userId) {
    const todo = await todoRepository.findTodoById(todoId, userId);
    if (!todo || todo.status !== 'DELETED') {
      throw new Error('Todo is not in trash or not found');
    }
    return await todoRepository.restoreTodo(todoId, userId);
  }

  async completeTodo(todoId, userId) {
    await this.getTodoById(todoId, userId); // Check ownership and existence
    return await todoRepository.completeTodo(todoId, userId);
  }

  async permanentlyDeleteTodo(todoId, userId) {
    const todo = await todoRepository.findTodoById(todoId, userId);
    if (!todo || todo.status !== 'DELETED') {
      throw new Error('Todo is not in trash or not found for permanent deletion');
    }
    return await todoRepository.permanentlyDeleteTodo(todoId, userId);
  }
}

module.exports = new TodoService();
