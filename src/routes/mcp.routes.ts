import { Router } from 'express';
import { MCPController } from '../controllers/mcp.controller';

const router = Router();
const mcpController = new MCPController();

/**
 * MCP Routes
 * Handles all Model Context Protocol related endpoints
 */

// Initialize a new conversation
router.post('/conversation', 
  (req, res) => mcpController.initializeConversation(req, res)
);

// Send a message in an existing conversation
router.post('/conversation/:contextId/message',
  (req, res) => mcpController.sendMessage(req, res)
);

// Get conversation history
router.get('/conversation/:contextId/history',
  (req, res) => mcpController.getConversationHistory(req, res)
);

export default router; 