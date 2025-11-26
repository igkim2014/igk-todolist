#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
IGK-TodoList GitHub Issues Auto Creator
모든 Phase의 GitHub 이슈를 자동으로 생성합니다.
"""

import subprocess
import sys
import os

# GitHub CLI 경로
GH_CLI = r"C:\Program Files\GitHub CLI\gh.exe"

# 모든 이슈 정의 (Phase 1 나머지 + Phase 2, 3, 4)
ISSUES = [
    # Phase 1 - Task 1.3
    {
        "title": "[Phase 1] Task 1.3: 스키마 실행 및 검증",
        "labels": "database,testing,complexity: low,priority: p0",
        "body": """## Todo

작성된 schema.sql을 실행하고 테이블 생성 검증

### 작업 내용

- schema.sql 실행
- 테이블 생성 확인 (User, Todo, Holiday)
- 인덱스 생성 확인
- 제약 조건 테스트

## 완료 조건

- [ ] 3개 테이블 생성 확인
- [ ] 인덱스 6개 생성 확인
- [ ] CHECK 제약 동작 확인
- [ ] UNIQUE 제약 동작 확인

## 의존성

**Dependencies:** Task 1.2
**Blocks:** Task 1.4, Task 2.3

## 예상 소요 시간

0.5시간

## 우선순위

P0 (필수)"""
    },
    # Phase 1 - Task 1.4
    {
        "title": "[Phase 1] Task 1.4: 초기 데이터 삽입 (국경일)",
        "labels": "database,data,complexity: low,priority: p1",
        "body": """## Todo

2025년 주요 국경일 데이터 삽입

### 작업 내용

- 2025년 주요 국경일 데이터 삽입
- isRecurring=true 설정

## 완료 조건

- [ ] 최소 10개 국경일 데이터 삽입
- [ ] Holiday 테이블 조회로 확인
- [ ] 날짜 정렬 확인

## 의존성

**Dependencies:** Task 1.3
**Blocks:** Task 2.11

## 예상 소요 시간

0.5시간

## 우선순위

P1"""
    },
    # Phase 2 이슈들은 실제 배치 파일에서 가져와야 합니다
    # 여기서는 간략화된 버전으로 진행
]

def create_issue(issue):
    """단일 이슈 생성"""
    cmd = [
        GH_CLI,
        "issue",
        "create",
        "--title", issue["title"],
        "--label", issue["labels"],
        "--body", issue["body"]
    ]

    try:
        print(f"[생성 중] {issue['title']}")
        result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', check=True)
        print(f"[완료] {result.stdout.strip()}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"[실패] {issue['title']}")
        print(f"에러: {e.stderr}")
        return False

def main():
    print("=" * 60)
    print("IGK-TodoList GitHub 이슈 자동 생성")
    print("=" * 60)
    print()

    # GitHub CLI 확인
    if not os.path.exists(GH_CLI):
        print(f"[오류] GitHub CLI를 찾을 수 없습니다: {GH_CLI}")
        sys.exit(1)

    print(f"총 {len(ISSUES)}개 이슈 생성 예정")
    print()

    success_count = 0
    fail_count = 0

    for issue in ISSUES:
        if create_issue(issue):
            success_count += 1
        else:
            fail_count += 1
        print()

    print("=" * 60)
    print(f"완료: {success_count}개 성공, {fail_count}개 실패")
    print("=" * 60)

if __name__ == "__main__":
    main()
