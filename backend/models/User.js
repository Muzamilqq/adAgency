const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

// User model - handles all user-related database operations
class User {
  // Find user by ID
  static async findById(id, includePassword = false) {
    const columns = includePassword 
      ? 'id, email, name, role, password_hash, created_at, updated_at, last_login'
      : 'id, email, name, role, created_at, updated_at, last_login';
    const result = await pool.query(
      `SELECT ${columns} FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  // Find user by email (includes password for auth)
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    return result.rows[0] || null;
  }

  // Create new user
  static async create({ email, password, name, role = 'viewer' }) {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, role, created_at`,
      [email.toLowerCase(), passwordHash, name, role]
    );
    
    return result.rows[0];
  }

  // Update user
  static async update(id, updates) {
    const allowedUpdates = ['name', 'email', 'role'];
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedUpdates.includes(key)) {
        setClause.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (setClause.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE users 
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, name, role, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Update password
  static async updatePassword(id, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id',
      [passwordHash, id]
    );
    
    return result.rows[0] || null;
  }

  // Update last login
  static async updateLastLogin(id) {
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Delete user (soft delete - optional)
  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0] || null;
  }

  // List all users with pagination
  static async list(limit = 50, offset = 0, search = '') {
    let query = `
      SELECT id, email, name, role, created_at, updated_at, last_login 
      FROM users 
      WHERE 1=1
    `;
    const values = [];
    
    if (search) {
      query += ` AND (name ILIKE $1 OR email ILIKE $1)`;
      values.push(`%${search}%`);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);
    
    const result = await pool.query(query, values);
    return result.rows;
  }

  // Count total users
  static async count(search = '') {
    let query = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    const values = [];
    
    if (search) {
      query += ` AND (name ILIKE $1 OR email ILIKE $1)`;
      values.push(`%${search}%`);
    }
    
    const result = await pool.query(query, values);
    return parseInt(result.rows[0].total, 10);
  }
}

module.exports = User;