const { pool } = require('../config/database');

// Campaign model - handles all campaign-related database operations
class Campaign {
  // Find campaign by ID
  static async findById(id) {
    const result = await pool.query(
      `SELECT c.*, cl.name as client_name
       FROM campaigns c
       LEFT JOIN clients cl ON c.client_id = cl.id
       WHERE c.id = $1 AND c.deleted_at IS NULL`,
      [id]
    );
    return result.rows[0] || null;
  }

  // List all campaigns with filters, sorting, and pagination
  static async list({
    status,
    clientId,
    search,
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    limit = 50,
  } = {}) {
    let whereClause = 'WHERE c.deleted_at IS NULL';
    const values = [];
    let paramIndex = 1;

    if (status) {
      whereClause += ` AND c.status = $${paramIndex}`;
      values.push(status);
      paramIndex++;
    }

    if (clientId) {
      whereClause += ` AND c.client_id = $${paramIndex}`;
      values.push(clientId);
      paramIndex++;
    }

    if (search) {
      whereClause += ` AND (c.name ILIKE $${paramIndex} OR cl.name ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    // Validate sort column to prevent SQL injection
    const allowedSortColumns = ['name', 'status', 'budget', 'spend', 'created_at', 'start_date', 'end_date', 'roas'];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM campaigns c
       LEFT JOIN clients cl ON c.client_id = cl.id
       ${whereClause}`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    // Get campaigns
    const query = `
      SELECT c.*, cl.name as client_name
      FROM campaigns c
      LEFT JOIN clients cl ON c.client_id = cl.id
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

  // Create new campaign
  static async create({
    name,
    clientId,
    status = 'draft',
    budget = 0,
    spend = 0,
    impressions = 0,
    clicks = 0,
    conversions = 0,
    roas = 0,
    startDate,
    endDate,
    description,
    createdBy,
  }) {
    const result = await pool.query(
      `INSERT INTO campaigns 
        (name, client_id, status, budget, spend, impressions, clicks, conversions, roas, start_date, end_date, description, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [name, clientId, status, budget, spend, impressions, clicks, conversions, roas, startDate, endDate, description, createdBy]
    );
    return result.rows[0];
  }

  // Update campaign
  static async update(id, updates) {
    const allowedUpdates = [
      'name', 'client_id', 'status', 'budget', 'spend',
      'impressions', 'clicks', 'conversions', 'roas',
      'start_date', 'end_date', 'description'
    ];
    
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
      UPDATE campaigns 
      SET ${setClause.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Soft delete campaign
  static async softDelete(id) {
    const result = await pool.query(
      `UPDATE campaigns 
       SET deleted_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [id]
    );
    return result.rows[0] || null;
  }

  // Hard delete campaign (use with caution)
  static async hardDelete(id) {
    const result = await pool.query(
      'DELETE FROM campaigns WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0] || null;
  }

  // Restore soft-deleted campaign
  static async restore(id) {
    const result = await pool.query(
      `UPDATE campaigns 
       SET deleted_at = NULL
       WHERE id = $1
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }

  // Get campaign statistics
  static async getStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'active' AND deleted_at IS NULL) as active_count,
        COUNT(*) FILTER (WHERE status = 'paused' AND deleted_at IS NULL) as paused_count,
        COUNT(*) FILTER (WHERE status = 'completed' AND deleted_at IS NULL) as completed_count,
        COUNT(*) FILTER (WHERE status = 'draft' AND deleted_at IS NULL) as draft_count,
        COUNT(*) FILTER (WHERE status = 'scheduled' AND deleted_at IS NULL) as scheduled_count,
        SUM(budget) FILTER (WHERE deleted_at IS NULL) as total_budget,
        SUM(spend) FILTER (WHERE deleted_at IS NULL) as total_spend
      FROM campaigns
    `);
    return result.rows[0];
  }

  // Add daily performance data
  static async addPerformance(campaignId, { date, impressions, clicks, conversions, spend }) {
    const result = await pool.query(
      `INSERT INTO campaign_performance 
        (campaign_id, date, impressions, clicks, conversions, spend)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (campaign_id, date) 
       DO UPDATE SET
        impressions = EXCLUDED.impressions,
        clicks = EXCLUDED.clicks,
        conversions = EXCLUDED.conversions,
        spend = EXCLUDED.spend
       RETURNING *`,
      [campaignId, date, impressions, clicks, conversions, spend]
    );
    return result.rows[0];
  }

  // Get campaign performance data
  static async getPerformance(campaignId, startDate, endDate) {
    const result = await pool.query(
      `SELECT * FROM campaign_performance
       WHERE campaign_id = $1 AND date BETWEEN $2 AND $3
       ORDER BY date ASC`,
      [campaignId, startDate, endDate]
    );
    return result.rows;
  }
}

module.exports = Campaign;
