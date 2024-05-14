import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics import accuracy_score

class TaskCategorizer:
    def __init__(self):
        self.vectorizer = CountVectorizer()
        self.model = MultinomialNB()

    def train(self, data):
        x_train, x_test, y_train, y_test = train_test_split(data['task'], data['category'], test_size=0.2)
        x_train_counts = self.vectorizer.fit_transform(x_train)
        self.model.fit(x_train_counts, y_train)
        x_test_counts = self.vectorizer.transform(x_test)
        predictions = self.model.predict(x_test_counts)
        print("Accuracy:", accuracy_score(y_test, predictions))

    def categorize(self, task):
        task_count = self.vectorizer.transform([task])
        category = self.model.predict(task_count)
        return category[0]

def main():
    data = pd.read_csv('task_data.csv')
    categorizer = TaskCategorizer()
    categorizer.train(data)
    print(categorizer.categorize("Buy groceries"))

if __name__ == "__main__":
    main()