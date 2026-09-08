# 문제 해결

## 1. Runner에서 404 오류가 출력됨 {#1-runner-prints-error-404}

### 해결 방법 {#how-to-fix}

[Runner에서 401 오류 코드가 반환됨](https://github.com/semaphoreui/semaphore/discussions/1873?converting=1)

---

## 2. localhost에 대한 Gathering Facts 문제 {#2-gathering-facts-issue-for-localhost}

이 문제는 [Snap](https://snapcraft.io/semaphore) 또는 [Docker](https://hub.docker.com/r/semaphoreui/semaphore)로 설치한 Semaphore UI에서 발생할 수 있습니다.

```
4:10:16 PM
TASK [Gathering Facts] *********************************************************
4:10:17 PM
fatal: [localhost]: FAILED! => changed=false
```

### 발생 원인 {#why-this-happens}

Ansible에서 localhost 사용에 대한 자세한 내용은 [Implicit 'localhost'](https://docs.ansible.com/ansible/latest/inventory/implicit_localhost.html) 문서를 참조하십시오.

Ansible이 로컬에서 fact를 수집하려고 하지만, Ansible은 이를 허용하지 않는 제한된 격리 컨테이너 안에 위치해 있습니다.

### 해결 방법 {#how-to-fix-this}

두 가지 방법이 있습니다:

1. fact 수집을 비활성화합니다:

```yaml
- hosts: localhost
  gather_facts: False
  roles:
    - ...
```

2. 연결 유형을 명시적으로 **ssh**로 설정합니다:
```
[localhost]
127.0.0.1 ansible_connection=ssh ansible_ssh_user=your_localhost_user
```
---
## 3. panic: pq: SSL is not enabled on the server {#3-panic-pq-ssl-is-not-enabled-on-the-server}

Postgres가 SSL로 동작하지 않는다는 의미입니다.

### 해결 방법 {#how-to-fix-this-1}

구성 파일에 `sslmode=disable` 옵션을 추가하십시오:

```json
	"postgres": {
		"host": "localhost",
		"user": "postgres",
		"pass": "pwd",
		"name": "semaphore",
		"options": {
			"sslmode": "disable"
		}
	},
```


---


## 4. fatal: bad numeric config value '0' for 'GIT_TERMINAL_PROMPT': invalid unit {#4-fatal-bad-numeric-config-value-0-for-git_terminal_prompt-invalid-unit}

인증이 필요한 저장소에 HTTPS로 접근하려고 한다는 의미입니다.

### 해결 방법 {#how-to-fix-this-2}

* **키 저장소** 화면으로 이동합니다.
* `Login with password` 유형의 새 키를 생성합니다.
* GitHub/BitBucket 등의 로그인 아이디를 지정합니다.
* 비밀번호를 지정합니다. GitHub/BitBucket에서는 계정 비밀번호를 사용할 수 없으며, 대신 Personal Access Token(PAT)을 사용해야 합니다. 자세한 내용은 [여기](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)를 참조하십시오.
* 키를 생성한 후 **저장소** 화면으로 이동하여 해당 저장소를 찾고 키를 지정합니다.


---

## 5. Git clone 또는 pull이 간헐적으로 실패함 {#5-git-clone-or-pull-fails-intermittently}

작업 로그에 `Git pull failed (...), retrying in 2s` 같은 메시지가 표시된 후 성공하거나, 여러 번 시도 후 최종적으로 실패할 수 있습니다.

### 발생 원인 {#why-this-happens-1}

git 서버에 일시적으로 연결할 수 없었거나 일시적인 오류를 반환했습니다. Semaphore는 작업을 실패 처리하기 전에 clone 및 pull 작업을 자동으로 재시도합니다.

### 해결 방법 {#how-to-fix-this-3}

1. **일시적인 장애**: 보통 저절로 해결됩니다. Semaphore는 지수 백오프를 적용하며 최대 `git_attempts`회(기본값 4)까지 재시도합니다.
2. **잦은 실패**: 구성에서 `git_attempts`를 늘리거나 `SEMAPHORE_GIT_ATTEMPTS`를 설정하십시오.
3. **즉각적이고 일관된 실패**: 저장소 URL, 브랜치, 액세스 키, 네트워크 연결을 확인하십시오.

구성에 대한 자세한 내용은 [Git 작업](/admin-guide/configuration/config-file#git-operations)을 참조하십시오.

---

## 6. unable to read LDAP response packet: unexpected EOF {#6-unable-to-read-ldap-response-packet-unexpected-eof}

LDAP 서버가 보안 연결(TLS)을 기대하는데 비보안 방식으로 연결하려고 시도하고 있을 가능성이 높습니다.

### 해결 방법 {#how-to-fix-this-4}

`config.json` 파일에서 TLS를 활성화하십시오:

```json
...
"ldap_needtls": true
...
```

---

## 7. LDAP Result Code 49 "Invalid Credentials" {#7-ldap-result-code-49-invalid-credentials}

비밀번호 또는 `binddn`이 잘못되었습니다.

### 해결 방법 {#how-to-fix-this-5}

`ldapwhoami` 도구를 사용하여 binddn이 동작하는지 확인하십시오:

```bash
ldapwhoami\
  -H ldap://ldap.com:389\
  -D "CN=/your/ldap_binddn/value/in/config/file"\
  -x\
  -W
```

비밀번호를 대화식으로 묻고, 코드 **0**을 반환하며 지정한 **DN**을 출력해야 합니다.

다음 문서도 참고할 수 있습니다: 
* [ldapsearch: Invalid credentials (49)](https://serverfault.com/q/771549/443463)
* [https://github.com/semaphoreui/semaphore/issues/906](https://github.com/semaphoreui/semaphore/issues/906)

---

## 8. LDAP Result Code 32 "No Such Object" {#8-ldap-result-code-32-no-such-object}

곧 제공될 예정입니다.
