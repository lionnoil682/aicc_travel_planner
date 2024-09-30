import os
import sys
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# .env에서 OpenAI API 키 불러오기
from dotenv import load_dotenv
load_dotenv()

# OpenAI API 키 설정
openai_api_key = os.getenv("OPENAI_API_KEY")

# LangChain 설정
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=1)

# 검색할 레고 제품 입력
search_query = sys.argv[1] if len(sys.argv) > 1 else "Star Wars"

# Chrome WebDriver 설정
chrome_options = Options()
chrome_options.add_argument("--headless")  # 브라우저 창을 띄우지 않음
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
service = Service(executable_path="/path/to/chromedriver")  # chromedriver 경로 설정

driver = webdriver.Chrome(service=service, options=chrome_options)

# 레고 공식 웹사이트로 이동
driver.get("https://www.lego.com/ko-kr")

# 검색창을 찾고 검색어 입력 후 엔터
search_box = driver.find_element(By.NAME, "q")  # 검색창의 HTML name 속성 사용
search_box.send_keys(search_query)
search_box.send_keys(Keys.RETURN)

# 검색 결과 페이지 로드 대기
time.sleep(3)

# 페이지 소스 가져오기
page_source = driver.page_source

# BeautifulSoup으로 HTML 파싱
soup = BeautifulSoup(page_source, "html.parser")

# 검색 결과에서 제품 정보 추출 (예: 제품명과 가격)
products = soup.find_all("div", class_="ProductGridstyles__ProductItem")

if products:
    results = []
    for product in products[:5]:  # 상위 5개 제품만 추출
        product_name = product.find("span", class_="ProductGridstyles__Title").text.strip()
        product_price = product.find("span", class_="ProductPricingstyles__Price").text.strip()
        results.append(f"Product: {product_name}, Price: {product_price}")
else:
    results = ["No products found."]

driver.quit()  # 드라이버 종료

# LangChain으로 요약 및 답변 생성
prompt_template = """
당신은 레고 제품을 검색하여 사용자에게 정보를 제공하는 AI 어시스턴트입니다.
다음은 레고 검색 결과입니다:

{results}

사용자가 질문한 레고 제품에 대해 3줄 이내로 요약된 답변을 제공하세요.
"""

prompt = PromptTemplate.from_template(prompt_template)

rag_chain = (
    {"results": "\n".join(results), "question": search_query}
    | prompt
    | llm
    | StrOutputParser()
)

answer = rag_chain.invoke({"question": search_query, "results": "\n".join(results)})
print(answer)