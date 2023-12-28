from transformers import pipeline

class ChatbotEnhancer:
    def __init__(self):
        self.generator = pipeline('text-generation', model='distilgpt2')

    def get_response(self, prompt):
        responses = self.generator(prompt, max_length=50, num_return_sequences=1)
        return responses[0]['generated_text']

def main():
    enhancer = ChatbotEnhancer()
    print(enhancer.get_response("How can I categorize my tasks?"))

if __name__ == "__main__":
    main()
