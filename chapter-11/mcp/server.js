import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { MongoClient } from 'mongodb';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

// Load keys from .env file
dotenv.config();

const server = new Server(
  { name: 'real-data-mcp-server', version: '1.0.0' },
  { capabilities: { tools: {} } },
);

// Define tools for Copilot to see
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'listMongoDatabases',
        description: 'Connects to MongoDB and lists all available databases.',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'listGitHubRepos',
        description:
          'Fetches a list of public and private repositories for the authenticated user.',
        inputSchema: { type: 'object', properties: {} },
      },
    ],
  };
});

// Execute the requested tool logic
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;

  try {
    // ---- 1. MONGODB TOOL ----
    if (name === 'listMongoDatabases') {
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();

      const dbList = await client.db().admin().listDatabases();
      await client.close();

      const names = dbList.databases.map((db) => db.name).join(', ');
      return {
        content: [{ type: 'text', text: `🗄️ MongoDB Databases found: ${names}` }],
      };
    }

    // ---- 2. GITHUB TOOL ----
    if (name === 'listGitHubRepos') {
      const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
      const { data } = await octokit.repos.listForAuthenticatedUser({ per_page: 10 });

      const repoNames = data.map((repo) => repo.full_name).join('\n');
      return {
        content: [{ type: 'text', text: `🐙 Recent GitHub Repositories:\n${repoNames}` }],
      };
    }
  } catch (error) {
    return {
      isError: true,
      content: [{ type: 'text', text: `❌ Tool Error: ${error.message}` }],
    };
  }

  throw new Error(`Tool ${name} not found`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Real Data MCP Server running...');
