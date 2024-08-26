import axios from "axios";

const SphereEngineToken = "7521e84d3a76bb1f44e3327555eb2a50"; // Replace with your actual Sphere Engine API token
const SphereEngineURL = "https://f5972e91.compilers.sphere-engine.com/api/v4";

export const executeCode = async (language, code, input) => {
  try {
    // Step 2: Creating a submission
    const createSubmissionResponse = await axios.post(
      `${SphereEngineURL}/submissions?access_token=${SphereEngineToken}`,
      {
        compilerId: language, // Sphere Engine uses compiler IDs, map your language to the appropriate compiler ID
        source: code,
        input: input,
      }
    );

    const submissionId = createSubmissionResponse.data.id;

    // Step 3: Checking the result
    const result = await axios.get(
      `${SphereEngineURL}/submissions/${submissionId}?access_token=${SphereEngineToken}`
    );

    return result.data;
  } catch (error) {
    console.error("Error executing code:", error);
    throw error;
  }
};
