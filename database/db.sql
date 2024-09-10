-- users 테이블 생성
CREATE TABLE users (
    user_idx SERIAL PRIMARY KEY,  -- 자동 증가하는 기본 키
    user_id VARCHAR(50) NOT NULL UNIQUE,  -- 사용자 ID, 고유해야 함
    user_pw VARCHAR(255) NOT NULL,  -- 사용자 비밀번호
    user_name VARCHAR(100) NOT NULL,  -- 사용자 이름
    user_birthday DATE NOT NULL,  -- 사용자 생일
    user_email VARCHAR(255) NOT NULL UNIQUE,  -- 사용자 이메일, 고유해야 함
    user_phonenum VARCHAR(20) NOT NULL UNIQUE  -- 사용자 전화번호, 고유해야 함
);

수정된 users

CREATE TABLE users (
	user_idx SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- travel_project 테이블 생성 최종
CREATE TABLE travel_project (
    project_idx SERIAL PRIMARY KEY,  		-- 자동 증가하는 기본 키
    user_idx INT,  							-- users 테이블과 조인 컬럼 (외래키 X - 제약 조건이 많음)
    project_title VARCHAR(255),  			-- 프로젝트 제목
	project_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 프로젝트 생성일 (자동 생성)
	start_date DATE NOT NULL,  -- 프로젝트 시작일
    end_date DATE NOT NULL,  -- 프로젝트 종료일
	update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 프로젝트 업데이트 날짜
    planner_title VARCHAR(255),  -- 플래너 제목
    planner_description TEXT,  -- 플래너 설명
    planner_date DATE,  -- 플래너 생성일
    planner_update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- 플래너 업데이트 날짜
	planner_img TEXT  -- 플래너 이미지 URL 또는 경로
);

-- user_idx 1에 대한 10개의 데이터
INSERT INTO travel_project (user_idx, project_title, start_date, end_date, planner_title, planner_description, planner_date, planner_img)
VALUES
(1, '서울', '2024-09-01', '2024-09-05', '서울 여행', '서울의 명소를 탐방', '2024-09-01', 'seoul.jpg'),
(1, '부산', '2024-09-10', '2024-09-12', '부산 여행', '해운대와 광안리를 즐기다', '2024-09-10', 'busan.jpg'),
(1, '경주', '2024-09-15', '2024-09-17', '경주 역사 투어', '역사적인 장소 방문', '2024-09-15', 'gyeongju.jpg'),
(1, '제주도', '2024-09-20', '2024-09-25', '제주도 힐링 여행', '자연과 함께하는 시간', '2024-09-20', 'jeju.jpg'),
(1, '강릉', '2024-09-28', '2024-09-30', '강릉 커피 투어', '강릉의 다양한 카페 방문', '2024-09-28', 'gangneung.jpg'),
(1, '전주', '2024-10-02', '2024-10-04', '전주 한옥마을 탐방', '전통과 현대의 조화', '2024-10-02', 'jeonju.jpg'),
(1, '속초', '2024-10-07', '2024-10-09', '속초 해수욕', '맑은 바다와 휴식', '2024-10-07', 'sokcho.jpg'),
(1, '포항', '2024-10-12', '2024-10-14', '포항 구룡포', '구룡포에서 해산물 맛보기', '2024-10-12', 'pohang.jpg'),
(1, '인천', '2024-10-18', '2024-10-20', '인천 차이나타운', '다양한 음식을 맛보다', '2024-10-18', 'incheon.jpg'),
(1, '대구', '2024-10-25', '2024-10-27', '대구 도심 탐방', '대구의 중심지를 걷다', '2024-10-25', 'daegu.jpg');
-- user_idx 2에 대한 10개의 데이터
INSERT INTO travel_project (user_idx, project_title, start_date, end_date, planner_title, planner_description, planner_date, planner_img)
VALUES
(2, '울산', '2024-09-03', '2024-09-06', '울산 대왕암공원', '대왕암공원에서의 산책', '2024-09-03', 'ulsan.jpg'),
(2, '광주', '2024-09-08', '2024-09-11', '광주 예술 투어', '광주의 미술관 방문', '2024-09-08', 'gwangju.jpg'),
(2, '평창', '2024-09-13', '2024-09-16', '평창 자연휴양림', '자연 속에서의 힐링', '2024-09-13', 'pyeongchang.jpg'),
(2, '안동', '2024-09-19', '2024-09-21', '안동 하회마을', '전통적인 마을 탐방', '2024-09-19', 'andong.jpg'),
(2, '여수', '2024-09-24', '2024-09-27', '여수 밤바다 여행', '여수의 야경 즐기기', '2024-09-24', 'yeosu.jpg'),
(2, '진주', '2024-09-30', '2024-10-03', '진주성 탐방', '역사적인 성을 탐방', '2024-09-30', 'jinju.jpg'),
(2, '춘천', '2024-10-06', '2024-10-08', '춘천 남이섬', '남이섬에서의 하루', '2024-10-06', 'chuncheon.jpg'),
(2, '대전', '2024-10-11', '2024-10-13', '대전 카이스트 방문', '대전의 과학 도시 탐방', '2024-10-11', 'daejeon.jpg'),
(2, '순천', '2024-10-16', '2024-10-18', '순천만 갈대밭', '순천의 아름다운 갈대밭', '2024-10-16', 'suncheon.jpg'),
(2, '통영', '2024-10-22', '2024-10-24', '통영 동피랑 마을', '벽화가 아름다운 동피랑', '2024-10-22', 'tongyeong.jpg');
-- user_idx 3에 대한 10개의 데이터
INSERT INTO travel_project (user_idx, project_title, start_date, end_date, planner_title, planner_description, planner_date, planner_img)
VALUES
(3, '가평', '2024-09-05', '2024-09-07', '가평 캠핑', '가평에서의 캠핑과 휴식', '2024-09-05', 'gapyeong.jpg'),
(3, '목포', '2024-09-09', '2024-09-12', '목포 유달산', '유달산 등반과 목포 항구', '2024-09-09', 'mokpo.jpg'),
(3, '경남 합천', '2024-09-14', '2024-09-17', '합천 해인사', '해인사와 팔만대장경 탐방', '2024-09-14', 'hapcheon.jpg'),
(3, '김해', '2024-09-18', '2024-09-21', '김해 국립박물관', '김해의 역사 탐방', '2024-09-18', 'gimhae.jpg'),
(3, '충주', '2024-09-23', '2024-09-26', '충주 수안보 온천', '수안보 온천에서의 힐링', '2024-09-23', 'chungju.jpg'),
(3, '남해', '2024-09-29', '2024-10-01', '남해 독일마을', '독일마을과 해변 산책', '2024-09-29', 'namhae.jpg'),
(3, '군산', '2024-10-05', '2024-10-07', '군산 근대역사박물관', '군산의 근대 역사 탐방', '2024-10-05', 'gunsan.jpg'),
(3, '제천', '2024-10-09', '2024-10-11', '제천 청풍호', '청풍호와 케이블카 체험', '2024-10-09', 'jecheon.jpg'),
(3, '구례', '2024-10-14', '2024-10-16', '구례 화엄사', '화엄사와 지리산 탐방', '2024-10-14', 'gurye.jpg'),
(3, '광양', '2024-10-19', '2024-10-21', '광양 매화마을', '매화마을에서 봄을 느끼다', '2024-10-19', 'gwangyang.jpg');

-- 데이터 추가
INSERT INTO task (_id, title, description, date, isCompleted, isImportant, userId) VALUES ('1', '할일1', '할일1 설명' '2024-08-12', false, false, 'guswlda');

-- 데이터 조회
SELECT * FROM task;

SELECT project_title, start_date, end_date from travel_project;

-- 특정 사용자 데이터 필터 조회
SELECT * FROM task WHERE userid= 'happy' ORDER BY created_at DESC;

-- Timezone 변경
ALTER DATABASE postgres SET timezone = 'Asia/Seoul';

SHOW timezone;

SET timezone = 'Asia/Seoul';

-- 데이터 삭제
DELETE FROM task WHERE _id = '1234';

-- 데이터 update
UPDATE task SET iscompleted = true  WHERE _id = '1236'


-- 트리거 함수 생성: updated_at 필드를 현재 시간으로 설정
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성: task 테이블에서 UPDATE가 발생할 때마다 update_updated_at_column 함수를 호출
CREATE TRIGGER update_task_updated_at
BEFORE UPDATE ON task
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- task 테이블의 created_at 필드는 행이 처음 삽입될 때만 설정.
-- updated_at 필드는 행이 업데이트될 때마다 트리거를 통해 현재 시간으로 자동 갱신.
-- BEFORE UPDATE 트리거는 레코드가 업데이트되기 직전에 updated_at 필드를 현재 시간으로 변경.

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);