const Campaign = require('../models/Campaign');

// Campaign Controller
const campaignController = {
  // List all campaigns with filters, sorting, and pagination
  list: async (req, res) => {
    try {
      const {
        status,
        clientId,
        search,
        sortBy,
        sortOrder,
        page = 1,
        limit = 50,
      } = req.query;

      const result = await Campaign.list({
        status,
        clientId,
        search,
        sortBy,
        sortOrder,
        page: parseInt(page),
        limit: parseInt(limit),
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('List campaigns error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  },

  // Get single campaign by ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const campaign = await Campaign.findById(id);

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found.',
        });
      }

      res.json({
        success: true,
        data: campaign,
      });
    } catch (error) {
      console.error('Get campaign error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  },

  // Create new campaign
  create: async (req, res) => {
    try {
      const campaignData = {
        ...req.body,
        createdBy: req.user.id,
      };

      const campaign = await Campaign.create(campaignData);

      res.status(201).json({
        success: true,
        data: campaign,
        message: 'Campaign created successfully.',
      });
    } catch (error) {
      console.error('Create campaign error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  },

  // Update campaign
  update: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if campaign exists
      const existingCampaign = await Campaign.findById(id);
      if (!existingCampaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found.',
        });
      }

      const campaign = await Campaign.update(id, req.body);

      res.json({
        success: true,
        data: campaign,
        message: 'Campaign updated successfully.',
      });
    } catch (error) {
      console.error('Update campaign error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  },

  // Soft delete campaign
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if campaign exists
      const existingCampaign = await Campaign.findById(id);
      if (!existingCampaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found.',
        });
      }

      await Campaign.softDelete(id);

      res.json({
        success: true,
        message: 'Campaign deleted successfully.',
      });
    } catch (error) {
      console.error('Delete campaign error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  },

  // Restore soft-deleted campaign
  restore: async (req, res) => {
    try {
      const { id } = req.params;
      
      const campaign = await Campaign.restore(id);
      
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found.',
        });
      }

      res.json({
        success: true,
        data: campaign,
        message: 'Campaign restored successfully.',
      });
    } catch (error) {
      console.error('Restore campaign error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  },

  // Get campaign statistics
  getStats: async (req, res) => {
    try {
      const stats = await Campaign.getStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Get campaign stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  },

  // Add campaign performance data
  addPerformance: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check if campaign exists
      const existingCampaign = await Campaign.findById(id);
      if (!existingCampaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found.',
        });
      }

      const performance = await Campaign.addPerformance(id, req.body);

      res.status(201).json({
        success: true,
        data: performance,
        message: 'Performance data added successfully.',
      });
    } catch (error) {
      console.error('Add performance error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  },

  // Get campaign performance data
  getPerformance: async (req, res) => {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;
      
      // Check if campaign exists
      const existingCampaign = await Campaign.findById(id);
      if (!existingCampaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found.',
        });
      }

      const performance = await Campaign.getPerformance(id, startDate, endDate);

      res.json({
        success: true,
        data: performance,
      });
    } catch (error) {
      console.error('Get performance error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  },
};

module.exports = campaignController;
