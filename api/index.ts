import app from '../server';

export default async function handler(req: any, res: any) {
  try {
    console.log(`[Vercel API Gateway] Routing URL: ${req.url} | Method: ${req.method} | Path: ${req.path}`);
    
    // Forward the request to the Express application instance
    return app(req, res);
  } catch (error: any) {
    console.error("[Vercel API Handler Exception]:", error);
    return res.status(500).json({
      error: "Vercel Serverless Function Crash",
      message: error?.message || 'Unknown error inside lambda handler',
      stack: error?.stack,
      name: error?.name,
      code: error?.code
    });
  }
}
