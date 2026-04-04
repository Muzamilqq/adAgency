const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

// Seed script to populate database with mock data
const seedDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('Starting database seeding...');
    await client.query('BEGIN');
    
    // Hash password for demo user
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    // Insert demo users
    const usersResult = await client.query(`
      INSERT INTO users (email, password_hash, name, role)
      VALUES 
        ('admin@adagency.com', $1, 'Admin User', 'admin'),
        ('manager@adagency.com', $1, 'Manager User', 'manager'),
        ('viewer@adagency.com', $1, 'Viewer User', 'viewer')
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email, name, role
    `, [passwordHash]);
    console.log(`✓ Inserted ${usersResult.rowCount} users`);
    
    // Insert clients
    const clientsResult = await client.query(`
      INSERT INTO clients (name, industry, website, email)
      VALUES 
        ('Lumiere Skincare', 'Beauty & Personal Care', 'https://lumiere.com', 'marketing@lumiere.com'),
        ('TechFlow Inc', 'Technology', 'https://techflow.io', 'ads@techflow.io'),
        ('GreenLife Products', 'Consumer Goods', 'https://greenlife.com', 'marketing@greenlife.com'),
        ('FitPro Athletics', 'Sports & Fitness', 'https://fitpro.com', 'growth@fitpro.com'),
        ('LuxStay Hotels', 'Hospitality', 'https://luxstay.com', 'marketing@luxstay.com'),
        ('CryptoVault', 'Cryptocurrency', 'https://cryptovault.com', 'marketing@cryptovault.com'),
        ('OrganicEats', 'Food & Beverage', 'https://organiceats.com', 'hello@organiceats.com'),
        ('SmartHome Systems', 'Technology', 'https://smarthome.com', 'marketing@smarthome.com')
      ON CONFLICT DO NOTHING
      RETURNING id, name
    `);
    console.log(`✓ Inserted ${clientsResult.rowCount} clients`);
    
    // Get client IDs for campaigns
    const clients = await client.query('SELECT id, name FROM clients');
    const clientMap = {};
    clients.rows.forEach(c => clientMap[c.name] = c.id);
    
    // Get admin user ID
    const adminUser = await client.query("SELECT id FROM users WHERE email = 'admin@adagency.com'");
    const adminId = adminUser.rows[0]?.id;
    
    // Insert campaigns
    const campaignsData = [
      {
        name: 'Lumiere Summer Launch',
        client: 'Lumiere Skincare',
        status: 'active',
        budget: 50000,
        spend: 32450,
        impressions: 2400000,
        clicks: 48000,
        conversions: 1200,
        roas: 3.2,
        start_date: '2024-06-01',
        end_date: '2024-08-31',
      },
      {
        name: 'TechFlow SaaS Awareness',
        client: 'TechFlow Inc',
        status: 'active',
        budget: 75000,
        spend: 42100,
        impressions: 3800000,
        clicks: 76000,
        conversions: 950,
        roas: 2.8,
        start_date: '2024-05-15',
        end_date: '2024-11-15',
      },
      {
        name: 'GreenLife Eco Campaign',
        client: 'GreenLife Products',
        status: 'paused',
        budget: 30000,
        spend: 18750,
        impressions: 1200000,
        clicks: 24000,
        conversions: 480,
        roas: 2.1,
        start_date: '2024-04-01',
        end_date: '2024-06-30',
      },
      {
        name: 'FitPro Q3 Push',
        client: 'FitPro Athletics',
        status: 'completed',
        budget: 45000,
        spend: 44800,
        impressions: 2100000,
        clicks: 63000,
        conversions: 1890,
        roas: 4.5,
        start_date: '2024-07-01',
        end_date: '2024-09-30',
      },
      {
        name: 'LuxStay Hotel Promo',
        client: 'LuxStay Hotels',
        status: 'active',
        budget: 60000,
        spend: 28500,
        impressions: 1800000,
        clicks: 36000,
        conversions: 720,
        roas: 2.5,
        start_date: '2024-08-01',
        end_date: '2024-10-31',
      },
      {
        name: 'CryptoVault Launch',
        client: 'CryptoVault',
        status: 'draft',
        budget: 100000,
        spend: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        roas: 0,
        start_date: '2024-10-01',
        end_date: '2024-12-31',
      },
      {
        name: 'OrganicEats Delivery',
        client: 'OrganicEats',
        status: 'active',
        budget: 35000,
        spend: 22100,
        impressions: 1500000,
        clicks: 30000,
        conversions: 900,
        roas: 3.8,
        start_date: '2024-06-15',
        end_date: '2024-09-15',
      },
      {
        name: 'SmartHome Black Friday',
        client: 'SmartHome Systems',
        status: 'scheduled',
        budget: 80000,
        spend: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        roas: 0,
        start_date: '2024-11-01',
        end_date: '2024-11-30',
      },
    ];
    
    for (const campaign of campaignsData) {
      await client.query(`
        INSERT INTO campaigns 
          (name, client_id, status, budget, spend, impressions, clicks, conversions, roas, start_date, end_date, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT DO NOTHING
      `, [
        campaign.name,
        clientMap[campaign.client],
        campaign.status,
        campaign.budget,
        campaign.spend,
        campaign.impressions,
        campaign.clicks,
        campaign.conversions,
        campaign.roas,
        campaign.start_date,
        campaign.end_date,
        adminId,
      ]);
    }
    console.log(`✓ Inserted ${campaignsData.length} campaigns`);
    
    await client.query('COMMIT');
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nDemo credentials:');
    console.log('  Email: admin@adagency.com');
    console.log('  Password: admin123');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

seedDatabase();
