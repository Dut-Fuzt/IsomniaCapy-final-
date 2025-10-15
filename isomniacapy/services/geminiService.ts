import { GoogleGenAI } from "@google/genai";
import { SurveyData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const summarizeSurvey = async (data: SurveyData): Promise<string> => {
  try {
    const problemsText = data.problems.length > 0 ? data.problems.join(', ') : 'none specified';
    const otherProblemText = data.otherProblem ? ` and specifically '${data.otherProblem}'` : '';
    const needsText = data.needs.join(', ');
    const otherNeedText = data.otherNeed ? ` and also '${data.otherNeed}'` : '';
    
    const prompt = `A student has provided their information. Age: ${data.age}. Grade: ${data.grade || 'not specified'}.
Current learning problems: ${problemsText}${otherProblemText}.
Their needs are: ${needsText}${otherNeedText}.

Please summarize this information in a friendly, conversational tone as a chatbot in Vietnamese. Start with something like "Okay, let me quickly summarize what you've told me!". Address the user directly and end by asking if the summary is correct and if they want to add or change anything.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error summarizing survey:", error);
    return "I had a little trouble processing that. Could you please confirm your details? You mentioned being in the age group " + data.age + " and your needs are " + data.needs.join(', ') + ". Is that correct?";
  }
};


export const getConsultationResponse = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], newMessage: string, systemInstruction: string): Promise<string> => {
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history,
            config: {
                systemInstruction: systemInstruction
            }
        });
        const response = await chat.sendMessage({ message: newMessage });
        return response.text;

    } catch (error) {
        console.error("Error getting consultation response:", error);
        return "I'm having a bit of trouble connecting right now. Please try again in a moment.";
    }
};

export const getStudyMethods = async (topic: string): Promise<string> => {
    try {
        const prompt = `A student wants to find effective study methods for the following topic: "${topic}". 
Please suggest 2-3 suitable learning techniques in Vietnamese. For each technique, provide:
1. A clear, concise name for the method.
2. A brief definition or concept.
3. A simple, step-by-step guide on how to apply it to their topic.
4. The key benefits of using this method.

Format the response in a clear, easy-to-read way, perhaps using markdown for headings and lists.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting study methods:", error);
        return "Sorry, I couldn't fetch study methods at the moment. Please check your input and try again.";
    }
};

export const analyzeBehavior = async (tableData: string, userSolution: string | null): Promise<string> => {
    try {
        let prompt: string;
        if (userSolution === null) {
            prompt = `A student has tracked their electronic device usage. Here is the data in a CSV-like format:\n"Device, Start Time, End Time, Duration, Benefits, Feeling After"\n${tableData}\n
Analyze this data and provide some neutral, non-judgmental observations about their habits in Vietnamese. Do not give any solutions or advice yet.
Instead, end your response by asking the user a reflective question like: "Seeing this laid out, what are your thoughts on your device usage patterns, and what is one small change you think you could make?"`;
        } else {
            prompt = `A student has tracked their electronic device usage. Here is the data:\n${tableData}\n
They have proposed the following solution to improve their habits: "${userSolution}"
First, positively acknowledge their idea and evaluate its potential effectiveness in Vietnamese. Then, suggest 1 or 2 additional, complementary strategies they could try. Frame your suggestions as friendly advice.`;
        }
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error analyzing behavior:", error);
        return "I'm having some trouble analyzing the data. Please ensure it's formatted correctly and try again.";
    }
};
