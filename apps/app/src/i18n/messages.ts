export const APP_LOCALES = ["zh-CN", "en"] as const;

export type AppLocale = (typeof APP_LOCALES)[number];

const en = {
  metadata: {
    title: "Motion Agent Console",
    description:
      "A precision console for agent chat, shot records, and preview state.",
  },
  layout: {
    eyebrow: "Motion Agent",
    title: "Agent Console",
    status: {
      streaming: "Running",
      thinking: "Syncing",
      idle: "Idle",
    },
    themeLabel: {
      dark: "Dark",
      light: "Light",
    },
    themeToggleAriaLabel: {
      dark: "Switch to light theme",
      light: "Switch to dark theme",
    },
    meta: {
      workspace: "Workspace",
      workspaceValue: "Motion Timeline",
      activeAgent: "Active Agent",
      activeAgentValue: "Storyboard Agent",
      sync: "Sync",
      syncReady: "Linked",
      syncIdle: "Standby",
      surface: "Surface",
    },
    rail: {
      eyebrow: "Chat",
      title: "Agent Thread",
      description: "Draft, revise, and sync the current motion workspace.",
    },
  },
  modeToggle: {
    chat: "Chat",
    app: "Board",
    ariaLabel: "Workspace surface switcher",
  },
  chat: {
    errorTitle: "Chat error",
    dismiss: "Dismiss",
    emptyEyebrow: "Agent thread",
    emptyTitle: "Start an agent run",
    emptyDescription:
      "Ask for an exact change to the current brief, shot records, or preview state.",
    chips: {
      concepts: "Rewrite brief",
      shotTable: "Update shots",
      previewShell: "Sync preview",
    },
    assistantLabel: "Agent",
    live: "Live",
    copy: "Copy",
    retry: "Retry",
    thinking: "Thinking",
    sendError: "Message failed to send. Try again.",
    placeholder: "Ask for a concrete change to the current workspace",
    approvalHint: "Resolve the pending approval before sending another turn.",
    enterHint: "Press Enter to send. Shift + Enter for a new line.",
    stop: "Stop",
    send: "Send",
  },
  canvas: {
    eyebrow: "Board",
    title: "Shot Board",
    description:
      "Edit the brief, shot records, image contracts, and preview state from one surface.",
    summary: {
      shots: "Shots",
      duration: "Duration",
      durationUnit: "s",
      ready: "Ready",
    },
    addShot: "Add shot",
    brief: {
      eyebrow: "Brief",
      title: "Project scope",
      description:
        "Lock the scope before you revise shot records, image jobs, or preview state.",
      fields: {
        projectTitle: "Project title",
        scriptTitle: "Script title",
        concept: "Concept",
        audience: "Audience",
        deliverable: "Deliverable",
        creativeDirection: "Creative direction",
        narrationTone: "Narration tone",
        aspectRatio: "Aspect ratio",
        revisionNotes: "Revision notes",
      },
    },
    table: {
      eyebrow: "Shots",
      title: "Shot records",
      description:
        "Each row is a live record with goal, narration, prompt, timing, and state.",
      columns: {
        shot: "Shot",
        sceneGoal: "Scene goal",
        narration: "Narration",
        imagePrompt: "Image prompt",
        visualStyle: "Visual style",
        duration: "Duration",
        status: "Status",
        actions: "Actions",
      },
      shotLabel: "Shot {number}",
      moveUp: "Move up",
      moveDown: "Move down",
      delete: "Delete",
    },
    emptyState: {
      eyebrow: "No shots",
      title: "No shot records yet",
      description:
        "Add the first shot or ask the agent to draft an initial pass.",
      addFirstShot: "Add the first shot",
    },
    status: {
      draft: "Draft",
      generating: "Generating",
      ready: "Ready",
      failed: "Failed",
    },
    jobs: {
      eyebrow: "Image queue",
      title: "Generation contract",
      description:
        "Track provider, model, seed, and output per shot without changing the shared state model.",
      empty:
        "Add a shot to stage its generation contract. Provider binding can land later without changing the model.",
      promptFallback: "No image prompt staged yet.",
      providerPlaceholder: "Provider TBD",
      modelPlaceholder: "Model TBD",
      outputPlaceholder: "Local file path or future asset URL",
      defaultError: "Image generation needs a retry or prompt revision.",
      fields: {
        provider: "Provider",
        model: "Model",
        seed: "Seed",
        outputUrl: "Output URL",
      },
      actions: {
        queue: "Queue",
        markReady: "Mark ready",
        markFailed: "Mark failed",
        reset: "Reset",
      },
      statusLabels: {
        idle: "Idle",
        queued: "Queued",
        running: "Running",
        ready: "Ready",
        failed: "Failed",
      },
    },
    preview: {
      eyebrow: "Preview state",
      title: "Timeline staging",
      description:
        "The preview mirrors the current shot list and keeps the Remotion handoff path clear.",
      compositionId: "Composition",
      totalScenes: "Scenes",
      status: "Status",
      lastRefresh: "Last preview refresh",
      refresh: "Refresh preview",
      placeholder: "Awaiting image output or timeline component binding.",
      emptyTitle: "No preview scenes yet",
      emptyDescription:
        "Once the shot list exists, the preview will stage one scene entry per shot.",
      statusLabels: {
        idle: "Idle",
        staged: "Staged",
        ready: "Ready",
      },
    },
    defaults: {
      projectTitle: "Launch concept, campaign beat, or episode name",
      scriptTitle: "Narrative arc or sequence name",
      concept: "Describe the idea, promise, and desired viewer takeaway.",
      audience: "Who is this cut for?",
      deliverable: "Example: 15s vertical storyboard",
      creativeDirection: "Visual mood, camera language, and reference cues",
      narrationTone: "Clear, cinematic, concise",
      aspectRatio: "9:16",
      revisionNotes: "What needs to change on the next pass?",
      shotTitle: "Opening frame, reveal, payoff...",
      sceneGoal: "What must this shot accomplish?",
      narration: "Voiceover, supers, or spoken beat",
      imagePrompt: "Prompt copy for the shot image",
      visualStyle: "Lighting, texture, lens, color mood",
    },
  },
  charts: {
    noData: "No data available",
  },
  meeting: {
    title: "Schedule a Meeting",
    prompt: "Select a time that works for you",
    scheduledTitle: "Meeting Scheduled",
    selectedSlotSummary: "{date} at {time}",
    declinedTitle: "No Time Selected",
    declinedDescription: "Let me find a better time that works for you",
    durationLabel: "Duration",
    durationUnit: "min",
    noneOfTheseWork: "None of these work",
    scheduledResponse: "Meeting scheduled for {date} at {time}",
    scheduledResponseWithDuration:
      "Meeting scheduled for {date} at {time} ({duration}).",
    declineResponse:
      "The user declined all proposed meeting times. Please suggest alternative times or ask for their availability.",
    defaultSlots: [
      { date: "Tomorrow", time: "2:00 PM", duration: "30 min" },
      { date: "Friday", time: "10:00 AM", duration: "30 min" },
      { date: "Next Monday", time: "3:00 PM", duration: "30 min" },
    ],
  },
  suggestions: [
    {
      title: "Draft six shots",
      message:
        "Draft a 6-shot storyboard for a 15-second vertical launch reel about an AI motion workspace.",
    },
    {
      title: "Compress pacing",
      message:
        "Revise the current shot table to feel faster and more premium, but keep the story under 20 seconds.",
    },
    {
      title: "Shift to product proof",
      message:
        "Turn the concept into a storyboard that emphasizes product proof points over brand mood.",
    },
    {
      title: "Rewrite prompts",
      message:
        "Review the current shots and rewrite the image prompts so they are more cinematic and reproducible.",
    },
  ],
  toolReasoning: {
    toolNames: {
      toggleTheme: "Toggle theme",
      pieChart: "Pie chart",
      barChart: "Bar chart",
      scheduleTime: "Schedule meeting",
      enableAppMode: "Open board",
      enableChatMode: "Open chat",
      get_motion_workspace: "Load workspace",
      save_motion_workspace: "Save workspace",
    },
    argLabels: {
      reasonForScheduling: "Reason",
      meetingDuration: "Duration",
      project: "Project",
      script: "Script",
      preview: "Preview",
    },
    arraySummary: "{count} items",
    objectSummary: "{count} keys",
  },
};

