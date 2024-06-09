const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { HumanMessage } = require("@langchain/core/messages");

const classifyEmail = async (req, res, next) => {
  const { emails } = await req.body;

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-pro",
    maxOutputTokens: 2048,
    temperature: 0,
    apiKey: process.env.GOOGLE_API_KEY,
  });

  const snippets = emails.map((email) => {
    return email.snippet;
  });

  const prompt = `act as an email classifier. your work is to classify the emails based on its content. 
                    I will provide you the snippet of the email in an array where each element is a different snippet. 
                    You have to analyse the content and classify the email into following category: "IMPORTANT", "SPAM", "MARKETING", "SOCIAL", "GENERAL", "PROMOTION".
                    short description of each category are as follows:
                    "IMPORTANT" = Emails that are personal or work-related or any bills to be paid and require immediate attention
                    "PROMOTION" = Emails related to sales, discounts and marketing campaigns
                    "SOCIAL" = Emails from friends, social network ot family,
                    "MARKETING" = Emails related to marketing, newsletter and notification
                    "SPAM" = Unwanted or unsolicited emails
                    "GENERAL" = If none of the above matches, use GENERAL 
                    the output must be in json format. the output format is mentioned below. just give me the json output only.
                    to classify the email, use the "snippet" field of input array
                        output format:
                            [
                                {
                                    classification: ,
                                    snippet: ,
                                }
                            ]
                    `;

  const input2 = [
    new HumanMessage({
      content: [
        {
          type: "text",
          text: prompt,
        },
        {
          type: "text",
          text: `here is the actual snippet array: ${snippets}. provide the output based on this array input`,
        },
      ],
    }),
  ];

  try {

    const response = await model.invoke(input2)
    console.log(response.content);
    return res.status(200).json({data : JSON.parse(response.content.slice(response.content.indexOf("["), response.content.lastIndexOf("]")+1)), success: true})

  } catch (error) {
    console.log(error.message);
    
    return res.status(500).json({ error: error.message });
  }
};

module.exports = classifyEmail