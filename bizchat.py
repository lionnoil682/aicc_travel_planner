from flask import Flask, request, jsonify
import os
import time
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv

# .env 파일에서 OpenAI API 키 로드
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

# OpenAI 및 LangChain 설정
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=1)

app = Flask(__name__)

def search_lego_products(search_query):
    # Chrome WebDriver 설정
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    service = Service(executable_path="/path/to/chromedriver")  # 자신의 chromedriver 경로로 수정
    driver = webdriver.Chrome(service=service, options=chrome_options)

    try:
        # 레고 공식 웹사이트로 이동
        driver.get("https://www.lego.com/ko-kr")

        # 검색창을 찾고 검색어 입력 후 엔터
        search_box = driver.find_element(By.NAME, "q")
        search_box.send_keys(search_query)
        search_box.send_keys(Keys.RETURN)

        # 검색 결과 페이지 로드 대기
        time.sleep(3)

        # 페이지 소스 가져오기
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, "html.parser")

        # 검색 결과에서 제품 정보 추출 (예: 제품명과 가격)
        products = soup.find_all("div", class_="ProductGridstyles__ProductItem")
        results = []
        if products:
            for product in products[:5]:  # 상위 5개 제품만 추출
                product_name = product.find("span", class_="ProductGridstyles__Title").text.strip()
                product_price = product.find("span", class_="ProductPricingstyles__Price").text.strip()
                results.append({"name": product_name, "price": product_price})
        else:
            results = [{"message": "No products found."}]
    except Exception as e:
        return {"error": str(e)}
    finally:
        driver.quit()  # 드라이버 종료

    return results

def summarize_lego_products(results, search_query):
    # LangChain을 사용하여 제품 요약 생성
    prompt_template = """
    당신은 레고 제품을 검색하여 사용자에게 정보를 제공하는 AI 어시스턴트입니다.
    다음은 레고 검색 결과입니다:

    {results}

    사용자가 질문한 레고 제품에 대해 3줄 이내로 요약된 답변을 제공하세요.
    """

    prompt = PromptTemplate.from_template(prompt_template)
    rag_chain = (
        {"results": "\n".join([f"{p['name']}: {p['price']}" for p in results]), "question": search_query}
        | prompt
        | llm
        | StrOutputParser()
    )

    answer = rag_chain.invoke({"question": search_query, "results": "\n".join([f"{p['name']}: {p['price']}" for p in results])})
    return answer

@app.route('/search', methods=['POST'])
def search():
    data = request.json
    search_query = data.get('query', '')
    
    if not search_query:
        return jsonify({"error": "No search query provided"}), 400
    
    # 레고 제품 검색
    products = search_lego_products(search_query)
    
    if "error" in products:
        return jsonify({"error": products["error"]}), 500
    
    # LangChain을 통해 검색 결과 요약
    summary = summarize_lego_products(products, search_query)
    
    return jsonify({"query": search_query, "products": products, "summary": summary})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)