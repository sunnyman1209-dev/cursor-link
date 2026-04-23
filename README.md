# 학급 정부 시스템 (Streamlit)

학급 예산 배정/결재/부처별 신청/감찰 리포트를 한 화면에서 관리하는 Streamlit 앱입니다.

## 실행 방법 (로컬)

1) 의존성 설치

```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2) 환경변수 설정

- `.env.example`을 참고해 **`.env`**를 생성하거나,
- OS 환경변수에 `APP_PASSWORDS`, `APP_DEPT_PASSWORDS`를 설정하세요.

> 주의: 비밀번호는 보안상 레포에 커밋하지 않습니다.

3) 실행

```bash
streamlit run app.py
```

## 환경변수

- `APP_PASSWORDS`: 역할별 1차 비밀번호(JSON)
- `APP_DEPT_PASSWORDS`: 부처별 2차 비밀번호(JSON)
- `DB_CONFIG`: 예산/벌금/지출 저장 CSV 파일명(기본 `config_v4.csv`)
- `LOG_FILE`: 결재/신청 로그 CSV 파일명(기본 `transactions_v4.csv`)

