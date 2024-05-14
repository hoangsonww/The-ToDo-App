import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import numpy as np

class DueDatePredictor:
    def __init__(self):
        self.model = LinearRegression()

    def train(self, data):
        X = data.drop(columns=['due_date'])
        y = data['due_date']
        x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        self.model.fit(x_train, y_train)
        predictions = self.model.predict(x_test)
        print("Mean Squared Error:", mean_squared_error(y_test, predictions))

    def predict_due_date(self, features):
        prediction = self.model.predict([features])
        return prediction[0]

def main():
    data = pd.read_csv('task_due_date_data.csv')
    predictor = DueDatePredictor()
    predictor.train(data)
    print(predictor.predict_due_date([feature_vector]))

if __name__ == "__main__":
    main()
