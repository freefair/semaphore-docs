# Semaphore와 Netbox 동적 인벤토리 통합

![Ansible 배지](https://img.shields.io/badge/ansible-%23000.svg?style=for-the-badge&logo=ansible&logoColor=white)
![Netbox 배지](https://img.shields.io/badge/Netbox-%23F00.svg?style=for-the-badge&logo=netbox&logoColor=white)
<!-- ![Semaphore Badge](https://img.shields.io/badge/Semaphore-%23187EBB.svg?style=for-the-badge&logo=semaphore&logoColor=white) -->

<a id="-key-features"></a>

## 🛠 주요 기능

이 저장소는 `netbox.netbox.nb_inventory` 플러그인을 사용하여 Semaphore에서 동적 인벤토리를 생성하는 방법을 보여줍니다. Netbox의 데이터를 자동으로 동기화하여 인프라 관리와 Ansible playbook 실행을 간소화합니다.

<a id="-setup"></a>

## 🔧 설정

<a id="requirements"></a>

### 요구 사항

- Semaphore 접근 권한
- API가 구성된 Netbox 접근 권한

<a id="-netbox-setup"></a>

### 🔑 Netbox 설정

Netbox가 구성되어 있고 API 상호 작용이 가능한지 확인하십시오. 요청 인증에 사용할 API token을 발급받으십시오.

<a id="-configuration-in-semaphore"></a>

### 📡 Semaphore에서 구성

1. Semaphore에서 인벤토리 섹션으로 이동합니다.
2. 새 인벤토리를 생성합니다.
3. 플러그인 구성에 다음 설정을 입력합니다:

   ```yaml
   plugin: netbox.netbox.nb_inventory
   api_endpoint: http://your_netbox_url_here
   token: YOUR_NETBOX_API_TOKEN
   validate_certs: False
   config_context: False
   ```

   `http://your_netbox_url_here`와 `YOUR_NETBOX_API_TOKEN`을 실제 Netbox 데이터로 교체하십시오.

<a id="-usage"></a>

## 🚀 사용법

구성이 완료되면 Netbox의 호스트 데이터를 자동으로 업데이트하는 동적 인벤토리를 사용하여 Semaphore에서 Ansible playbook을 실행할 수 있습니다.

<a id="-further-documentation"></a>

## 📚 추가 문서

`netbox.netbox.nb_inventory` 플러그인과 그 기능에 대한 자세한 내용은 [공식 Ansible 문서](https://docs.ansible.com/ansible/latest/collections/netbox/netbox/nb_inventory_inventory.html)에서 확인하십시오.
