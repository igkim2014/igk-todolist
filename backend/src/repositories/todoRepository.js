const prisma = require('../config/database');

class TodoRepository {
  async createTodo(data) {
    return await prisma.todo.create({ data });
  }

  async findTodoById(todoId, userId) {
    return await prisma.todo.findUnique({
      where: {
        todoId,
        userId,
      },
    });
  }

  async findTodos(userId, filters) {
    const { status, search, sortBy, order } = filters;
    const where = { userId };

    if (status) {
      where.status = status;
    } else {
      where.status = { not: 'DELETED' }; // Default to not showing deleted todos
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy = {};
    if (sortBy) {
      orderBy[sortBy] = order || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    return await prisma.todo.findMany({
      where,
      orderBy,
    });
  }

  async updateTodo(todoId, userId, data) {
    return await prisma.todo.update({
      where: { todoId, userId },
      data,
    });
  }

  async deleteTodo(todoId, userId) {
    // Soft delete
    return await prisma.todo.update({
      where: { todoId, userId },
      data: {
        status: 'DELETED',
        deletedAt: new Date(),
      },
    });
  }

  async restoreTodo(todoId, userId) {
    return await prisma.todo.update({
      where: { todoId, userId, status: 'DELETED' }, // Only restore deleted todos
      data: {
        status: 'ACTIVE',
        deletedAt: null,
      },
    });
  }

  async completeTodo(todoId, userId) {
    return await prisma.todo.update({
      where: { todoId, userId },
      data: {
        status: 'COMPLETED',
        isCompleted: true,
      },
    });
  }

  async permanentlyDeleteTodo(todoId, userId) {
    return await prisma.todo.delete({
      where: { todoId, userId, status: 'DELETED' }, // Only permanently delete deleted todos
    });
  }
}

module.exports = new TodoRepository();