type AppMessages = typeof en;

export const DEFAULT_LOCALE: AppLocale = "zh-CN";

export const messages: Record<AppLocale, AppMessages> = {
  "zh-CN": {
    metadata: {
      title: "Motion Agent 控制台",
      description: "一个面向智能体对话、镜头记录与预览状态的精密控制台。",
    },
    layout: {
      eyebrow: "Motion Agent",
      title: "Agent 控制台",
      status: {
        streaming: "执行中",
        thinking: "同步中",
        idle: "待命",
      },
      themeLabel: {
        dark: "深色",
        light: "浅色",
      },
      themeToggleAriaLabel: {
        dark: "切换到浅色主题",
        light: "切换到深色主题",
      },
      meta: {
        workspace: "工作区",
        workspaceValue: "Motion 时间线",
        activeAgent: "当前智能体",
        activeAgentValue: "分镜智能体",
        sync: "同步",
        syncReady: "已联通",
        syncIdle: "待同步",
        surface: "界面",
      },
      rail: {
        eyebrow: "对话",
        title: "智能体线程",
        description: "在这里起草、修订，并同步当前 motion 工作区的状态。",
      },
    },
    modeToggle: {
      chat: "对话",
      app: "看板",
      ariaLabel: "工作区视图切换",
    },
    chat: {
      errorTitle: "对话出错",
      dismiss: "关闭",
      emptyEyebrow: "智能体线程",
      emptyTitle: "开始一次智能体运行",
      emptyDescription:
        "直接说明你要修改的 brief、镜头记录或预览状态，不要给泛泛的演示指令。",
      chips: {
        concepts: "重写 brief",
        shotTable: "更新镜头",
        previewShell: "同步预览",
      },
      assistantLabel: "智能体",
      live: "实时",
      copy: "复制",
      retry: "重试",
      thinking: "思考中",
      sendError: "消息发送失败，请重试。",
      placeholder: "直接要求修改当前工作区中的具体状态",
      approvalHint: "请先处理待定审批，再发送下一轮消息。",
      enterHint: "回车发送，Shift + 回车换行。",
      stop: "停止",
      send: "发送",
    },
    canvas: {
      eyebrow: "看板",
      title: "镜头看板",
      description: "在同一个界面里编辑 brief、镜头记录、图片契约和预览状态。",
      summary: {
        shots: "镜头数",
        duration: "时长",
        durationUnit: "秒",
        ready: "就绪",
      },
      addShot: "添加镜头",
      brief: {
        eyebrow: "Brief",
        title: "项目范围",
        description: "先锁定项目范围，再去修订镜头记录、图片任务和预览状态。",
        fields: {
          projectTitle: "项目标题",
          scriptTitle: "脚本标题",
          concept: "概念",
          audience: "受众",
          deliverable: "交付物",
          creativeDirection: "创意方向",
          narrationTone: "旁白语气",
          aspectRatio: "画幅比例",
          revisionNotes: "修订备注",
        },
      },
      table: {
        eyebrow: "镜头",
        title: "镜头记录",
        description:
          "每一行都是一个实时镜头记录，包含目标、旁白、提示词、时长与状态。",
        columns: {
          shot: "镜头",
          sceneGoal: "场景目标",
          narration: "旁白",
          imagePrompt: "图片提示词",
          visualStyle: "视觉风格",
          duration: "时长",
          status: "状态",
          actions: "操作",
        },
        shotLabel: "镜头 {number}",
        moveUp: "上移",
        moveDown: "下移",
        delete: "删除",
      },
      emptyState: {
        eyebrow: "暂无镜头",
        title: "还没有镜头记录",
        description: "先添加第一条镜头，或让智能体起草第一轮初稿。",
        addFirstShot: "添加第一条镜头",
      },
      status: {
        draft: "草稿",
        generating: "生成中",
        ready: "已就绪",
        failed: "失败",
      },
      jobs: {
        eyebrow: "图片队列",
        title: "生成契约",
        description:
          "这一层只记录 provider、model、seed 和输出句柄，不改动共享状态模型。",
        empty:
          "先添加镜头，再为它建立生成契约。后续接入具体 provider 时不需要改动模型。",
        promptFallback: "还没有为这个镜头准备图片提示词。",
        providerPlaceholder: "待定 provider",
        modelPlaceholder: "待定 model",
        outputPlaceholder: "本地文件路径或未来的资产 URL",
        defaultError: "图片生成需要重试，或需要重新改写提示词。",
        fields: {
          provider: "Provider",
          model: "Model",
          seed: "Seed",
          outputUrl: "输出 URL",
        },
        actions: {
          queue: "进入队列",
          markReady: "标记就绪",
          markFailed: "标记失败",
          reset: "重置",
        },
        statusLabels: {
          idle: "未开始",
          queued: "排队中",
          running: "执行中",
          ready: "已就绪",
          failed: "失败",
        },
      },
      preview: {
        eyebrow: "预览状态",
        title: "时间线占位",
        description:
          "预览层直接镜像当前 shot list，并为后续 Remotion 接入保留清晰路径。",
        compositionId: "Composition",
        totalScenes: "场景数",
        status: "状态",
        lastRefresh: "上次预览刷新",
        refresh: "刷新预览",
        placeholder: "等待图片输出或时间线组件完成绑定。",
        emptyTitle: "还没有预览场景",
        emptyDescription:
          "一旦 shot list 成形，预览层会为每个镜头生成一条 scene 占位记录。",
        statusLabels: {
          idle: "未开始",
          staged: "已暂存",
          ready: "可预览",
        },
      },
      defaults: {
        projectTitle: "发布主题、campaign 节点或剧集名",
        scriptTitle: "叙事弧线或序列名称",
        concept: "描述这条视频的核心想法、承诺和用户看完后的感受。",
        audience: "这条成片是给谁看的？",
        deliverable: "例如：15 秒竖版 storyboard",
        creativeDirection: "视觉气质、镜头语言和参考方向",
        narrationTone: "清晰、电影感、克制",
        aspectRatio: "9:16",
        revisionNotes: "下一轮希望调整什么？",
        shotTitle: "开场、揭示、转折、收束...",
        sceneGoal: "这个镜头必须完成什么叙事任务？",
        narration: "旁白、字幕或 spoken beat",
        imagePrompt: "这个镜头的图片提示词",
        visualStyle: "光线、材质、镜头和色彩氛围",
      },
    },
    charts: {
      noData: "暂无可用数据",
    },
    meeting: {
      title: "安排会议",
      prompt: "请选择一个适合你的时间",
      scheduledTitle: "会议已安排",
      selectedSlotSummary: "{date} {time}",
      declinedTitle: "暂未选定时间",
      declinedDescription: "我会继续帮你寻找更合适的时间。",
      durationLabel: "时长",
      durationUnit: "分钟",
      noneOfTheseWork: "这些时间都不合适",
      scheduledResponse: "会议已安排在 {date} {time}",
      scheduledResponseWithDuration:
        "会议已安排在 {date} {time}（{duration}）。",
      declineResponse:
        "用户拒绝了当前提供的所有会议时间。请继续建议其他时间，或询问对方的可用时段。",
      defaultSlots: [
        { date: "明天", time: "下午 2:00", duration: "30 分钟" },
        { date: "周五", time: "上午 10:00", duration: "30 分钟" },
        { date: "下周一", time: "下午 3:00", duration: "30 分钟" },
      ],
    },
    suggestions: [
      {
        title: "起草 6 条镜头",
        message:
          "为一个 AI motion workspace 起草一份 15 秒竖版发布短片 storyboard，先给我 6 条镜头。",
      },
      {
        title: "压缩节奏",
        message: "把当前镜头表修订得更紧凑、更高级，但总时长控制在 20 秒以内。",
      },
      {
        title: "转向产品证明",
        message:
          "把当前概念改写成更偏产品 proof 的 storyboard，减少纯情绪镜头。",
      },
      {
        title: "重写提示词",
        message:
          "检查当前所有镜头，重写 image prompt，让它们更电影化且更容易复现。",
      },
    ],
    toolReasoning: {
      toolNames: {
        toggleTheme: "切换主题",
        pieChart: "饼图",
        barChart: "柱状图",
        scheduleTime: "安排会议",
        enableAppMode: "打开看板",
        enableChatMode: "返回对话",
        get_motion_workspace: "读取工作台状态",
        save_motion_workspace: "保存工作台状态",
      },
      argLabels: {
        reasonForScheduling: "安排原因",
        meetingDuration: "会议时长",
        project: "项目",
        script: "脚本",
        preview: "预览",
      },
      arraySummary: "{count} 项",
      objectSummary: "{count} 个字段",
    },
  },
  en,
};

export type { AppMessages };

export function getMessages(locale: AppLocale = DEFAULT_LOCALE): AppMessages {
  return messages[locale] ?? messages[DEFAULT_LOCALE];
}
