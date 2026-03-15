---
date: "2024-06-04"
titleKo: GPT4씹어먹는다는 MiniCPM Llma3-V-2-5 설치 및 실행 해보기
titleEn: Trying Out MiniCPM Llama3-V-2-5 Installation and Execution, Claiming to Outperform GPT-4
category: ai
tags:
  - 카페루아
images:
  - /desk/20240604-gpt4씹어먹는다는-minicpm-llma3-v-2-5-설치-및-실행-해보기/01.webp
  - /desk/20240604-gpt4씹어먹는다는-minicpm-llma3-v-2-5-설치-및-실행-해보기/02.webp
  - /desk/20240604-gpt4씹어먹는다는-minicpm-llma3-v-2-5-설치-및-실행-해보기/03.webp
  - /desk/20240604-gpt4씹어먹는다는-minicpm-llma3-v-2-5-설치-및-실행-해보기/04.webp
thumbnail: /desk/20240604-gpt4씹어먹는다는-minicpm-llma3-v-2-5-설치-및-실행-해보기/01.webp
sourceCategoryNo: "180"
sourceCategory: 카페루아
externalUrl: https://blog.naver.com/fstory97/223468853215
---

<!-- ko -->
아주 예전에 인공지능을 공부하고 만들기는 했지만, 많은 부분에서 다시 새롭게 공부하는 느낌입니다. 제가 만들고 싶은 [AI에이전트 개발](https://blog.naver.com/fstory97/223451877643)과 지금 당장 필요한 활용을 위해서는 코드깎는노인님의 AI EXE를 실행하고, ollama등을 이용하여 개인용 로컬 AI엔진을 연결하는 것을 목표로 작업을 해보고 있습니다.​

**1. MINI CPM  Llama-V 2.5 8b모델**

그래서 개인이 돌려볼 수 있는 어떤 좋은 모델이 있나 싶어 하던 차에 페이스북 타임라인에 [귱귱](https://github.com/gyunggyung)님이 추천해주신 모델 MiniCPM-Llama3-V 2.5 8b 을 돌려보기로 했습니다. Transformer기반의 중국에서 개발된 GPT4레벨의 멀티모달 소형모델로 스마트폰과 같이 제한된 환경에서 온디바이스 구동을 목표합니다.

https://github.com/OpenBMB/MiniCPM-V
**GitHub - OpenBMB/MiniCPM-V: MiniCPM-Llama3-V 2.5: A GPT-4V Level Multimodal LLM on Your Phone** MiniCPM-Llama3-V 2.5: A GPT-4V Level Multimodal LLM on Your Phone - OpenBMB/MiniCPM-V github.com

https://github.com/OpenBMB/MiniCPM-V

{{IMG:1}}

MiniCPM Llama3-v2.5B 모델성능

​​

**2. MINI CPM  Llama-V 2.5 설치 및 실행**

- [https://www.youtube.com/watch?v=6SnZMbSx570](https://www.youtube.com/watch?v=6SnZMbSx570) 을 참고해서 우선 설치 및 실행부터 해봤고 해당 내용을 정리 공유합니다. 영상을 따라하는 실습내용을 요약하자면 Huggingface에서 MiniCPM-Llama3-V-2_5를 콘다의 파이썬으로 돌려보는 테스트로 이미지와 텍스트 질문을 던지면 텍스트 응답을 받을 수 있습니다.​**2.1 사전 구비사항**- Cuda가 구동가능한 RTX시리즈 HW
- Python3, Conda 설치
​**2.2. Pillow, Transformers, Torch, torchvision 설치**

pip install pillow=10.1.0
pip install transoforemrs
pip install torch
pip install torchvision

**2.3. Huggingface CLI 로그인****  - **[**https://huggingface.co/welcome**](https://huggingface.co/welcome)  - 모델을 다운받고 실행하기 위해서는 Huggingface에 회원가입 후 CLI로 로그인되어있어야 합니다.

pip install huggingface_hub
huggingface-cli login

**2.4. Conda 가상환경 실행**

#파이썬 3.10으로 minicpm의 conda 가상환경을 만듭니다.
conda create -n minicpm python=3.10
conda activate minicpm
#파이썬 실행
python3

**2.5. Conda 내에서 파이썬 코드 실행**- **이미지와 텍스트를 넣어서 질문하고 텍스트로 질의를 파이썬 인터프리터로 받아오는 샘플입니다.**

{{IMG:2}}

/home/luke/lenna.png

**​**

import torch
from transformers import AutoModel, AutoTokenizer
from PIL import Image
model = AutoModel.from_pretrained('openbmb/MiniCPM-Llama3-V-2_5', trust_remote_code=True)
tokenizer =  AutoTokenizer.from_pretrained('openbmb/MiniCPM-Llama3-V-2_5', trust_remote_code=True)
model.eval()
image = Image.open('/home/luke/lenna.png').convert('RGB')
question = '이 사진의 인물은 레나 포르센이란 분이야. 인공지능을 공부하면 모르는 사람이 없지. 인공지능 연구에 왜 이 사진이 사용되었을까? 공식적인 답변과 네가 생각하는 비공식적인 답변을 해봐'
msgs = [{'role':'user', 'content':question}]
res = model.chat (image = image,  msgs=msgs,  tokenizer=tokenizer, sampling=True, temperature=0.7)
print(res);

**3. 실행 결과**

{{IMG:3}}

**​**중국에서 만들었지만 한글이 무척 잘되는건 인상적이었습니다. 하지만 제가 기대했던 그런 답변이 아니었습니다.  AI가 아직은 상상력과 인간적인면이 많이 부족합니다.

{{IMG:4}}

공대생들이 플레이보이잡지 이미지를 쓴건 뻔 하잖아! (예전 컴공은 90%가 남자였습니다.) 그런데 제가 저 사진을 처음 본건 20년전에 흑백이었습니다. 제가 가지고 있던 전공서적이 흑백이었던 지라. 다음은 ollama에 제대로 붙여보거나 AIEXE실습을 좀 해봐야겠습니다. ​[https://github.com/OpenBMB/ollama/tree/minicpm-v2.5/examples/minicpm-v2.5](https://github.com/OpenBMB/ollama/tree/minicpm-v2.5/examples/minicpm-v2.5)

https://github.com/OpenBMB/ollama/tree/minicpm-v2.5/examples/minicpm-v2.5
**ollama/examples/minicpm-v2.5 at minicpm-v2.5 · OpenBMB/ollama** Get up and running with Llama 3, Mistral, Gemma, and other large language models. - OpenBMB/ollama github.com

https://github.com/OpenBMB/ollama/tree/minicpm-v2.5/examples/minicpm-v2.5

맨날 사업만 떠들다가 이렇게 뭔가 만드는 결과물을 뚝딱 뚝딱 내놓으니 다시 개발자로 돌아온것 같아 사회에 도움이되는 것 같아  기분이 좋습니다. Docker, Container, SSL, redis때문에 지난 주말은 다 날렸습니다. 간만에 돌아오니 실력에 자괴감이 드는 순간이기도 했어서 좀 우울했지만 어쨌든 역시 밤새면 해결되더군요. 최고의 코딩 무기는 체력과 끈기 꾸준함입니다.​​

<!-- en -->
Although I studied and built AI a long time ago, it feels like I'm learning many parts anew. To develop the [AI agent](https://blog.naver.com/fstory97/223451877643) I want to create and for the immediate applications I need, I'm working on running "Code-Carving Elder's" AI EXE and connecting a personal local AI engine using ollama, among other tools.

**1. MINI CPM Llama-V 2.5 8b Model**

So, wondering if there was a good model that individuals could run, I decided to try out the MiniCPM-Llama3-V 2.5 8b model recommended by [Gyunggyung](https://github.com/gyunggyung) on my Facebook timeline. It's a Transformer-based, GPT-4 level multimodal small model developed in China, aiming for on-device operation in limited environments like smartphones.

https://github.com/OpenBMB/MiniCPM-V
                                **GitHub - OpenBMB/MiniCPM-V: MiniCPM-Llama3-V 2.5: A GPT-4V Level Multimodal LLM on Your Phone** MiniCPM-Llama3-V 2.5: A GPT-4V Level Multimodal LLM on Your Phone - OpenBMB/MiniCPM-V github.com

https://github.com/OpenBMB/MiniCPM-V

{{IMG:1}}
                                
                            MiniCPM Llama3-v2.5B Model Performance

**2. MINI CPM Llama-V 2.5 Installation and Execution**

- I first tried installing and running it by referring to [https://www.youtube.com/watch?v=6SnZMbSx570](https://www.youtube.com/watch?v=6SnZMbSx570), and I'm organizing and sharing the content here. To summarize the practical content of following the video, it's a test of running MiniCPM-Llama3-V-2_5 from Huggingface with Python in Conda, where you can get a text response by providing an image and a text question.
**2.1 Prerequisites**
- RTX series HW capable of running Cuda
- Python3, Conda installed
**2.2. Install Pillow, Transformers, Torch, torchvision**

pip install pillow=10.1.0
pip install transoforemrs
pip install torch
pip install torchvision

**2.3. Huggingface CLI Login**
  - [**https://huggingface.co/welcome**](https://huggingface.co/welcome)
  - To download and run the model, you must sign up for Huggingface and log in via CLI.

pip install huggingface_hub
huggingface-cli login

**2.4. Run Conda Virtual Environment**

#Create a conda virtual environment for minicpm with Python 3.10.
conda create -n minicpm python=3.10
conda activate minicpm
#Run Python
python3

**2.5. Run Python Code within Conda**
- **This is a sample of asking a question with an image and text, and receiving a text response through the Python interpreter.**

{{IMG:2}}
                                
                            /home/luke/lenna.png

import torch
from transformers import AutoModel, AutoTokenizer
from PIL import Image
model = AutoModel.from_pretrained('openbmb/MiniCPM-Llama3-V-2_5', trust_remote_code=True)
tokenizer = AutoTokenizer.from_pretrained('openbmb/MiniCPM-Llama3-V-2_5', trust_remote_code=True)
model.eval()
image = Image.open('/home/luke/lenna.png').convert('RGB')
question = 'This person in the photo is Lena Forsén. Anyone who studies AI knows her. Why was this photo used in AI research? Give me an official answer and an unofficial answer you think of.'
msgs = [{'role':'user', 'content':question}]
res = model.chat (image = image, msgs=msgs, tokenizer=tokenizer, sampling=True, temperature=0.7)
print(res);

**3. Execution Result**

{{IMG:3}}

It was impressive that it handled Korean so well, despite being developed in China. However, it wasn't the answer I expected. AI still lacks a lot in imagination and human-like aspects.

{{IMG:4}}

It's obvious that engineering students used a Playboy magazine image! (In the past, computer science departments were 90% male.) But when I first saw that photo 20 years ago, it was in black and white because my textbooks were black and white. Next, I need to properly connect it to ollama or do some AIEXE practice. [https://github.com/OpenBMB/ollama/tree/minicpm-v2.5/examples/minicpm-v2.5](https://github.com/OpenBMB/ollama/tree/minicpm-v2.5/examples/minicpm-v2.5)

https://github.com/OpenBMB/ollama/tree/minicpm-v2.5/examples/minicpm-v2.5
                                **ollama/examples/minicpm-v2.5 at minicpm-v2.5 · OpenBMB/ollama** Get up and running with Llama 3, Mistral, Gemma, and other large language models. - OpenBMB/ollama github.com

https://github.com/OpenBMB/ollama/tree/minicpm-v2.5/examples/minicpm-v2.5

After always just talking about business, it feels good to be back as a developer, churning out results like this, and feeling like I'm contributing to society. I lost my entire last weekend to Docker, Container, SSL, and Redis. Coming back after a long time, there were moments of self-doubt about my skills, which made me a bit gloomy, but in the end, staying up all night solved it. The best coding weapons are stamina, perseverance, and consistency.