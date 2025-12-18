import { Client } from "@gradio/client";

export class HFSpaceClient {
  async generateNFTImage(prompt: string): Promise<string> {
    const client = await Client.connect("stabilityai/stable-diffusion");
    
    const result = await client.predict("/predict", {
      prompt,
      negative_prompt: NFTConfig.negativePrompt,
      steps: 20,
    });

    return result.data[0].url;
  }
}