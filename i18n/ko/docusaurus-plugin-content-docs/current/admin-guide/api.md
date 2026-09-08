# API

## API 참조 {#api-reference}

Semaphore UI는 두 가지 형식의 API 문서를 제공하므로 워크플로에 가장 잘 맞는 것을 선택할 수 있습니다.

* [Swagger/OpenAPI](https://semaphoreui.com/api-docs) &mdash; 브라우저 기반의 대화형 환경을 선호하는 경우에 적합합니다.
* [공식 Postman 컬렉션](https://www.postman.com/semaphoreui) &mdash; Postman에서 모든 엔드포인트를 살펴보고 테스트할 수 있습니다.
* **내장 Swagger API 문서** &mdash; Swagger UI로 제공되는 대화형 API 문서입니다. 사용 중인 인스턴스에서 직접 접근할 수 있습니다.

![](/assets/swagger-link.webp)

모든 옵션에는 사용 가능한 엔드포인트, 매개변수, 응답 예시에 대한 완전한 문서가 포함되어 있습니다.

## API 시작하기 {#getting-started-with-the-api}

Semaphore API를 사용하려면 API token을 생성해야 합니다.
이 token은 요청 헤더에 다음과 같이 포함해야 합니다.

```http
Authorization: Bearer YOUR_API_TOKEN
```

### API token 생성 {#creating-an-api-token}

API token을 생성하는 방법은 두 가지입니다.
- 웹 인터페이스를 통해
- HTTP 요청을 사용하여

#### 웹 인터페이스를 통해 (2.14부터) {#through-the-web-interface-since-214}

Semaphore 웹 UI에서 API token을 생성하고 관리할 수 있습니다.

![API Token](https://www.semaphoreui.com/uploads/v2.14/tokens.webp)

#### HTTP 요청 사용 {#using-http-request}

직접 HTTP 요청을 보내 인증하고 세션 token을 생성할 수도 있습니다.

Semaphore에 로그인합니다(비밀번호는 이스케이프해야 합니다. 예: `slashy\pass` 대신 `slashy\\pass`).

```bash
curl -v -c /tmp/semaphore-cookie -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-d '{"auth": "YOUR_LOGIN", "password": "YOUR_PASSWORD"}' \
http://localhost:3000/api/auth/login
```

새 token을 생성하고 발급받습니다.

```bash
curl -v -b /tmp/semaphore-cookie -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
http://localhost:3000/api/user/tokens
```

이 명령은 다음과 비슷한 결과를 반환합니다.

```json
{
    "id": "YOUR_ACCESS_TOKEN",
    "created": "2025-05-21T02:35:12Z",
    "expired": false,
    "user_id": 3
}
```
---

## token을 사용하여 API 요청 보내기 {#using-token-to-make-api-requests}

API token을 발급받았으면 **Authorization** 헤더에 포함하여 요청을 인증합니다.

### 작업 실행 {#launch-a-task}

이 token을 사용하여 작업을 실행하거나 다른 요청을 보낼 수 있습니다.

```bash
curl -v -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
-d '{"template_id": 1}' \
http://localhost:3000/api/project/1/tasks
```

---

## API token 만료 처리 {#expiring-an-api-token}

token이 더 이상 필요하지 않으면 계정 보안을 위해 만료시켜야 합니다.

API token을 수동으로 취소(만료)하려면 token 엔드포인트에 DELETE 요청을 보냅니다.

```bash
curl -v -XDELETE \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
http://localhost:3000/api/user/tokens/YOUR_ACCESS_TOKEN
```
