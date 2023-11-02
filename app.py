from flask import Flask, render_template
from xata import XataClient

app = Flask(__name__, template_folder="templates", static_folder="static")


# @app.route('/')
def hello():
    xata = XataClient(db_url="https://Mark-H-s-workspace-128v6h.eu-west-1.xata.sh/db/db1", api_key="xau_4f0ccbfvA1fHvQ35Kz93uQcod9eejCTr0")
    a = xata.records().insert("travellers", {
        "email": "test@gmail.com",
        "name": "alex"
    })
    print(a)

    b = xata.records().insert("travellers", {
        "name": "John"
    })
    print(b)

    print(xata.data().query("travellers",{
  "page": {
    "size": 26
  }}))

    return render_template('index.html')

if __name__ == '__main__':
    hello()
    app.run()
