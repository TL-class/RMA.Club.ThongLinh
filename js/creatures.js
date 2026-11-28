/**
 * ASCIIquarium Deluxe — Rich Marine Species Library (22 Species)
 * All ASCII sprites are carefully escaped and multi-frame animated.
 */

const SPECIES_CATALOG = {
  shark: {
    id: 'shark',
    name: 'Cá Mập Trắng Lớn',
    icon: '🦈',
    category: 'predator',
    speedRange: [1.3, 1.95],
    depthRange: [0.22, 0.65],
    desc: 'Chúa tể đại dương tuần tra oai vệ với hàm răng sắc nhọn và vây lưng đặc trưng.',
    baseColor: '#7dd3fc',
    framesRight: [
      [
        "                              __",
        "                             ( `\\",
        "  ,                          )   `\\",
        ";' `.                        (     `\\__",
        " ;   `.             __..---''          `~~~~-._",
        "  ;    `.____...--''     b)                    `--._",
        "   ;        _.-'     )).       ......-----.....     `\\",
        "    ;'  _.-'   |/|/|/|)-.....''                ``--._  )",
        "   ;  .'       ` ' ' '               .....---'''''```-'",
        "  ;  /                  ....----'''''",
        " ;  /    ...----''''''''",
        " `-'---''"
      ],
      [
        "                              __",
        "                             ( `\\",
        "  `.                         )   `\\",
        "  ; `.                       (     `\\__",
        "   ;  `.            __..---''          `~~~~-._",
        "    ;   `.____...--''    b)                    `--._",
        "   ;        _.-'     )).       ......-----.....     `\\",
        "  ;'    _.-'   |/|/|/|)-.....''                ``--._  )",
        " ;    .'       ` ' ' '               .....---'''''```-'",
        ";    /                  ....----'''''",
        "`;  /    ...----''''''''",
        " `-'---''"
      ]
    ],
    framesLeft: [
      [
        "                     __",
        "                    /' )",
        "                  /'   (                          ,",
        "              __/'     )                        .' `;",
        "      _.-~~~~'          ``---..__             .'   ;",
        " _.--'                    (d     ``--...____.'    ;",
        "/'     .....-----......       .((     `-._        ;",
        "(  _.--''                ``.....-(|\\|\\|\\|   `-._  ';",
        "`-```'''''---.....               ' ' ' '       `.  ;",
        "                  '''''----....                  \\  ;",
        "                               ''''''''----...    \\  ;",
        "                                              ``---`-'"
      ],
      [
        "                     __",
        "                    /' )",
        "                  /'   (                         .'",
        "              __/'     )                       .' ;",
        "      _.-~~~~'          ``---..__            .'  ;",
        " _.--'                    (d     ``--...____.'   ;",
        "/'     .....-----......       .((     `-._        ;",
        "(  _.--''                ``.....-(|\\|\\|\\|   `-._    ';",
        "`-```'''''---.....               ' ' ' '       `.    ;",
        "                  '''''----....                  \\    ;",
        "                               ''''''''----...    \\  ;'",
        "                                              ``---`-'"
      ]
    ],
    colorRows: ['#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe', '#f8fafc', '#f8fafc', '#cbd5e1', '#fca5a5', '#94a3b8', '#64748b', '#475569', '#334155']
  },

  whale: {
    id: 'whale',
    name: 'Cá Voi Xanh Khổng Lồ',
    icon: '🐋',
    category: 'giant',
    speedRange: [0.65, 1.0],
    depthRange: [0.16, 0.42],
    desc: 'Sinh vật lớn nhất hành tinh, thỉnh thoảng phun cột nước trắng xóa lên mặt biển.',
    baseColor: '#60a5fa',
    framesRight: [
      [
        "              .       .",
        "               \\     /",
        "            .---'---'---.",
        "          .'             `.",
        "        .'    o            `._",
        "       ;                      `--..__",
        "      ;                              `--.._",
        "      ;       _______________________      `\\",
        "       ;     (_______________________)      /",
        "        `.                               _.'",
        "          `-.____                 ____.-'",
        "                 `''-----------''`"
      ],
      [
        "             ~ .     . ~",
        "               \\     /",
        "            .---'---'---.",
        "          .'             `.",
        "        .'    o            `._",
        "       ;                      `--..__",
        "      ;                              `--.._",
        "      ;       _______________________      /",
        "       ;     (_______________________)     \\",
        "        `.                               _.'",
        "          `-.____                 ____.-'",
        "                 `''-----------''`"
      ]
    ],
    framesLeft: [
      [
        "                  .       .",
        "                   \\     /",
        "                .---'---'---.",
        "              .'             `.",
        "          _.-'            o    `.",
        "    __..--'                      ;",
        " _..--'                          ;",
        "/'      _______________________  ;",
        "\\      (_______________________) ;",
        " `._                           .'",
        "    `-.__                 ____.-'",
        "         `''-----------''`"
      ],
      [
        "                 ~ .     . ~",
        "                   \\     /",
        "                .---'---'---.",
        "              .'             `.",
        "          _.-'            o    `.",
        "    __..--'                      ;",
        " _..--'                          ;",
        "\\       _______________________  ;",
        "/      (_______________________) ;",
        " `._                           .'",
        "    `-.__                 ____.-'",
        "         `''-----------''`"
      ]
    ],
    colorRows: ['#e0f2fe', '#bae6fd', '#60a5fa', '#3b82f6', '#93c5fd', '#3b82f6', '#2563eb', '#dbeafe', '#bfdbfe', '#60a5fa', '#3b82f6', '#1d4ed8']
  },

  dolphin: {
    id: 'dolphin',
    name: 'Cá Heo Mũi Chai',
    icon: '🐬',
    category: 'graceful',
    speedRange: [1.5, 2.2],
    depthRange: [0.16, 0.55],
    desc: 'Chú cá heo thông minh bơi lượn theo đường sóng sin uyển chuyển đầy sức sống.',
    baseColor: '#38bdf8',
    framesRight: [
      [
        "          __",
        "      _.-'  `'-._",
        "   .-'     (o)   `'-.",
        " ><___..---'''''---.._>",
        "        `---.___.-'"
      ],
      [
        "          __",
        "      _.-'  `'-._",
        "   .-'     (o)   `'-.",
        " >=<__..---'''''---.._>",
        "        `---.___.-'"
      ]
    ],
    framesLeft: [
      [
        "           __",
        "       _.-'  `'-._",
        "    .-'   (o)     `'-.",
        " <_..---'''''---..___><",
        "      `-.____.---'"
      ],
      [
        "           __",
        "       _.-'  `'-._",
        "    .-'   (o)     `'-.",
        " <_..---'''''---..__>=<",
        "      `-.____.---'"
      ]
    ],
    colorRows: ['#bae6fd', '#7dd3fc', '#38bdf8', '#e0f2fe', '#0284c7']
  },

  narwhal: {
    id: 'narwhal',
    name: 'Kỳ Lân Biển Narwhal',
    icon: '🦄',
    category: 'giant',
    speedRange: [1.1, 1.6],
    depthRange: [0.20, 0.60],
    desc: 'Sinh vật Bắc Cực huyền thoại với chiếc ngà xoắn ốc ánh vàng dài vút phía trước.',
    baseColor: '#a5f3fc',
    framesRight: [
      [
        "      .---'''''---.",
        "    .'   *  *  (o) `.",
        " ><(_________________)=====----",
        "    `.             .'",
        "      `''-------''`"
      ],
      [
        "      .---'''''---.",
        "    .'  *  *   (o) `.",
        " >=<_________________)=====----",
        "    `.             .'",
        "      `''-------''`"
      ]
    ],
    framesLeft: [
      [
        "           .---'''''---.",
        "         .' (o)  *  *   `.",
        "----=====(_________________)><<",
        "         `.             .'",
        "           `''-------''`"
      ],
      [
        "           .---'''''---.",
        "         .' (o)   *  *  `.",
        "----=====(_________________>=<",
        "         `.             .'",
        "           `''-------''`"
      ]
    ],
    colorRows: ['#cffafe', '#67e8f9', '#fde047', '#22d3ee', '#06b6d4']
  },

  angelfish: {
    id: 'angelfish',
    name: 'Cá Thần Tiên Hoàng Kim',
    icon: '🐠',
    category: 'tropical',
    speedRange: [0.85, 1.45],
    depthRange: [0.18, 0.78],
    desc: 'Dáng hình thoi thanh lịch với các sọc ánh kim rực rỡ, rất thích ăn mồi nổi.',
    baseColor: '#fde047',
    framesRight: [
      [
        "    \\",
        "   / \\",
        " >=(')>",
        "   \\ /",
        "    /"
      ],
      [
        "    /",
        "   / \\",
        " >=(')>",
        "   \\ /",
        "    \\"
      ]
    ],
    framesLeft: [
      [
        "   /",
        "  / \\",
        " <(')=<",
        "  \\ /",
        "   \\"
      ],
      [
        "   \\",
        "  / \\",
        " <(')=<",
        "  \\ /",
        "   /"
      ]
    ],
    colorRows: ['#67e8f9', '#fde047', '#fb7185', '#fde047', '#67e8f9']
  },

  clownfish: {
    id: 'clownfish',
    name: 'Cá Hề Nemo',
    icon: '🐡',
    category: 'tropical',
    speedRange: [1.0, 1.65],
    depthRange: [0.35, 0.85],
    desc: 'Chú cá cam sọc trắng tinh nghịch, thường bơi lượn quanh các rạn san hô.',
    baseColor: '#fb923c',
    framesRight: [
      [
        "  _.-.",
        "><_||_o>",
        "  `'-'"
      ],
      [
        "  _.-.",
        ">=_||_o>",
        "  `'-'"
      ]
    ],
    framesLeft: [
      [
        "  .-._",
        "<o_||_><",
        "  `-'`"
      ],
      [
        "  .-._",
        "<o_||_=<",
        "  `-'`"
      ]
    ],
    colorRows: ['#fb923c', '#ffffff', '#fb923c']
  },

  neon: {
    id: 'neon',
    name: 'Cá Neon Xanh Đỏ (Bơi Đàn)',
    icon: '🐟',
    category: 'school',
    speedRange: [1.35, 2.1],
    depthRange: [0.16, 0.72],
    desc: 'Loài cá nhỏ phát sáng dải xanh-đỏ rực rỡ, luôn di chuyển theo đàn đồng bộ.',
    baseColor: '#22d3ee',
    framesRight: [
      [">><(((o>"],
      [">=<(((o>"]
    ],
    framesLeft: [
      ["<o)))><<"],
      ["<o)))>=<"]
    ],
    colorRows: ['#22d3ee']
  },

  stripedTropical: {
    id: 'stripedTropical',
    name: 'Cá Bướm Sọc Hồng',
    icon: '🐠',
    category: 'tropical',
    speedRange: [0.9, 1.5],
    depthRange: [0.22, 0.82],
    desc: 'Cá nhiệt đới sọc nhiều màu lấy nguyên mẫu từ giao diện terminal Ubuntu.',
    baseColor: '#f472b6',
    framesRight: [
      [
        "   \\  /--\\",
        "  >=  (o>",
        "   /  \\__/"
      ],
      [
        "   /  /--\\",
        "  >=  (o>",
        "   \\  \\__/"
      ]
    ],
    framesLeft: [
      [
        "  /--\\  /",
        " <o)  =<",
        "  \\__/  \\"
      ],
      [
        "  /--\\  \\",
        " <o)  =<",
        "  \\__/  /"
      ]
    ],
    colorRows: ['#a7f3d0', '#f472b6', '#a7f3d0']
  },

  pufferfish: {
    id: 'pufferfish',
    name: 'Cá Nóc Phồng Gai',
    icon: '🐡',
    category: 'special',
    speedRange: [0.7, 1.2],
    depthRange: [0.28, 0.80],
    desc: 'Bình thường nhỏ nhắn đáng yêu, nhưng sẽ phồng to đầy gai khi bạn click vào!',
    baseColor: '#facc15',
    framesRight: [
      [
        "  .-.",
        "><(o)>",
        "  `-'"
      ],
      [
        "  \\ | /",
        " -.(o).-",
        "=(  O  )>",
        " -'`-' -",
        "  / | \\"
      ]
    ],
    framesLeft: [
      [
        "  .-.",
        "<(o)><",
        "  `-'"
      ],
      [
        "  \\ | /",
        " -.(o).-",
        "<(  O  )=",
        " -'`-' -",
        "  / | \\"
      ]
    ],
    colorRows: ['#fde047', '#fef08a', '#f59e0b', '#fef08a', '#fde047']
  },

  swordfish: {
    id: 'swordfish',
    name: 'Cá Kiếm Tốc Độ',
    icon: '🗡️',
    category: 'fast',
    speedRange: [2.4, 3.5],
    depthRange: [0.18, 0.55],
    desc: 'Vận động viên nước rút của đại dương với chiếc mũi kiếm dài xé nước.',
    baseColor: '#38bdf8',
    framesRight: [
      [
        "      /|",
        "  ><===(')----",
        "      \\|"
      ],
      [
        "      /|",
        "  >=<==(')----",
        "      \\|"
      ]
    ],
    framesLeft: [
      [
        "       |\\",
        "----(')===><",
        "       |/"
      ],
      [
        "       |\\",
        "----(')==>=<",
        "       |/"
      ]
    ],
    colorRows: ['#7dd3fc', '#e0f2fe', '#7dd3fc']
  },

  stingray: {
    id: 'stingray',
    name: 'Cá Đuối Manta',
    icon: '🛸',
    category: 'graceful',
    speedRange: [0.95, 1.45],
    depthRange: [0.35, 0.78],
    desc: 'Sải cánh mềm mại như đang bay lượn giữa làn nước xanh thẳm.',
    baseColor: '#c084fc',
    framesRight: [
      [
        "    _.-~-._",
        "---'  (o)  `>",
        "    `-._.-'"
      ],
      [
        "    _.---._",
        "~~~'  (o)  `>",
        "    `-~-~-'"
      ]
    ],
    framesLeft: [
      [
        "    _.-~-._",
        " <'  (o)  `---",
        "    `-._.-'"
      ],
      [
        "    _.---._",
        " <'  (o)  `~~~",
        "    `-~-~-'"
      ]
    ],
    colorRows: ['#d8b4fe', '#f3e8ff', '#a855f7']
  },

  squid: {
    id: 'squid',
    name: 'Mực Ống Phản Lực',
    icon: '🦑',
    category: 'fast',
    speedRange: [1.3, 2.0],
    depthRange: [0.25, 0.75],
    desc: 'Bơi giật lùi bằng lực đẩy phản lực cực nhanh với chùm xúc tu dài phía sau.',
    baseColor: '#f472b6',
    framesRight: [
      [
        "      _.-.",
        " ~~~=( o  >",
        "      `-'-'"
      ],
      [
        "      _.-.",
        " ===<( o  >",
        "      `-'-'"
      ]
    ],
    framesLeft: [
      [
        "  .-._",
        " <  o )=~~~",
        "  `-'`"
      ],
      [
        "  .-._",
        " <  o )>===",
        "  `-'`"
      ]
    ],
    colorRows: ['#fbcfe8', '#f472b6', '#db2777']
  },

  jellyfish: {
    id: 'jellyfish',
    name: 'Sứa Phát Quang',
    icon: '🪼',
    category: 'drifter',
    speedRange: [0.25, 0.5],
    depthRange: [0.20, 0.75],
    desc: 'Trôi bồng bềnh theo nhịp co bóp của dù sứa, phát ánh sáng tím hồng huyền ảo.',
    baseColor: '#f0abfc',
    framesRight: [
      [
        "  .---.",
        " ( o o )",
        "  ) | (",
        " (  |  )",
        "  )   ("
      ],
      [
        " .-----.",
        "(  o o  )",
        " (  |  )",
        "  ) | (",
        " (     )"
      ]
    ],
    framesLeft: [
      [
        "  .---.",
        " ( o o )",
        "  ) | (",
        " (  |  )",
        "  )   ("
      ],
      [
        " .-----.",
        "(  o o  )",
        " (  |  )",
        "  ) | (",
        " (     )"
      ]
    ],
    colorRows: ['#f5d0fe', '#e879f9', '#c084fc', '#a855f7', '#7e22ce']
  },

  turtle: {
    id: 'turtle',
    name: 'Rùa Biển Xanh',
    icon: '🐢',
    category: 'graceful',
    speedRange: [0.6, 1.0],
    depthRange: [0.25, 0.75],
    desc: 'Lão rùa biển điềm đạm với chiếc mai hoa văn lục giác cổ kính.',
    baseColor: '#4ade80',
    framesRight: [
      [
        "    _____",
        "  .'#/\\#'.",
        "-(_######_)o>",
        "   '\\  /'"
      ],
      [
        "    _____",
        "  .'#/\\#'.",
        "-(_######_)o>",
        "   '/  \\'"
      ]
    ],
    framesLeft: [
      [
        "     _____",
        "   .'#/\\#'.",
        "<o(_######_)-",
        "    '\\  /'"
      ],
      [
        "     _____",
        "   .'#/\\#'.",
        "<o(_######_)-",
        "    '/  \\'"
      ]
    ],
    colorRows: ['#86efac', '#22c55e', '#4ade80', '#bbf7d0']
  },

  seahorse: {
    id: 'seahorse',
    name: 'Cá Ngựa Nhỏ',
    icon: '🐴',
    category: 'drifter',
    speedRange: [0.35, 0.65],
    depthRange: [0.40, 0.85],
    desc: 'Bơi thẳng đứng duyên dáng với chiếc đuôi cuộn tròn như dấu hỏi.',
    baseColor: '#fbbf24',
    framesRight: [
      [
        "  _o>",
        " ( (",
        "  ) )",
        " ( (",
        "  `_)"
      ],
      [
        "  _o>",
        " ( (",
        "  ) )",
        " ( (",
        "  `_)"
      ]
    ],
    framesLeft: [
      [
        " <o_",
        "  ) )",
        " ( (",
        "  ) )",
        " (_'"
      ],
      [
        " <o_",
        "  ) )",
        " ( (",
        "  ) )",
        " (_'"
      ]
    ],
    colorRows: ['#fde047', '#facc15', '#eab308', '#facc15', '#ca8a04']
  },

  mermaid: {
    id: 'mermaid',
    name: 'Nàng Tiên Cá',
    icon: '🧜‍♀️',
    category: 'graceful',
    speedRange: [0.85, 1.25],
    depthRange: [0.22, 0.62],
    desc: 'Nhân vật huyền thoại kinh điển của asciiquarium với mái tóc vàng óng ả.',
    baseColor: '#f9a8d4',
    framesRight: [
      [
        "      .-.",
        "     ( o )",
        "  .-' /|\\ '-.",
        "><___/ | \\___)",
        "       ~"
      ],
      [
        "      .-.",
        "     ( o )",
        "  .-' /|\\ '-.",
        ">=<__/ | \\___)",
        "       ~"
      ]
    ],
    framesLeft: [
      [
        "      .-.",
        "     ( o )",
        "  .-' /|\\ '-.",
        "(___/ | \\___><",
        "       ~"
      ],
      [
        "      .-.",
        "     ( o )",
        "  .-' /|\\ '-.",
        "(___/ | \\__>=<",
        "       ~"
      ]
    ],
    colorRows: ['#fde047', '#fbcfe8', '#f472b6', '#34d399', '#6ee7b7']
  },

  anglerfish: {
    id: 'anglerfish',
    name: 'Cá Lồng Đèn Biển Sâu',
    icon: '🏮',
    category: 'predator',
    speedRange: [0.75, 1.15],
    depthRange: [0.58, 0.86],
    desc: 'Sống ở tầng nước sâu với chiếc đèn lồng phát sáng rực rỡ treo trước trán.',
    baseColor: '#f87171',
    framesRight: [
      [
        "      .--*",
        "   .-'   \\",
        " >=(  (o) >",
        "   `-.___/"
      ],
      [
        "      .--o",
        "   .-'   \\",
        " >=(  (o) >",
        "   `-.___/"
      ]
    ],
    framesLeft: [
      [
        "  *--.",
        " /   `-.",
        "< (o)  )=<",
        " \\___.-'"
      ],
      [
        "  o--.",
        " /   `-.",
        "< (o)  )=<",
        " \\___.-'"
      ]
    ],
    colorRows: ['#fef08a', '#fca5a5', '#f87171', '#ef4444']
  },

  octopus: {
    id: 'octopus',
    name: 'Bạch Tuộc Đỏ',
    icon: '🐙',
    category: 'bottom',
    speedRange: [0.45, 0.8],
    depthRange: [0.65, 0.88],
    desc: 'Chuyên gia ngụy trang uốn lượn 8 xúc tu mềm mại gần đáy đại dương.',
    baseColor: '#fb7185',
    framesRight: [
      [
        "   .---.",
        "  ( o o )",
        " /|\\ | /|\\",
        "/ | \\|/ | \\"
      ],
      [
        "   .---.",
        "  ( o o )",
        " \\|/ | \\|/",
        "\\ | /|\\ | /"
      ]
    ],
    framesLeft: [
      [
        "   .---.",
        "  ( o o )",
        " /|\\ | /|\\",
        "/ | \\|/ | \\"
      ],
      [
        "   .---.",
        "  ( o o )",
        " \\|/ | \\|/",
        "\\ | /|\\ | /"
      ]
    ],
    colorRows: ['#fda4af', '#fb7185', '#f43f5e', '#e11d48']
  },

  crab: {
    id: 'crab',
    name: 'Cua Hoàng Đế',
    icon: '🦀',
    category: 'bottom',
    speedRange: [0.4, 0.75],
    depthRange: [0.92, 0.95],
    desc: 'Bò ngang cần mẫn trên lớp cát đáy bể, giơ cao đôi càng chắc khỏe.',
    baseColor: '#f97316',
    framesRight: [
      [
        " (\\)   (/)",
        "  ( o_o )",
        " /|_____|\\"
      ],
      [
        " (|)   (|)",
        "  ( o_o )",
        " \\|_____|/"
      ]
    ],
    framesLeft: [
      [
        " (\\)   (/)",
        "  ( o_o )",
        " /|_____|\\"
      ],
      [
        " (|)   (|)",
        "  ( o_o )",
        " \\|_____|/"
      ]
    ],
    colorRows: ['#fdba74', '#fb923c', '#ea580c']
  },

  submarine: {
    id: 'submarine',
    name: 'Tàu Ngầm Thám Hiểm',
    icon: '🚤',
    category: 'special',
    speedRange: [1.1, 1.5],
    depthRange: [0.22, 0.55],
    desc: 'Tàu ngầm vàng thám hiểm đáy biển với kính tiềm vọng và chân vịt sủi bọt.',
    baseColor: '#facc15',
    framesRight: [
      [
        "      _|_",
        "  .---' '---.",
        "=(  [o] [o]  )>",
        "  `---------'"
      ],
      [
        "      _|_",
        "  .---' '---.",
        "+(  [o] [o]  )>",
        "  `---------'"
      ]
    ],
    framesLeft: [
      [
        "      _|_",
        "  .---' '---.",
        "<(  [o] [o]  )=",
        "  `---------'"
      ],
      [
        "      _|_",
        "  .---' '---.",
        "<(  [o] [o]  )+",
        "  `---------'"
      ]
    ],
    colorRows: ['#fef08a', '#fde047', '#facc15', '#eab308']
  },

  duck: {
    id: 'duck',
    name: 'Vịt Bơi Mặt Nước',
    icon: '🦆',
    category: 'surface',
    speedRange: [0.7, 1.1],
    depthRange: [0, 0],
    desc: 'Chú vịt nhỏ thong thả bơi bập bềnh ngay trên làn sóng mặt biển.',
    baseColor: '#fde047',
    framesRight: [
      [
        "  _.",
        "=(o )__",
        " ( ._> /"
      ],
      [
        "  _.",
        "=(o )__",
        " ( ._< /"
      ]
    ],
    framesLeft: [
      [
        "   ._",
        "__( o)=",
        "\\ <_. )"
      ],
      [
        "   ._",
        "__( o)=",
        "\\ >_. )"
      ]
    ],
    colorRows: ['#fef08a', '#fde047', '#fb923c']
  },

  ship: {
    id: 'ship',
    name: 'Thuyền Buồm Hải Tặc',
    icon: '⛵',
    category: 'surface',
    speedRange: [0.55, 0.85],
    depthRange: [0, 0],
    desc: 'Con tàu buồm lớn lướt sóng trên mặt đại dương như trong bản gốc asciiquarium.',
    baseColor: '#e2e8f0',
    framesRight: [
      [
        "     |    |    |",
        "    )_)  )_)  )_)",
        "   )___))___))___)\\",
        "  )____)____)_____)\\",
        "_____|____|____|____\\\\__",
        "\\                   /"
      ],
      [
        "     |    |    |",
        "    )_)  )_)  )_)",
        "   )___))___))___)\\",
        "  )____)____)_____)\\",
        "_____|____|____|____\\\\__",
        "\\                   /"
      ]
    ],
    framesLeft: [
      [
        "    |    |    |",
        "   (_(  (_(  (_(",
        "  /(___((___((___(",
        " /((____(____(____(",
        "__//____|____|____|_____",
        " \\                   /"
      ],
      [
        "    |    |    |",
        "   (_(  (_(  (_(",
        "  /(___((___((___(",
        " /((____(____(____(",
        "__//____|____|____|_____",
        " \\                   /"
      ]
    ],
    colorRows: ['#f8fafc', '#e2e8f0', '#cbd5e1', '#94a3b8', '#d97706', '#b45309']
  }
};

// Sunken Castle & Treasure Scenery ASCII
const CASTLE_ART = [
  "      |>>>                    |>>>",
  "      |                       |",
  "  _  _|_  _               _  _|_  _",
  " | |_| |_| |             | |_| |_| |",
  " \\  .      /             \\      .  /",
  "  |   []  |_______________|  []   |",
  "  |       |  _    _    _  |       |",
  "  |  []   | | |  | |  | | |   []  |",
  "  |_______|_|_|__|_|__|_|_|_______|"
];

const CHEST_CLOSED = [
  "  .-------.",
  " /_______/|",
  " |  [=]  ||",
  " |_______|/"
];

const CHEST_OPEN = [
  "  .-------.",
  " / * $ * /|",
  " |~~~~~~~||",
  " |_______|/"
];
