interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Swiss National Bank (SNB) data portal MCP. Keyless.
 *
 * SNB organizes its statistics into "cubes" identified by a cubeId. There is no
 * reliable machine-readable cube discovery endpoint (the portal's catalog paths
 * return the SPA HTML, not JSON), so callers pick from documented cube IDs below.
 *
 * Verified-live cube IDs (data + dimensions both return 200 JSON):
 *   - devkua     Foreign exchange rates (CHF per foreign currency)
 *   - zimoma     Money market / reference rates incl. SARON (SNB policy-relevant)
 *   - rendoblid  Spot interest rates for Swiss Confederation & euro bond issues (yield curve)
 *   - snbmonagg  Monetary aggregates (M1/M2/M3, currency in circulation)
 */


const BASE = 'https://data.snb.ch/api';
const UA = 'pipeworx-mcp-snb-ch/1.0 (+https://pipeworx.io)';

const KNOWN_CUBES =
  'devkua = foreign exchange rates (CHF per currency); zimoma = money market & reference rates incl. SARON; rendoblid = Confederation/euro bond spot interest rates (yield curve); snbmonagg = monetary aggregates (M1/M2/M3, currency in circulation).';

const tools: McpToolExport['tools'] = [
  {
    name: 'get_cube',
    description:
      "Fetch a Swiss National Bank statistical data cube's time series as JSON. " +
      'Cube discovery is limited — pick a cubeId from these documented, verified-live IDs: ' +
      KNOWN_CUBES +
      ' Defaults to devkua (FX rates).',
    inputSchema: {
      type: 'object',
      properties: {
        cubeId: {
          type: 'string',
          description: 'SNB cube ID, e.g. "devkua", "zimoma", "rendoblid", "snbmonagg". Default "devkua".',
        },
      },
    },
  },
  {
    name: 'cube_structure',
    description:
      "Fetch a Swiss National Bank cube's dimensions/structure (the dimension items / series keys " +
      'available within the cube). Use this to understand what a cube contains before/after calling get_cube. ' +
      'Verified-live cube IDs: ' +
      KNOWN_CUBES +
      ' Defaults to devkua (FX rates).',
    inputSchema: {
      type: 'object',
      properties: {
        cubeId: {
          type: 'string',
          description: 'SNB cube ID, e.g. "devkua", "zimoma", "rendoblid", "snbmonagg". Default "devkua".',
        },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_cube':
      return snbGet(`/cube/${cubeId(args)}/data/json/en`);
    case 'cube_structure':
      return snbGet(`/cube/${cubeId(args)}/dimensions/en`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function snbGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (!res.ok) throw new Error(`SNB: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function cubeId(args: Record<string, unknown>): string {
  const v = args.cubeId;
  const id = typeof v === 'string' && v.trim() ? v.trim() : 'devkua';
  return encodeURIComponent(id);
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
