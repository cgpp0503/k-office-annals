import { Question, Character } from '../types';

export const QUESTIONS: Question[] = [
    // Strategy (전략) 관련 문항
    {
        id: 1,
        text: "프로젝트 마감일이 코앞인데, 예상치 못한 큰 문제가 발생했다. 당신의 행동은?",
        options: [
            { text: "플랜 B를 즉각 가동하고 일정과 리소스를 전면 재조정한다.", scores: { strategy: 3 } },
            { text: "일단 몸으로 부딪혀서 밤을 새워서라도 어떻게든 해결한다.", scores: { emotion: 2, strategy: -1 } }
        ]
    },
    {
        id: 2,
        text: "새로운 업무 지시가 내려왔을 때, 가장 먼저 드는 생각은?",
        options: [
            { text: "이게 팀의 전체 목표에 어떻게 기여하는지부터 파악한다.", scores: { strategy: 3 } },
            { text: "내가 당장 오늘 해야 할 액션 아이템이 무엇인지 리스트업한다.", scores: { strategy: 1, leadership: 1 } }
        ]
    },
    {
        id: 3,
        text: "팀 회의에서 의견 충돌이 발생했을 때, 당신의 해결 방식은?",
        options: [
            { text: "데이터와 논리를 바탕으로 가장 효율적인 대안을 제시한다.", scores: { strategy: 3, emotion: -1 } },
            { text: "양측의 감정을 다독이며 적절한 타협점을 찾는다.", scores: { social: 3, strategy: -1 } }
        ]
    },
    // Leadership (리더십) 관련 문항
    {
        id: 4,
        text: "후배가 실수를 해서 팀이 피해를 입었다. 당신의 피드백 방식은?",
        options: [
            { text: "원인을 분석하게 하고 재발 방지 대책을 스스로 세우게 한다.", scores: { leadership: 3 } },
            { text: "일단 내가 나서서 수습해주고, 나중에 커피 한잔 사주며 위로한다.", scores: { social: 2, leadership: -1 } }
        ]
    },
    {
        id: 5,
        text: "아무도 하기 싫어하는 귀찮고 돋보이지 않는 태스크가 남았다. 어떻게 할 것인가?",
        options: [
            { text: "내가 먼저 총대를 메고 빠르게 치워버려 팀의 부담을 던다.", scores: { leadership: 3, emotion: 1 } },
            { text: "사다리 타기나 공정한 룰을 정해서 역할을 분담하자고 제안한다.", scores: { strategy: 2, social: 1 } }
        ]
    },
    {
        id: 6,
        text: "부서장이 당신에게 중요한 프레젠테이션 리딩을 맡겼다. 어떻게 준비할까?",
        options: [
            { text: "모두를 이끌고 갈 명확한 방향성과 목차를 제시하는 것에 집중한다.", scores: { leadership: 3, strategy: 1 } },
            { text: "눈길을 사로잡을 화려한 디자인과 언변으로 이목을 끄는 데 집중한다.", scores: { emotion: 2, social: 1 } }
        ]
    },
    // Social (사회성) 관련 문항
    {
        id: 7,
        text: "기다리던 점심시간이 되었다! 당신의 선택은?",
        options: [
            { text: "팀원들과 함께 왁자지껄 핫플 맛집으로 향하며 수다를 떤다.", scores: { social: 3 } },
            { text: "자리에서 유튜브를 보며 혼밥의 평화와 에너지를 충전한다.", scores: { social: -3, emotion: 1 } }
        ]
    },
    {
        id: 8,
        text: "탕비실에서 타 부서 사람과 마주쳤다. 어색한 침묵이 흐를 때 행동은?",
        options: [
            { text: "가벼운 스몰토크(날씨, 업무 등)를 자연스럽게 먼저 건넨다.", scores: { social: 3 } },
            { text: "목례만 가볍게 하고 얼른 커피만 뽑아서 내 자리로 돌아간다.", scores: { social: -2 } }
        ]
    },
    {
        id: 9,
        text: "퇴근 10분 전, 갑작스러운 전체 회식 공지가 올라왔다. 당신의 반응은?",
        options: [
            { text: "오예 공짜 고기! 평소 이야기 못 나본 다른 팀원들과 친해질 기회다.", scores: { social: 3, emotion: 1 } },
            { text: "내 저녁 시간... 급한 약속 핑계를 대고 빠질 수 있는지 필사적으로 고민한다.", scores: { social: -3 } }
        ]
    },
    // Emotion (감정) 관련 문항
    {
        id: 10,
        text: "동료가 크게 상심한 일로 남몰래 고민 상담을 해왔다. 당신의 반응은?",
        options: [
            { text: "\"진짜 힘들었겠다ㅠㅠ\" 폭풍 공감하며 같이 분노하고 슬퍼해준다.", scores: { emotion: 3, social: 1 } },
            { text: "\"그럴 땐 이렇게 해봐\" 실질적인 해결책을 스텝별로 고민해서 알려준다.", scores: { strategy: 3, emotion: -2 } }
        ]
    },
    {
        id: 11,
        text: "어려운 프로젝트를 성사시켜서 대표님께 크게 칭찬을 받았다. 오늘 하루 당신은?",
        options: [
            { text: "기분이 하늘을 찌르고 여기저기 친한 동료들에게 자랑하고 싶어 안달이 난다.", scores: { emotion: 3, social: 1 } },
            { text: "엄청 뿌듯하지만 속으로만 기뻐하며 바로 다음 업무 스케줄을 확인한다.", scores: { emotion: -2, strategy: 2 } }
        ]
    },
    {
        id: 12,
        text: "바쁜 와중에 실수로 마시던 커피를 바지에 쏟아버렸다. 당신의 첫 마디와 행동은?",
        options: [
            { text: "\"아아악! 오늘 진짜 머피의 법칙이야!\" 짜증내며 반나절 내내 우울해한다.", scores: { emotion: 3, leadership: -1 } },
            { text: "(아무 말 없이) 빠르게 화장실에 가서 물티슈로 닦고 자리에 돌아와 다시 일한다.", scores: { emotion: -3, strategy: 1 } }
        ]
    }
];

