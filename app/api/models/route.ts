import openai from "../model";

export async function GET(){
  const response = await openai.models.list();
  return Response.json(response);
}
  