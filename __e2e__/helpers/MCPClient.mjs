import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { spawn } from 'child_process'

/**
 * Logging function
 * @param {any[]} args - Arguments to log
 */
function log(...args) {
  // if (process.env['VERBOSE']) {
  console.log(...args)
  //}
}
class MCPClient {
  constructor() {
    this.client = null
    this.transport = null
  }
  /**
   * Connect to the MCP server by spawning a process.
   * @param {string} serverCommand - The command to run the MCP server (e.g., 'node', 'python', 'npx').
   * @param {string[]} serverArgs - Arguments to pass to the server command.
   * @param {Object} env - Environment variables to set for the server process (merged with process.env).
   * @returns {Promise<import('child_process').ChildProcess>} The spawned server process.
   */
  async connect(serverCommand, serverArgs = [], env = {}) {
    try {
      log(
        `🔗 Connecting to MCP server: ${serverCommand} ${serverArgs.join(' ')}`
      )

      // Merge provided env with process.env, filtering out undefined values
      const mergedEnv = Object.fromEntries(
        Object.entries({ ...process.env, ...env })
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      )

      // Spawn the server process
      const serverProcess = spawn(serverCommand, serverArgs, {
        stdio: ['pipe', 'pipe', 'inherit'],
        env: mergedEnv,
      })

      // Create transport
      this.transport = new StdioClientTransport({
        command: serverCommand,
        args: serverArgs,
        env: mergedEnv,
      })

      // Create client
      this.client = new Client(
        {
          name: 'mcp-client',
          version: '1.0.0',
        },
        {
          capabilities: {},
        }
      )

      // Connect
      await this.client.connect(this.transport)
      log('✅ Connected to MCP server')

      return serverProcess
    } catch (error) {
      log('❌ Failed to connect to MCP server:', error)
      throw error
    }
  }

  async listTools() {
    if (!this.client) {
      throw new Error('Client not connected')
    }

    log('📋 Listing available tools...')
    const response = await this.client.listTools()

    log(`Found ${response.tools?.length || 0} tools:`)
    response.tools?.forEach((tool) => {
      log(`  - ${tool.name}`)
    })

    return response
  }

  async listResources() {
    if (!this.client) {
      throw new Error('Client not connected')
    }

    log('📚 Listing available resources...')
    const response = await this.client.listResources()

    log(`Found ${response.resources?.length || 0} resources:`)
    response.resources?.forEach((resource) => {
      log(`  - ${resource.uri}: ${resource.name || 'No name'}`)
    })

    return response
  }

  /**
   * Call a tool with the given name and arguments
   * @param {string} toolName - Name of the tool to call
   * @param {{[key: string]: unknown}} args - Arguments to pass to the tool
   * @returns {Promise<any>} - Tool response
   */
  async callTool(toolName, args = {}) {
    if (!this.client) {
      throw new Error('Client not connected')
    }

    log(`🔧 Calling tool: ${toolName} with args: ${JSON.stringify(args)}`)
    return this.client.callTool({
      name: toolName,
      arguments: args,
    })
  }

  /**
   * Read a resource by URI
   * @param {string} uri - URI of the resource to read
   * @returns {Promise<any>} - Resource data
   */
  async readResource(uri) {
    if (!this.client) {
      throw new Error('Client not connected')
    }

    log(`📖 Reading resource: ${uri}`)
    const request = { uri }

    const response = await this.client.readResource(request)

    log(`✅ Resource read completed for: ${uri}`)
    return response
  }

  async disconnect() {
    log('🔌 Starting MCP client disconnection...')

    // --- Close client ---
    if (this.client) {
      try {
        await this.client.close()
        log('✅ MCP client closed successfully')
      } catch (error) {
        log('⚠️ Error while closing MCP client:', error)
      } finally {
        // Ensure reference is cleared regardless of outcome
        this.client = null
      }
    }

    // --- Close transport ---
    if (this.transport) {
      try {
        if (typeof this.transport.close === 'function') {
          await this.transport.close()
        }
        log('✅ Transport closed successfully')
      } catch (error) {
        log('⚠️ Error while closing transport:', error)
      } finally {
        // Ensure reference is cleared regardless of outcome
        this.transport = null
      }
    }

    log('🔌 Disconnected from MCP server completely')
  }
}

export { MCPClient }
