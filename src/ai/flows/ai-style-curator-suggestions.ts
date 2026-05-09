'use server';
/**
 * @fileOverview An AI style curator that provides personalized clothing suggestions from the Viloryi collection.
 *
 * - aiStyleCuratorSuggestions - A function that handles the AI style curation process.
 * - AIStyleCuratorSuggestionsInput - The input type for the aiStyleCuratorSuggestions function.
 * - AIStyleCuratorSuggestionsOutput - The return type for the aiStyleCuratorSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIStyleCuratorSuggestionsInputSchema = z.object({
  stylePreference: z.string().optional().describe("User's preferred style (e.g., 'boho-chic', 'minimalist', 'classic')."),
  occasion: z.string().optional().describe("The occasion for which the clothing is needed (e.g., 'casual day out', 'evening party', 'office wear')."),
  currentWardrobeDescription: z.string().optional().describe("A brief description of what the user already has or prefers to avoid."),
  clothingTypePreference: z.array(z.enum(["Kurti Sets", "Kurtis", "Co-ord Sets"])).optional().describe("Specific clothing types the user is interested in.")
});
export type AIStyleCuratorSuggestionsInput = z.infer<typeof AIStyleCuratorSuggestionsInputSchema>;

const AIStyleCuratorSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.object({
    title: z.string().describe("A brief title for the clothing suggestion."),
    description: z.string().describe("A detailed description of the suggested combination or piece, highlighting its style and suitability for the preferences/occasion."),
    items: z.array(z.string()).describe("Names of specific items suggested from the Viloryi collection."),
    reasoning: z.string().describe("Explanation of why this suggestion was made based on the input preferences.")
  })).describe("A list of personalized clothing suggestions from the Viloryi collection.")
});
export type AIStyleCuratorSuggestionsOutput = z.infer<typeof AIStyleCuratorSuggestionsOutputSchema>;

export async function aiStyleCuratorSuggestions(input: AIStyleCuratorSuggestionsInput): Promise<AIStyleCuratorSuggestionsOutput> {
  return aiStyleCuratorFlow(input);
}

const styleCuratorPrompt = ai.definePrompt({
  name: 'styleCuratorPrompt',
  input: { schema: AIStyleCuratorSuggestionsInputSchema },
  output: { schema: AIStyleCuratorSuggestionsOutputSchema },
  prompt: `You are an expert fashion stylist for "Viloryi", a premium, luxury, minimal, and new-age women's clothing brand.\nYour goal is to provide personalized clothing suggestions (combinations or individual pieces) from Viloryi's collection based on the user's preferences.\nViloryi's collection primarily features: Kurti Sets, Kurtis, and Co-ord Sets.\n\nConsider the following user preferences:\n{{#if stylePreference}}\nStyle Preference: {{{stylePreference}}}\n{{/if}}\n{{#if occasion}}\nOccasion: {{{occasion}}}\n{{/if}}\n{{#if currentWardrobeDescription}}\nCurrent Wardrobe/Preferences to Consider: {{{currentWardrobeDescription}}}\n{{/if}}\n{{#if clothingTypePreference}}\nPreferred Clothing Types: {{#each clothingTypePreference}}- {{{this}}}\n{{/each}}\n{{/if}}\n\nBased on these details, suggest 1-3 distinct clothing options from Viloryi's collection. For each suggestion, provide a title, a detailed description, list the suggested items (use descriptive names for Viloryi items), and explain your reasoning. Ensure the suggestions align with Viloryi's brand aesthetic (luxury, minimal, new-age) and product categories.\n\nMake sure your output strictly adheres to the JSON schema provided.`
});

const aiStyleCuratorFlow = ai.defineFlow(
  {
    name: 'aiStyleCuratorFlow',
    inputSchema: AIStyleCuratorSuggestionsInputSchema,
    outputSchema: AIStyleCuratorSuggestionsOutputSchema,
  },
  async (input) => {
    const { output } = await styleCuratorPrompt(input);
    return output!;
  }
);