export const CHARACTERS: Character[] = [
    {
        id: "royal_strategist",
        name: "광기어린 책사",
        description: "뛰어난 두뇌로 팀의 위기를 벗어나게 하지만, 가끔 그 해결 방식이 너무 과격하여 주변을 놀라게 합니다. 비효율을 혐오합니다.",
        features: ["플랜 B부터 Z까지 예비", "숨 쉬듯 팩트폭력", "비효율 알레르기"],
        imageUrl: "/images/characters/royal_strategist.png",
        baseScores: { strategy: 9, leadership: 4, social: -3, emotion: -4 }
    },
    {
        id: "mad_king",
        name: "분노조절장애 폭군",
        description: "추진력은 우주 최강! 하지만 언제 터질지 모르는 시한폭탄 같은 카리스마형 리더십의 소유자입니다.",
        features: ["내 말이 곧 사규", "실행력 최강", "가끔 자기 혼자 분노함"],
        imageUrl: "/images/characters/mad_king.png",
        baseScores: { strategy: 3, leadership: 9, social: -2, emotion: 7 }
    },
    {
        id: "social_butterfly_eunuch",
        name: "간에 붙었다 쓸개에 붙는 내시",
        description: "놀라운 사회생활 능력으로 모든 부서 사람들과 친하지만, 진짜 속마음은 아무도 모릅니다.",
        features: ["눈치 100단", "사내 정치 만렙", "모든 회식의 중심"],
        imageUrl: "/images/characters/social_butterfly_eunuch.png",
        baseScores: { strategy: 2, leadership: -2, social: 9, emotion: 3 }
    },
    {
        id: "crying_intern",
        name: "유리멘탈 나인",
        description: "공감 능력은 정말 뛰어나지만 작은 지적에도 쉽게 상처받아 남몰래 우는 여린 마음의 소유자입니다.",
        features: ["리액션 부자", "자주 억울함을 느낌", "마음의 상처가 깊음"],
        imageUrl: "/images/characters/crying_intern.png",
        baseScores: { strategy: -3, leadership: -3, social: 4, emotion: 9 }
    },
    {
        id: "clear_eyed_historian",
        name: "맑은 눈의 사관",
        description: "모든 것을 기록하고 원칙대로 행동합니다. 직급에 굴하지 않고 임원 앞에서도 할 말은 하는 무서운 신입.",
        features: ["원칙주의자", "모든 회의록 녹음", "알파고 마인드"],
        imageUrl: "/images/characters/clear_eyed_historian.png",
        baseScores: { strategy: 7, leadership: 3, social: -4, emotion: -6 }
    },
    {
        id: "silent_general",
        name: "말없는 과묵한 장군",
        description: "불만 없이 뒤에서 묵묵히 팀원들의 일을 돕고, 위기 상황에는 큰 책임까지 짊어지는 든든한 방패입니다.",
        features: ["행동으로 보여줌", "전무후무 의리파", "불평불만 제로"],
        imageUrl: "/images/characters/silent_general.png",
        baseScores: { strategy: 2, leadership: 8, social: 3, emotion: -3 }
    },
    {
        id: "gossip_merchant",
        name: "소문난 보부상",
        description: "회사 내 모든 은밀한 소문을 알고 있으며, 고급 정보 전달을 통해 사내에서 자신의 입지를 탄탄히 다집니다.",
        features: ["사내 정보망의 코어", "은근한 오지랖", "네트워킹의 귀재"],
        imageUrl: "/images/characters/gossip_merchant.png",
        baseScores: { strategy: 5, leadership: -3, social: 8, emotion: 2 }
    },
    {
        id: "zen_monk",
        name: "해탈한 도사",
        description: "회사 일에 더 이상 아무런 감흥이 없습니다. 칼퇴와 워라밸, 그리고 내 마음의 평화가 가장 중요합니다.",
        features: ["무념무상", "칼퇴 요정", "어떤 공격에도 타격감 제로"],
        imageUrl: "/images/characters/zen_monk.png",
        baseScores: { strategy: -5, leadership: -5, social: -5, emotion: -5 }
    }
];
