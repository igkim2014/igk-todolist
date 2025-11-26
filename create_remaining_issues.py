#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GitHub Issues Creator from Batch Files
배치 파일에서 gh 명령어를 추출하여 이슈 생성
"""

import subprocess
import sys
import re
import urllib.parse
from pathlib import Path

# GitHub CLI 경로
GH_CLI = r"C:\Program Files\GitHub CLI\gh.exe"

def decode_body(encoded_body):
    """URL 인코딩된 본문을 디코딩"""
    # %0A를 \n으로 변환
    decoded = encoded_body.replace('%0A', '\n')
    # %% 를 % 로 변환 (배치 파일 이스케이프)
    decoded = decoded.replace('%%', '%')
    # 나머지 URL 디코딩
    try:
        decoded = urllib.parse.unquote(decoded)
    except:
        pass
    return decoded

def parse_batch_file(bat_file):
    """배치 파일에서 gh issue create 명령 추출"""
    issues = []
    current_issue = None

    with open(bat_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # gh issue create 명령 시작
        if line.startswith('gh issue create'):
            current_issue = {
                'title': '',
                'labels': '',
                'body': ''
            }
            i += 1
            continue

        # 명령어 파라미터 파싱
        if current_issue is not None:
            # 줄바꿈 문자 ^ 제거
            line = line.replace('^', '').strip()

            # title 파싱
            if '--title' in line:
                match = re.search(r'--title\s+"([^"]+)"', line)
                if match:
                    current_issue['title'] = match.group(1)

            # label 파싱
            elif '--label' in line:
                match = re.search(r'--label\s+"([^"]+)"', line)
                if match:
                    current_issue['labels'] = match.group(1)

            # body 파싱
            elif '--body' in line:
                match = re.search(r'--body\s+"([^"]+)"', line)
                if match:
                    encoded_body = match.group(1)
                    current_issue['body'] = decode_body(encoded_body)
                    # body가 완료되면 이슈 저장
                    if current_issue['title'] and current_issue['labels']:
                        issues.append(current_issue)
                    current_issue = None

        i += 1

    return issues

def create_issue(issue):
    """단일 이슈 생성"""
    cmd = [
        GH_CLI,
        "issue",
        "create",
        "--title", issue['title'],
        "--label", issue['labels'],
        "--body", issue['body']
    ]

    try:
        print(f"[생성 중] {issue['title']}")
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            encoding='utf-8',
            check=True
        )
        url = result.stdout.strip()
        print(f"[완료] {url}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"[실패] {issue['title']}")
        print(f"에러: {e.stderr}")
        return False
    except Exception as e:
        print(f"[실패] {issue['title']}")
        print(f"예외: {str(e)}")
        return False

def main():
    print("=" * 70)
    print("IGK-TodoList GitHub 이슈 자동 생성")
    print("=" * 70)
    print()

    # 배치 파일 목록
    batch_files = [
        ("Phase 2: 백엔드 개발", "create_issues_phase2.bat"),
        ("Phase 3: 프론트엔드 개발", "create_issues_phase3.bat"),
        ("Phase 4: 통합 및 배포", "create_issues_phase4.bat")
    ]

    total_success = 0
    total_fail = 0

    for phase_name, bat_file in batch_files:
        print(f"\n{'=' * 70}")
        print(f"{phase_name}")
        print(f"{'=' * 70}\n")

        file_path = Path(bat_file)
        if not file_path.exists():
            print(f"[오류] 파일을 찾을 수 없습니다: {bat_file}")
            continue

        issues = parse_batch_file(file_path)
        print(f"{len(issues)}개 이슈 발견\n")

        for issue in issues:
            if create_issue(issue):
                total_success += 1
            else:
                total_fail += 1
            print()

    print("=" * 70)
    print(f"전체 완료: {total_success}개 성공, {total_fail}개 실패")
    print("=" * 70)

if __name__ == "__main__":
    main()
