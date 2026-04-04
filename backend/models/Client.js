const { pool } = require('../config/database');

// Client model - handles all client-related database operations
class Client {
  // Find client by ID
  static async findById(id) {
    const result = await pool.query(
      `SELECT * FROM clients 
       WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return result.rows[0] || null;
  }

  // List all clients with optional filters
  static async list({
    search,
    sortBy = 'name',
    sortOrder = 'asc',
    page = 1,
    limit = 50,
  } = {}) {
    let whereClause = 'WHERE deleted_at IS NULL';
    const values = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR industry ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    const allowedSortColumns = ['name', 'industry', 'created_at'];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'name';
    const safeSortOrder = sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM clients ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    // Get clients
    const query = `
      SELECT c.*,
        (SELECT COUNT(*) FROM campaigns WHERE client_id = c.id AND deleted_at IS NULL) as campaign_count,
        (SELECT COALESCE(SUM(spend), 0) FROM campaigns WHERE client_id = c.id AND deleted_at IS NULL) as total_spend
      FROM clients c
      ${whereClause}
      ORDER BY c.${safeSortBy} ${safeSortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    return {
      data: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Create new client
  static async create({
    name,
    industry,
    website,
    email,
    phone,
    address,
  }) {
    const result = await pool.query(
      `INSERT INTO clients (name, industry, website, email, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, industry, website, email, phone, address]
    );
    return result.rows[0];
  }

  // Update client
  static async update(id, updates) {
    const allowedUpdates = ['name', 'industry', 'website', 'email', 'phone', 'address'];
    
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedUpdates.includes(key) && value !== undefined) {
        setClause.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (setClause.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE clients 
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Soft delete client
  static async softDelete(id) {
    const result = await pool.query(
      `UPDATE clients 
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [id]
    );
    return result.rows[0] || null;
  }

  // Restore soft-deleted client
  static async restore(id) {
    const result = await pool.query(
      `UPDATE clients 
       SET deleted_at = NULL
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }

  // Get client's campaigns
  static async getCampaigns(clientId) {
    const result = await pool.query(
      `SELECT * FROM campaigns 
       WHERE client_id = $1 AND deleted_at IS NULL
       ORDER BY created_at DESC`,
      [clientId]
    );
    return result.rows;
  }
}

module.exports = Client;
