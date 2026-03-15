---
date: "2025-01-13"
titleKo: 무료 SSL인증서 (Let's encrypt) 발급 및 자동갱신 설정 방법
titleEn: How to Get a Free SSL Certificate (Let'
category: it
tags:
  - IT개인자료정리
images: []
sourceCategoryNo: "72"
sourceCategory: IT개인자료정리
externalUrl: https://blog.naver.com/fstory97/223724857846
---

<!-- ko -->
- 늘 유료 인증서 쓰다가 무료 인증서를 써달라고 해서 무료 인증서를 찾아봤는데, 설정이 생각보다 쉽고 자동갱신이 되는 걸 알았다. 여태까지 갱신한다고 삽질했던 내가 원시인이 었구나. (원래 그랬나?) 전혀 돈 쓸필요가 없었다. 혹시 저 같이 헛 돈 쓰는 바보가 있을까봐 공유합니다.
​

1. Certbot tool 설치

# bash
sudo apt update
sudo apt-get install letsencrypt -y

2. 인증서 생성

​  생성 시 주의할 점은 현재 서버만 됨, 다른 서버에서 대신 발급은 불가 하며, DNS는 명령어를 내리는 서버에 설정되어 있어야 함. 아래처럼 멀티 도메인도 가능 함

certbot certonly --standalone -d api.ai-dol.com -d cloud.ai-dol.com

- 이메일 입력하여 연락처 적으면 생성 완료

3. nginx.conf 수정 및 갱신 설정

nginx에 public key 와 privite key 를 그대로 써도 잘 돌아가는데, **### * 주의 사항 : 생성 되는 인증서는 심볼릭 링크임**- 인증서 생성 때 나오는 경로는 symbolic link이므로 해당 파일을 docker등에 맵핑할 경우 읽어들이지 못하는 문제가 있음. 이것 때문에 잠깐 삽질했는데, nginx 배포 스크립트에서 심볼릭 링크를 복사해서 사용하는 것이 좋음.

# nginx 배포 스크립트인 run.sh 파일의 일부
# 심볼릭 링크가 있는 위치의 물리 파일을 복사
sudo cp -L /etc/letsencrypt/live/api.ai-dol.com/fullchain.pem $HOME_DIR/ssl/
sudo cp -L /etc/letsencrypt/live/api.ai-dol.com/privkey.pem $HOME_DIR/ssl/```

자동으로 갱신하기 위해 심볼릭 링크를 쓰고, 물리적 경로에는 다른 파일로 번호가 붙으며 계속 누적 생성딤​

4.  자동 갱신  hook 설정

* 인증서가 자동 갱신 되면 도커의 인증서는 갱신되지 않는 문제가 있으므로 자동 갱신 스크립트를 작성해 두어야 함 /etc/letsencrypt/renewal-hooks/deploy 위치에 스크립트를 작성해두면 갱신 후에 자동으로 실행됨. ​* 아래와 같이 자동으로 간단하게 docker를 재시작 시키도록 짜 둠

# 01-copy-and-restart.sh
cd /home/cto/deepreal-me-api/deep-real-me-nginx
sudo bash run.sh prod

​​**ps. 블로그도 마크다운 지원, 좀, obisidian 그대로 붙여 놓아서 쓸 수 있으면 얼마나 좋아.****​****#개발 #SSL #웹개발****​**

<!-- en -->
- I always used paid certificates, but was asked to use free ones, so I looked them up and found that they were surprisingly easy to set up and automatically renewed. I realized I'd been a caveman, struggling with renewals all this time. (Was it always like this?) There was no need to spend any money at all. Sharing this just in case there are other fools like me wasting money.

1. Install Certbot tool

```bash
sudo apt update
sudo apt-get install letsencrypt -y
```

2. Certificate Generation

Important note during generation: Only the current server can issue certificates; issuance from other servers is not possible, and DNS must be configured on the server where the command is executed. Multi-domains are also possible as shown below:

```
certbot certonly --standalone -d api.ai-dol.com -d cloud.ai-dol.com
```

- Enter your email for contact information, and generation is complete.

3. Modify nginx.conf and Renewal Settings

Nginx works fine even if you use the public and private keys as they are, but **### * Caution: The generated certificates are symbolic links** - The path generated during certificate creation is a symbolic link, so there might be issues reading the file if mapped to Docker, etc. I struggled with this for a bit, but it's better to copy and use the symbolic link in the Nginx deployment script.

```bash
# Part of the Nginx deployment script, run.sh
# Copy the physical files from the symbolic link location
sudo cp -L /etc/letsencrypt/live/api.ai-dol.com/fullchain.pem $HOME_DIR/ssl/
sudo cp -L /etc/letsencrypt/live/api.ai-dol.com/privkey.pem $HOME_DIR/ssl/
```

Symbolic links are used for automatic renewal, and in the physical path, numbered files are continuously generated and accumulated.

4. Configure Automatic Renewal Hook

* When certificates are automatically renewed, there's an issue where Docker's certificates are not updated, so an automatic renewal script must be prepared. If a script is placed in the `/etc/letsencrypt/renewal-hooks/deploy` directory, it will automatically run after renewal.
* I've set it up to simply restart Docker automatically as follows:

```bash
# 01-copy-and-restart.sh
cd /home/cto/deepreal-me-api/deep-real-me-nginx
sudo bash run.sh prod
```

**ps. It would be great if blogs supported markdown, and I could just paste from Obsidian.**

**#development #SSL #webdevelopment**