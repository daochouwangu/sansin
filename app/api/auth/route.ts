import openai from "../model";

export async function GET(request: Request){
  const code = request.headers.get('Authorization');
  return Response.json({ ok: code === 'docschina777'});
}
  