/**
 * User Repository
 * Clean Architecture - Interface Adapter Layer
 * SOLID Principles: Single Responsibility, Dependency Inversion
 */

const BaseRepository = require("./base/BaseRepository");
const { randomUUID } = require("crypto"); // ✅ uuid 대신 crypto.randomUUID 사용

class UserRepository extends BaseRepository {
  constructor() {
    super("User");
  }

  /**
   * 이메일로 사용자 조회
   */
  async findByEmail(email) {
    return await this.findOne('"email" = $1', [email]);
  }

  /**
   * userId로 사용자 조회
   */
  async findByUserId(userId) {
    return await this.findById(userId, "userId");
  }

  /**
   * 사용자 생성 (회원가입)
   */
  async createUser(userData) {
    const { email, password, username, role = "user" } = userData;

    const newUser = {
      userId: randomUUID(), // ✅ uuidv4() → randomUUID()
      email,
      password,
      username,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.create(newUser);
  }

  /**
   * 사용자 프로필 조회 (비밀번호 제외)
   */
  async getProfile(userId) {
    const query = `
      SELECT "userId", "email", "username", "role", "createdAt", "updatedAt"
      FROM "${this.tableName}"
      WHERE "userId" = $1
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  /**
   * 사용자 정보 업데이트
   */
  async updateUser(userId, updateData) {
    const allowedFields = ["username", "password"];
    const filteredData = {};

    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        filteredData[key] = updateData[key];
      }
    });

    if (Object.keys(filteredData).length === 0) {
      return await this.findByUserId(userId);
    }

    return await this.update(userId, filteredData, "userId");
  }

  /**
   * 사용자 삭제
   */
  async deleteUser(userId) {
    return await this.delete(userId, "userId");
  }

  /**
   * 역할(role)별 사용자 조회
   */
  async findByRole(role) {
    return await this.findAll('"role" = $1', [role]);
  }

  /**
   * 이메일 존재 여부 확인
   */
  async existsByEmail(email) {
    const count = await this.count('"email" = $1', [email]);
    return count > 0;
  }
}

module.exports = new UserRepository();
