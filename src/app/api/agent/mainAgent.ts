
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { llm as mainModel } from "../(models)/model";
import tools from "../tools/loadData";


const agentCheckpointer = new MemorySaver();


const agent = createReactAgent({
  llm: mainModel,
  tools: tools,
  checkpointSaver: agentCheckpointer,
});

export default agent;