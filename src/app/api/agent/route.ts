
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import tool from "../tools/loadData";
import { llm } from "../(models)/model";

// model 
// Define the tools for the agent to use

const agentCheckpointer = new MemorySaver();
const agent = createReactAgent({
  llm,
  tools: tool,
  checkpointSaver: agentCheckpointer,
});

export default agent;