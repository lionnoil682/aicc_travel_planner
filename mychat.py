import os
import requests
from bs4 import BeautifulSoup
from flask import Flask, request, jsonify
import openai
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Flask 애플리케이션 초기화
app = Flask(__name__)

def fetch_player_market_values(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # 선수 데이터 추출
    player_data = []
    player_rows = soup.select('table.items tbody tr')
    
    for row in player_rows:
        name = row.select_one('td.no-border-right a').text.strip()
        market_value = row.select_one('td.right[data-sort-value]').text.strip()
        player_data.append({'name': name, 'market_value': market_value})

    return player_data

def ask_openai(question, player_data):
    context = "\n".join([f"{player['name']}의 시장 가치는 {player['market_value']}." for player in player_data])
    prompt = f"""당신은 질문-답변(Question-Answering)을 수행하는 친절한 AI 어시스턴트입니다. 
    주어진 문맥(context) 에서 주어진 질문(question) 에 답하는 것입니다.
    
    #Context:
    {context}

    #Question:
    {question}

    #Answer:"""
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message['content']

# API 엔드포인트 설정
@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.json
    question = data.get('question', '')

    if not question:
        return jsonify({'error': '질문을 입력하세요.'}), 400

    url = "https://www.transfermarkt.co.kr/navigation/marktwerte"
    player_data = fetch_player_market_values(url)

    # 질문에 대한 응답 생성
    answer = ask_openai(question, player_data)
    
    return jsonify({'answer': answer})

# 서버 실행
if __name__ == "__main__":
    app.run(port=8080)  # 포트 8080으로 설정