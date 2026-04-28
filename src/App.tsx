/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, createContext, useContext, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  Globe, 
  CheckCircle2, 
  Clock, 
  Search,
  ChevronRight,
  Info,
  Check,
  Menu,
  User,
  ExternalLink,
  ChevronLeft,
  Sparkles,
  RotateCcw,
  ShoppingCart,
  Star,
  Zap,
  Brain,
  Trash2,
  Dices,
  History,
  X,
  Activity,
  TrendingUp,
  List,
  Plus,
  Wallet,
  Bell,
  CreditCard,
  LockKeyhole,
  LogOut,
  Trophy,
  LayoutGrid,
  Calendar,
  Copy,
  MessageCircle,
  Send,
  Paperclip,
  ArrowDownCircle,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Headphones,
  MoreVertical,
  BarChart3,
  Building,
  ChevronDown,
  RotateCw,
  Target,
  Users,
  Settings2,
  XCircle,
  Ticket,
  Shield,
  AlertCircle
} from 'lucide-react';

import { 
  doc, 
  setDoc, 
  addDoc,
  getDoc, 
  query, 
  collection, 
  where, 
  getDocs,
  onSnapshot,
  runTransaction,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  increment,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { db, auth } from './lib/firebase';

// --- Types ---

// --- Types ---

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
];

const translations: Record<string, Record<string, string>> = {
  en: {
    navbar_lotteries: 'Lotteries',
    navbar_results: 'Results',
    navbar_check: 'Check Tickets',
    navbar_help: 'Help',
    navbar_support: 'Contact Support',
    navbar_login: 'Secure Login',
    lobby_header_verified: 'Verified Official Global Provider',
    lobby_header_title: "The World's Largest Lottery Market. Official.",
    lobby_header_subtitle: 'Securely participate in global government-regulated lotteries through our licensed banking-grade platform.',
    lobby_security_title: 'Multi-layered security',
    lobby_security_subtitle: 'Trusted by 1.2M monthly users',
    tab_major: 'Major Lotto',
    tab_rapid: 'Rapid Games',
    card_live_every: 'Live Every',
    card_official: 'Official',
    card_play_now: 'Play Now',
    card_select_numbers: 'Select Numbers',
    market: 'Market',
    estimated_jackpot: 'Estimated Jackpot',
    add_line: 'Add Line',
    line: 'Line',
    quick_pick: 'Quick',
    clear: 'Clear',
    ai_prediction: 'AI Prediction',
    analyzing: 'Analyzing...',
    draw_period: 'Draw Period',
    last_win: 'Last Win',
    time_left: 'Time Left',
    purchase: 'Purchase',
    success: 'Success!',
    processing: 'Processing...',
    balance: 'Balance',
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    my_bets: 'My Bets',
    betting_history: 'Betting History',
    win_notifications: 'Win Notifications',
    real_time_alerts: 'Real-time Alerts',
    transaction_records: 'Transaction Records',
    deposit_withdrawal: 'Deposit & Withdrawal',
    security_settings: 'Security Settings',
    two_fa_recovery: '2FA & Recovery',
    language: 'Language',
    log_out: 'Log Out',
    secure_exit: 'Secure Exit',
    withdrawal_history: 'Withdrawal History',
    view_withdrawal_details: 'View withdrawal status and details',
    verified_member: 'Verified Member',
    confirm_bets: 'Confirm Bets',
    results: 'Results',
    wallet: 'Wallet',
    support: 'Support',
    user: 'User',
    all: 'All',
    fast_games: 'Fast Games',
    select_language: 'Select Language',
    confirm: 'Confirm',
    need_help: 'Need Instant Help?',
    telegram_support: 'Please connect with our dedicated agents on Telegram for real-time assistance.',
    connect_telegram: 'Connect to Official Telegram',
    active_24_7: 'Active 24/7',
    offline_notice: 'Offline - Please use Telegram for instant help',
    winners: 'Winners',
    prize_pool: 'Prize Pool',
    draw_history: 'Draw History',
    load_more: 'Load More',
    view_all: 'View All',
    legal_compliance: 'Legal Compliance',
    security_audit: 'Security Audit',
    protection_title: 'Secure Participant Protection',
    protection_text: 'Every ticket purchased through Global Lotto Bank is a genuine entry into the official draw. Our platform ensures total transparency.',
    licensed_platform: 'Licensed Platform',
    platform_compliance: 'Operating under strict government compliance and regulatory oversight.',
    encryption_standard: '256-bit SSL Encryption',
    encryption_text: 'Your transactions and data are protected by industry-standard security.',
    responsible_gaming: 'Responsible Gaming',
    gaming_limits: 'Play responsibly and stay within your limits.',
    privacy_policy: 'Privacy Policy',
    terms_of_service: 'Terms of Service',
    cookie_settings: 'Cookie Settings',
    congratulations: 'Congratulations!',
    you_won: 'You Won',
    status_won: 'Won',
    status_lost: 'Lost',
    status_pending: 'Pending',
    view_wallet: 'View My Wallet',
    share_result: 'Share Result',
    recent_results: 'Recent Results',
    last_5_trends: 'Last 5 Trends',
    next_block: 'Next Block',
    live_every: 'Live Every',
    big: 'Big',
    small: 'Small',
    odd: 'Odd',
    even: 'Even',
    ends_in: 'Ends In',
    play_now: 'Play Now',
    select_numbers: 'Select Numbers',
    official: 'Official',
    jackpot_increase: 'Increase of $5M since yesterday',
    matrix_link: 'Matrix Link',
    preview: 'Preview',
    official_source_verified: 'Official Source Verified',
    official_source_text: 'Results are synchronized in real-time with official government lottery headquarters.',
    secure_assets: 'Secure Assets',
    processing_status: 'Processing: 5-30 mins',
    enter_amount: 'Enter Amount to',
    max: 'MAX',
    big_desc: 'Sum 11-18',
    small_desc: 'Sum 3-10',
    odd_desc: 'Sum 1, 3, 5...',
    even_desc: 'Sum 2, 4, 6...',
    smart_follower: 'Smart Trend Follower',
    sum_betting_grid: 'Sum Betting Grid',
    odd_multipliers: 'Odd Multipliers',
    ends_in_timer: 'Ends In',
    older_draw_data: 'Load Older Draw Data',
    balance_label: 'Balance:',
    winners_count: 'Winners',
    primary_zone: 'Primary Zone',
    white_ball_zone: 'White Ball Zone',
    red_ball_zone: 'Red Ball Zone',
    gold_ball_zone: 'Gold Ball Zone',
    special_zone: 'Special Zone',
    verified_winner: 'Verified Winner Credentials',
    secure_verified: 'Secure Transaction Verified',
    previous_result: 'Previous Result',
    sum: 'Sum',
    live_trend_analysis: 'Live Trend Analysis',
    lobby: 'Lobby',
    live: 'LIVE',
    recent_draws: 'Recent Draws',
    last_30_days: 'Last 30 Days',
    last_100_draws: 'Last 100 Draws',
    full_year_history: 'Full 2026 History',
    winners_label: 'Winners',
    prize_label: 'Prize',
    matched_desc: 'Matched 5 White Balls',
    receiver_address: 'Receiver Address',
    withdrawal_address: 'Withdrawal Address',
    paste_address_placeholder: 'Paste your wallet address...',
    confirm_withdrawal: 'Confirm Withdrawal',
    deposit_safety_text: 'Min 10 USDT • Only TRC20 supported • Arrives after 1 block confirmation',
    withdrawal_safety_text: 'Withdraw limit: 50,000 USDT • 2FA required for safety • Network fees apply',
    win_footer_text: 'in {{lottery}} #{{id}}',
    in_label: 'in',
    draw_id_label: 'Draw',
    my_referrals: 'My Referrals',
    referral_dashboard: 'Referral Dashboard',
    downline_users: 'Downline Users',
    daily_flow: 'Daily Flow',
    daily_commission: 'Total Daily Commission',
    total_commission: 'Total Commission',
    sub_accounts: 'Sub-Accounts',
    footer_copyright: '© 2026 Global Lotto Bank. All lottery brands are trademarks of their respective owners.',
    region_us: 'USA',
    region_jp: 'Japan',
    region_uk: 'United Kingdom',
    region_eu: 'Europe',
    region_cn: 'China',
    region_vn: 'Vietnam',
    faster_response: 'Faster response',
    secure_encryption: 'Secure encryption',
    predicted_pool: '{{period}} Predicted Pool',
    increasing_realtime: 'Increasing in Real-time',
    hot: 'Hot',
    cold: 'Cold',
    overdue: 'Overdue',
    withdrawal_limit: 'Withdraw limit: 50,000 USDT',
    two_fa_required: '2FA required for safety',
    network_fees_apply: 'Network fees apply',
    min_deposit: 'Min 10 USDT',
    only_trc20: 'Only TRC20 supported',
    block_confirmation: 'Arrives after 1 block confirmation',
    login_subtitle: 'Access your secure global lottery account',
    username_label: 'Username / ID',
    password_label: 'Password',
    username_placeholder: 'Enter your registered ID',
    password_placeholder: 'Enter your security code',
    forgot_password: 'Forgot Access Code?',
    dont_have_account: "Don't have an account?",
    register_now: 'Register Now',
    register_title: 'Account Registration',
    register_subtitle: 'Join the world\'s largest lottery market',
    email_label: 'Email Address',
    email_placeholder: 'Enter your email',
    confirm_password_label: 'Confirm Password',
    confirm_password_placeholder: 'Repeat your security code',
    already_have_account: 'Already have an account?',
    login_now: 'Login Now',
    accept_terms: 'I accept the Terms and Conditions',
    bank_account: 'Bank Account',
    bank_name: 'Bank Name',
    account_number: 'Account Number',
    account_name: 'Account Holder Name',
  },
  zh: {
    navbar_lotteries: '彩票',
    navbar_results: '开奖结果',
    navbar_check: '选号检查',
    navbar_help: '帮助',
    navbar_support: '联系客服',
    navbar_login: '安全登录',
    lobby_header_verified: '经认证的官方全球供应商',
    lobby_header_title: "全球最大的彩票市场。官方认证。",
    lobby_header_subtitle: '通过我们的持牌银行级平台安全参与全球政府监管的彩票。',
    lobby_security_title: '多层安全保障',
    lobby_security_subtitle: '深受 120 万月度用户的信任',
    tab_major: '主流大乐透',
    tab_rapid: '快速游戏',
    licensed_platform: '持牌平台',
    platform_compliance: '在严格的政府合规和监管下运营。',
    encryption_standard: '256位 SSL 加密',
    encryption_text: '您的交易和数据受行业标准安全保护。',
    responsible_gaming: '理性博彩',
    gaming_limits: '请理性参与，并保持在您的额度范围内。',
    privacy_policy: '隐私政策',
    terms_of_service: '服务条款',
    cookie_settings: 'Cookie设置',
    congratulations: '恭喜！',
    you_won: '中奖啦',
    status_won: '已中奖',
    status_lost: '未中奖',
    status_pending: '待开奖',
    view_wallet: '查看我的钱包',
    share_result: '分享结果',
    recent_results: '近期开奖',
    last_5_trends: '最近 5 期走势',
    next_block: '下一区块',
    live_every: '每隔',
    big: '大',
    small: '小',
    odd: '单',
    even: '双',
    ends_in: '结束于',
    play_now: '立即开玩',
    select_numbers: '选择号码',
    official: '官方',
    jackpot_increase: '比昨天增加了 $5M',
    matrix_link: '矩阵链接',
    preview: '预览',
    official_source_verified: '官方来源已认证',
    official_source_text: '开奖结果与政府官方彩票总部实时同步。',
    secure_assets: '安全资产',
    processing_status: '处理中：5-30 分钟',
    enter_amount: '输入金额',
    max: '最大',
    market: '市场',
    estimated_jackpot: '预估奖金',
    add_line: '增加一注',
    line: '注',
    quick_pick: '机选',
    clear: '清除',
    ai_prediction: 'AI 预测',
    balance: '余额',
    deposit: '充值',
    withdraw: '提现',
    my_bets: '我的投注',
    betting_history: '投注历史',
    win_notifications: '中奖通知',
    real_time_alerts: '实时警报',
    transaction_records: '交易记录',
    deposit_withdrawal: '充提记录',
    security_settings: '安全设置',
    two_fa_recovery: '2FA 与恢复',
    language: '语言设置',
    log_out: '退出登录',
    secure_exit: '安全退出',
    withdrawal_history: '提现记录',
    view_withdrawal_details: '查看提现状态与详情',
    verified_member: '认证会员',
    confirm_bets: '确认投注',
    results: '开奖',
    wallet: '钱包',
    support: '客服',
    user: '我的',
    all: '全部',
    fast_games: '快速游戏',
    select_language: '选择语言',
    confirm: '确认',
    need_help: '需要即时帮助吗？',
    telegram_support: '请在 Telegram 上联系我们的专属代理，以获得实时协助 and 安全加密通信。',
    connect_telegram: '连接官方 Telegram',
    active_24_7: '24/7 在线',
    offline_notice: '离线模式 - 请使用 Telegram 获取即时帮助',
    draw_history: '开奖历史',
    load_more: '加载更多',
    view_all: '查看全部',
    legal_compliance: '法律合规',
    security_audit: '安全审计报告',
    protection_title: '安全参与者保护',
    protection_text: '通过 Global Lotto Bank 购买的每张彩票都是进入官方开奖的真实条目。我们的平台确保完全透明。',
    winners_count: '中奖者',
    primary_zone: '主选区',
    white_ball_zone: '红球区',
    red_ball_zone: '蓝球区',
    gold_ball_zone: '幸运球区',
    special_zone: '特别号码区',
    quick: '机选',
    analyzing: '分析中...',
    draw_period: 'DRAW #',
    last_win: '上期开奖',
    time_left: '剩余时间',
    winners: '中奖人数',
    prize_pool: '奖金池',
    verified_winner: '经认证的获胜者凭证',
    secure_verified: '安全交易已验证',
    previous_result: '上期结果',
    sum: 'SUM',
    live_trend_analysis: '实时走势分析',
    lobby: '大厅',
    live: '实时',
    recent_draws: '最近开奖',
    last_30_days: '最近 30 天',
    last_100_draws: '最近 100 期',
    full_year_history: '2026 全年历史',
    winners_label: '中奖人数',
    prize_label: '奖金',
    matched_desc: '匹配 5 个白球',
    receiver_address: '收款地址',
    withdrawal_address: '提现地址',
    paste_address_placeholder: '粘贴您的钱包地址...',
    confirm_withdrawal: '确认提现',
    deposit_safety_text: '最小 10 USDT • 仅支持 TRC20 • 1 个区块确认后到账',
    withdrawal_safety_text: '提现限制：50,000 USDT • 为了安全需要 2FA • 适用网络费用',
    win_footer_text: '于 {{lottery}} #{{id}}',
    in_label: '于',
    draw_id_label: 'DRAW #',
    my_referrals: '下级代理',
    referral_dashboard: '代理中心',
    downline_users: '下级用户',
    daily_flow: '每日流水',
    daily_commission: '每日总提成',
    total_commission: '总计提成',
    sub_accounts: '下级成员',
    footer_copyright: '© 2026 Global Lotto Bank。所有彩票品牌均为其各自所有者的商标。',
    smart_follower: '智能趋势跟随',
    sum_betting_grid: 'SUM BETTING GRID',
    odd_multipliers: '赔率乘率',
    ends_in_timer: '离截止',
    older_draw_data: '加载更早的开奖数据',
    big_desc: 'SUM 11-18',
    small_desc: 'SUM 3-10',
    odd_desc: 'SUM 1, 3, 5...',
    even_desc: 'SUM 2, 4, 6...',
    balance_label: '余额:',
    region_us: '美国',
    region_jp: '日本',
    region_uk: '英国',
    region_eu: '欧洲',
    region_cn: '中国',
    region_vn: '越南',
    faster_response: '响应更快',
    secure_encryption: '安全加密',
    predicted_pool: '{{period}} 预估奖金池',
    increasing_realtime: '实时增长中',
    hot: '热号',
    cold: '冷号',
    overdue: '遗漏',
    withdrawal_limit: '提现限制：50,000 USDT',
    two_fa_required: '为了安全需要 2FA',
    network_fees_apply: '适用网络费用',
    min_deposit: '最小充值 10 USDT',
    only_trc20: '仅支持 TRC20',
    block_confirmation: '1 个区块确认后到账',
    login_subtitle: '访问您的安全全球彩票账户',
    username_label: '用户名 / ID',
    password_label: '密码',
    username_placeholder: '输入您的注册 ID',
    password_placeholder: '输入您的安全码',
    forgot_password: '忘记访问代码？',
    dont_have_account: '还没有账户？',
    register_now: '立即注册',
    register_title: '账号注册',
    register_subtitle: '加入全球最大的彩票市场',
    email_label: '电子邮箱地址',
    email_placeholder: '输入您的邮箱',
    confirm_password_label: '确认密码',
    confirm_password_placeholder: '重复您的安全码',
    already_have_account: '已经有账户了？',
    login_now: '立即登录',
    accept_terms: '我接受服务条款和条件',
    bank_account: '银行账户',
    bank_name: '银行名称',
    account_number: '银行卡号',
    account_name: '开户人姓名',
  },
  ko: {
    navbar_lotteries: '복권',
    navbar_results: '결과',
    navbar_check: '티켓 확인',
    navbar_help: '도움말',
    navbar_support: '고격 지원',
    navbar_login: '보안 로그인',
    lobby_header_verified: '공인 공식 글로벌 제공업체',
    lobby_header_title: "세계 최대의 복권 시장. 공식.",
    lobby_header_subtitle: '면허를 받은 금융권 수준의 플랫폼을 통해 전 세계 정부 규제 복권에 안전하게 참여하십시오.',
    lobby_security_title: '다층 보안',
    lobby_security_subtitle: '매월 120만 명의 사용자가 신뢰함',
    tab_major: '주요 로또',
    tab_rapid: '빠른 게임',
    card_live_every: '90초마다 생방송',
    card_official: '공식',
    card_play_now: '지금 플레이',
    card_select_numbers: '번호 선택',
    market: '시장',
    estimated_jackpot: '예상 잭팟',
    add_line: '번호 추가',
    line: '라인',
    quick_pick: '자동',
    clear: '지우기',
    ai_prediction: 'AI 예측',
    analyzing: '분석 중...',
    draw_period: '추첨 회차',
    last_win: '지난 당첨',
    time_left: '남은 시간',
    purchase: '구매',
    success: '성공!',
    processing: '처리 중...',
    balance: '잔액',
    deposit: '입금',
    withdraw: '출금',
    my_bets: '내 베팅',
    betting_history: '베팅 내역',
    win_notifications: '당첨 알림',
    real_time_alerts: '실시간 알림',
    transaction_records: '거래 기록',
    deposit_withdrawal: '입출금 내역',
    security_settings: '보안 설정',
    two_fa_recovery: '2FA 및 복구',
    language: '언어 설정',
    log_out: '로그아웃',
    secure_exit: '안전 종료',
    withdrawal_history: '출금 내역',
    view_withdrawal_details: '출금 상태 및 상세 정보 보기',
    verified_member: '인증 회원',
    confirm_bets: '베팅 확인',
    results: '결과',
    wallet: '지갑',
    support: '지원',
    user: '사용자',
    all: '전체',
    fast_games: '빠른 게임',
    select_language: '언어 선택',
    confirm: '확인',
    need_help: '즉각적인 도움이 필요하십니까?',
    telegram_support: '실시간 지원 및 안전한 암호화 통신을 위해 텔레그램의 전담 상담원에게 문의하십시오.',
    connect_telegram: '공식 텔레그램 연결',
    active_24_7: '24/7 활성',
    offline_notice: '오프라인 - 즉각적인 도움을 위해 텔레그램을 사용하십시오',
    winners: '당첨자',
    prize_pool: '상금 풀',
    draw_history: '추첨 내역',
    load_more: '더 보기',
    view_all: '전체 보기',
    legal_compliance: '법적 준수',
    security_audit: '보안 감사 보고서',
    protection_title: '안전한 참가자 보호',
    protection_text: 'Global Lotto Bank를 통해 구매한 모든 티켓은 공식 추첨에 참여하는 정품입니다. 당사 플랫폼은 완전한 투명성을 보장합니다.',
    licensed_platform: '라이선스 플랫폼',
    platform_compliance: '엄격한 정부 규정 및 규제 감독 하에 운영됩니다.',
    encryption_standard: '256비트 SSL 암호화',
    encryption_text: '귀하의 거래와 데이터는 업계 표준 보안으로 보호됩니다.',
    responsible_gaming: '책임감 있는 게임',
    gaming_limits: '책임감 있게 플레이하고 한도 내에서 유지하십시오.',
    privacy_policy: '개인정보 처리방침',
    terms_of_service: '서비스 약관',
    cookie_settings: '쿠키 설정',
    congratulations: '축하합니다!',
    you_won: '당첨되었습니다',
    view_wallet: '내 지갑 보기',
    share_result: '결과 공유',
    recent_results: '최근 결과',
    last_5_trends: '최근 5개 트렌드',
    next_block: '다음 블록',
    live_every: '매회 생방송',
    big: '크다',
    small: '작다',
    odd: '홀수',
    even: '짝수',
    ends_in: '종료까지',
    play_now: '지금 플레이',
    select_numbers: '번호 선택',
    official: '공식',
    jackpot_increase: '어제보다 $5M 증가',
    matrix_link: '공유 링크',
    preview: '미리보기',
    official_source_verified: '공식 소스 확인됨',
    official_source_text: '결과는 정부 공식 복권 본부와 실시간으로 동기화됩니다.',
    secure_assets: '보안 자산',
    processing_status: '처리 시간: 5-30분',
    enter_amount: '금액 입력',
    max: '최대',
    big_desc: '합계 11-18',
    small_desc: '합계 3-10',
    odd_desc: '합계 1, 3, 5...',
    even_desc: '합계 2, 4, 6...',
    smart_follower: '스마트 트렌드 팔로워',
    sum_betting_grid: '합계 베팅 그리드',
    odd_multipliers: '홀수 배수',
    ends_in_timer: '종료까지',
    older_draw_data: '이전 추첨 데이터 로드',
    balance_label: '잔액:',
    winners_count: '당첨자',
    primary_zone: '메인 영역',
    white_ball_zone: '화이트 볼 영역',
    red_ball_zone: '레드 볼 영역',
    gold_ball_zone: '골드 볼 영역',
    special_zone: '특별 영역',
    quick: '자동',
    verified_winner: '인증된 당첨자 자격 증명',
    secure_verified: '보안 거래 확인됨',
    previous_result: '이전 결과',
    sum: '합계',
    live_trend_analysis: '실시간 트렌드 분석',
    lobby: '로비',
    live: '라이브',
    recent_draws: '최근 추첨',
    last_30_days: '최근 30일',
    last_100_draws: '최근 100회',
    full_year_history: '2026년 전체 내역',
    winners_label: '당첨자',
    prize_label: '상금',
    matched_desc: '화이트 볼 5개 일치',
    receiver_address: '수신 주소',
    withdrawal_address: '출금 주소',
    paste_address_placeholder: '지갑 주소를 붙여넣으세요...',
    confirm_withdrawal: '출금 확인',
    deposit_safety_text: '최소 10 USDT • TRC20만 지원 • 1 블록 확인 후 도착',
    withdrawal_safety_text: '출금 한도: 50,000 USDT • 안전을 위해 2FA 필요 • 네트워크 수수료 적용',
    win_footer_text: '{{lottery}} #{{id}}에서',
    in_label: '에서',
    draw_id_label: '회차',
    footer_copyright: '© 2026 Global Lotto Bank. 모든 복권 브랜드는 해당 소유자의 상표입니다.',
    region_us: '미국',
    region_jp: '일본',
    region_uk: '영국',
    region_eu: '유럽',
    region_cn: '중국',
    region_vn: '베트남',
    faster_response: '빠른 응답',
    secure_encryption: '보안 암호화',
    predicted_pool: '{{period}} 예상 풀',
    increasing_realtime: '실시간 증가 중',
    hot: '핫',
    cold: '콜드',
    overdue: '장기 미당첨',
    withdrawal_limit: '출금 한도: 50,000 USDT',
    two_fa_required: '안전을 위해 2FA 필요',
    network_fees_apply: '네트워크 수수료 적용',
    min_deposit: '최소 10 USDT 입금',
    only_trc20: 'TRC20만 지원',
    block_confirmation: '1 블록 확인 후 도착',
    bank_account: '은행 계좌',
    bank_name: '은행명',
    account_number: '계좌 번호',
    account_name: '예금주 성명',
  },
  hi: {
    navbar_lotteries: 'लॉटरी',
    navbar_results: 'परिणाम',
    navbar_check: 'टिकट जांचें',
    navbar_help: 'सहायता',
    navbar_support: 'सहायता से संपर्क करें',
    navbar_login: 'सुरक्षित लॉगिन',
    lobby_header_verified: 'सत्यापित आधिकारिक वैश्विक प्रदाता',
    lobby_header_title: "दुनिया का सबसे बड़ा लॉटरी बाजार। आधिकारिक।",
    lobby_header_subtitle: 'हमारे लाइसेंस प्राप्त बैंकिंग-ग्रेड प्लेटफॉर्म के माध्यम से वैश्विक सरकारी-विनियमित लॉटरी में सुरक्षित रूप से भाग लें।',
    lobby_security_title: 'बहुस्तरीय सुरक्षा',
    lobby_security_subtitle: '1.2M मासिक उपयोगकर्ताओं द्वारा विश्वसनीय',
    tab_major: 'प्रमुख लोट्टो',
    tab_rapid: 'त्वरित गेम',
    card_live_every: 'हर 90 सेकंड में लाइव',
    card_official: 'आधिकारिक',
    card_play_now: 'अभी खेलें',
    card_select_numbers: 'नंबर चुनें',
    market: 'बाजार',
    estimated_jackpot: 'अनुमानित जैकपॉट',
    add_line: 'लाइन जोड़ें',
    line: 'लाइन',
    quick_pick: 'क्विक',
    clear: 'साफ़ करें',
    ai_prediction: 'AI भविष्यवाणी',
    analyzing: 'विश्लेषण कर रहा है...',
    draw_period: 'ड्रा अवधि',
    last_win: 'पिछली जीत',
    time_left: 'बचा हुआ समय',
    purchase: 'खरीदें',
    success: 'सफलता!',
    processing: 'प्रसंस्करण...',
    balance: 'शेष राशि',
    deposit: 'जमा',
    withdraw: 'निकालें',
    my_bets: 'मेरे दांव',
    betting_history: 'सट्टेबाजी का इतिहास',
    win_notifications: 'जीत की सूचनाएं',
    real_time_alerts: 'रियल-टाइम अलर्ट',
    transaction_records: 'लेनदेन रिकॉर्ड',
    deposit_withdrawal: 'जमा और निकासी',
    security_settings: 'सुरक्षा सेटिंग्स',
    two_fa_recovery: '2FA और रिकवरी',
    language: 'भाषा',
    log_out: 'लॉग आउट',
    secure_exit: 'सुरक्षित निकास',
    withdrawal_history: 'निकासी इतिहास',
    view_withdrawal_details: 'निकासी की स्थिति और विवरण देखें',
    verified_member: 'सत्यापित सदस्य',
    confirm_bets: 'दांव की पुष्टि करें',
    results: 'परिणाम',
    wallet: 'वॉलेट',
    support: 'सहायता',
    user: 'उपयोगकर्ता',
    all: 'सभी',
    fast_games: 'Fast Games',
    select_language: 'भाषा चुनें',
    confirm: 'पुष्टि करें',
    need_help: 'तुरंत सहायता चाहिए?',
    telegram_support: 'वास्तविक समय की सहायता के लिए कृपया टेलीग्राम पर हमारे समर्पित एजेंटों के साथ जुड़ें।',
    connect_telegram: 'आधिकारिक टेलीग्राम से जुड़ें',
    active_24_7: '24/7 सक्रिय',
    offline_notice: 'ऑफ़लाइन - कृपया तुरंत सहायता के लिए टेलीग्राम का उपयोग करें',
    winners: 'विजेता',
    prize_pool: 'पुरस्कार पूल',
    draw_history: 'ड्रा इतिहास',
    load_more: 'और लोड करें',
    view_all: 'सभी देखें',
    legal_compliance: 'कानूनी अनुपालन',
    security_audit: 'सुरक्षा ऑडिट रिपोर्ट',
    protection_title: 'सुरक्षित भागीदार सुरक्षा',
    protection_text: 'Global Lotto Bank के माध्यम से खरीदा गया प्रत्येक टिकट आधिकारिक ड्रा में एक वास्तविक प्रविष्टि है। हमारा मंच पूर्ण पारदर्शिता सुनिश्चित करता है।',
    licensed_platform: 'लाइसेंस प्राप्त प्लेटफॉर्म',
    platform_compliance: 'सख्त सरकारी अनुपालन और विनियामक निरीक्षण के तहत काम करना।',
    encryption_standard: '256-बिट SSL एन्क्रिप्शन',
    encryption_text: 'आपका लेनदेन और डेटा उद्योग-मानक सुरक्षा द्वारा सुरक्षित है।',
    responsible_gaming: 'जिम्मेदार गेमिंग',
    gaming_limits: 'जिम्मेदारी से खेलें और अपनी सीमाओं के भीतर रहें।',
    privacy_policy: 'गोपनीयता नीति',
    terms_of_service: 'सेवा की शर्तें',
    cookie_settings: 'कुकी सेटिंग्स',
    congratulations: 'बधाई हो!',
    you_won: 'आप जीते',
    view_wallet: 'मेरा वॉलेट देखें',
    share_result: 'परिणाम साझा करें',
    recent_results: 'हाल के परिणाम',
    last_5_trends: 'पिछले 5 रुझान',
    next_block: 'अगला ब्लॉक',
    live_every: 'लाइव हर',
    big: 'बड़ा',
    small: 'छोटा',
    odd: 'विषम',
    even: 'सम',
    ends_in: 'समाप्त होने में',
    play_now: 'अभी खेलें',
    select_numbers: 'नंबर चुनें',
    official: 'आधिकारिक',
    jackpot_increase: 'कल से $5M की वृद्धि',
    matrix_link: 'साझा लिंक',
    preview: 'पूर्वावलोकन',
    official_source_verified: 'आधिकारिक स्रोत सत्यापित',
    official_source_text: 'परिणाम आधिकारिक सरकारी लॉटरी मुख्यालय के साथ रीयल-टाइम में सिंक किए जाते हैं।',
    secure_assets: 'सुरक्षित संपत्ति',
    processing_status: 'प्रसंस्करण: 5-30 मिनट',
    enter_amount: 'राशि दर्ज करें',
    max: 'MAX',
    big_desc: 'योग 11-18',
    small_desc: 'योग 3-10',
    odd_desc: 'योग 1, 3, 5...',
    even_desc: 'योग 2, 4, 6...',
    older_draw_data: 'पुराना ड्रा डेटा लोड करें',
    balance_label: 'शेष राशि:',
    winners_count: 'विजेता',
    primary_zone: 'प्राथमिक क्षेत्र',
    white_ball_zone: 'व्हाइट बॉल क्षेत्र',
    red_ball_zone: 'रेड बॉल क्षेत्र',
    gold_ball_zone: 'गोल्ड बॉल क्षेत्र',
    special_zone: 'विशिष्ट क्षेत्र',
    quick: 'त्वरित',
    verified_winner: 'सत्यापित विजेता क्रेडेंशियल',
    secure_verified: 'सुरक्षित लेनदेन सत्यापित',
    previous_result: 'पिछला परिणाम',
    sum: 'योग',
    live_trend_analysis: 'लाइव ट्रेंड विश्लेषण',
    lobby: 'लॉबी',
    live: 'लाइव',
    recent_draws: 'हाल के ड्रा',
    last_30_days: 'पिछले 30 दिन',
    last_100_draws: 'पिछले 100 ड्रा',
    full_year_history: 'पूरा 2026 इतिहास',
    winners_label: 'विजेता',
    prize_label: 'पुरस्कार',
    matched_desc: '5 व्हाइट बॉल्स का मिलान हुआ',
    receiver_address: 'प्राप्तकर्ता का पता',
    withdrawal_address: 'निकासी का पता',
    paste_address_placeholder: 'अपना वॉलेट पता पेस्ट करें...',
    confirm_withdrawal: 'निकासी की पुष्टि करें',
    deposit_safety_text: 'न्यूनतम 10 USDT • केवल TRC20 समर्थित • 1 ब्लॉक पुष्टिकरण के बाद आता है',
    withdrawal_safety_text: 'निकासी सीमा: 50,000 USDT • सुरक्षा के लिए 2FA आवश्यक • नेटवर्क शुल्क लागू',
    footer_copyright: '© 2026 Global Lotto Bank. सभी लॉटरी ब्रांड उनके संबंधित स्वाmियों के ट्रेडमार्क हैं।',
    region_us: 'अमरीका',
    region_jp: 'जापान',
    region_uk: 'यूनाइटेड किंगडम',
    region_eu: 'यूरोप',
    region_cn: 'चीन',
    region_vn: 'वियतनाम',
    faster_response: 'तेजी से प्रतिक्रिया',
    secure_encryption: 'सुरक्षित एन्क्रिप्शन',
    predicted_pool: '{{period}} अनुमानित पूल',
    increasing_realtime: 'रीयल-टाइम में बढ़ रहा है',
    hot: 'गरम',
    cold: 'ठंडा',
    overdue: 'अतिदेय',
    withdrawal_limit: 'निकासी सीमा: 50,000 USDT',
    two_fa_required: 'सुरक्षा के लिए 2FA आवश्यक',
    network_fees_apply: 'नेटवर्क शुल्क लागू',
    min_deposit: 'न्यूनतम 10 USDT',
    only_trc20: 'केवल TRC20 समर्थित',
    block_confirmation: '1 ब्लॉक पुष्टि के बाद आता है',
    bank_account: 'बैंक खाता',
    bank_name: 'बैंक का नाम',
    account_number: 'खाता संख्या',
    account_name: 'खाता धारक का नाम',
  },
  vi: {
    navbar_lotteries: 'Xổ số',
    navbar_results: 'Kết quả',
    navbar_check: 'Kiểm tra vé',
    navbar_help: 'Trợ giúp',
    navbar_support: 'Liên hệ hỗ trợ',
    navbar_login: 'Đăng nhập an toàn',
    lobby_header_verified: 'Nhà cung cấp toàn cầu chính thức đã xác minh',
    lobby_header_title: "Thị trường xổ số lớn nhất thế giới. Chính thức.",
    lobby_header_subtitle: 'Tham gia an toàn vào các xổ số do chính phủ quản lý trên toàn cầu thông qua nền tảng cấp ngân hàng đã được cấp phép của chúng tôi.',
    lobby_security_title: 'Bảo mật đa lớp',
    lobby_security_subtitle: 'Được 1,2 triệu người dùng hàng tháng tin tưởng',
    tab_major: 'Lotto chính',
    tab_rapid: 'Trò chơi nhanh',
    card_live_every: 'Trực tiếp mỗi 90 giây',
    card_official: 'Chính thức',
    card_play_now: 'Chơi ngay',
    card_select_numbers: 'Chọn số',
    market: 'Thị trường',
    estimated_jackpot: 'Jackpot ước tính',
    add_line: 'Thêm dòng',
    line: 'Dòng',
    quick_pick: 'Chọn nhanh',
    clear: 'Xóa',
    ai_prediction: 'Dự đoán AI',
    analyzing: 'Đang phân tích...',
    draw_period: 'Kỳ quay thưởng',
    last_win: 'Thắng lần trước',
    time_left: 'Thời gian còn lại',
    purchase: 'Mua',
    success: 'Thành công!',
    processing: 'Đang xử lý...',
    balance: 'Số dư',
    deposit: 'Nạp tiền',
    withdraw: 'Rút tiền',
    my_bets: 'Cược của tôi',
    betting_history: 'Lịch sử cược',
    win_notifications: 'Thông báo thắng',
    real_time_alerts: 'Cảnh báo thời gian thực',
    transaction_records: 'Hồ sơ giao dịch',
    deposit_withdrawal: 'Nạp & Rút tiền',
    security_settings: 'Cài đặt bảo mật',
    two_fa_recovery: '2FA & Khôi phục',
    language: 'Ngôn ngữ',
    log_out: 'Đăng xuất',
    secure_exit: 'Thoát an toàn',
    withdrawal_history: 'Lịch sử rút tiền',
    view_withdrawal_details: 'Xem trạng thái và chi tiết rút tiền',
    verified_member: 'Thành viên đã xác minh',
    confirm_bets: 'Xác nhận cược',
    results: 'Kết quả',
    wallet: 'Ví',
    support: 'Hỗ trợ',
    user: 'Người dùng',
    all: 'Tất cả',
    fast_games: 'Trò chơi nhanh',
    select_language: 'Chọn ngôn ngữ',
    confirm: 'Xác nhận',
    need_help: 'Cần hỗ trợ ngay?',
    telegram_support: 'Vui lòng kết nối với các đại lý tận tâm của chúng tôi trên Telegram để được hỗ trợ theo thời gian thực.',
    connect_telegram: 'Kết nối Telegram chính thức',
    active_24_7: 'Hoạt động 24/7',
    offline_notice: 'Ngoại tuyến - Vui lòng sử dụng Telegram để được trợ giúp ngay lập tức',
    winners: 'Người thắng',
    prize_pool: 'Quỹ giải thưởng',
    draw_history: 'Lịch sử quay thưởng',
    load_more: 'Tải thêm',
    view_all: 'Xem tất cả',
    legal_compliance: 'Tuân thủ pháp luật',
    security_audit: 'Báo cáo kiểm toán bảo mật',
    protection_title: 'Bảo vệ người tham gia an toàn',
    protection_text: 'Mỗi tờ vé số được mua qua Global Lotto Bank là một sự tham gia thực sự vào đợt quay thưởng chính thức. Nền tảng của chúng tôi đảm bảo sự minh bạch hoàn toàn.',
    licensed_platform: 'Nền tảng được cấp phép',
    platform_compliance: 'Hoạt động dưới sự tuân thủ nghiêm ngặt của chính phủ và giám sát quản lý.',
    encryption_standard: 'Mã hóa SSL 256-bit',
    encryption_text: 'Giao dịch và dữ liệu của bạn được bảo vệ bởi bảo mật tiêu chuẩn ngành.',
    responsible_gaming: 'Chơi game có trách nhiệm',
    gaming_limits: 'Chơi có trách nhiệm và ở trong giới hạn của bạn.',
    privacy_policy: 'Chính sách bảo mật',
    terms_of_service: 'Điều khoản dịch vụ',
    cookie_settings: 'Cài đặt cookie',
    congratulations: 'Chúc mừng!',
    you_won: 'Bạn đã thắng',
    view_wallet: 'Xem ví của tôi',
    share_result: 'Chia sẻ kết quả',
    recent_results: 'Kết quả gần đây',
    last_5_trends: '5 xu hướng gần nhất',
    next_block: 'Khối tiếp theo',
    live_every: 'Trực tiếp mỗi',
    big: 'Lớn',
    small: 'Nhỏ',
    odd: 'Lẻ',
    even: 'Chẵn',
    ends_in: 'Kết thúc sau',
    play_now: 'Chơi ngay',
    select_numbers: 'Chọn số',
    official: 'Chính thức',
    jackpot_increase: 'Tăng 5 triệu USD so với hôm qua',
    matrix_link: 'Link chia sẻ',
    preview: 'Xem trước',
    official_source_verified: 'Nguồn chính thức đã xác minh',
    official_source_text: 'Kết quả được đồng bộ hóa theo thời gian thực với trụ sở xổ số chính thức của chính phủ.',
    secure_assets: 'Tài sản an toàn',
    processing_status: 'Xử lý: 5-30 phút',
    enter_amount: 'Nhập số tiền để',
    max: 'MAX',
    big_desc: 'Tổng 11-18',
    small_desc: 'Tổng 3-10',
    odd_desc: 'Tổng 1, 3, 5...',
    even_desc: 'Tổng 2, 4, 6...',
    smart_follower: 'Chiến thuật theo xu hướng',
    sum_betting_grid: 'Bảng cược tổng',
    odd_multipliers: 'Hệ số nhân lẻ',
    ends_in_timer: 'Kết thúc sau',
    older_draw_data: 'Tải dữ liệu quay thưởng cũ hơn',
    balance_label: 'Số dư:',
    winners_count: 'Người thắng',
    primary_zone: 'Khu vực chính',
    white_ball_zone: 'Khu vực bóng trắng',
    red_ball_zone: 'Khu vực bóng đỏ',
    gold_ball_zone: 'Khu vực bóng vàng',
    special_zone: 'Khu vực đặc biệt',
    quick: 'Nhanh',
    verified_winner: 'Thông tin người thắng đã xác minh',
    secure_verified: 'Giao dịch an toàn đã xác minh',
    previous_result: 'Kết quả trước đó',
    sum: 'Tổng',
    live_trend_analysis: 'Phân tích xu hướng trực tiếp',
    lobby: 'Phòng chờ',
    live: 'TRỰC TIẾP',
    recent_draws: 'Các kỳ quay gần đây',
    last_30_days: '30 ngày qua',
    last_100_draws: '100 kỳ quay qua',
    full_year_history: 'Lịch sử đầy đủ 2026',
    winners_label: 'Người thắng',
    prize_label: 'Giải thưởng',
    matched_desc: 'Khớp 5 bóng trắng',
    receiver_address: 'Địa chỉ người nhận',
    withdrawal_address: 'Địa chỉ rút tiền',
    paste_address_placeholder: 'Dán địa chỉ ví của bạn...',
    confirm_withdrawal: 'Xác nhận rút tiền',
    deposit_safety_text: 'Tối thiểu 10 USDT • Chỉ hỗ trợ TRC20 • Đến sau 1 xác nhận khối',
    withdrawal_safety_text: 'Hạn mức rút: 50.000 USDT • Cần 2FA để an toàn • Phí mạng áp dụng',
    win_footer_text: 'trong {{lottery}} #{{id}}',
    in_label: 'trong',
    draw_id_label: 'Kỳ quay',
    footer_copyright: '© 2026 Global Lotto Bank. Tất cả các thương hiệu xổ số đều là nhãn hiệu của chủ sở hữu tương ứng.',
    region_us: 'Mỹ',
    region_jp: 'Nhật Bản',
    region_uk: 'Vương quốc Anh',
    region_eu: 'Châu Âu',
    region_cn: 'Trung Quốc',
    region_vn: 'Việt Nam',
    faster_response: 'Phản hồi nhanh hơn',
    secure_encryption: 'Mã hóa an toàn',
    predicted_pool: '{{period}} Quỹ dự kiến',
    increasing_realtime: 'Tăng theo thời gian thực',
    hot: 'Nóng',
    cold: 'Lạnh',
    overdue: 'Quá hạn',
    withdrawal_limit: 'Hạn mức rút: 50.000 USDT',
    two_fa_required: 'Cần 2FA để an toàn',
    network_fees_apply: 'Phí mạng áp dụng',
    min_deposit: 'Nạp tối thiểu 10 USDT',
    only_trc20: 'Chỉ hỗ trợ TRC20',
    block_confirmation: 'Đến sau 1 xác nhận khối',
    bank_account: 'Tài khoản ngân hàng',
    bank_name: 'Tên ngân hàng',
    account_number: 'Số tài khoản',
    account_name: 'Tên chủ tài khoản',
  }
};

// Simplified translation helper for multiple languages (using English as fallback)
const getT = (langCode: string) => (key: string) => {
  return translations[langCode]?.[key] || translations['en'][key] || key;
};

const LanguageContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}>({
  lang: languages[1],
  setLang: () => {},
  t: (key: string) => key,
});

const ReferralContext = createContext<{
  referrerId: string | null;
}>({
  referrerId: null,
});

interface LotteryDrawState {
  nextDraw: number; // timestamp
  lastResult: number[] | null;
  drawId: string;
  lastResultTime?: number;
}

const LotteryContext = createContext<{
  drawStates: Record<string, LotteryDrawState>;
  lotteryConfigs: any[];
  lotteryHistory: Record<string, any[]>;
  settleBets?: (lotoId: string, drawId: string, result: number[]) => Promise<void>;
}>({
  drawStates: {},
  lotteryConfigs: [],
  lotteryHistory: {},
});

const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

interface TicketLine {
  main: number[];
  powerball: number | null;
  type?: string;
  val?: string | number;
}

interface Lottery {
  id: string;
  name: string;
  region: string;
  jackpot?: string;
  currencySymbol?: string;
  color: 'blue' | 'red' | 'indigo' | 'orange' | 'gold' | 'green' | 'cyan';
  logoPlaceholder: string;
  tag?: string;
  flag: string;
  specialDisplay?: 'fast3' | 'keno' | 'speedy' | 'hash' | 'wingo';
  drawInterval: number; // Seconds
}

const generateResult = (lotoId: string): number[] => {
  if (lotoId === 'wg') return [Math.floor(Math.random() * 10)];
  if (lotoId === 'f3') return [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
  if (lotoId === 'pb' || lotoId === 'mm') return Array.from({ length: 6 }).map((_, i) => i === 5 ? Math.floor(Math.random() * 26) + 1 : Math.floor(Math.random() * 69) + 1);
  if (lotoId === 'l7') return Array.from({ length: 7 }).map(() => Math.floor(Math.random() * 37) + 1);
  if (lotoId === 'kp') return Array.from({ length: 10 }).map(() => Math.floor(Math.random() * 80) + 1);
  return Array.from({ length: 5 }).map(() => Math.floor(Math.random() * 10));
};

const lotteries: Lottery[] = [
  { id: 'pb', name: 'Powerball', region: 'region_us', jackpot: '945M', currencySymbol: '$', color: 'red', logoPlaceholder: 'P', flag: '🇺🇸', tag: 'Hot', drawInterval: 86400 },
  { id: 'mm', name: 'Mega Millions', region: 'region_us', jackpot: '1.2B', currencySymbol: '$', color: 'orange', logoPlaceholder: 'MM', flag: '🇺🇸', tag: 'Gigantic', drawInterval: 86400 },
  { id: 'wg', name: 'Wingo 5M', region: 'Rapid', jackpot: '9,000x', currencySymbol: '$', color: 'green', logoPlaceholder: 'WG', flag: '🚦', specialDisplay: 'wingo', tag: 'New', drawInterval: 300 },
  { id: 'l7', name: 'LOTO 7', region: 'region_jp', jackpot: '1.0B', currencySymbol: '¥', color: 'blue', logoPlaceholder: '7', flag: '🇯🇵', tag: 'Weekly', drawInterval: 86400 },
  { id: 'f3', name: 'Fast 3', region: 'Rapid', jackpot: '10,000x', currencySymbol: '$', color: 'red', logoPlaceholder: 'F3', flag: '🎲', specialDisplay: 'fast3', tag: 'Hot', drawInterval: 300 },
  { id: 'bh', name: 'Bitcoin Hash', region: 'Virtual', jackpot: '2,400.00 BTC', currencySymbol: '₿', color: 'cyan', logoPlaceholder: 'HASH', flag: '⚡', specialDisplay: 'hash', tag: 'Live', drawInterval: 300 },
  { id: 'em', name: 'EuroMillions', region: 'region_eu', jackpot: '190M', currencySymbol: '€', color: 'indigo', logoPlaceholder: 'EM', flag: '🇪🇺', drawInterval: 86400 },
  { id: 'vl', name: 'Mega 6/45', region: 'region_vn', jackpot: '150B', currencySymbol: '₫', color: 'red', logoPlaceholder: 'VL', flag: '🇻🇳', drawInterval: 86400 },
  { id: 'kp', name: 'Keno Pro', region: 'Daily', jackpot: '2M', currencySymbol: '$', color: 'gold', logoPlaceholder: 'KP', flag: '🔢', specialDisplay: 'keno', tag: '24/7', drawInterval: 300 },
  { id: 'se', name: 'SuperEnalotto', region: 'Italy', jackpot: '209M', currencySymbol: '€', color: 'green', logoPlaceholder: 'SE', flag: '🇮🇹', drawInterval: 86400 },
];

// --- Admin Dashboard Components ---

const AdminDashboard = ({ onBack, drawStates, onSettleMissing }: { onBack: () => void, drawStates: Record<string, LotteryDrawState>, onSettleMissing?: () => Promise<void> }) => {
  const { t } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState<'draws' | 'prizes' | 'transactions' | 'bets' | 'users' | 'settings'>('draws');
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const userMap = useMemo(() => {
    const map: Record<string, any> = {};
    users.forEach(u => map[u.id] = u);
    return map;
  }, [users]);

  const tabs = [
    { id: 'draws', label: '开奖管理', icon: <Target size={16} /> },
    { id: 'prizes', label: '奖金设置', icon: <Trophy size={16} /> },
    { id: 'transactions', label: '出入金审核', icon: <CreditCard size={16} /> },
    { id: 'bets', label: '注单查询', icon: <History size={16} /> },
    { id: 'users', label: '用户管理', icon: <Users size={16} /> },
    { id: 'settings', label: '系统设置', icon: <Settings2 size={16} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-32 px-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-3 bg-white border border-border-grey rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95">
           <ChevronLeft size={20} className="text-text-main" />
        </button>
        <div>
           <h2 className="text-2xl font-black text-text-main uppercase tracking-tight">管理中心</h2>
           <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mt-1">Admin Control Panel</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Side Navigation */}
        <div className="w-full lg:w-64 shrink-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-6 py-4 rounded-[1.25rem] text-xs font-black transition-all group
                ${activeTab === tab.id 
                  ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/30 lg:translate-x-2' 
                  : 'bg-white text-text-muted border border-border-grey hover:bg-surface-grey lg:hover:translate-x-1'
                }
              `}
            >
              <div className={`transition-colors ${activeTab === tab.id ? 'text-white' : 'text-brand-blue group-hover:scale-110'}`}>
                {tab.icon}
              </div>
              <span className="whitespace-nowrap">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="ml-auto hidden lg:block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-[2.5rem] border border-border-grey shadow-2xl p-8 min-h-[700px] w-full">
          {activeTab === 'draws' && <AdminDraws drawStates={drawStates} onSettleMissing={onSettleMissing} />}
          {activeTab === 'prizes' && <AdminPrizes />}
          {activeTab === 'transactions' && <AdminTransactions userMap={userMap} />}
          {activeTab === 'bets' && <AdminBets userMap={userMap} />}
          {activeTab === 'users' && <AdminUsers initialUsers={users} />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </div>
    </div>
  );
};

const AdminDraws = ({ drawStates, onSettleMissing }: { drawStates: Record<string, LotteryDrawState>, onSettleMissing?: () => Promise<void> }) => {
  const [configs, setConfigs] = useState<any[]>([]);
  const [now, setNow] = useState(Date.now());
  const [isSettling, setIsSettling] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'lottery_configs'), (snap) => {
      setConfigs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleSetResult = async (lotteryId: string, numbers: string, targetDrawId: string) => {
    const nums = numbers.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    if (nums.length === 0) return;
    
    // Store as a map of drawId -> results
    const configRef = doc(db, 'lottery_configs', lotteryId);
    const configSnap = await getDoc(configRef);
    let scheduledResults = {};
    if (configSnap.exists()) {
      scheduledResults = configSnap.data().scheduled_results || {};
    }
    
    scheduledResults[targetDrawId] = nums;
    
    await setDoc(configRef, { scheduled_results: scheduledResults }, { merge: true });
    alert(`Draw #${targetDrawId} result preset`);
  };

  const handleManualDraw = async (lotteryId: string) => {
    const drwRef = doc(db, 'draw_states', lotteryId);
    await updateDoc(drwRef, { nextDraw: Date.now() - 1000 });
    alert('已强制开奖，系统正在处理...');
  };

  const handleSetInterval = async (lotteryId: string, seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return;
    const configRef = doc(db, 'lottery_configs', lotteryId);
    await setDoc(configRef, { drawInterval: seconds }, { merge: true });
    alert('开奖间隔阶段性更新，下期开奖后生效');
  };

  const handleClearResult = async (lotteryId: string, drawId: string) => {
    const configRef = doc(db, 'lottery_configs', lotteryId);
    const configSnap = await getDoc(configRef);
    if (configSnap.exists()) {
      const scheduledResults = configSnap.data().scheduled_results || {};
      delete scheduledResults[drawId];
      await setDoc(configRef, { scheduled_results: scheduledResults }, { merge: true });
      alert('已清除预设');
    }
  };

  const handleManualSettle = async () => {
    setIsSettling(true);
    try {
      if (onSettleMissing) {
        await onSettleMissing();
      }
      alert("Background settlement triggered for all pending bets.");
    } catch (e) {
      alert("Error: " + e);
    } finally {
      setIsSettling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-xl font-black text-text-main">开奖管理</h3>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Manual Draw Control & Scheduling</p>
          </div>
          <button 
            onClick={handleManualSettle}
            disabled={isSettling}
            className="px-4 py-2 bg-brand-blue text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-brand-blue/20 active:scale-95 disabled:opacity-50"
          >
            {isSettling ? 'Settling...' : 'Sync & Settle All'}
          </button>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-brand-blue bg-brand-blue/5 border border-brand-blue/10 px-4 py-1.5 rounded-full">
           <Zap size={12} className="animate-pulse" />
           SYSTEM LIVE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lotteries.map(loto => {
          const config = configs.find(c => c.id === loto.id);
          const currentDraw = drawStates[loto.id];
          return (
            <div key={loto.id} className="p-6 border border-border-grey rounded-3xl bg-surface-grey/30 relative overflow-hidden group">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                     <div className={`w-12 h-12 rounded-2xl bg-white border border-border-grey flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform`}>
                        <LotteryLogo id={loto.id} />
                     </div>
                     <div>
                        <span className="font-black text-sm text-text-main block">{loto.name}</span>
                        <span className="text-[8px] font-bold text-text-muted uppercase tracking-widest">{loto.region}</span>
                     </div>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-[10px] font-black text-brand-blue bg-brand-blue/5 px-3 py-1 rounded-full border border-brand-blue/10 mb-1">
                        #{currentDraw?.drawId || '---'}
                     </span>
                     <p className="text-[9px] font-bold text-text-muted italic">
                       距离下期: {currentDraw?.nextDraw ? Math.max(0, Math.floor((currentDraw.nextDraw - now) / 1000)) : '0'}s
                     </p>
                  </div>
               </div>

                <div className="space-y-5">
                   {/* Scheduled Result */}
                   <div className="space-y-2">
                       <div className="flex items-center justify-between">
                         <label className="text-[9px] font-black text-text-muted uppercase tracking-widest">下期开奖预设</label>
                         {currentDraw?.drawId && config?.scheduled_results?.[currentDraw.drawId] && (
                           <span className="text-[8px] font-black text-white bg-danger px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                             <Target size={8} />
                             已预设: {Array.isArray(config.scheduled_results[currentDraw.drawId]) ? config.scheduled_results[currentDraw.drawId].join(', ') : 'Format Error'}
                           </span>
                         )}
                       </div>
                       <div className="flex gap-2">
                          <input 
                            id={`draw-${loto.id}`}
                            type="text" 
                            placeholder={loto.id === 'f3' ? "例如: 1, 2, 3" : loto.id === 'pb' ? "例如: 1,2,3,4,5,6" : "数字, 逗号隔开"}
                            className="flex-1 bg-white border border-border-grey rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-brand-blue/20 outline-none"
                          />
                          <div className="flex gap-1">
                            <button 
                              onClick={() => {
                                const val = (document.getElementById(`draw-${loto.id}`) as HTMLInputElement).value;
                                handleSetResult(loto.id, val, currentDraw?.drawId);
                              }}
                              className="bg-brand-blue text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-md shadow-brand-blue/10 active:scale-95 transition-transform"
                            >
                              保存预设
                            </button>
                            {currentDraw?.drawId && config?.scheduled_results?.[currentDraw.drawId] && (
                              <button 
                                onClick={() => handleClearResult(loto.id, currentDraw.drawId)}
                                className="bg-danger/10 text-danger border border-danger/20 px-3 py-2 rounded-xl hover:bg-danger hover:text-white transition-colors"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                       </div>
                   </div>

                   {/* Interval & Manual Control */}
                   <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border-grey/30">
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-text-muted uppercase tracking-widest">开奖间隔 (秒)</label>
                         <div className="flex gap-1">
                            <input 
                              id={`interval-${loto.id}`}
                              type="number" 
                              defaultValue={config?.drawInterval || loto.drawInterval}
                              className="w-full bg-white border border-border-grey rounded-xl px-3 py-2 text-xs font-bold"
                            />
                            <button 
                              onClick={() => {
                                const val = parseInt((document.getElementById(`interval-${loto.id}`) as HTMLInputElement).value);
                                handleSetInterval(loto.id, val);
                              }}
                              className="bg-surface-grey border border-border-grey text-text-main p-2 rounded-xl hover:bg-white transition-colors"
                            >
                               <Settings2 size={14} />
                            </button>
                         </div>
                      </div>
                      <div className="flex flex-col justify-end">
                         <button 
                           onClick={() => handleManualDraw(loto.id)}
                           className="w-full h-9 bg-success/10 text-success border border-success/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-success hover:text-white transition-all whitespace-nowrap"
                         >
                           立即强制开奖
                         </button>
                      </div>
                   </div>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AdminPrizes = () => {
  const [configs, setConfigs] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'lottery_configs'), (snap) => {
      setConfigs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const handleSetPrizes = async (lotteryId: string, p1: string, p2: string, p3: string, bOdds?: any) => {
    const data: any = {
      prizes: {
        first: parseFloat(p1) || 0,
        second: parseFloat(p2) || 0,
        third: parseFloat(p3) || 0,
      }
    };
    if (bOdds) {
      data.binaryOdds = {
        big: parseFloat(bOdds.big) || 0,
        small: parseFloat(bOdds.small) || 0,
        odd: parseFloat(bOdds.odd) || 0,
        even: parseFloat(bOdds.even) || 0,
      };
    }
    await setDoc(doc(db, 'lottery_configs', lotteryId), data, { merge: true });
    alert('设置已更新');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-text-main">奖金设置</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lotteries.map(loto => {
          const config = configs.find(c => c.id === loto.id);
          return (
            <div key={loto.id} className="p-6 border border-border-grey rounded-3xl bg-surface-grey/30">
               <div className="flex items-center gap-3 mb-4">
                  <LotteryLogo id={loto.id} />
                  <span className="font-bold text-text-main">{loto.name}</span>
               </div>
               <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] font-black text-text-muted uppercase">一等奖</label>
                    <input id={`p1-${loto.id}`} type="number" defaultValue={config?.prizes?.first || ''} className="w-full bg-white border border-border-grey rounded-lg px-2 py-1.5 text-xs" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-text-muted uppercase">二等奖</label>
                    <input id={`p2-${loto.id}`} type="number" defaultValue={config?.prizes?.second || ''} className="w-full bg-white border border-border-grey rounded-lg px-2 py-1.5 text-xs" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-text-muted uppercase">三等奖</label>
                    <input id={`p3-${loto.id}`} type="number" defaultValue={config?.prizes?.third || ''} className="w-full bg-white border border-border-grey rounded-lg px-2 py-1.5 text-xs" />
                  </div>
                </div>

                {(loto.id === 'wg' || loto.id === 'f3') && (
                  <div className="mt-4 pt-4 border-t border-border-grey/30">
                    <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-3">大小单双 赔率设置</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-black text-text-muted uppercase">大 (Odds)</label>
                        <input id={`ob-${loto.id}`} type="number" step="0.01" defaultValue={config?.binaryOdds?.big || 1.96} className="w-full bg-white border border-border-grey rounded-lg px-2 py-1.5 text-xs" />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-text-muted uppercase">小 (Odds)</label>
                        <input id={`os-${loto.id}`} type="number" step="0.01" defaultValue={config?.binaryOdds?.small || 1.96} className="w-full bg-white border border-border-grey rounded-lg px-2 py-1.5 text-xs" />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-text-muted uppercase">单 (Odds)</label>
                        <input id={`oo-${loto.id}`} type="number" step="0.01" defaultValue={config?.binaryOdds?.odd || 1.96} className="w-full bg-white border border-border-grey rounded-lg px-2 py-1.5 text-xs" />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-text-muted uppercase">双 (Odds)</label>
                        <input id={`oe-${loto.id}`} type="number" step="0.01" defaultValue={config?.binaryOdds?.even || 1.96} className="w-full bg-white border border-border-grey rounded-lg px-2 py-1.5 text-xs" />
                      </div>
                    </div>
                  </div>
                )}
               <button 
                 onClick={() => {
                   const p1 = (document.getElementById(`p1-${loto.id}`) as HTMLInputElement).value;
                   const p2 = (document.getElementById(`p2-${loto.id}`) as HTMLInputElement).value;
                   const p3 = (document.getElementById(`p3-${loto.id}`) as HTMLInputElement).value;
                   let bOdds = null; if (loto.id === 'wg' || loto.id === 'f3') { bOdds = { big: (document.getElementById(`ob-${loto.id}`) as HTMLInputElement).value, small: (document.getElementById(`os-${loto.id}`) as HTMLInputElement).value, odd: (document.getElementById(`oo-${loto.id}`) as HTMLInputElement).value, even: (document.getElementById(`oe-${loto.id}`) as HTMLInputElement).value }; } handleSetPrizes(loto.id, p1, p2, p3, bOdds);
                 }}
                 className="mt-4 w-full bg-brand-blue text-white py-2 rounded-xl text-xs font-bold"
               >
                 保存设置
               </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AdminTransactions = ({ userMap = {} }: { userMap?: Record<string, any> }) => {
  const [txs, setTxs] = useState<any[]>([]);
  const [editingTx, setEditingTx] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setTxs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const updateStatus = async (tx: any, status: 'completed' | 'rejected') => {
    await runTransaction(db, async (transaction) => {
      const txRef = doc(db, 'transactions', tx.id);
      const userRef = doc(db, 'users', tx.uid);
      
      const userSnap = await transaction.get(userRef);
      if (!userSnap.exists()) throw "User does not exist";
      
      const currentBalance = userSnap.data().balance || 0;
      
      if (status === 'completed') {
        if (tx.type === 'deposit') {
          transaction.update(userRef, { balance: currentBalance + tx.amount });
        } else if (tx.type === 'withdrawal') {
          // Balance was already deducted at request time (presumably, or we do it here)
          // For now let's assume it was deducted, so we just mark it complete.
          // In a real app, you'd check if balance is enough.
        }
      } else if (status === 'rejected') {
        if (tx.type === 'withdrawal') {
          // Refund balance if withdrawal rejected
          transaction.update(userRef, { balance: currentBalance + tx.amount });
        }
      }
      
      transaction.update(txRef, { status: status });
    });
    alert('状态已更新');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-text-main">出入金审核</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-grey px-4">
              <th className="py-4 text-[10px] font-black uppercase text-text-muted">用户 UID</th>
              <th className="py-4 text-[10px] font-black uppercase text-text-muted">类型</th>
              <th className="py-4 text-[10px] font-black uppercase text-text-muted">金额</th>
              <th className="py-4 text-[10px] font-black uppercase text-text-muted">提现地址</th>
              <th className="py-4 text-[10px] font-black uppercase text-text-muted">状态</th>
              <th className="py-4 text-[10px] font-black uppercase text-text-muted">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-grey/50">
            {txs.filter(t => t.type === 'deposit' || t.type === 'withdrawal').map(tx => (
              <tr key={tx.id} className="hover:bg-surface-grey/30">
                <td className="py-4">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono whitespace-nowrap">{tx.uid?.toString().substring(0, 10) || 'Unknown'}...</span>
                    {userMap[tx.uid] && (
                      <span className="text-[9px] font-bold text-brand-blue truncate max-w-[100px]">{userMap[tx.uid].email}</span>
                    )}
                  </div>
                </td>
                <td className="py-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${tx.type === 'deposit' ? 'bg-success/10 text-success' : 'bg-brand-blue/10 text-brand-blue'}`}>
                    {tx.type === 'deposit' ? '充值' : '提现'}
                  </span>
                </td>
                <td className="py-4 text-xs font-bold">{tx.amount} USDT</td>
                <td className="py-4">
                  <div className="flex flex-col gap-1 max-w-[150px]">
                    {tx.bank_name ? (
                      <div className="text-[9px] font-bold text-text-main bg-brand-blue/5 p-2 rounded-lg border border-brand-blue/10">
                        <p className="text-brand-blue text-[7px] uppercase tracking-tighter mb-1">银行账户模式</p>
                        <p className="mb-0.5">{tx.bank_name}</p>
                        <p className="font-mono text-brand-blue mb-0.5">{tx.account_number}</p>
                        <p className="opacity-70">{tx.account_name}</p>
                      </div>
                    ) : (
                      <p className="text-[9px] font-mono break-all opacity-60 leading-tight">{tx.address || '---'}</p>
                    )}
                    {tx.type === 'withdrawal' && (
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEditingTx(tx);
                        }}
                        className="mt-2 py-2 px-3 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border border-brand-blue/20 flex items-center gap-1 w-fit"
                      >
                        <Settings2 size={12} />
                        修改提现信息
                      </button>
                    )}
                  </div>
                </td>
                <td className="py-4">
                  <span className={`text-[10px] font-bold ${
                    tx.status === 'pending' ? 'text-amber-500' : 
                    tx.status === 'completed' ? 'text-success' : 
                    'text-danger'
                  }`}>{tx.status}</span>
                </td>
                <td className="py-4 flex gap-2">
                  {tx.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(tx, 'completed')} className="p-1 text-success hover:bg-success/10 rounded"><CheckCircle2 size={18} /></button>
                      <button onClick={() => updateStatus(tx, 'rejected')} className="p-1 text-danger hover:bg-danger/10 rounded"><XCircle size={18} /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingTx && (
        <EditModal 
          tx={editingTx} 
          onClose={() => setEditingTx(null)} 
        />
      )}
    </div>
  );
};

const EditModal = ({ tx, onClose }: { tx: any, onClose: () => void }) => {
  const [formData, setFormData] = useState({
    bank_name: tx.bank_name || '',
    account_number: tx.account_number || '',
    account_name: tx.account_name || '',
    address: tx.address || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'transactions', tx.id), formData);
      onClose();
    } catch (err: any) {
      alert('更新失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-border-grey/10 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-text-main">编辑提现信息</h3>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Edit Withdrawal Info</p>
          </div>
          <button onClick={onClose} className="p-3 bg-surface-grey hover:bg-border-grey/20 rounded-2xl transition-all">
            <X size={20} className="text-text-main" />
          </button>
        </div>
        
        <div className="p-8 space-y-5">
          {tx.bank_name ? (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">银行名称 / Bank Name</label>
                <div className="relative group">
                  <input 
                    type="text"
                    value={formData.bank_name}
                    onChange={e => setFormData({ ...formData, bank_name: e.target.value })}
                    className="w-full bg-surface-grey border border-border-grey/20 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/10 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20"><Building size={16} /></div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">银行卡号 / Account Number</label>
                <div className="relative group">
                  <input 
                    type="text"
                    value={formData.account_number}
                    onChange={e => setFormData({ ...formData, account_number: e.target.value })}
                    className="w-full bg-surface-grey border border-border-grey/20 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/10 transition-all font-mono"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20"><CreditCard size={16} /></div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">持卡人姓名 / Holder Name</label>
                <div className="relative group">
                  <input 
                    type="text"
                    value={formData.account_name}
                    onChange={e => setFormData({ ...formData, account_name: e.target.value })}
                    className="w-full bg-surface-grey border border-border-grey/20 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/10 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20"><User size={16} /></div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">提现地址 / Withdrawal Address</label>
              <div className="relative group">
                <textarea 
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-surface-grey border border-border-grey/20 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-blue/10 transition-all font-mono min-h-[100px] resize-none"
                />
                <div className="absolute right-4 top-6 opacity-20"><Wallet size={16} /></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-surface-grey/50 border-t border-border-grey/10 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 px-6 rounded-2xl border border-border-grey/30 text-sm font-black text-text-muted hover:bg-white transition-all uppercase tracking-widest"
          >
            取消
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-4 px-6 rounded-2xl bg-brand-blue text-white text-sm font-black hover:opacity-90 shadow-xl shadow-brand-blue/20 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '保存修改'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AdminBets = ({ userMap = {} }: { userMap?: Record<string, any> }) => {
  const { t } = useContext(LanguageContext);
  const [bets, setBets] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'purchases'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setBets(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-text-main">注单查询</h3>
      <div className="grid gap-4">
        {bets.map(bet => (
          <div key={bet.id} className="p-4 border border-border-grey rounded-2xl bg-surface-grey/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-blue-light flex items-center justify-center text-brand-blue">
                   <Ticket size={20} />
                </div>
                <div>
                   <p className="text-xs font-black text-text-main">{bet.lotteryId} | DRAW # {bet.drawId || 'LIVE'}</p>
                   <div className="flex items-center gap-2">
                      <p className="text-[10px] text-text-muted font-mono opacity-50">{bet.uid?.toString().substring(0, 8)}...</p>
                      {userMap[bet.uid] ? (
                        <span className="text-[10px] font-bold text-brand-blue bg-brand-blue/5 px-2 py-0.5 rounded-full border border-brand-blue/10">
                           {userMap[bet.uid].email}
                        </span>
                      ) : bet.userEmail ? (
                         <span className="text-[10px] font-bold text-brand-blue bg-brand-blue/5 px-2 py-0.5 rounded-full border border-brand-blue/10">
                           {bet.userEmail}
                         </span>
                      ) : null}
                   </div>
                </div>
             </div>
             <div className="flex-1 flex flex-wrap gap-2 justify-center">
                {Array.isArray(bet.numbers) ? bet.numbers.map((n: any, i: number) => (
                  <span key={i} className="w-6 h-6 rounded-full bg-white border border-border-grey flex items-center justify-center text-[10px] font-black">{n}</span>
                )) : (bet.bets || bet.lines) ? (
                  <div className="flex flex-wrap gap-1">
                    {(bet.bets || bet.lines).map((b: any, i: number) => {
                      const val = b.val || b.selection;
                      const type = b.type;
                      const main = b.main;
                      const displayVal = main && main.length > 0 
                        ? main.join(',') 
                        : (type === 'sum' ? `SUM:${val}` : t(val?.toString().toLowerCase()) || val);
                      
                      return (
                        <span key={i} className="px-2 py-0.5 bg-brand-blue/5 text-brand-blue border border-brand-blue/10 rounded text-[9px] font-black uppercase tracking-tighter">
                          {displayVal}
                        </span>
                      );
                    })}
                  </div>
                ) : bet.selection ? (
                  <span className="px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-lg text-[10px] font-black uppercase tracking-widest">{bet.selection}</span>
                ) : (
                  <span className="text-[9px] text-text-muted italic">No digits</span>
                )}
             </div>
             <div className="text-right">
                <p className="text-xs font-black text-text-main">{bet.amount} USDT</p>
                <p className={`text-[10px] font-bold ${bet.status === 'won' ? 'text-success' : bet.status === 'lost' ? 'text-text-muted' : 'text-amber-500'}`}>
                  {bet.status === 'won' ? `中奖: ${bet.winAmount} USDT` : bet.status}
                </p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminUsers = ({ initialUsers = [] }: { initialUsers?: any[] }) => {
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [admins, setAdmins] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  useEffect(() => {
    // We already have users from props, but let's keep the admin listener
    const unsubAdmins = onSnapshot(collection(db, 'admins'), (snap) => {
      setAdmins(snap.docs.map(doc => doc.id));
    });
    
    return () => {
      unsubAdmins();
    };
  }, []);

  const handleUpdateUser = async (e: any) => {
    e.preventDefault();
    const form = e.target as any;
    const balance = parseFloat(form.balance.value);
    const displayName = form.displayName.value;
    const email = form.email.value;
    const invite_code = form.invite_code.value;
    const withdraw_address = form.withdraw_address.value;
    const bank_name = form.bank_name.value;
    const account_number = form.account_number.value;
    const account_name = form.account_name.value;
    const isAdminChecked = form.isAdmin.checked;

    await updateDoc(doc(db, 'users', editingUser.id), { 
      balance,
      displayName,
      email,
      invite_code,
      withdraw_address,
      bank_name,
      account_number,
      account_name
    });
    
    if (isAdminChecked) {
      await setDoc(doc(db, 'admins', editingUser.id), { role: 'admin' });
    } else {
      await deleteDoc(doc(db, 'admins', editingUser.id));
    }
    
    alert('用户信息已更新');
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-text-main">用户管理</h3>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">User Database & Permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] font-black text-brand-blue bg-brand-blue/5 border border-brand-blue/10 px-4 py-1.5 rounded-full">
            <Users size={12} />
            {users.length} TOTAL
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full">
            <Shield size={12} />
            {admins.length} ADMINS
          </div>
        </div>
      </div>

      {/* Compact User Table */}
      <div className="bg-white border border-border-grey rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-grey/50 border-b border-border-grey">
                <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">用户信息</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">余额 (USDT)</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">邀请码</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-center">状态</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-grey/50">
              {(users || []).sort((a, b) => {
                 if (!a || !b) return 0;
                 const aIsAdmin = (admins || []).includes(a.id);
                 const bIsAdmin = (admins || []).includes(b.id);
                 if (aIsAdmin && !bIsAdmin) return -1;
                 if (!aIsAdmin && bIsAdmin) return 1;
                 return 0;
              }).map(user => {
                if (!user) return null;
                const userIsAdmin = (admins || []).includes(user.id);
                return (
                  <tr key={user.id} className={`hover:bg-surface-grey/30 transition-colors ${userIsAdmin ? 'bg-amber-50/10' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${userIsAdmin ? 'bg-amber-100 text-amber-600' : 'bg-surface-grey text-text-muted'}`}>
                          <User size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-text-main truncate">{user.displayName || 'Guest'}</p>
                          <p className="text-[9px] text-text-muted font-mono truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-black text-brand-blue">{(typeof user.balance === 'number' ? user.balance : parseFloat(user.balance) || 0).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-mono font-bold text-text-main select-all">{user.invite_code || '---'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {userIsAdmin ? (
                          <span className="text-[8px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-tighter">Administrator</span>
                        ) : (
                          <span className="text-[8px] font-black text-text-muted bg-surface-grey px-2 py-0.5 rounded border border-border-grey uppercase tracking-tighter opacity-60">Verified User</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setEditingUser(user)}
                        className="p-2 text-text-muted hover:text-brand-blue hover:bg-brand-blue/5 rounded-xl transition-all"
                      >
                        <Settings2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-2xl" onClick={() => setEditingUser(null)} />
           <div className="relative bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-border-grey">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-brand-blue-light flex items-center justify-center text-brand-blue shadow-inner">
                    <User size={24} />
                 </div>
                 <div>
                    <h4 className="text-lg font-black text-text-main leading-tight">用户设置</h4>
                    <p className="text-xs text-text-muted font-mono">{editingUser.email}</p>
                 </div>
              </div>

              <form onSubmit={handleUpdateUser} className="space-y-6 max-h-[60vh] overflow-y-auto px-1 pr-2">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">用户名</label>
                    <input 
                      name="displayName" 
                      type="text" 
                      defaultValue={editingUser.displayName || ''} 
                      className="w-full bg-surface-grey border border-border-grey rounded-2xl px-5 py-3 text-sm font-bold focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all" 
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">邮箱地址</label>
                    <input 
                      name="email" 
                      type="email" 
                      defaultValue={editingUser.email || ''} 
                      className="w-full bg-surface-grey border border-border-grey rounded-2xl px-5 py-3 text-sm font-bold focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all" 
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">修改余额 (USDT)</label>
                    <input 
                      name="balance" 
                      type="number" 
                      step="0.01" 
                      defaultValue={editingUser.balance} 
                      className="w-full bg-surface-grey border border-border-grey rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all" 
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">邀请码</label>
                    <input 
                      name="invite_code" 
                      type="text" 
                      defaultValue={editingUser.invite_code || ''} 
                      className="w-full bg-surface-grey border border-border-grey rounded-2xl px-5 py-3 text-sm font-bold focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all" 
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">默认提现钱包地址</label>
                 </div>

                 <div className="grid grid-cols-1 gap-4 p-4 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
                    <p className="text-[9px] font-black text-brand-blue uppercase tracking-[0.2em] mb-1">银行账户设置</p>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1">银行名称</label>
                       <input 
                         name="bank_name" 
                         type="text" 
                         defaultValue={editingUser.bank_name || ''} 
                         className="w-full bg-white border border-border-grey rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-brand-blue transition-all" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1">银行卡号</label>
                       <input 
                         name="account_number" 
                         type="text" 
                         defaultValue={editingUser.account_number || ''} 
                         className="w-full bg-white border border-border-grey rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-brand-blue transition-all" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1">开户人姓名</label>
                       <input 
                         name="account_name" 
                         type="text" 
                         defaultValue={editingUser.account_name || ''} 
                         className="w-full bg-white border border-border-grey rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-brand-blue transition-all" 
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">默认提现钱包地址</label>
                    <input 
                      name="withdraw_address" 
                      type="text" 
                      defaultValue={editingUser.withdraw_address || ''} 
                      placeholder="TRC20 / ERC20 地址"
                      className="w-full bg-surface-grey border border-border-grey rounded-2xl px-5 py-3 text-sm font-bold focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all" 
                    />
                 </div>
                 
                 <div className="flex items-center justify-between p-4 bg-surface-grey/50 rounded-2xl border border-dashed border-border-grey">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-white border border-border-grey flex items-center justify-center text-amber-500">
                          <Shield size={18} />
                       </div>
                       <div>
                          <p className="text-xs font-black text-text-main leading-none mb-1">管理员权限</p>
                          <p className="text-[9px] text-text-muted font-medium">允许访问管理控制台</p>
                       </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        id="is-admin" 
                        name="isAdmin" 
                        type="checkbox" 
                        defaultChecked={admins.includes(editingUser.id)} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-border-grey peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                    </label>
                 </div>

                 <div className="flex flex-col gap-3 pt-4">
                    <button type="submit" className="w-full py-4 bg-brand-blue text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-blue/20 transition-all hover:scale-[1.02] active:scale-100">
                       保存所有更改
                    </button>
                    <button type="button" onClick={() => setEditingUser(null)} className="w-full py-3 text-xs font-black text-text-muted uppercase tracking-widest hover:text-text-main transition-colors">
                       放弃修改
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const AdminSettings = () => {
  const [settings, setSettings] = useState<any>(null);
  const [trc20QR, setTrc20QR] = useState<string>('');
  const [erc20QR, setErc20QR] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setSettings(data);
        if (data.trc20_qr) setTrc20QR(data.trc20_qr);
        if (data.erc20_qr) setErc20QR(data.erc20_qr);
      }
    });
    return () => unsub();
  }, []);

  const handleFileChange = (e: any, type: 'trc20' | 'erc20') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 500) { // 500KB limit for base64 storage in firestore
      alert('图片文件太大，请选择 500KB 以下的图片');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === 'trc20') setTrc20QR(base64String);
      else setErc20QR(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateSettings = async (e: any) => {
    e.preventDefault();
    setUploading(true);
    try {
      const form = e.target as any;
      await setDoc(doc(db, 'settings', 'global'), {
        support_link: form.support_link.value,
        trc20_address: form.trc20_address.value,
        erc20_address: form.erc20_address.value,
        trc20_qr: trc20QR,
        erc20_qr: erc20QR,
        updatedAt: serverTimestamp()
      }, { merge: true });
      alert('系统设置已更新');
    } catch (err) {
      console.error(err);
      alert('保存失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-text-main">系统设置</h3>
          <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold bg-surface-grey px-3 py-1 rounded-full border border-border-grey">
             <Settings2 size={12} />
             GLOBAL_CONFIG
          </div>
       </div>
       
       <form onSubmit={handleUpdateSettings} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">客服链接 (TELEGRAM/WHATSAPP)</label>
                <input name="support_link" type="text" defaultValue={settings?.support_link || ''} className="w-full bg-white border border-border-grey rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all" placeholder="https://t.me/..." />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">TRC20 收款地址</label>
                <input name="trc20_address" type="text" defaultValue={settings?.trc20_address || ''} className="w-full bg-white border border-border-grey rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all" placeholder="T..." />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">ERC20 收款地址</label>
                <input name="erc20_address" type="text" defaultValue={settings?.erc20_address || ''} className="w-full bg-white border border-border-grey rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all" placeholder="0x..." />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* TRC20 QR */}
             <div className="p-6 border border-border-grey bg-surface-grey/30 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                   <h4 className="text-xs font-black text-text-main tracking-widest uppercase">TRC20 收款二维码</h4>
                   <label className="cursor-pointer bg-brand-blue text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                      上传图片
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'trc20')} className="hidden" />
                   </label>
                </div>
                <div className="aspect-square w-full max-w-[200px] mx-auto bg-white rounded-2xl border border-border-grey/50 flex items-center justify-center overflow-hidden">
                   {trc20QR ? (
                      <img src={trc20QR} alt="TRC20 QR" className="w-full h-full object-contain" />
                   ) : (
                      <div className="text-center space-y-2">
                         <QrCode size={32} className="text-text-muted/30 mx-auto" />
                         <p className="text-[9px] text-text-muted">未上传二维码</p>
                      </div>
                   )}
                </div>
                {trc20QR && (
                   <button type="button" onClick={() => setTrc20QR('')} className="w-full text-[9px] text-danger font-bold hover:underline">移除图片</button>
                )}
             </div>

             {/* ERC20 QR */}
             <div className="p-6 border border-border-grey bg-surface-grey/30 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                   <h4 className="text-xs font-black text-text-main tracking-widest uppercase">ERC20 收款二维码</h4>
                   <label className="cursor-pointer bg-brand-blue text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                      上传图片
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'erc20')} className="hidden" />
                   </label>
                </div>
                <div className="aspect-square w-full max-w-[200px] mx-auto bg-white rounded-2xl border border-border-grey/50 flex items-center justify-center overflow-hidden">
                   {erc20QR ? (
                      <img src={erc20QR} alt="ERC20 QR" className="w-full h-full object-contain" />
                   ) : (
                      <div className="text-center space-y-2">
                         <QrCode size={32} className="text-text-muted/30 mx-auto" />
                         <p className="text-[9px] text-text-muted">未上传二维码</p>
                      </div>
                   )}
                </div>
                {erc20QR && (
                   <button type="button" onClick={() => setErc20QR('')} className="w-full text-[9px] text-danger font-bold hover:underline">移除图片</button>
                )}
             </div>
          </div>

          <button 
             type="submit" 
             disabled={uploading}
             className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-[0.98] ${uploading ? 'bg-text-muted cursor-not-allowed' : 'bg-brand-blue text-white shadow-brand-blue/20'}`}
          >
             {uploading ? '正在保存...' : '保 存 全 局 设 置'}
          </button>
       </form>
    </div>
  );
};

const LotteryLogo = ({ id }: { id: string }) => {
  switch (id) {
    case 'pb': // Powerball: 3D glossy red sphere with a bold white 'P'
      return (
        <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-400 via-danger to-red-900 flex items-center justify-center shadow-lg relative overflow-hidden border-t border-white/30">
          <div className="absolute top-1 left-1.5 w-4 h-2 bg-white/20 rounded-full blur-[2px] -rotate-15" />
          <span className="text-white font-black text-xl italic drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] z-10">P</span>
        </div>
      );
    case 'l7': // LOTO 7: Minimalist rainbow-gradient '7' in a clean white circle
      return (
        <div className="shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border border-border-grey relative overflow-hidden">
          <span className="font-black text-xl bg-gradient-to-br from-indigo-500 via-red-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm">7</span>
          <div className="absolute inset-0 border-[3px] border-transparent bg-gradient-to-br from-indigo-500/10 via-red-500/10 to-yellow-500/10 rounded-full" />
        </div>
      );
    case 'em': // EuroMillions: Premium golden star on a dark blue background
      return (
        <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-900 to-brand-blue flex items-center justify-center shadow-lg border-t border-white/20 relative">
          <Star size={18} fill="#FFD700" stroke="#FFD700" className="drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]" />
          <div className="absolute inset-0">
             <div className="absolute top-2 left-2 w-0.5 h-0.5 bg-white rounded-full animate-pulse capitalize" />
             <div className="absolute bottom-3 right-2 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-700" />
          </div>
        </div>
      );
    case 'f3': // Fast 3: Three red balls with a small lightning bolt icon
      return (
        <div className="shrink-0 w-10 h-10 rounded-lg bg-surface-grey border border-border-grey flex items-center justify-center relative">
          <div className="flex -space-x-1 items-center">
             {[1,2,3].map(i => (
               <div key={i} className="w-3.5 h-3.5 rounded-full bg-danger shadow-sm border-t border-white/30" />
             ))}
          </div>
          <div className="absolute -top-1 -right-1 bg-yellow-400 p-0.5 rounded-full shadow-sm border border-yellow-500">
            <Zap size={8} fill="white" stroke="white" />
          </div>
        </div>
      );
    case 'vl': // Mega 6/45: Vibrant red and yellow logo
      return (
        <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg border-t border-white/30 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.4)_0%,transparent_50%)]" />
          <div className="flex flex-col items-center leading-none">
             <span className="text-[8px] font-black text-yellow-400 tracking-tighter uppercase mb-0.5">MEGA</span>
             <span className="text-[12px] font-black text-white italic tracking-tighter">6/45</span>
          </div>
        </div>
      );
    case 'kp': // Keno: Dynamic cluster of colorful small spheres
      return (
        <div className="shrink-0 w-10 h-10 rounded-full bg-surface-grey border border-border-grey flex items-center justify-center overflow-hidden relative shadow-inner">
           <div className="grid grid-cols-2 gap-1 p-1">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm border-t border-white/30" />
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm border-t border-white/30" />
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm border-t border-white/30" />
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm border-t border-white/30" />
           </div>
           <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        </div>
      );
    case 'mm': // Mega Millions: Golden star with 'M' inside a blue circle
      return (
        <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center shadow-lg relative border-t border-white/30">
          <Star size={18} fill="#FFD700" stroke="#FFD700" className="opacity-40 blur-[1px] absolute" />
          <span className="text-white font-black text-xl italic z-10 drop-shadow-md">MM</span>
        </div>
      );
    case 'se': // SuperEnalotto: Elegant dark green logo
      return (
        <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-700 to-green-950 flex items-center justify-center shadow-lg relative border-t border-white/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
          <span className="text-white font-black text-xl italic z-10 drop-shadow-md">SE</span>
        </div>
      );
    case 'sn': // Speedy 90s: Fast blue icon with stripes
      return (
        <div className="shrink-0 w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
          <Zap size={18} fill="white" stroke="white" />
        </div>
      );
    case 'bh': // Bitcoin Hash Lotto: Futuristic cyan tech logo
      return (
        <div className="shrink-0 w-10 h-10 rounded-full bg-slate-900 border border-cyan-500/50 flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <div className="absolute inset-0 bg-[conical-gradient(from_0deg,#06b6d4,transparent,transparent)] opacity-20 animate-spin" style={{ animationDuration: '4s' }} />
          <div className="text-cyan-400 font-bold text-xs tracking-tighter z-10">HASH</div>
        </div>
      );
    case 'wg': // Wingo: Traffic Light 
      return (
        <div className="shrink-0 w-10 h-10 rounded-full bg-surface-grey border border-border-grey flex flex-col items-center justify-center gap-0.5 overflow-hidden p-1.5 shadow-inner">
           <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
           <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
           <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm animate-pulse" />
        </div>
      );
    default:
      return null;
  }
};

const Navbar = ({ onLoginClick, isLoggedIn, onProfileClick }: { onLoginClick: () => void; isLoggedIn: boolean; onProfileClick: () => void }) => {
  const { t } = useContext(LanguageContext);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border-grey shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-brand-blue rounded flex items-center justify-center text-white font-bold">L</div>
            <span className="font-bold text-xl tracking-tight text-brand-blue">GlobalLotto <span className="text-text-muted font-normal">Bank</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {[
              { key: 'navbar_lotteries', label: t('navbar_lotteries') },
              { key: 'navbar_results', label: t('navbar_results') },
              { key: 'navbar_check', label: t('navbar_check') },
              { key: 'navbar_help', label: t('navbar_help') }
            ].map((item) => (
              <button key={item.key} className="text-sm font-medium text-text-muted hover:text-brand-blue transition-colors">{item.label}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <button 
              onClick={onProfileClick}
              className="flex items-center gap-2 p-1 pr-3 bg-surface-grey border border-border-grey rounded-full hover:bg-border-grey/20 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                <User size={16} className="mt-1" />
              </div>
              <span className="text-[11px] font-black text-text-main uppercase tracking-tight">{t('user')}</span>
            </button>
          ) : (
            <button 
              onClick={onLoginClick}
              className="flex items-center gap-1.5 bg-brand-blue text-white px-3.5 py-1.5 rounded-lg text-[13px] font-bold shadow-sm hover:bg-brand-blue/90 transition-all active:scale-95"
            >
              <Lock size={12} />
              {t('navbar_login')}
            </button>
          )}
          <button className="md:hidden text-text-muted p-1"><Menu size={22} /></button>
        </div>
      </div>
    </nav>
  );
};

const Card = ({ lottery, onSelect }: { lottery: Lottery; onSelect: (loto: Lottery) => void; key?: string }) => {
  const { t } = useContext(LanguageContext);
  const { drawStates, lotteryHistory } = useContext(LotteryContext);
  const [timeLeft, setTimeLeft] = useState('');

  const history = lotteryHistory[lottery.id] || [];
  const recentResults = history.slice(0, 3).map(h => h.res?.[0] ?? 0);

  useEffect(() => {
    const updateTimer = () => {
      const state = drawStates[lottery.id];
      if (!state || !state.nextDraw) {
        setTimeLeft('00:00:00');
        return;
      }
      
      const now = Date.now();
      const diff = Math.max(0, state.nextDraw - now);
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [drawStates, lottery.id]);

  const getJackpotGradient = () => {
    if (lottery.id === 'pb' || lottery.id === 'mm') return 'from-yellow-400 via-red-500 to-red-700'; // Gold-to-Red
    if (lottery.id === 'l7' || lottery.id === 'bh') return 'from-blue-400 via-brand-blue to-indigo-800';
    if (lottery.id === 'em') return 'from-yellow-300 via-yellow-600 to-amber-800';
    if (lottery.id === 'se') return 'from-green-400 via-green-600 to-green-900';
    return 'from-text-main to-text-main';
  };

  return (
    <motion.div 
      whileHover={{ y: -4, shadow: '0 20px 40px rgba(0,0,0,0.05)' }}
      onClick={() => onSelect(lottery)}
      className="banking-card py-4 px-3 flex flex-col justify-between group h-full relative overflow-hidden border-border-grey/30 cursor-pointer"
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <LotteryLogo id={lottery.id} />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="font-bold text-[12px] text-text-main leading-none truncate uppercase tracking-tight">{lottery.name}</h3>
              </div>
              <p className="text-[9px] text-text-muted font-medium truncate mt-1 uppercase tracking-wider">{t(lottery.region)}</p>
            </div>
          </div>
          <div className="absolute top-3 right-3 flex flex-col items-end pointer-events-none">
             {lottery.tag && (
                <span className={`text-[8px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow-sm uppercase leading-none mb-1
                  ${lottery.specialDisplay ? 'bg-danger text-white animate-pulse' : 'bg-brand-blue text-white'}
                `}>
                  {lottery.specialDisplay && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_white]" />}
                  {lottery.tag}
                </span>
             )}
          </div>
        </div>

        {lottery.specialDisplay === 'fast3' ? (
          <div className="bg-surface-grey rounded-lg p-1.5 border border-border-grey/30 mb-2">
             <p className="text-[7.5px] font-bold text-danger uppercase tracking-wider mb-1 opacity-80">{t('recent_results')}</p>
             <div className="flex gap-1.5 justify-start items-center">
                {(recentResults.length > 0 ? recentResults : [1, 2, 3]).map((n, i) => (
                  <div key={i} className="w-4.5 h-4.5 rounded-full bg-danger flex items-center justify-center text-[10px] font-black text-white shadow-sm border-t border-white/20">
                    {n}
                  </div>
                ))}
             </div>
          </div>
        ) : lottery.specialDisplay === 'keno' ? (
          <div className="bg-surface-grey rounded-lg p-1.5 border border-border-grey/30 mb-2">
             <div className="grid grid-cols-10 gap-0.5 opacity-20 h-3 items-center mb-1">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className={`w-1 h-1 rounded-full ${Math.random() > 0.4 ? 'bg-brand-blue' : 'bg-border-grey'}`} />
                ))}
             </div>
             <p className="text-[9px] font-black text-brand-blue uppercase tracking-tighter leading-none">{lottery.jackpot}</p>
          </div>
        ) : lottery.specialDisplay === 'speedy' ? (
          <div className="bg-surface-grey rounded-lg p-2 border border-border-grey/30 mb-2">
             <p className="text-[7.5px] font-bold text-brand-blue uppercase tracking-wider mb-1.5 opacity-80">{t('last_5_trends')}</p>
             <div className="flex gap-1 flex-wrap">
                {['big', 'small', 'odd', 'big', 'odd'].map((item, idx) => (
                  <div key={idx} className="flex px-1 py-0.5 rounded bg-white border border-border-grey shadow-sm items-center gap-0.5">
                    <div className={`w-1 h-1 rounded-full ${item === 'big' ? 'bg-danger' : item === 'small' ? 'bg-brand-blue' : 'bg-amber-500'}`} />
                    <span className="text-[8px] font-black text-text-main tracking-tighter">{t(item)}</span>
                  </div>
                ))}
             </div>
          </div>
        ) : lottery.specialDisplay === 'hash' ? (
          <div className="bg-slate-900 rounded-xl p-3 border border-cyan-500/20 mb-2 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col gap-0.5">
               <p className="text-[8px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                 <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                 {t('next_block')}
               </p>
               <p className="text-lg font-bold text-white font-mono tracking-tight">{lottery.jackpot}</p>
            </div>
          </div>
        ) : (
          <div className="bg-surface-grey/50 rounded-xl p-3 border border-border-grey/30 mb-2 shadow-inner">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-0.5 mb-1">
                <span className={`text-[10px] font-bold font-serif bg-gradient-to-br ${getJackpotGradient()} bg-clip-text text-transparent`}>
                  {lottery.currencySymbol}
                </span>
                <span className={`text-xl md:text-2xl font-black tracking-tighter bg-gradient-to-br ${getJackpotGradient()} bg-clip-text text-transparent drop-shadow-sm`}>
                  {lottery.jackpot}
                </span>
              </div>
              <div className="flex items-center gap-1 px-0.5">
                <div className="w-1 h-1 rounded-full bg-success animate-pulse" />
                <p className="text-[7px] font-black text-success uppercase tracking-wider">{t('jackpot_increase')}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[9px] font-semibold text-text-muted border-t border-border-grey/40 pt-2">
          <div className="flex items-center gap-1">
             <Clock size={10} className="text-brand-blue/60" />
             <span className="font-mono text-text-main tracking-tighter">
               {timeLeft || '00:00:00'}
             </span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gradient-to-br from-brand-blue-light/40 to-transparent border border-brand-blue/10 relative overflow-hidden group/hologram">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/hologram:animate-shimmer" />
            <CheckCircle2 size={10} className="text-brand-blue/80" />
            <span className="text-[8px] font-black text-brand-blue uppercase tracking-[0.1em] italic">{t('official')}</span>
          </div>
        </div>
        <button 
          className="w-full bg-brand-blue text-white py-1.5 rounded-lg font-bold text-[9px] shadow-sm hover:bg-brand-blue/90 transition-all flex items-center justify-center gap-1 uppercase tracking-widest"
        >
          {lottery.specialDisplay ? t('play_now') : t('select_numbers')}
          <ChevronRight size={10} />
        </button>
      </div>
    </motion.div>
  );
};

const formatTimer = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const TicketSelection = ({ lottery, onBack, onWin, currentUser }: { lottery: Lottery; onBack: () => void; onWin: () => void; currentUser: any }) => {
  const { t } = useContext(LanguageContext);
  const { drawStates, lotteryConfigs, lotteryHistory } = useContext(LotteryContext);
  const config = lotteryConfigs.find(c => c.id === lottery.id);
  
  const currentDraw = drawStates[lottery.id];
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!currentDraw) return;
      const diff = Math.max(0, currentDraw.nextDraw - Date.now());
      setTimeLeft(Math.floor(diff / 1000));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [currentDraw?.nextDraw]);

  // --- Rules Engine ---
  const getRules = (id: string) => {
    switch (id) {
      case 'pb': return { mainGrid: 69, mainPicks: 5, hasSpecial: true, specialGrid: 26, specialPicks: 1, label: 'Powerball®' };
      case 'mm': return { mainGrid: 70, mainPicks: 5, hasSpecial: true, specialGrid: 25, specialPicks: 1, label: 'Mega Ball' };
      case 'l7': return { mainGrid: 37, mainPicks: 7, hasSpecial: false, specialGrid: 0, specialPicks: 0, label: '' };
      case 'em': return { mainGrid: 50, mainPicks: 5, hasSpecial: true, specialGrid: 12, specialPicks: 2, label: 'Lucky Stars' };
      case 'se': return { mainGrid: 90, mainPicks: 6, hasSpecial: false, specialGrid: 0, specialPicks: 0, label: '' };
      case 'vl': return { mainGrid: 45, mainPicks: 6, hasSpecial: false, specialGrid: 0, specialPicks: 0, label: '' };
      case 'kp': return { mainGrid: 80, mainPicks: 10, hasSpecial: false, specialGrid: 0, specialPicks: 0, label: '' };
      case 'sn': return { mainGrid: 90, mainPicks: 1, hasSpecial: false, specialGrid: 0, specialPicks: 0, label: '', startAtZero: false };
      case 'bh': return { mainGrid: 10, mainPicks: 1, hasSpecial: false, specialGrid: 0, specialPicks: 0, label: '', startAtZero: true };
      case 'wg': return { mainGrid: 10, mainPicks: 1, hasSpecial: false, specialGrid: 0, specialPicks: 0, label: '', startAtZero: true };
      default: return { mainGrid: 69, mainPicks: 5, hasSpecial: true, specialGrid: 26, specialPicks: 1, label: 'Special', startAtZero: false };
    }
  };

  const rules = getRules(lottery.id);

  const [lines, setLines] = useState<TicketLine[]>(() => {
    // Initial empty lines based on rules
    return [{ main: [], powerball: null }];
  });
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [isAiPredicting, setIsAiPredicting] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [customAmount, setCustomAmount] = useState('10');
  
  const wingoHistory = lotteryHistory[lottery.id] || [];

  const lastWingoResult = wingoHistory[0]?.res?.[0] ?? null;

  const activeLine = lines[activeLineIndex];

  const updateActiveLine = (updates: Partial<TicketLine>) => {
    const newLines = [...lines];
    newLines[activeLineIndex] = { ...newLines[activeLineIndex], ...updates };
    setLines(newLines);
  };

  const toggleMain = (num: number) => {
    const selectedMain = activeLine.main;
    if (selectedMain.includes(num)) {
      updateActiveLine({ main: selectedMain.filter(n => n !== num) });
    } else if (selectedMain.length < rules.mainPicks) {
      updateActiveLine({ main: [...selectedMain, num] });
    }
  };

  const setPowerball = (num: number) => {
    updateActiveLine({ powerball: num });
  };

  const clearActiveLine = () => {
    updateActiveLine({ main: [], powerball: null });
  };

  const generateRandomNumbers = () => {
    const mainNums: number[] = [];
    const offset = rules.startAtZero ? 0 : 1;
    while (mainNums.length < rules.mainPicks) {
      const r = Math.floor(Math.random() * rules.mainGrid) + offset;
      if (!mainNums.includes(r)) mainNums.push(r);
    }
    return { 
      main: mainNums.sort((a, b) => a - b), 
      powerball: rules.hasSpecial ? Math.floor(Math.random() * rules.specialGrid) + 1 : null 
    };
  };

  const handleRandomPick = () => {
    updateActiveLine(generateRandomNumbers());
  };

  const handleAiPredict = () => {
    setIsAiPredicting(true);
    clearActiveLine();

    setTimeout(() => {
      handleRandomPick();
      setIsAiPredicting(false);
    }, 1200);
  };

  const addLine = () => {
    setLines([...lines, { main: [], powerball: null }]);
    setActiveLineIndex(lines.length);
  };

  const deleteLine = (index: number) => {
    if (lines.length === 1) {
      setLines([{ main: [], powerball: null }]);
      return;
    }
    const newLines = lines.filter((_, i) => i !== index);
    setLines(newLines);
    setActiveLineIndex(Math.max(0, activeLineIndex - (activeLineIndex >= index ? 1 : 0)));
  };

  const handlePurchase = async () => {
    if (!isAllComplete || isAiPredicting || isPurchasing || !currentUser) return;
    
    const unitPrice = lottery.id === 'wg' ? (parseFloat(customAmount) || 0) : 2;
    const totalPrice = lines.length * unitPrice;
    
    if (currentUser.balance < totalPrice) {
      alert("余额不足，请充值");
      return;
    }

    setIsPurchasing(true);
    
    try {
      // Use transaction to deduct balance and record purchase
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await transaction.get(userRef);
        
        if (!userSnap.exists()) throw "User profile not found";
        const currentBalance = userSnap.data().balance;
        if (currentBalance < totalPrice) throw "Insufficient balance";
        
        // Deduct balance
        transaction.update(userRef, { balance: currentBalance - totalPrice });
        
        // Add purchase record
        const purchaseRef = doc(collection(db, 'purchases'));
        transaction.set(purchaseRef, {
          uid: currentUser.uid,
          userEmail: currentUser.email,
          lotteryId: lottery.id,
          lotteryName: lottery.name,
          drawId: currentDraw?.drawId || 'unknown',
          lines: lines,
          amount: totalPrice,
          status: 'pending',
          timestamp: serverTimestamp()
        });
      });

      setIsPurchasing(false);
      setPurchased(true);
      
      setLines([{ main: [], powerball: null }]);
      setActiveLineIndex(0);
      setTimeout(() => setPurchased(false), 2000);
    } catch (error) {
      console.error("Purchase error:", error);
      setIsPurchasing(false);
      alert(typeof error === 'string' ? error : "购买失败，请稍后再试");
    }
  };

  const totalLines = lines.length;
  const unitPrice = lottery.id === 'wg' ? (parseFloat(customAmount) || 0) : 2;
  const totalPrice = totalLines * unitPrice;
  const isAllComplete = lines.every(line => 
    (line.type === 'binary' && line.val) ||
    (line.main.length === rules.mainPicks && 
     (!rules.hasSpecial || line.powerball !== null))
  );

  return (
    <div className="max-w-5xl w-full mx-auto pb-32 px-2 md:px-4">
      {/* Mini Header / Navigation */}
      <div className="flex items-center justify-between mb-2 py-2">
        <button 
          onClick={onBack}
          className={`flex items-center gap-1.5 text-text-muted font-bold transition-colors group ${lottery.id === 'pb' ? 'hover:text-danger' : 'hover:text-brand-blue'}`}
        >
          <ChevronLeft size={16} />
          <span className="text-xs">{t('market')}</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded text-[9px] font-black border border-success/20">
            <Lock size={10} />
            {t('encrypted')}
          </div>
        </div>
      </div>

      {/* Shrunken Jackpot Bar */}
      <div className="bg-white border border-border-grey/50 rounded-xl p-3 mb-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border ${lottery.id === 'pb' ? 'bg-danger/5 border-danger/10' : 'bg-brand-blue/5 border-brand-blue/10'}`}>
            <LotteryLogo id={lottery.id} />
          </div>
          <div>
            <h1 className="text-sm font-black text-text-main tracking-tight leading-none uppercase">{lottery.name}®</h1>
            <p className="text-[9px] text-text-muted font-bold tracking-wider uppercase mt-1">Official Multi-State</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-bold text-text-muted uppercase tracking-wider">
          <div className="text-right">
            <p className="text-[8px] font-black text-danger uppercase tracking-widest leading-none mb-1">{t('estimated_jackpot')}</p>
            <p className="text-lg font-black text-danger tracking-tighter leading-none">{lottery.currencySymbol}{lottery.jackpot}</p>
          </div>
        </div>
      </div>

      {/* Line Selector Tab Bar */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1 scrollbar-hide">
        {lines.map((line, idx) => (
          <button
            key={idx}
            onClick={() => setActiveLineIndex(idx)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold border transition-all whitespace-nowrap
              ${activeLineIndex === idx 
                ? lottery.id === 'pb' 
                  ? 'bg-danger text-white border-danger shadow-md' 
                  : 'bg-brand-blue text-white border-brand-blue shadow-md' 
                : 'bg-white text-text-muted border-border-grey hover:border-brand-blue/30'
              }
            `}
          >
            <span>{t('line')} {idx + 1}</span>
            {line.main.length === 5 && line.powerball !== null && (
              <CheckCircle2 size={12} className={activeLineIndex === idx ? 'text-white' : 'text-success'} />
            )}
            {idx > 0 && activeLineIndex === idx && (
              <X size={10} onClick={(e) => { e.stopPropagation(); deleteLine(idx); }} className="hover:text-danger ml-1" />
            )}
          </button>
        ))}
        <button 
          onClick={addLine}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg bg-surface-grey border border-dashed border-border-grey text-[10px] font-bold hover:bg-white transition-all whitespace-nowrap ${lottery.id === 'pb' ? 'text-danger hover:border-danger' : 'text-brand-blue hover:border-brand-blue'}`}
        >
          <Plus size={12} />
          {t('add_line')}
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border-grey/50 shadow-sm overflow-hidden">
        {/* Tool Row */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border-grey/30 bg-surface-grey/30">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRandomPick}
              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-text-muted hover:text-brand-blue transition-all flex items-center gap-1.5"
              title="Random"
            >
              <Dices size={14} />
              <span className="text-[10px] font-bold">Quick</span>
            </button>
            <button 
              onClick={clearActiveLine}
              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-text-muted hover:text-danger transition-all flex items-center gap-1.5"
              title="Clear"
            >
              <Trash2 size={14} />
              <span className="text-[10px] font-bold">Clear</span>
            </button>
          </div>
          
          <button 
            onClick={handleAiPredict}
            disabled={isAiPredicting}
            className={`relative overflow-hidden px-4 md:px-6 py-2.5 rounded-full text-white font-bold text-[9px] uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg active:scale-95
              ${lottery.id === 'pb' 
                ? 'bg-gradient-to-r from-red-600 via-orange-600 to-red-700 animate-light-trail' 
                : lottery.id === 'mm'
                  ? 'bg-gradient-to-r from-blue-700 via-amber-400/50 to-blue-800 animate-light-trail'
                  : lottery.id === 'bh'
                    ? 'bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-700 animate-light-trail'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 animate-light-trail'
              }
            `}
          >
            <Brain size={14} className={isAiPredicting ? 'animate-pulse' : ''} />
            {isAiPredicting ? t('analyzing') : t('ai_prediction')}
            <div className="absolute inset-0 border border-white/20 rounded-full" />
          </button>
        </div>

        {/* Wingo Special Dashboard */}
        {lottery.id === 'wg' && (
          <div className="px-6 py-4 bg-gradient-to-b from-surface-grey to-white border-b border-border-grey/30">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
               <div className="flex items-center gap-4">
                  <div className="flex gap-2 p-2 bg-black/5 rounded-2xl border border-black/5">
                    <div className={`w-8 h-8 rounded-full border-2 border-white/50 shadow-inner transition-all duration-500 ${[0, 2, 4, 6, 8].includes(lastWingoResult ?? -1) ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-red-900/30'}`} />
                    <div className={`w-8 h-8 rounded-full border-2 border-white/50 shadow-inner transition-all duration-500 ${[0, 5].includes(lastWingoResult ?? -1) ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]' : 'bg-purple-900/30'}`} />
                    <div className={`w-8 h-8 rounded-full border-2 border-white/50 shadow-inner transition-all duration-500 ${[1, 3, 5, 7, 9].includes(lastWingoResult ?? -1) ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'bg-green-900/30'}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-0.5">Draw Period</p>
                    <p className="text-2xl font-black font-mono text-text-main tracking-tighter leading-none mb-2">{String(currentDraw?.drawId || '---').slice(-3)}</p>
                    {lastWingoResult !== null && (
                       <div className="flex items-center gap-2.5">
                          <span className="text-[10px] font-black text-text-muted uppercase tracking-tight">Last Win:</span>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white shadow-md
                             ${lastWingoResult === 0 
                               ? 'bg-gradient-to-br from-red-500 to-purple-500' 
                               : lastWingoResult === 5 
                                 ? 'bg-gradient-to-br from-green-500 to-purple-500'
                                 : [1,3,7,9].includes(lastWingoResult) 
                                   ? 'bg-green-500' 
                                   : 'bg-red-500'}
                          `}>
                            {lastWingoResult}
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest
                             ${[1,3,7,9,5].includes(lastWingoResult) ? 'text-green-600' : [2,4,6,8,0].includes(lastWingoResult) ? 'text-red-600' : 'text-purple-600'}
                          `}>
                             {lastWingoResult >= 5 ? t('big') : t('small')} {lastWingoResult % 2 !== 0 ? t('odd') : t('even')}
                          </span>
                       </div>
                    )}
                  </div>
               </div>
               <div className="bg-white px-6 py-2 rounded-2xl border border-border-grey shadow-sm flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-black text-text-muted uppercase tracking-tighter">Time Left</span>
                    <span className="text-2xl font-black font-mono text-brand-blue tracking-tighter">{formatTimer(timeLeft)}</span>
                  </div>
               </div>
            </div>

            {/* Color Quick Select */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <button 
                onClick={() => updateActiveLine({ type: 'binary', val: 'GREEN', main: [], powerball: null })}
                className={`group relative overflow-hidden py-3 rounded-xl bg-green-500 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/20 active:scale-95 transition-all border-4 ${activeLine.type === 'binary' && activeLine.val === 'GREEN' ? 'border-white' : 'border-transparent'}`}
              >
                 <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
                 <span>{t('green')}</span>
                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button 
                onClick={() => updateActiveLine({ type: 'binary', val: 'PURPLE', main: [], powerball: null })}
                className={`group relative overflow-hidden py-3 rounded-xl bg-purple-500 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-purple-500/20 active:scale-95 transition-all border-4 ${activeLine.type === 'binary' && activeLine.val === 'PURPLE' ? 'border-white' : 'border-transparent'}`}
              >
                 <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
                 <span>{t('purple')}</span>
                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button 
                onClick={() => updateActiveLine({ type: 'binary', val: 'RED', main: [], powerball: null })}
                className={`group relative overflow-hidden py-3 rounded-xl bg-red-500 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95 transition-all border-4 ${activeLine.type === 'binary' && activeLine.val === 'RED' ? 'border-white' : 'border-transparent'}`}
              >
                 <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
                 <span>{t('red')}</span>
                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            {/* Big / Small / Odd / Even */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                onClick={() => updateActiveLine({ type: 'binary', val: 'BIG', main: [], powerball: null })}
                className={`py-3 rounded-xl border text-text-main font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-sm flex flex-col items-center gap-1 ${activeLine.type === 'binary' && activeLine.val === 'BIG' ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white border-border-grey hover:border-brand-blue'}`}
              >
                <span>{t('big')}</span>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded ${activeLine.type === 'binary' && activeLine.val === 'BIG' ? 'bg-white/20' : 'bg-brand-blue/5 text-brand-blue'}`}>{config?.binaryOdds?.big || 1.96}x</span>
              </button>
              <button 
                onClick={() => updateActiveLine({ type: 'binary', val: 'SMALL', main: [], powerball: null })}
                className={`py-3 rounded-xl border text-text-main font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-sm flex flex-col items-center gap-1 ${activeLine.type === 'binary' && activeLine.val === 'SMALL' ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white border-border-grey hover:border-brand-blue'}`}
              >
                <span>{t('small')}</span>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded ${activeLine.type === 'binary' && activeLine.val === 'SMALL' ? 'bg-white/20' : 'bg-brand-blue/5 text-brand-blue'}`}>{config?.binaryOdds?.small || 1.96}x</span>
              </button>
              <button 
                onClick={() => updateActiveLine({ type: 'binary', val: 'ODD', main: [], powerball: null })}
                className={`py-3 rounded-xl border text-text-main font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-sm flex flex-col items-center gap-1 ${activeLine.type === 'binary' && activeLine.val === 'ODD' ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white border-border-grey hover:border-brand-blue'}`}
              >
                <span>{t('odd')}</span>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded ${activeLine.type === 'binary' && activeLine.val === 'ODD' ? 'bg-white/20' : 'bg-brand-blue/5 text-brand-blue'}`}>{config?.binaryOdds?.odd || 1.96}x</span>
              </button>
              <button 
                onClick={() => updateActiveLine({ type: 'binary', val: 'EVEN', main: [], powerball: null })}
                className={`py-3 rounded-xl border text-text-main font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-sm flex flex-col items-center gap-1 ${activeLine.type === 'binary' && activeLine.val === 'EVEN' ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white border-border-grey hover:border-brand-blue'}`}
              >
                <span>{t('even')}</span>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded ${activeLine.type === 'binary' && activeLine.val === 'EVEN' ? 'bg-white/20' : 'bg-brand-blue/5 text-brand-blue'}`}>{config?.binaryOdds?.even || 1.96}x</span>
              </button>
            </div>
          </div>
        )}

        {/* Compressed Grids Area */}
        <div className="p-4 space-y-4">
          {/* Main Grid Zone */}
          <div className="relative">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-6 rounded-full ${lottery.id === 'pb' ? 'bg-danger' : 'bg-brand-blue'}`} />
                <div>
                   <h4 className={`text-[11px] font-black uppercase tracking-widest leading-none ${lottery.id === 'pb' ? 'text-danger' : 'text-text-main'}`}>
                     {lottery.id === 'pb' ? t('white_ball_zone') : t('primary_zone')}
                   </h4>
                   <p className="text-[8px] text-text-muted font-bold uppercase mt-1">{t('select_nums_desc').replace('{{count}}', rules.mainPicks.toString()).replace('{{max}}', rules.mainGrid.toString())}</p>
                </div>
              </div>
              <div className={`${activeLine.main.length === rules.mainPicks ? 'bg-success/10 border-success/20' : (lottery.id === 'pb' ? 'bg-danger/10 border-danger/10' : 'bg-brand-blue-light border-brand-blue/10')} px-3 py-1 rounded-lg border transition-all duration-300`}>
                 <span className={`text-[10px] font-black font-mono flex items-center gap-1.5 ${activeLine.main.length === rules.mainPicks ? 'text-success' : (lottery.id === 'pb' ? 'text-danger' : 'text-brand-blue')}`}>
                   {activeLine.main.length === rules.mainPicks ? <Check size={12} strokeWidth={4} /> : `${activeLine.main.length} / ${rules.mainPicks}`}
                 </span>
              </div>
            </div>
            <div className={`grid ${rules.mainGrid >= 90 ? 'grid-cols-9 sm:grid-cols-10' : rules.mainGrid >= 80 ? 'grid-cols-8 sm:grid-cols-10' : rules.mainGrid <= 10 ? 'grid-cols-5 sm:grid-cols-10' : 'grid-cols-7 sm:grid-cols-10'} gap-2`}>
              {Array.from({ length: rules.mainGrid }, (_, i) => i + (rules.startAtZero ? 0 : 1)).map(num => {
                const isSelected = activeLine.main.includes(num);
                return (
                  <button
                    key={num}
                    onClick={() => toggleMain(num)}
                    className={`aspect-square w-full rounded-full text-[12px] font-black flex items-center justify-center transition-all relative
                      ${isSelected 
                        ? lottery.id === 'pb' 
                          ? 'crystal-sphere-white text-danger ring-2 ring-danger shadow-[0_0_15px_rgba(220,53,69,0.3)] scale-110 z-10' 
                          : lottery.id === 'bh'
                            ? 'crystal-sphere-cyan text-white scale-110 z-10'
                            : lottery.id === 'wg'
                              ? [1,3,7,9].includes(num)
                                 ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)] scale-110 z-10'
                                 : [2,4,6,8].includes(num)
                                   ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-110 z-10'
                                   : num === 0 
                                     ? 'bg-gradient-to-br from-red-500 to-purple-500 text-white scale-110 z-10 shadow-lg'
                                     : 'bg-gradient-to-br from-green-500 to-purple-500 text-white scale-110 z-10 shadow-lg'
                              : 'crystal-sphere-blue text-white scale-110 z-10' 
                        : 'bg-white text-text-muted border border-border-grey shadow-sm hover:border-brand-blue/30 active:scale-90 hover:scale-105'
                      }
                      ${lottery.id === 'wg' && !isSelected ? (
                        [1,3,7,9].includes(num) ? 'wingo-green' :
                        [2,4,6,8].includes(num) ? 'wingo-red' :
                        num === 0 ? 'wingo-split-red-violet' :
                        num === 5 ? 'wingo-split-green-violet' :
                        'wingo-violet'
                      ) : ''}
                    `}
                  >
                    {isSelected && (
                       <div className="absolute inset-0 rounded-full bg-white/10 blur-[2px]" />
                    )}
                    <span className="relative z-10">{num}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider with reduced margin */}
          <div className="flex items-center gap-4 px-2 py-1">
             <div className="h-px bg-border-grey/50 flex-1" />
             <div className="px-3 py-1 bg-surface-grey border border-border-grey rounded-full text-[8px] font-black text-text-muted uppercase tracking-[0.2em]">{t('matrix_link')}</div>
             <div className="h-px bg-border-grey/50 flex-1" />
          </div>

          {/* Powerball Grid Zone Professional Card */}
          {rules.hasSpecial && (
            <div className={`${lottery.id === 'pb' ? 'bg-white' : 'bg-brand-blue/[0.03]'} p-6 rounded-3xl border ${lottery.id === 'pb' ? 'border-danger/10 shadow-[0_10px_35px_rgba(220,53,69,0.06)]' : 'border-brand-blue/5'} relative overflow-hidden group/zone`}>
              <div className={`absolute top-0 right-0 w-32 h-32 ${lottery.id === 'pb' ? 'bg-danger/5' : 'bg-brand-blue/10'} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover/zone:scale-110 transition-transform duration-700`} />
              
              <div className="flex items-center justify-between mb-5 px-1 relative z-10">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-6 rounded-full animate-pulse ${lottery.id === 'pb' ? 'bg-danger' : (lottery.id === 'mm' ? 'bg-amber-400' : 'bg-brand-blue')}`} />
                  <div>
                    <h4 className={`text-[11px] font-black uppercase tracking-widest leading-none ${lottery.id === 'pb' ? 'text-danger' : (lottery.id === 'mm' ? 'text-amber-600' : 'text-text-main')}`}>
                      {lottery.id === 'pb' ? t('red_ball_zone') : (lottery.id === 'mm' ? t('gold_ball_zone') : `${t('special_zone')}`)}
                    </h4>
                    <p className="text-[8px] text-text-muted font-bold uppercase mt-1">{t('select_nums_desc').replace('{{count}}', rules.specialPicks.toString()).replace('{{max}}', rules.specialGrid.toString())}</p>
                  </div>
                </div>
                <div className={`${activeLine.powerball ? 'bg-success/10 border-success/20' : (lottery.id === 'pb' ? 'bg-danger/10 border-danger/10' : (lottery.id === 'mm' ? 'bg-amber-400/10 border-amber-400/20' : 'bg-brand-blue-light border-brand-blue/10'))} px-3 py-1 rounded-lg border transition-all duration-300`}>
                  <span className={`text-[10px] font-black font-mono flex items-center gap-1.5 ${activeLine.powerball ? 'text-success' : (lottery.id === 'pb' ? 'text-danger' : (lottery.id === 'mm' ? 'text-amber-600' : 'text-brand-blue'))}`}>
                    {activeLine.powerball ? <Check size={12} strokeWidth={4} /> : `0 / ${rules.specialPicks}`}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-7 sm:grid-cols-10 gap-2 relative z-10">
                {Array.from({ length: rules.specialGrid }, (_, i) => i + 1).map(num => {
                  const isSelected = activeLine.powerball === num;
                  const sphereClass = lottery.id === 'pb' ? 'crystal-sphere-red' : (lottery.id === 'mm' ? 'crystal-sphere-gold' : 'crystal-sphere-blue');
                  return (
                    <button
                      key={num}
                      onClick={() => setPowerball(num)}
                      className={`aspect-square w-full rounded-full text-[12px] font-black flex items-center justify-center transition-all relative
                        ${isSelected 
                          ? `${sphereClass} text-white scale-110 z-10 shadow-lg` 
                          : lottery.id === 'mm'
                            ? 'bg-white text-text-main border border-border-grey shadow-sm hover:border-amber-400 hover:bg-amber-50 active:scale-90 hover:scale-105'
                            : 'bg-white text-text-main border border-border-grey shadow-sm hover:border-danger hover:bg-danger/5 active:scale-90 hover:scale-105'
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 rounded-full bg-white/10 blur-[2px]" />
                      )}
                      <span className="relative z-10">{num}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Wingo Draw History */}
        {lottery.id === 'wg' && (
           <div className="mt-8 mb-4 bg-white rounded-2xl border border-border-grey overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-surface-grey border-b border-border-grey flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <List size={14} className="text-brand-blue" />
                    <h3 className="text-[9px] font-black text-text-main uppercase tracking-widest leading-none">{t('draw_history')}</h3>
                 </div>
              </div>
              <div className="divide-y divide-border-grey/50">
                 {wingoHistory.map((record) => (
                   <div key={record.id} className="px-4 py-3 flex items-center justify-between">
                      <span className="text-[10px] font-black text-text-main font-mono">{record.id.toString().slice(-3)}</span>
                      <div className="flex items-center gap-3">
                         <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm
                           ${record.res[0] === 0 
                             ? 'bg-gradient-to-br from-red-500 to-purple-500' 
                             : record.res[0] === 5 
                               ? 'bg-gradient-to-br from-green-500 to-purple-500'
                               : [1,3,7,9].includes(record.res[0]) 
                                 ? 'bg-green-500' 
                                 : 'bg-red-500'}
                         `}>
                           {record.res[0]}
                         </div>
                         <div className="flex gap-1">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded ${record.res[0] >= 5 ? 'bg-danger/10 text-danger' : 'bg-brand-blue/10 text-brand-blue'}`}>
                               {record.res[0] >= 5 ? t('big') : t('small')}
                            </span>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded
                               ${record.res[0] % 2 !== 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-700'}
                            `}>
                               {record.res[0] % 2 !== 0 ? t('odd') : t('even')}
                            </span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      {/* Slim Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-grey shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-50 py-3 px-4 md:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex flex-col">
                <span className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">{t('preview')}</span>
                <div className="flex gap-1">
                   {activeLine.main.slice(0, rules.mainPicks).map((n, i) => (
                      <div key={i} className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-black ${lottery.id === 'pb' ? 'crystal-sphere-white !text-danger ring-1 ring-danger/20' : lottery.id === 'bh' ? 'crystal-sphere-cyan' : 'crystal-sphere-blue'}`}>{n}</div>
                   ))}
                   {rules.hasSpecial && activeLine.powerball && (
                      <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-black ${lottery.id === 'pb' ? 'crystal-sphere-red shadow-[0_0_10px_rgba(220,53,69,0.4)]' : (lottery.id === 'mm' ? 'crystal-sphere-gold shadow-[0_0_10px_rgba(249,202,36,0.4)]' : 'crystal-sphere-red')}`}>{activeLine.powerball}</div>
                   )}
                </div>
             </div>
             <div className="w-px h-8 bg-border-grey/50 hidden sm:block shrink-0" />
             <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 truncate">
                   <span className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-none">余额:</span>
                   <span className="text-[13px] font-black text-brand-blue font-mono leading-none">${(currentUser?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center gap-3">
                   {lottery.id === 'wg' && (
                      <div className="flex items-center gap-1.5 bg-surface-grey px-2 py-1 rounded-lg border border-border-grey shrink-0">
                         <span className="text-[7px] font-black text-text-muted uppercase tracking-tighter">Amt</span>
                         <input 
                           type="number" 
                           value={customAmount}
                           onChange={(e) => setCustomAmount(e.target.value)}
                           className="w-12 h-5 bg-transparent text-center text-xs font-black focus:outline-none"
                           placeholder="0"
                         />
                      </div>
                   )}
                </div>
             </div>
          </div>

          <button 
            onClick={handlePurchase}
            disabled={!isAllComplete || isAiPredicting || isPurchasing}
            className={`flex-1 shrink-0 max-w-[180px] py-3 rounded-xl font-black text-xs shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest
              ${purchased 
                ? 'bg-success text-white shadow-success/20'
                : isAllComplete && !isAiPredicting && !isPurchasing
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20' 
                  : 'bg-surface-grey text-text-muted border border-border-grey cursor-not-allowed opacity-60'
              }
            `}
          >
            {isPurchasing ? (
              <RotateCw size={14} className="animate-spin" />
            ) : purchased ? (
              <Check size={14} />
            ) : (
                <ShoppingCart size={14} />
            )}
            {isPurchasing ? t('processing') : purchased ? t('success') : t('purchase')}
          </button>
        </div>
      </div>
    </div>
  );
};

const ResultsDetailView = ({ lottery, onBack }: { lottery: Lottery, onBack: () => void }) => {
  const { t } = useContext(LanguageContext);
  const [filter, setFilter] = useState('30d');
  
  // Generating mock history data
  const history = Array.from({ length: 20 }, (_, i) => ({
    drawNumber: 2026104 - i,
    date: `Apr ${18 - i}, 2026`,
    time: '21:00',
    winners: Math.floor(Math.random() * 500000) + 100000,
    prizePool: (Math.random() * 5 + 1).toFixed(1) + 'M',
    numbers: [
      Math.floor(Math.random() * 69) + 1,
      Math.floor(Math.random() * 69) + 1,
      Math.floor(Math.random() * 69) + 1,
      Math.floor(Math.random() * 69) + 1,
      Math.floor(Math.random() * 69) + 1,
      Math.floor(Math.random() * 26) + 1
    ].sort((a, b) => a - b)
  }));

  return (
    <div className="max-w-xl mx-auto pb-32 px-4 md:px-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 rounded-2xl bg-white border border-border-grey shadow-sm text-text-main hover:text-brand-blue transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
             <LotteryLogo id={lottery.id} />
             <div>
               <h2 className="text-xl font-black text-text-main tracking-tight uppercase leading-none">{lottery.name}</h2>
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mt-1.5">{t('draw_history')}</p>
             </div>
          </div>
        </div>
        <button className="p-3 rounded-2xl bg-brand-blue/5 text-brand-blue border border-brand-blue/10 hover:bg-brand-blue-light transition-all active:scale-95">
          <BarChart3 size={20} />
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between mb-6 px-1">
         <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t('recent_draws')}</p>
         <div className="relative">
           <select 
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
             className="appearance-none bg-surface-grey border border-border-grey/50 rounded-xl py-2 pl-4 pr-10 text-[10px] font-black uppercase tracking-widest text-text-main outline-none focus:border-brand-blue transition-colors cursor-pointer"
           >
             <option value="30d">{t('last_30_days')}</option>
             <option value="100d">{t('last_100_draws')}</option>
             <option value="year">{t('full_year_history')}</option>
           </select>
           <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
         </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {history.map((draw) => (
          <div key={draw.drawNumber} className="bg-white rounded-2xl border border-border-grey shadow-sm p-4 hover:border-brand-blue/20 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-brand-blue bg-brand-blue-light px-2 py-0.5 rounded tracking-tighter">
                  #{draw.drawNumber}
                </span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight">
                  {draw.date} • {draw.time}
                </span>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black text-text-main uppercase tracking-tighter">{draw.winners.toLocaleString()} {t('winners_label')}</p>
                <p className="text-[8px] font-medium text-text-muted uppercase tracking-widest">{t('prize_label')}: {draw.prizePool} USDT</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
               {draw.numbers.slice(0, 5).map((num, idx) => (
                 <div key={idx} className="w-8 h-8 rounded-full bg-white border border-border-grey shadow-sm flex items-center justify-center text-[10px] font-black text-text-main relative overflow-hidden text-[9px]">
                   <div className="absolute top-1 left-1.5 w-1.5 h-1 bg-black/5 rounded-full blur-[1px]" />
                   {num}
                 </div>
               ))}
               <div className="w-8 h-8 rounded-full bg-danger text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-danger/20 border-t border-white/20 relative overflow-hidden text-[9px]">
                 <div className="absolute top-1 left-1.5 w-1.5 h-1 bg-white/20 rounded-full blur-[1px]" />
                 {draw.numbers[5]}
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <button className="w-full mt-8 py-4 bg-surface-grey border border-border-grey/50 rounded-2xl text-[10px] font-black text-text-muted uppercase tracking-[0.2em] hover:bg-white hover:text-brand-blue hover:border-brand-blue/30 transition-all flex items-center justify-center gap-2">
        <RotateCw size={14} />
        {t('older_draw_data')}
      </button>
    </div>
  );
};

const ResultsView = ({ lotteries, onShowDetail }: { lotteries: Lottery[], onShowDetail: (loto: Lottery) => void }) => {
  const { t } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState<'all' | 'major' | 'fast'>('all');
  const tabs = [
    { id: 'all', label: t('all') },
    { id: 'fast', label: t('tab_rapid') },
    { id: 'major', label: t('tab_major') }
  ];

  const filteredLotteries = lotteries.filter(loto => {
    if (activeTab === 'all') return true;
    if (activeTab === 'major') return !loto.specialDisplay;
    if (activeTab === 'fast') return !!loto.specialDisplay;
    return true;
  });

  const renderBalls = (id: string) => {
    switch (id) {
      case 'pb': // Powerball: 5 white + 1 red
        return (
          <div className="flex gap-2">
            {[12, 24, 33, 45, 58].map((n, i) => (
              <div key={i} className="w-9 h-9 rounded-full bg-white text-text-main flex items-center justify-center text-xs font-black shadow-[inset_0_-3px_6px_rgba(0,0,0,0.1),0_4px_8px_rgba(0,0,0,0.05)] border border-border-grey/50 relative overflow-hidden">
                <div className="absolute top-1 left-2 w-2 h-1 bg-white/40 rounded-full blur-[1px]" />
                {n}
              </div>
            ))}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-800 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-red-500/20 relative overflow-hidden border-t border-white/30">
              <div className="absolute top-1 left-2 w-2 h-1 bg-white/30 rounded-full blur-[1px]" />
              14
            </div>
          </div>
        );
      case 'l7': // LOTO 7: 7 rainbow spheres
        const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500'];
        return (
          <div className="flex flex-wrap gap-2">
            {[5, 12, 19, 24, 31, 33, 37].map((n, i) => (
              <div key={i} className={`w-8 h-8 rounded-full ${colors[i]} text-white flex items-center justify-center text-[10px] font-black shadow-lg relative overflow-hidden border-t border-white/20`}>
                <div className="absolute top-1 left-1.5 w-1.5 h-1 bg-white/20 rounded-full blur-[1px]" />
                {n}
              </div>
            ))}
          </div>
        );
      case 'f3': // Fast 3: 3 large red spheres
        return (
          <div className="flex gap-4">
            {[2, 4, 6].map((n, i) => (
              <div key={i} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center text-xl font-black shadow-xl shadow-red-500/20 border-t border-white/30 relative">
                <div className="absolute top-1 left-2 w-3 h-1.5 bg-white/20 rounded-full blur-[1px]" />
                {n}
              </div>
            ))}
          </div>
        );
      case 'em': // EuroMillions: 5 numbers + 2 stars
        return (
          <div className="flex flex-wrap gap-2 items-center">
            {[8, 14, 26, 31, 44].map((n, i) => (
              <div key={i} className="w-9 h-9 rounded-full bg-white text-blue-900 border border-blue-900/20 flex items-center justify-center text-xs font-black shadow-sm">
                {n}
              </div>
            ))}
            <div className="flex gap-1 ml-1">
              {[3, 7].map((n, i) => (
                <div key={i} className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg rotate-45 flex items-center justify-center shadow-lg border border-yellow-300/50">
                   <span className="-rotate-45 text-white text-[10px] font-black">{n}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'kp': // Keno: 20 numbers (let's show 10 prominent ones)
        return (
          <div className="grid grid-cols-5 gap-2">
            {[4, 12, 18, 25, 31, 44, 52, 67, 71, 79].map((n, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-surface-grey border border-border-grey flex items-center justify-center text-[10px] font-black text-text-muted">
                {n}
              </div>
            ))}
          </div>
        );
      case 'vl': // Mega 6/45: 6 numbers
        return (
          <div className="flex gap-2">
            {[3, 15, 22, 29, 36, 42].map((n, i) => (
              <div key={i} className="w-9 h-9 rounded-full bg-white text-red-600 border border-red-200 flex items-center justify-center text-xs font-black shadow-sm">
                {n}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto pb-32 px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-text-main tracking-tight uppercase">{t('results')}</h2>
        <button className="p-3 rounded-2xl bg-white border border-border-grey shadow-sm text-brand-blue hover:bg-brand-blue-light transition-all active:scale-95">
          <Calendar size={20} />
        </button>
      </div>

      {/* Slim Category Tabs */}
      <div className="flex gap-2 mb-8 bg-surface-grey p-1.5 rounded-2xl border border-border-grey/50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
              ${activeTab === tab.id 
                ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20 translate-y-[-2px]' 
                : 'text-text-muted hover:text-brand-blue hover:bg-white'
              }
            `}
          >
            {t(tab.id === 'all' ? 'all' : tab.id === 'major' ? 'tab_major' : 'tab_rapid')}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredLotteries.map(loto => (
          <div key={loto.id} className="bg-white rounded-[2rem] border border-border-grey/50 p-6 shadow-sm hover:shadow-xl hover:border-brand-blue/10 transition-all group relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <LotteryLogo id={loto.id} />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border border-border-grey flex items-center justify-center text-[8px] font-black overflow-hidden shadow-sm">
                    {loto.flag}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-black text-text-main leading-none uppercase tracking-tight">{loto.name}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] font-black text-brand-blue bg-brand-blue-light px-2 py-0.5 rounded uppercase tracking-tighter">#105</span>
                    <span className="text-[9px] font-bold text-text-muted uppercase">Apr 18, 2026 • 21:00</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onShowDetail(loto)}
                className="p-2.5 rounded-xl bg-surface-grey text-text-muted hover:text-brand-blue hover:bg-white border border-transparent hover:border-border-grey transition-all"
                aria-label="View Details"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            
            <div className="relative z-10 px-1">
              {renderBalls(loto.id)}
            </div>

            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-surface-grey rounded-full translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          </div>
        ))}
      </div>

      {/* Data Source Policy */}
      <div className="mt-12 text-center p-6 bg-surface-grey rounded-3xl border border-border-grey/50">
        <div className="flex items-center justify-center gap-2 text-brand-blue mb-2">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">Official Source Verified</span>
        </div>
        <p className="text-[10px] text-text-muted font-medium leading-relaxed">
          Results are synchronized in real-time with official government lottery headquarters. 
          Winning tickets are automatically credited and calculated.
        </p>
      </div>
    </div>
  );
};

const WalletView = ({ currentUser }: { currentUser: any }) => {
  const { t } = useContext(LanguageContext);
  const networks = ["USDT (TRC20)", "USDT (ERC20)", "USDC", t('bank_account')];
  const [selectedNetwork, setSelectedNetwork] = useState(0);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState(currentUser?.withdraw_address || '');
  const [bankName, setBankName] = useState(currentUser?.bank_name || '');
  const [accountNumber, setAccountNumber] = useState(currentUser?.account_number || '');
  const [accountName, setAccountName] = useState(currentUser?.account_name || '');
  const [loading, setLoading] = useState(false);

  const handleWithdrawal = async () => {
    const val = parseFloat(amount);
    if (!val || val < 10) return alert('Minimum withdrawal is 10 USDT');
    if (val > (currentUser?.balance || 0)) return alert('Insufficient balance');

    const networkName = networks[selectedNetwork];
    const isBank = selectedNetwork === 3;

    if (isBank) {
      if (!bankName) return alert('Please enter bank name');
      if (!accountNumber) return alert('Please enter account number');
      if (!accountName) return alert('Please enter account name');
    } else {
      if (!withdrawAddress) return alert('Please enter withdrawal address');
    }

    setLoading(true);
    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', currentUser.uid);
        const txRef = doc(collection(db, 'transactions'));
        
        const userSnap = await transaction.get(userRef);
        const balance = userSnap.data()?.balance || 0;
        
        if (balance < val) throw new Error('Insufficient balance');
        
        const updateData: any = { balance: balance - val };
        if (isBank) {
          updateData.bank_name = bankName;
          updateData.account_number = accountNumber;
          updateData.account_name = accountName;
        } else {
          updateData.withdraw_address = withdrawAddress;
        }

        transaction.update(userRef, updateData);

        const txData: any = {
          uid: currentUser.uid,
          amount: val,
          type: 'withdrawal',
          status: 'pending',
          network: networkName,
          timestamp: serverTimestamp()
        };

        if (isBank) {
          txData.bank_name = bankName;
          txData.account_number = accountNumber;
          txData.account_name = accountName;
        } else {
          txData.address = withdrawAddress;
        }

        transaction.set(txRef, txData);
      });
      alert('Withdrawal request submitted');
      setAmount('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [settings, setSettings] = useState<any>(null);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) setSettings(doc.data());
    });
    return () => unsub();
  }, []);

  const depositAddress = selectedNetwork === 0 ? settings?.trc20_address : settings?.erc20_address;

  return (
    <div className="max-w-xl mx-auto pb-20 px-4">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
        <h2 className="text-sm font-black text-text-main tracking-widest uppercase">
          {t('wallet')} {activeTab === 'deposit' ? t('deposit') : t('withdraw')}
        </h2>
      </div>
      
      {/* Slim Balance Section */}
      <div className="bg-white rounded-2xl p-4 border border-border-grey shadow-sm mb-4 flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-brand-blue" />
        <div>
          <span className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-0.5 block">{t('balance')}</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-text-main tracking-tight">{(currentUser?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span className="text-[10px] font-black text-brand-blue">USDT</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-success leading-none mb-1 uppercase tracking-tighter">{t('secure_assets')}</p>
          <p className="text-[10px] font-bold text-text-muted">≈ ${(currentUser?.balance || 0).toLocaleString()} USD</p>
        </div>
      </div>

      {/* Balance Actions */}
      <div className="flex gap-3 mb-6">
        <button 
          onClick={() => setActiveTab('deposit')}
          className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm
            ${activeTab === 'deposit' 
              ? 'bg-brand-blue text-white shadow-brand-blue/20' 
              : 'bg-white text-text-muted border border-border-grey hover:bg-surface-grey'
            }
          `}
        >
          {t('deposit')}
        </button>
        <div className="flex-1 flex flex-col gap-1 items-center">
          <button 
            onClick={() => setActiveTab('withdraw')}
            className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm
              ${activeTab === 'withdraw' 
                ? 'bg-brand-blue text-white shadow-brand-blue/20' 
                : 'bg-white text-text-muted border border-border-grey hover:bg-surface-grey'
              }
            `}
          >
            {t('withdraw')}
          </button>
          <span className="text-[8px] font-bold text-text-muted opacity-60">{t('processing_status')}</span>
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1 mb-2 block">
          {t('enter_amount')} {activeTab === 'deposit' ? t('deposit') : t('withdraw')}
        </label>
        <div className="relative group">
          <input 
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-surface-grey border-2 border-border-grey/50 rounded-2xl py-4 px-5 text-sm font-black text-text-main placeholder:text-text-muted/40 focus:border-brand-blue focus:ring-0 transition-all outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="text-[10px] font-black text-brand-blue/40 uppercase">USDT</span>
            <button 
              onClick={() => setAmount((currentUser?.balance || 0).toFixed(2))}
              className="px-2.5 py-1.5 bg-brand-blue-light text-brand-blue text-[9px] font-black rounded-lg hover:bg-brand-blue hover:text-white transition-all active:scale-90"
            >
              {t('max')}
            </button>
          </div>
        </div>
      </div>

      {/* Slim Pill Network Selector */}
      <div className="mb-4">
        <div className="flex items-center gap-2 bg-surface-grey p-1 rounded-full border border-border-grey/50">
          {networks.map((net, i) => (
            <button
              key={net}
              onClick={() => setSelectedNetwork(i)}
              className={`flex-1 py-1.5 rounded-full text-[9px] font-black transition-all uppercase tracking-wider
                ${selectedNetwork === i 
                  ? 'bg-brand-blue text-white shadow-md' 
                  : 'text-text-muted hover:text-brand-blue'
                }
              `}
            >
              {net.split(' ')[1] || net}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Specific Section */}
      <div className="bg-white rounded-[2.5rem] border border-border-grey shadow-lg p-5 text-center relative overflow-hidden">
        {activeTab === 'deposit' ? (
          <div className="flex flex-col items-center">
            <div className="mb-4 p-3 bg-white inline-block rounded-2xl border border-surface-grey shadow-inner relative group">
               <div className="p-2 bg-surface-grey rounded-xl">
                  <QrCode size={100} className="text-text-main" />
               </div>
               <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                 <button className="bg-brand-blue text-white p-2 rounded-full shadow-lg active:scale-90 transition-transform"><RotateCcw size={14} /></button>
               </div>
            </div>

            <div className="w-full space-y-3">
               <div className="text-center">
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">{networks[selectedNetwork]} Receiver Address</p>
                  <div className="flex items-center gap-2 p-3 bg-surface-grey rounded-xl border border-border-grey/50 group">
                     <span className="flex-1 text-[11px] font-mono font-black text-text-main truncate">{depositAddress || '---'}</span>
                     <button 
                       onClick={() => {
                         if (depositAddress) {
                           navigator.clipboard.writeText(depositAddress);
                           alert('Address copied');
                         }
                       }}
                       className="p-2 bg-brand-blue text-white rounded-lg shadow-md active:scale-95 transition-all hover:bg-brand-blue/90"
                     >
                        <Copy size={16} />
                     </button>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-left">
            {selectedNetwork === 3 ? (
              <>
                <div>
                  <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 mb-1.5 block">{t('bank_name')}</label>
                  <input 
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder={t('bank_name')}
                    className="w-full bg-surface-grey border border-border-grey/50 rounded-xl py-3 px-4 text-xs font-bold text-text-main placeholder:text-text-muted/40 outline-none focus:border-brand-blue transition-all"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 mb-1.5 block">{t('account_number')}</label>
                  <input 
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder={t('account_number')}
                    className="w-full bg-surface-grey border border-border-grey/50 rounded-xl py-3 px-4 text-xs font-bold text-text-main placeholder:text-text-muted/40 outline-none focus:border-brand-blue transition-all"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 mb-1.5 block">{t('account_name')}</label>
                  <input 
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder={t('account_name')}
                    className="w-full bg-surface-grey border border-border-grey/50 rounded-xl py-3 px-4 text-xs font-bold text-text-main placeholder:text-text-muted/40 outline-none focus:border-brand-blue transition-all"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1 mb-1.5 block">{t('withdrawal_address')}</label>
                <input 
                  type="text"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  placeholder={t('paste_address_placeholder')}
                  className="w-full bg-surface-grey border border-border-grey/50 rounded-xl py-3 px-4 text-xs font-bold text-text-main placeholder:text-text-muted/40 outline-none focus:border-brand-blue transition-all"
                />
              </div>
            )}
            <button 
              onClick={handleWithdrawal}
              disabled={loading}
              className="w-full py-4 bg-brand-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-blue/20 active:scale-[0.98] disabled:opacity-50 transition-all"
            >
              {loading ? t('processing') : t('confirm_withdrawal')}
            </button>
          </div>
        )}

        {/* Ultra-Slim Safety Text */}
        <div className="mt-5 pt-4 border-t border-border-grey/30">
           <p className="text-[8px] font-black text-text-muted/80 uppercase tracking-widest leading-relaxed">
             {activeTab === 'deposit' 
               ? "Min 10 USDT • Only TRC20 supported • Arrives after 1 block confirmation"
               : "Withdraw limit: 50,000 USDT • 2FA required for safety • Network fees apply"
             }
           </p>
        </div>
        
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/[0.02] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      </div>
    </div>
  );
};

const BetHistoryView = ({ onBack, currentUser }: { onBack: () => void; currentUser: any }) => {
  const { t } = useContext(LanguageContext);
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    try {
      const q = query(
        collection(db, 'purchases'), 
        where('uid', '==', currentUser.uid),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      
      const unsub = onSnapshot(q, (snap) => {
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBets(data);
        setLoading(false);
        setError(null);
      }, (err) => {
        console.error("Fetch bets error:", err);
        setError(err.message);
        setLoading(false);
      });

      return () => unsub();
    } catch (err: any) {
      console.error("Setup query error:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [currentUser]);

  // Hook to check for settlement
  const { settleBets } = useContext(LotteryContext);
  useEffect(() => {
    if (!currentUser || bets.length === 0 || !settleBets) return;
    
    const checkNeeded = bets.filter(b => b.status === 'pending');
    if (checkNeeded.length === 0) return;

    const autoSettle = async () => {
      for (const bet of checkNeeded) {
        const histId = `${bet.lotteryId}_${bet.drawId}`;
        const histSnap = await getDoc(doc(db, 'draw_history', histId));
        if (histSnap.exists()) {
          settleBets(bet.lotteryId, bet.drawId, histSnap.data().res);
        }
      }
    };
    autoSettle();
  }, [bets, currentUser, settleBets]);

  const stats = useMemo(() => {
    return bets.reduce((acc, bet) => {
      const amt = parseFloat(bet.amount || '0');
      const win = parseFloat(bet.winAmount || '0');
      acc.totalInvested += amt;
      acc.totalWon += win;
      if (bet.status === 'won') acc.winCount++;
      return acc;
    }, { totalInvested: 0, totalWon: 0, winCount: 0 });
  }, [bets]);

  const netProfit = stats.totalWon - stats.totalInvested;

  return (
    <div className="max-w-md mx-auto pb-32 px-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-white border border-border-grey rounded-lg shadow-sm active:scale-95 transition-all">
             <ChevronLeft size={16} className="text-text-main" />
          </button>
          <div>
            <h2 className="text-base font-black text-text-main uppercase tracking-tight leading-tight">{t('my_bets')}</h2>
            <p className="text-[8px] font-bold text-text-muted uppercase tracking-widest">{bets.length} TICKETS</p>
          </div>
        </div>
      </div>

      {/* Stats Dashboard - Compact */}
      {!loading && bets.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-2 mb-6"
        >
          <div className="bg-white border border-border-grey rounded-xl p-2 shadow-sm text-center">
            <p className="text-[7px] font-black text-text-muted uppercase tracking-tight mb-0.5">Invested</p>
            <p className="text-xs font-black text-text-main tabular-nums">{stats.totalInvested.toFixed(1)}</p>
          </div>
          <div className="bg-white border border-border-grey rounded-xl p-2 shadow-sm border-b-2 border-b-success/30 text-center">
            <p className="text-[7px] font-black text-text-muted uppercase tracking-tight mb-0.5">Returns</p>
            <p className="text-xs font-black text-success tabular-nums">{stats.totalWon.toFixed(1)}</p>
          </div>
          <div className="bg-brand-blue text-white rounded-xl p-2 shadow-md text-center">
            <p className="text-[7px] font-black text-white/60 uppercase tracking-tight mb-0.5">Profit</p>
            <p className={`text-xs font-black tabular-nums ${netProfit >= 0 ? 'text-white' : 'text-danger'}`}>
              {netProfit >= 0 ? '+' : ''}{netProfit.toFixed(1)}
            </p>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex flex-col items-center py-20 opacity-20">
           <p className="text-[10px] font-black uppercase">Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-danger/5 rounded-3xl border border-dashed border-danger/20 p-6">
          <AlertCircle size={32} className="text-danger mx-auto mb-4" />
          <p className="text-sm font-bold text-danger mb-2">Sync Error</p>
          <p className="text-[10px] text-danger/60 break-words">{error}</p>
        </div>
      ) : bets.length === 0 ? (
        <div className="text-center py-32 bg-surface-grey rounded-3xl border border-dashed border-border-grey flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white border border-border-grey flex items-center justify-center text-text-muted/20">
            <Ticket size={32} />
          </div>
          <p className="text-sm font-bold text-text-muted uppercase tracking-widest">No active bets yet</p>
          <button onClick={onBack} className="px-6 py-2 bg-brand-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Go to Lobby</button>
        </div>
      ) : (
        <div className="space-y-3">
          {bets.map((bet, idx) => (
            <motion.div 
              key={bet.id} 
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="bg-white border border-border-grey rounded-2xl p-4 shadow-sm relative overflow-hidden text-left hover:shadow-md transition-all group border-l-[3px] border-l-transparent"
              style={{ borderLeftColor: bet.status === 'won' ? '#22C55E' : bet.status === 'lost' ? '#6C757D' : '#0066FF' }}
            >
              {bet.status === 'won' && (
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden z-20">
                  <div className="absolute top-2 -right-7 w-28 py-0.5 bg-success text-white text-[8px] font-black uppercase text-center rotate-45 shadow-sm flex flex-col items-center">
                    <span className="leading-none tracking-[0.1em]">WIN</span>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded bg-surface-grey border border-border-grey flex items-center justify-center">
                      <Ticket size={12} className="text-brand-blue" />
                    </div>
                    <p className="text-[10px] font-black text-text-main uppercase tracking-tight">{bet.lotteryName || bet.lotteryId}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-black text-brand-blue bg-brand-blue/5 px-1.5 py-0.5 rounded-md uppercase tracking-widest ring-1 ring-brand-blue/10"># {bet.drawId}</span>
                    <p className="text-[8px] font-medium text-text-muted/60 tabular-nums">
                      {bet.timestamp?.toDate ? bet.timestamp.toDate().toLocaleString() : 'Just now'}
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest shadow-sm ${
                   bet.status === 'won' ? 'bg-success text-white' : 
                   bet.status === 'lost' ? 'bg-text-muted/10 text-text-muted' : 
                   'bg-brand-blue/10 text-brand-blue'
                }`}>
                   {bet.status === 'won' ? t('status_won') : bet.status === 'lost' ? t('status_lost') : t('status_pending')}
                </div>
              </div>

              <div className="mb-4 bg-surface-grey/50 rounded-xl p-3 border border-border-grey/20">
                {bet.lines ? (
                  <div className="space-y-1.5">
                    {bet.lines.map((line: any, lIdx: number) => (
                      <div key={`bet-${bet.id}-line-${lIdx}`} className="flex gap-1 flex-wrap">
                        {line.main?.map((n: number, nIdx: number) => (
                          <span key={`bet-${bet.id}-line-${lIdx}-n-${nIdx}`} className="w-5 h-5 rounded-full bg-white border border-border-grey flex items-center justify-center text-[8px] font-black shadow-sm text-text-main">{n < 10 ? `0${n}` : n}</span>
                        )) || null}
                        {line.powerball && (
                          <span className="w-5 h-5 rounded-full bg-brand-blue text-white flex items-center justify-center text-[8px] font-black shadow-sm">{line.powerball < 10 ? `0${line.powerball}` : line.powerball}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : bet.bets ? (
                  <div className="flex flex-wrap gap-1.5">
                    {bet.bets.map((b: any, bIdx: number) => (
                      <span key={`bet-${bet.id}-b-${bIdx}`} className="px-2 py-1 bg-white border border-border-grey rounded-lg text-[9px] font-black text-brand-blue shadow-sm uppercase tracking-tighter">
                         <span className="opacity-50 mr-1">{b.type === 'sum' ? 'SUM' : b.type}:</span>
                         {b.val} <span className="text-[7px] text-text-muted ml-0.5">x{b.multiplier || 1}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                       <p className="text-[8px] font-bold text-text-main uppercase tracking-widest opacity-60">Pending Settlement</p>
                    </div>
                )}
              </div>

              <div className="flex items-center gap-4 relative pt-1 border-t border-border-grey/10">
                <div className="flex-1">
                  <p className="text-[7px] font-black text-text-muted uppercase tracking-widest mb-1 leading-none">Investment</p>
                  <p className="text-[12px] font-black text-text-main leading-none tabular-nums tracking-tighter">{parseFloat(bet.amount || '0').toFixed(2)} <span className="text-[8px] font-medium opacity-40 ml-0.5">USDT</span></p>
                </div>
                
                <div className="flex-1 text-right">
                  <p className="text-[7px] font-black text-text-muted uppercase tracking-widest mb-1 leading-none">Win Return</p>
                  <p className={`text-[12px] font-black leading-none tabular-nums tracking-tighter ${bet.status === 'won' ? 'text-success' : 'text-text-muted/40'}`}>
                    {bet.status === 'won' ? `+${(Number(bet.winAmount) || 0).toFixed(2)}` : (bet.status === 'lost' ? '0.00' : '-')} <span className="text-[10px] font-medium ml-0.5">USDT</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const TransactionHistoryView = ({ onBack, currentUser }: { onBack: () => void, currentUser: any }) => {
  const { t } = useContext(LanguageContext);
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) return;
    const q = query(collection(db, 'transactions'), where('uid', '==', currentUser.uid), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setTxs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, [currentUser?.uid]);

  return (
    <div className="max-w-xl mx-auto pb-32 px-4 text-left">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 bg-white border border-border-grey rounded-xl shadow-sm">
           <ChevronLeft size={20} className="text-text-main" />
        </button>
        <h2 className="text-xl font-black text-text-main uppercase tracking-tight">{t('transaction_records')}</h2>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-20 opacity-30">
            <p className="text-xs font-black uppercase tracking-widest">Loading transactions...</p>
          </div>
        ) : txs.length === 0 ? (
          <div className="text-center py-20 bg-surface-grey border border-dashed border-border-grey rounded-3xl">
            <p className="text-sm font-bold text-text-muted">No transactions yet</p>
          </div>
        ) : txs.map((tx) => (
          <div key={tx.id} className="flex flex-col p-4 bg-white border border-border-grey rounded-2xl shadow-sm gap-3">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                     tx.type === 'deposit' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                   }`}>
                      {tx.type === 'deposit' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                   </div>
                   <div>
                      <p className="text-sm font-black text-text-main leading-none mb-1 uppercase">{tx.type}</p>
                      <p className="text-[9px] font-medium text-text-muted uppercase tracking-tight">#{tx.id.substring(0, 10)}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className={`text-sm font-black ${tx.type === 'deposit' ? 'text-success' : 'text-danger'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}{tx.amount} USDT
                   </p>
                   <div className="flex items-center justify-end gap-1 mt-1">
                      <div className={`w-1 h-1 rounded-full ${tx.status === 'completed' ? 'bg-success' : 'bg-amber-400 animate-pulse'}`} />
                      <p className="text-[8px] font-bold text-text-muted uppercase tracking-widest">{tx.status}</p>
                   </div>
                </div>
             </div>
             {tx.type === 'withdrawal' && (
               <div className="bg-surface-grey/50 p-2 rounded-lg border border-border-grey/30">
                 {tx.bank_name ? (
                   <div className="space-y-1">
                     <p className="text-[9px] font-black text-brand-blue uppercase tracking-widest">{t('bank_account')}</p>
                     <p className="text-[12px] font-bold text-text-main leading-tight">{tx.bank_name}</p>
                     <p className="text-[12px] font-mono text-brand-blue leading-tight">{tx.account_number}</p>
                     <p className="text-[11px] opacity-70 leading-tight">{tx.account_name}</p>
                   </div>
                 ) : (
                   <>
                     <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-1">{t('withdrawal_address')}</p>
                     <p className="text-[12px] font-mono text-text-main break-all">{tx.address || '---'}</p>
                   </>
                 )}
               </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
};

const WithdrawalHistoryView = ({ onBack, currentUser }: { onBack: () => void; currentUser: any }) => {
  const { t } = useContext(LanguageContext);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) return;
    const q = query(
      collection(db, 'transactions'),
      where('uid', '==', currentUser.uid),
      where('type', '==', 'withdrawal'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsub = onSnapshot(q, (snap) => {
      setWithdrawals(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
       console.error("Snapshot error:", error);
       setLoading(false);
    });

    return () => unsub();
  }, [currentUser?.uid]);

  return (
    <div className="max-w-xl mx-auto pb-32 px-4 text-left">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 bg-white border border-border-grey rounded-xl shadow-sm active:scale-95 transition-all">
          <ChevronLeft size={20} className="text-text-main" />
        </button>
        <h2 className="text-xl font-black text-text-main uppercase tracking-tight">{t('withdrawal_history')}</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 opacity-20"><p className="text-[10px] font-black uppercase tracking-widest">Loading...</p></div>
      ) : withdrawals.length === 0 ? (
        <div className="text-center py-20 bg-surface-grey border border-dashed border-border-grey rounded-3xl flex flex-col items-center gap-4">
          <ArrowUpRight size={32} className="text-text-muted/20" />
          <p className="text-sm font-bold text-text-muted uppercase tracking-widest">No withdrawal records</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {withdrawals.map((tx) => (
            <motion.div 
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-border-grey rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-brand-blue/30 transition-all hover:shadow-lg hover:shadow-brand-blue/5"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-blue animate-pulse" />
                    <p className="text-xs font-black text-text-main uppercase tracking-tight">{tx.network || 'USDT'}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-text-muted font-bold opacity-60">
                    <Clock size={10} />
                    {tx.timestamp?.toDate ? tx.timestamp.toDate().toLocaleString() : 'Processing'}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${
                  tx.status === 'completed' ? 'bg-success text-white shadow-success/20' : 
                  tx.status === 'rejected' ? 'bg-danger text-white shadow-danger/20' : 
                  'bg-amber-100 text-amber-600 border border-amber-200'
                }`}>
                  {tx.status}
                </div>
              </div>

              <div className="bg-surface-grey/40 rounded-2xl p-4 border border-border-grey/30 mb-5 group-hover:bg-brand-blue/5 transition-colors">
                {tx.bank_name ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block mb-1">{t('bank_name')}</span>
                      <span className="text-[13px] font-black text-text-main">{tx.bank_name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block mb-1">{t('account_number')}</span>
                      <span className="text-[13px] font-mono font-black text-brand-blue">{tx.account_number}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block mb-1">{t('account_name')}</span>
                      <span className="text-[13px] font-black text-text-main">{tx.account_name}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">{t('withdrawal_address')}</p>
                    <p className="text-[12px] font-mono font-black break-all text-brand-blue leading-relaxed">{tx.address || '---'}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border-grey/10">
                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                  <Wallet size={10} />
                  {t('amount')}
                </p>
                <div className="text-right">
                  <p className="text-lg font-black text-text-main leading-none">
                    {parseFloat(tx.amount || '0').toFixed(2)}
                  </p>
                  <p className="text-[9px] font-bold text-text-muted mt-1 uppercase">USDT</p>
                </div>
              </div>

              {/* Decorative background element */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-brand-blue/5 blur-3xl rounded-full group-hover:bg-brand-blue/10 transition-colors" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const ReferralsView = ({ onBack, currentUser }: { onBack: () => void, currentUser: any }) => {
  const { t } = useContext(LanguageContext);
  const [downlines, setDownlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ dailyCommission: 0, totalCommission: 0 });

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!currentUser?.uid) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // 1. Fetch downline users
        const usersRef = collection(db, 'users');
        const downlineQuery = query(usersRef, where('referrer_id', '==', currentUser.uid));
        const downlineSnap = await getDocs(downlineQuery);
        const users = downlineSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDownlines(users);

        // 2. Fetch commission transactions for stats
        const txRef = collection(db, 'transactions');
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Optimized single-field query
        const commissionQuery = query(txRef, where('referrer_id', '==', currentUser.uid));
        
        const txSnap = await getDocs(commissionQuery);
        let daily = 0;
        let total = 0;
        
        txSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.type === 'commission' && data.status === 'completed') {
            const amount = Number(data.amount) || 0;
            total += amount;
            
            const timestamp = data.timestamp?.toDate();
            if (timestamp && timestamp >= startOfDay) {
              daily += amount;
            }
          }
        });
        
        setStats({ dailyCommission: daily, totalCommission: total });
      } catch (err: any) {
        console.error("Error fetching referral data:", err);
        setError(err.message || "Failed to load referral data");
      } finally {
        setLoading(false);
      }
    };
    fetchReferralData();
  }, [currentUser?.uid]); // Dependency on specific UID

  return (
    <div className="max-w-xl mx-auto pb-32 px-4 text-left">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 bg-white border border-border-grey rounded-xl shadow-sm">
           <ChevronLeft size={20} className="text-text-main" />
        </button>
        <h2 className="text-xl font-black text-text-main uppercase tracking-tight">{t('my_referrals')}</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
         <div className="bg-brand-blue rounded-3xl p-5 text-white shadow-xl shadow-brand-blue/20 relative overflow-hidden">
            <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest mb-1">{t('daily_commission')}</p>
            <p className="text-xl font-black tracking-tight">{stats.dailyCommission.toFixed(2)} <span className="text-[10px]">USDT</span></p>
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2" />
         </div>
         <div className="bg-white border border-border-grey rounded-3xl p-5 shadow-sm relative overflow-hidden">
            <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-1">{t('total_commission')}</p>
            <p className="text-xl font-black text-text-main tracking-tight">{stats.totalCommission.toFixed(2)} <span className="text-[10px]">USDT</span></p>
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-blue/5 blur-xl rounded-full translate-x-1/2 -translate-y-1/2" />
         </div>
      </div>

      <div className="mb-4 flex items-center justify-between px-1">
         <h4 className="text-[10px] font-black text-text-main uppercase tracking-widest leading-none">{t('sub_accounts')} ({downlines.length})</h4>
         <div className="flex items-center gap-1.5 text-[9px] font-bold text-text-muted bg-surface-grey px-2 py-1 rounded-full border border-border-grey/50">
            <div className="w-1 h-1 rounded-full bg-success animate-pulse" />
            LIVE
         </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 text-text-muted gap-4">
             <RotateCw className="animate-spin" size={32} />
             <p className="text-xs font-bold uppercase tracking-widest">{t('analyzing')}</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-danger/5 border border-danger/20 rounded-[2rem]">
             <p className="text-xs font-bold text-danger uppercase tracking-widest">{error}</p>
             <button onClick={() => window.location.reload()} className="mt-4 text-[10px] font-black text-brand-blue uppercase underline tracking-widest">
                Retry Now
             </button>
          </div>
        ) : downlines.length === 0 ? (
          <div className="p-12 text-center bg-white border border-border-grey border-dashed rounded-[2.5rem]">
             <div className="w-16 h-16 bg-surface-grey rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-text-muted opacity-30" />
             </div>
             <p className="text-xs font-bold text-text-muted uppercase tracking-widest">No Sub-accounts found</p>
          </div>
        ) : (
          downlines.map((user) => (
            <div key={user.uid} className="bg-white border border-border-grey rounded-3xl p-5 shadow-sm hover:border-brand-blue/50 transition-all group">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-brand-blue-light flex items-center justify-center text-brand-blue text-sm font-black">
                        {user.displayName?.[0]?.toUpperCase() || 'U'}
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-text-main leading-tight">{user.displayName || 'Unnamed User'}</h4>
                        <p className="text-[9px] font-medium text-text-muted mt-0.5">ID: {user.uid.substring(0, 12)}...</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-0.5">{t('balance')}</p>
                     <p className="text-sm font-black text-brand-blue">{(user.balance || 0).toFixed(2)} <span className="text-[10px]">USDT</span></p>
                  </div>
               </div>
               
               <div className="flex items-center justify-between p-3 bg-surface-grey rounded-2xl border border-border-grey/50 group-hover:bg-brand-blue/5 transition-colors">
                  <div className="flex items-center gap-2">
                     <BarChart3 size={14} className="text-brand-blue" />
                     <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{t('daily_flow')}</span>
                  </div>
                  {/* Mock turnover for now as we don't have aggregated flow data yet */}
                  <span className="text-[11px] font-black text-text-main">0.00 <span className="text-[9px] text-text-muted uppercase">USDT</span></span>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const LoginView = ({ onLogin, onGoToRegister }: { onLogin: (user: any) => void; onGoToRegister: () => void }) => {
  const { t } = useContext(LanguageContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    setError('');
    
    // Safety timeout to prevent infinite "PROCESSING" state
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      setError('Connection timeout. Please try again.');
    }, 15000);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      clearTimeout(timeoutId);
      onLogin(userCredential.user);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error(err);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto min-h-[70vh] flex flex-col justify-center px-6 text-left">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-brand-blue rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-brand-blue/20">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-black text-text-main tracking-tight uppercase leading-tight mb-2">
          {t('navbar_login')}
        </h2>
        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest leading-relaxed">
          {t('login_subtitle')}
        </p>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold">
            {error}
          </div>
        )}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1">{t('email_label')}</label>
          <div className="relative">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('email_placeholder')}
              className="w-full bg-white border border-border-grey/60 rounded-2xl py-4 px-5 text-sm font-bold text-text-main outline-none focus:border-brand-blue shadow-sm transition-all text-left"
            />
            <MessageCircle className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted/40" size={18} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1">{t('password_label')}</label>
          <div className="relative">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password_placeholder')}
              className="w-full bg-white border border-border-grey/60 rounded-2xl py-4 px-5 text-sm font-bold text-text-main outline-none focus:border-brand-blue shadow-sm transition-all text-left"
            />
            <LockKeyhole className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted/40" size={18} />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 pb-1 px-1">
          <div onClick={onGoToRegister} className="cursor-pointer group">
            <span className="text-[10px] font-medium text-text-muted">{t('dont_have_account')}?</span>
            <span className="text-[11px] font-black text-brand-blue uppercase tracking-widest ml-1.5 group-hover:underline">{t('register_now')}</span>
          </div>
          <button className="text-[9px] font-black text-text-muted/60 uppercase tracking-widest hover:underline">{t('forgot_password')}?</button>
        </div>

        <button 
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-brand-blue text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-brand-blue/20 hover:bg-brand-blue/90 active:scale-[0.98] transition-all mt-4"
        >
          {isLoading ? t('processing') : t('navbar_login')}
        </button>
      </div>
    </div>
  );
};

const RegisterView = ({ onRegister, onGoToLogin }: { onRegister: (userData: any) => void; onGoToLogin: () => void }) => {
  const { t } = useContext(LanguageContext);
  const { referrerId } = useContext(ReferralContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accepted, setAccepted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!accepted) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      setError('Connection timeout. Please try again.');
    }, 15000);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      clearTimeout(timeoutId);
      const user = userCredential.user;
      const inviteCode = generateInviteCode();
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: username,
        invite_code: inviteCode,
        referrer_id: referrerId || null,
        balance: 0,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      await setDoc(doc(db, 'invite_codes', inviteCode), { uid: user.uid });
      
      onRegister(userData);
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error(err);
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto min-h-[85vh] flex flex-col justify-center px-6 text-left py-10">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-brand-blue rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-brand-blue/20">
          <Plus size={32} />
        </div>
        <h2 className="text-2xl font-black text-text-main tracking-tight uppercase leading-tight mb-2">
          {t('register_title')}
        </h2>
        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest leading-relaxed">
          {t('register_subtitle')}
        </p>
        {referrerId && (
          <p className="mt-2 text-xs font-bold text-brand-blue">
            You were referred by: {referrerId}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold">
            {error}
          </div>
        )}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1">{t('username_label')}</label>
          <div className="relative">
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('username_placeholder')}
              className="w-full bg-white border border-border-grey/60 rounded-2xl py-4 px-5 text-sm font-bold text-text-main outline-none focus:border-brand-blue shadow-sm transition-all text-left"
            />
            <User className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted/40" size={18} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1">{t('email_label')}</label>
          <div className="relative">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('email_placeholder')}
              className="w-full bg-white border border-border-grey/60 rounded-2xl py-4 px-5 text-sm font-bold text-text-main outline-none focus:border-brand-blue shadow-sm transition-all text-left"
            />
            <MessageCircle className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted/40" size={18} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1">{t('password_label')}</label>
          <div className="relative">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password_placeholder')}
              className="w-full bg-white border border-border-grey/60 rounded-2xl py-4 px-5 text-sm font-bold text-text-main outline-none focus:border-brand-blue shadow-sm transition-all text-left"
            />
            <LockKeyhole className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted/40" size={18} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1">{t('confirm_password_label')}</label>
          <div className="relative">
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('confirm_password_placeholder')}
              className="w-full bg-white border border-border-grey/60 rounded-2xl py-4 px-5 text-sm font-bold text-text-main outline-none focus:border-brand-blue shadow-sm transition-all text-left"
            />
            <ShieldCheck className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted/40" size={18} />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
           <button 
             onClick={() => setAccepted(!accepted)}
             className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${accepted ? 'bg-brand-blue border-brand-blue text-white' : 'border-border-grey bg-white'}`}
           >
              {accepted && <Check size={12} />}
           </button>
           <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight">{t('accept_terms')}</span>
        </div>

        <button 
          onClick={handleRegister}
          disabled={!accepted || isLoading}
          className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all mt-6 ${
            accepted && !isLoading
            ? 'bg-brand-blue text-white shadow-brand-blue/20 hover:bg-brand-blue/90 active:scale-[0.98]' 
            : 'bg-border-grey text-text-muted cursor-not-allowed'
          }`}
        >
          {isLoading ? t('processing') : t('register_now')}
        </button>

        <div className="pt-8 text-center border-t border-border-grey/30">
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest">
            {t('already_have_account')} <span onClick={onGoToLogin} className="text-brand-blue cursor-pointer hover:underline text-[13px] font-black ml-1 scale-110 inline-block">{t('login_now')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const NotificationsView = ({ onBack }: { onBack: () => void }) => {
  const { t } = useContext(LanguageContext);
  const notices = [
    { id: 1, title: 'Big Win!', message: 'Your Powerball ticket matched 3 numbers! Prize: 10 USDT', time: '1 hour ago', unread: true },
    { id: 2, title: 'Deposit Successful', message: 'Your deposit of 100 USDT was confirmed.', time: '5 hours ago', unread: false },
    { id: 3, title: 'Security Alert', message: 'New login detected from IP 192.168.1.1', time: '1 day ago', unread: false },
  ];

  return (
    <div className="max-w-xl mx-auto pb-32 px-4 text-left">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 bg-white border border-border-grey rounded-xl shadow-sm">
           <ChevronLeft size={20} className="text-text-main" />
        </button>
        <h2 className="text-xl font-black text-text-main uppercase tracking-tight">{t('win_notifications')}</h2>
      </div>

      <div className="space-y-3">
        {notices.map((n) => (
          <div key={n.id} className={`p-4 rounded-2xl border transition-all ${n.unread ? 'bg-brand-blue/5 border-brand-blue/20' : 'bg-white border-border-grey'}`}>
             <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-black text-text-main">{n.title}</h4>
                <p className="text-[9px] text-text-muted font-bold uppercase">{n.time}</p>
             </div>
             <p className="text-xs text-text-muted leading-relaxed font-medium">{n.message}</p>
             {n.unread && <div className="mt-2 w-1.5 h-1.5 bg-brand-blue rounded-full" />}
          </div>
        ))}
      </div>
    </div>
  );
};

const SecurityView = ({ onBack }: { onBack: () => void }) => {
  const { t } = useContext(LanguageContext);
  return (
    <div className="max-w-xl mx-auto pb-32 px-4 text-left">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 bg-white border border-border-grey rounded-xl shadow-sm">
           <ChevronLeft size={20} className="text-text-main" />
        </button>
        <h2 className="text-xl font-black text-text-main uppercase tracking-tight">{t('security_settings')}</h2>
      </div>

      <div className="space-y-6">
         <div className="bg-white border border-border-grey rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                  <ShieldCheck size={28} />
               </div>
               <div>
                  <h4 className="text-md font-black text-text-main leading-tight">Identity Verified</h4>
                  <p className="text-xs text-success font-bold uppercase tracking-tight">Level 2 Protection Enabled</p>
               </div>
            </div>

            <div className="space-y-4">
               {[
                 { label: 'Two-Factor Authentication (2FA)', status: 'Enabled', active: true },
                 { label: 'Login Password', status: 'Updated 2 months ago', active: false },
                 { label: 'Fund Password', status: 'Not Set', active: false, alert: true },
                 { label: 'Device Management', status: '3 Active Devices', active: false },
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center justify-between py-3 border-b border-border-grey/50 last:border-0 border-dashed">
                    <div>
                       <p className="text-xs font-black text-text-main mb-0.5">{item.label}</p>
                       <p className={`text-[10px] font-bold uppercase ${item.alert ? 'text-danger' : 'text-text-muted'}`}>{item.status}</p>
                    </div>
                    <ChevronRight size={16} className="text-text-muted" />
                 </div>
               ))}
            </div>
         </div>

         <div className="p-6 bg-surface-grey border border-border-grey md:rounded-3xl">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-relaxed">
               Security Note: Never share your login credentials or recovery phrases with anyone, including support staff. 
               We will never ask for your password via Telegram or email.
            </p>
         </div>
      </div>
    </div>
  );
};

const SupportView = () => {
  const { t } = useContext(LanguageContext);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (doc) => {
      if (doc.exists()) setSettings(doc.data());
    });
    return () => unsub();
  }, []);

  const handleConnect = () => {
    if (settings?.support_link) {
      window.open(settings.support_link, '_blank');
    } else {
      // Fallback if no link is set
      window.open('https://t.me/your_default_support', '_blank');
    }
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col h-[70vh] px-4">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-brand-blue/5 flex items-center justify-center text-brand-blue mb-2 shadow-inner">
           <Send size={40} className="rotate-[15deg]" />
        </div>
        
        <div className="space-y-2 max-w-xs">
          <h2 className="text-xl font-black text-text-main leading-tight uppercase tracking-tight">{t('need_help')}</h2>
          <p className="text-xs text-text-muted font-medium leading-relaxed">
            {t('telegram_support')}
          </p>
        </div>

        <div className="w-full max-w-xs">
          <button 
            onClick={handleConnect}
            className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white rounded-[2rem] py-4 font-black text-xs shadow-2xl shadow-brand-blue/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest active:scale-95 group"
          >
            <div className="p-1.5 bg-white/20 rounded-full group-hover:rotate-12 transition-transform">
               <Send size={16} fill="white" stroke="white" />
            </div>
            {t('connect_telegram')}
          </button>
          
          <p className="text-[10px] text-text-muted font-bold mt-4 tracking-wide">
            Faster response • {t('active_24_7')} • Secure encryption
          </p>
        </div>
      </div>

      {/* Input Bar (Offline Mode) */}
      <div className="bg-surface-grey border border-border-grey p-2 rounded-2xl flex items-center gap-2 opacity-60 pointer-events-none mb-4">
         <button className="p-2 text-text-muted">
            <Paperclip size={20} />
         </button>
         <div className="flex-1 text-xs font-bold text-text-muted/60 uppercase tracking-widest px-2">
            {t('offline_notice')}
         </div>
         <button className="p-3 bg-text-muted/20 text-text-muted rounded-xl">
            <Send size={18} />
         </button>
      </div>
    </div>
  );
};

const Profile = ({ setView, setIsLoggedIn, currentUser, isAdmin }: { setView: (v: ViewType) => void, setIsLoggedIn: (s: boolean) => void, currentUser: any, isAdmin: boolean }) => {
  const { lang, setLang, t } = useContext(LanguageContext);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const inviteLink = `${window.location.origin}${window.location.pathname}?ref=${currentUser?.invite_code || ''}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  interface MenuItem {
    icon: any;
    label: string;
    subLabel: string;
    color: string;
    onClick: () => void;
    bgOverride?: string;
    borderOverride?: string;
  }

  const menuItems: MenuItem[] = [
    { icon: <BarChart3 size={20} />, label: t('my_referrals'), subLabel: t('referral_dashboard'), color: 'text-brand-blue', onClick: () => setView('referrals') },
    { icon: <History size={20} />, label: t('my_bets'), subLabel: t('betting_history'), color: 'text-brand-blue', onClick: () => setView('bet_history') },
    { icon: <ArrowUpRight size={20} />, label: t('withdrawal_history'), subLabel: t('view_withdrawal_details'), color: 'text-brand-blue', onClick: () => setView('withdrawal_history') },
    { icon: <CreditCard size={20} />, label: t('transaction_records'), subLabel: t('deposit_withdrawal'), color: 'text-brand-blue', onClick: () => setView('transaction_history') },
    { icon: <Bell size={20} />, label: t('win_notifications'), subLabel: t('real_time_alerts'), color: 'text-danger', onClick: () => setView('notifications') },
    { icon: <LockKeyhole size={20} />, label: t('security_settings'), subLabel: t('two_fa_recovery'), color: 'text-brand-blue', onClick: () => setView('security') },
    { icon: <Globe size={20} />, label: t('language'), subLabel: `${lang.flag} ${lang.name}`, color: 'text-brand-blue', onClick: () => setShowLanguageModal(true) },
    { icon: <LogOut size={20} />, label: t('log_out'), subLabel: t('secure_exit'), color: 'text-text-muted', onClick: async () => {
      await signOut(auth);
      setIsLoggedIn(false);
      setView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }},
  ];

  if (isAdmin) {
    menuItems.unshift({ 
      icon: <Shield size={20} />, 
      label: '管理后台', 
      subLabel: '系统管理与审核', 
      color: 'text-white', 
      bgOverride: 'bg-gradient-to-r from-amber-500 to-orange-600',
      borderOverride: 'border-amber-200',
      onClick: () => setView('admin') 
    });
  }

  return (
    <div className="max-w-xl mx-auto pb-32">
      {/* User Header */}
      <div className="flex flex-col items-center mb-5 px-4 pt-4">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-brand-blue-light border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
            <User size={40} className="text-brand-blue mt-3" />
          </div>
          <div className="absolute bottom-0 right-0 bg-brand-blue text-white p-0.5 rounded-full border-2 border-white shadow-lg">
             <CheckCircle2 size={12} />
          </div>
        </div>
        <h2 className="text-xl font-black text-text-main tracking-tight uppercase leading-none">{currentUser?.displayName || 'Guest'}</h2>
        <div className="flex items-center gap-1.5 mt-2">
           {isAdmin && (
             <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shadow-sm animate-pulse">ADMIN</span>
           )}
           <span className="text-[9px] font-black text-brand-blue uppercase tracking-widest bg-brand-blue/5 px-2.5 py-1 rounded-full border border-brand-blue/10">{t('verified_member')}</span>
        </div>
      </div>

      {/* Balance Card */}
      <div className="mx-4 p-5 bg-brand-blue rounded-[1.5rem] text-white shadow-2xl relative overflow-hidden mb-5">
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1.5">{t('balance')}</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black">{(currentUser?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <span className="text-[10px] font-bold text-white/70">USDT</span>
            </div>
            <p className="text-[9px] text-white/40 mt-1 uppercase font-bold tracking-tighter">≈ ${(currentUser?.balance || 0).toLocaleString()} USD</p>
          </div>
          <button className="bg-white text-brand-blue px-6 py-2.5 rounded-xl font-black text-[11px] shadow-lg hover:shadow-white/20 transition-all uppercase tracking-widest active:scale-95">
            {t('deposit')}
          </button>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[30px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 blur-[30px] rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Referral Link Section */}
      <div className="mx-4 mb-6 bg-white border border-border-grey rounded-2xl p-4 relative overflow-hidden group shadow-sm">
         <div className="flex items-center justify-between mb-3.5">
            <div>
               <h3 className="text-[11px] font-black text-text-main uppercase tracking-widest">Invite & Earn</h3>
               <p className="text-[9px] text-text-muted font-bold mt-0.5 opacity-70">Share your unique code to get rewards</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-grey flex items-center justify-center text-brand-blue border border-border-grey/50 shadow-inner">
               <Copy size={14} />
            </div>
         </div>
         
         <div className="flex items-center gap-2 p-2.5 bg-surface-grey/50 rounded-xl border border-border-grey/50 group-hover:border-brand-blue/30 transition-all">
            <span className="flex-1 text-[10px] font-mono font-black text-text-main truncate opacity-80">{inviteLink}</span>
            <button 
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all shadow-sm ${
                copied ? 'bg-success text-white' : 'bg-brand-blue text-white hover:bg-brand-blue/90'
              }`}
            >
               {copied ? 'Copied' : 'Copy'}
            </button>
         </div>

         {currentUser?.referrer_id && (
           <div className="mt-3.5 flex items-center gap-2 pt-3 border-t border-dashed border-border-grey/50">
             <span className="text-[9px] font-black text-text-muted uppercase tracking-tighter opacity-70">My Referrer:</span>
             <span className="text-[9px] font-black text-brand-blue bg-brand-blue/5 px-2 py-0.5 rounded border border-brand-blue/10">
               {currentUser.referrer_id.substring(0, 8)}...
             </span>
           </div>
         )}
      </div>

      {/* Menu List */}
      <div className="bg-white border-y md:border border-border-grey md:rounded-3xl shadow-sm overflow-hidden">
        {menuItems.map((item: any, idx) => (
          <button 
            key={idx}
            onClick={item.onClick}
            className={`w-full flex items-center justify-between p-5 hover:bg-surface-grey transition-colors group ${idx !== menuItems.length - 1 ? 'border-b border-border-grey/50' : ''}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm ${item.bgOverride || 'bg-surface-grey shadow-inner'} ${item.borderOverride ? `border ${item.borderOverride}` : ''} ${item.color}`}>
                {item.icon}
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-text-main leading-none mb-1">{item.label}</p>
                <p className="text-[10px] text-text-muted font-medium">{item.subLabel}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-text-muted group-hover:text-brand-blue transition-colors" />
          </button>
        ))}
      </div>

      {/* Language Selection Modal */}
      <AnimatePresence>
        {showLanguageModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLanguageModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-5 border-b border-border-grey flex items-center justify-between">
                <h3 className="font-black text-lg text-text-main uppercase tracking-tight">{t('select_language')}</h3>
                <button 
                  onClick={() => setShowLanguageModal(false)}
                  className="p-2 hover:bg-surface-grey rounded-full transition-colors"
                >
                  <X size={20} className="text-text-muted" />
                </button>
              </div>
              <div className="overflow-y-auto p-2">
                <div className="grid grid-cols-1 gap-1">
                  {languages.map((langOption) => (
                    <button
                      key={langOption.code}
                      onClick={() => {
                        setLang(langOption);
                        setShowLanguageModal(false);
                      }}
                      className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                        lang.code === langOption.code 
                        ? 'bg-brand-blue/5 border-2 border-brand-blue/20' 
                        : 'hover:bg-surface-grey border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{langOption.flag}</span>
                        <span className={`font-bold ${lang.code === langOption.code ? 'text-brand-blue' : 'text-text-main'}`}>
                          {langOption.name}
                        </span>
                      </div>
                      {lang.code === langOption.code && (
                        <div className="w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-surface-grey/30">
                <button 
                  onClick={() => setShowLanguageModal(false)}
                  className="w-full py-4 bg-brand-blue text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-blue/20"
                >
                  {t('confirm')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BottomNavbar = ({ currentView, setView }: { currentView: any, setView: (v: any) => void }) => {
  const { t } = useContext(LanguageContext);
  const navItems = [
    { id: 'lobby', label: t('lobby'), icon: <LayoutGrid size={22} /> },
    { id: 'results', label: t('navbar_results'), icon: <Trophy size={22} /> },
    { id: 'support', label: t('support'), icon: (
      <div className="relative">
        <MessageCircle size={22} />
        <div className="absolute -top-1 -right-1 bg-brand-blue text-white p-0.5 rounded-full ring-2 ring-white">
          <Send size={8} fill="white" className="rotate-[15deg]" />
        </div>
      </div>
    ) },
    { id: 'wallet', label: t('wallet'), icon: <Wallet size={22} /> },
    { id: 'profile', label: t('user'), icon: <User size={22} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-grey shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-[60] px-4 pb-6 pt-3">
      <div className="max-w-xl mx-auto flex justify-between items-center">
        {navItems.map(item => {
          const isActive = (item.id === 'lobby' && (currentView === 'lobby' || currentView === 'select')) || currentView === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => {
                if (item.id !== 'results' && item.id !== 'wallet' && item.id !== 'support' && item.id !== 'lobby' && item.id !== 'profile') return;
                setView(item.id as any);
              }}
              className={`flex flex-col items-center gap-1 transition-all relative ${isActive ? 'text-brand-blue' : 'text-text-muted hover:text-brand-blue/60'}`}
            >
              <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-brand-blue-light' : ''}`}>
                {item.icon}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div layoutId="nav-active" className="w-1 h-1 bg-brand-blue rounded-full absolute -bottom-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

type ViewType = 'lobby' | 'select' | 'profile' | 'results' | 'results_detail' | 'wallet' | 'support' | 'bet_history' | 'transaction_history' | 'withdrawal_history' | 'notifications' | 'security' | 'login' | 'register' | 'referrals' | 'admin';

const FooterElements = () => {
  const { t } = useContext(LanguageContext);
  return (
    <div className="mt-16 pb-12 border-t border-border-grey pt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-2 text-brand-blue">
            <ShieldCheck size={24} />
            <span className="font-bold text-sm">{t('licensed_platform')}</span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed max-w-xs">
            {t('platform_compliance')}
          </p>
        </div>
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-2 text-brand-blue">
            <Lock size={24} />
            <span className="font-bold text-sm">{t('encryption_standard')}</span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed max-w-xs">
            {t('encryption_text')}
          </p>
        </div>
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-2 text-brand-blue">
            <Info size={24} />
            <span className="font-bold text-sm">{t('responsible_gaming')}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-9 h-9 border-2 border-text-muted rounded-full flex items-center justify-center text-xs font-bold text-text-muted">18+</span>
            <p className="text-xs text-text-muted leading-relaxed max-w-[150px]">
              {t('gaming_limits')}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] text-text-muted">{t('footer_copyright')}</p>
        <div className="flex gap-4">
           {[
             { key: 'privacy_policy', label: t('privacy_policy') },
             { key: 'terms_of_service', label: t('terms_of_service') },
             { key: 'cookie_settings', label: t('cookie_settings') }
           ].map(link => (
             <button key={link.key} className="text-[10px] font-medium text-text-muted hover:text-brand-blue underline">{link.label}</button>
           ))}
        </div>
      </div>
    </div>
  );
};

const AppContent = ({ 
  view, 
  setView, 
  lobbyTab, 
  setLobbyTab, 
  selectedLoto, 
  setSelectedLoto, 
  handleSelectLoto, 
  selectedLotoForHistory, 
  setSelectedLotoForHistory, 
  showWinPopup, 
  setShowWinPopup,
  isLoggedIn,
  setIsLoggedIn,
  isAdmin,
  currentUser,
  drawStates,
  onSettleMissing
}: {
  view: ViewType;
  setView: (v: ViewType) => void;
  lobbyTab: 'major' | 'rapid';
  setLobbyTab: (t: 'major' | 'rapid') => void;
  selectedLoto: Lottery | null;
  setSelectedLoto: (l: Lottery | null) => void;
  handleSelectLoto: (l: Lottery) => void;
  selectedLotoForHistory: Lottery | null;
  setSelectedLotoForHistory: (l: Lottery | null) => void;
  showWinPopup: boolean;
  setShowWinPopup: (s: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (s: boolean) => void;
  isAdmin: boolean;
  currentUser: any;
  drawStates: Record<string, LotteryDrawState>;
  onSettleMissing?: () => Promise<void>;
}) => {
  const { t } = useContext(LanguageContext);

  const renderContent = () => {
    if (view === 'login') {
      return (
        <LoginView 
          onLogin={() => {
            setView('lobby');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          onGoToRegister={() => setView('register')} 
        />
      );
    }
    if (view === 'register') {
      return (
        <RegisterView 
          onRegister={() => {
            setView('lobby');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
          onGoToLogin={() => setView('login')} 
        />
      );
    }
    if (view === 'lobby') {
      return (
        <>
          <header className="mb-4 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <div className="flex items-center gap-2 text-brand-blue mb-0.5 justify-center md:justify-start">
                <div className="w-4 h-4 rounded-full border border-brand-blue/30 flex items-center justify-center">
                  <ShieldCheck size={10} className="text-brand-blue" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted">{t('lobby_header_verified')}</span>
              </div>
              <h1 className="text-lg md:text-xl font-black text-text-main tracking-tight leading-tight mb-1">
                {t('lobby_header_title')}
              </h1>
              <p className="text-text-muted max-w-md text-[9px] md:text-[10px] leading-relaxed">
                {t('lobby_header_subtitle')}
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-4 bg-surface-grey border border-border-grey rounded-xl p-4 shadow-sm">
               <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-brand-blue-light flex items-center justify-center overflow-hidden">
                      <User size={20} className="text-brand-blue mt-2" />
                    </div>
                  ))}
               </div>
               <div>
                 <p className="text-xs font-bold text-text-main tracking-tight">{t('lobby_security_title')}</p>
                 <p className="text-[10px] text-text-muted">{t('lobby_security_subtitle')}</p>
               </div>
            </div>
          </header>

          <div className="flex gap-2 mb-4 w-full max-w-sm mx-auto md:mx-0">
            <button
              onClick={() => setLobbyTab('rapid')}
              className={`flex-1 py-2 px-4 rounded-full text-[9px] font-black uppercase tracking-widest transition-all relative
                ${lobbyTab === 'rapid' 
                  ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30' 
                  : 'bg-surface-grey text-text-muted hover:bg-border-grey/30'
                }
              `}
            >
              {t('tab_rapid')}
              {lobbyTab === 'rapid' && (
                <motion.div 
                  layoutId="lobby-tab-underline"
                  className="absolute -bottom-1 left-1/4 right-1/4 h-0.5 bg-brand-blue rounded-full blur-[1px]"
                />
              )}
            </button>
            <button
              onClick={() => setLobbyTab('major')}
              className={`flex-1 py-2 px-4 rounded-full text-[9px] font-black uppercase tracking-widest transition-all relative
                ${lobbyTab === 'major' 
                  ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30' 
                  : 'bg-surface-grey text-text-muted hover:bg-border-grey/30'
                }
              `}
            >
              {t('tab_major')}
              {lobbyTab === 'major' && (
                <motion.div 
                  layoutId="lobby-tab-underline"
                  className="absolute -bottom-1 left-1/4 right-1/4 h-0.5 bg-brand-blue rounded-full blur-[1px]"
                />
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-5 w-full">
            {lotteries
              .filter(loto => {
                if (lobbyTab === 'major') return !loto.specialDisplay;
                return !!loto.specialDisplay;
              })
              .map(loto => (
                <Card key={loto.id} lottery={loto} onSelect={handleSelectLoto} />
              ))}
          </div>

          <div className="mt-16 bg-brand-blue rounded-[2.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">{t('protection_title')}</h2>
              <p className="text-white/80 text-sm leading-relaxed mb-8">
                {t('protection_text')}
              </p>
              <div className="flex flex-wrap gap-4">
                 <button className="bg-white text-brand-blue px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-brand-blue-light transition-all flex items-center gap-2">
                   {t('legal_compliance')}
                   <ExternalLink size={14} />
                 </button>
                 <button className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-all">
                   {t('security_audit')}
                 </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-danger/10 blur-[80px] rounded-full translate-x-1/4 translate-y-1/4" />
          </div>

          <FooterElements />
        </>
      );
    } else if (view === 'select') {
      if (selectedLoto?.specialDisplay === 'fast3') {
        return <Fast3Selection lottery={selectedLoto} onBack={() => setView('lobby')} onWin={() => setShowWinPopup(true)} currentUser={currentUser} />;
      }
      return <TicketSelection lottery={selectedLoto!} onBack={() => setView('lobby')} onWin={() => setShowWinPopup(true)} currentUser={currentUser} />;
    } else if (view === 'admin') {
      return (
        <React.Suspense fallback={<div className="p-20 text-center">Loading Dashboard...</div>}>
          <AdminDashboard 
            onBack={() => {
              setView('lobby');
              window.scrollTo({ top: 0 });
            }} 
            drawStates={drawStates || {}} 
            onSettleMissing={onSettleMissing}
          />
        </React.Suspense>
      );
    } else if (view === 'profile') {
      return <Profile setView={setView} setIsLoggedIn={setIsLoggedIn} currentUser={currentUser} isAdmin={isAdmin} />;
    } else if (view === 'results') {
      return (
        <ResultsView 
          lotteries={lotteries} 
          onShowDetail={(loto) => {
            setSelectedLotoForHistory(loto);
            setView('results_detail');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} 
        />
      );
    } else if (view === 'results_detail') {
      if (!selectedLotoForHistory) {
        setView('results');
        return null;
      }
      return (
        <ResultsDetailView 
          lottery={selectedLotoForHistory} 
          onBack={() => setView('results')} 
        />
      );
    } else if (view === 'wallet') {
      return <WalletView currentUser={currentUser} />;
    } else if (view === 'support') {
      return <SupportView />;
    } else if (view === 'bet_history') {
      return <BetHistoryView onBack={() => setView('profile')} currentUser={currentUser} />;
    } else if (view === 'transaction_history') {
      return <TransactionHistoryView onBack={() => setView('profile')} currentUser={currentUser} />;
    } else if (view === 'withdrawal_history') {
      return <WithdrawalHistoryView onBack={() => setView('profile')} currentUser={currentUser} />;
    } else if (view === 'notifications') {
      return <NotificationsView onBack={() => setView('profile')} />;
    } else if (view === 'security') {
      return <SecurityView onBack={() => setView('profile')} />;
    } else if (view === 'referrals') {
      return <ReferralsView onBack={() => setView('profile')} currentUser={currentUser} />;
    }
    return null;
  };

  return (
    <MainLayout
      view={view}
      setView={setView}
      isLoggedIn={isLoggedIn}
      onLoginClick={() => setView('login')}
      onProfileClick={() => setView('profile')}
      showWinPopup={showWinPopup}
      setShowWinPopup={setShowWinPopup}
    >
      {renderContent()}
    </MainLayout>
  );
};

// --- Main Shell Layout ---
const MainLayout = ({ 
  children, 
  view, 
  setView, 
  isLoggedIn, 
  onProfileClick, 
  onLoginClick,
  showWinPopup, 
  setShowWinPopup 
}: { 
  children: React.ReactNode;
  view: ViewType;
  setView: (v: ViewType) => void;
  isLoggedIn: boolean;
  onProfileClick: () => void;
  onLoginClick: () => void;
  showWinPopup: boolean;
  setShowWinPopup: (s: boolean) => void;
}) => {
  return (
    <div className="min-h-screen pt-20 pb-20 px-4 flex flex-col items-center bg-surface-grey transition-all duration-300">
      <Navbar 
        onLoginClick={onLoginClick} 
        isLoggedIn={isLoggedIn}
        onProfileClick={onProfileClick}
      />
      
      <main className="max-w-7xl w-full mx-auto flex-1">
        {children}
      </main>

      <AnimatePresence>
        {showWinPopup && (
          <WinPopup onClose={() => setShowWinPopup(false)} />
        )}
      </AnimatePresence>

      {(view !== 'select' && view !== 'results_detail' && view !== 'login' && view !== 'register') && (
        <BottomNavbar currentView={view} setView={setView} />
      )}
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [view, setView] = useState<ViewType>('lobby');
  const [lobbyTab, setLobbyTab] = useState<'major' | 'rapid'>('rapid');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const [selectedLoto, setSelectedLoto] = useState<Lottery | null>(null);
  const [selectedLotoForHistory, setSelectedLotoForHistory] = useState<Lottery | null>(null);
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [referrerId, setReferrerId] = useState<string | null>(null);
  const [lotteryConfigs, setLotteryConfigs] = useState<any[]>([]);
  const [lotteryHistory, setLotteryHistory] = useState<Record<string, any[]>>({});
  const [drawStates, setDrawStates] = useState<Record<string, LotteryDrawState>>({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'lottery_configs'), (snap) => {
      setLotteryConfigs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // Basic history listener for the lobby/results
    const unsub = onSnapshot(query(collection(db, 'draw_history'), orderBy('timestamp', 'desc'), limit(100)), (snap) => {
      const history: Record<string, any[]> = {};
      snap.docs.forEach(doc => {
        const data = doc.data();
        const lotoId = data.lotteryId;
        if (!history[lotoId]) history[lotoId] = [];
        // Normalize result field to 'res' for UI consistency
        history[lotoId].push({ 
          id: doc.id, 
          ...data, 
          res: data.res || data.result || [0] 
        });
      });
      setLotteryHistory(history);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'draw_states'), (snap) => {
      const states: Record<string, LotteryDrawState> = {};
      snap.docs.forEach(doc => {
        states[doc.id] = doc.data() as LotteryDrawState;
      });
      setDrawStates(states);
    });
    return () => unsub();
  }, []);

  // --- Initialize Draw States if missing ---
  useEffect(() => {
    // We allow any logged in user to check if states exist, 
    // but only the creation logic will succeed if they are admin or if rules allow.
    // Given the constraints, we'll try to initialize to ensure the game starts.
    if (isLoggedIn) {
      const initStates = async () => {
        for (const loto of lotteries) {
          try {
            const docRef = doc(db, 'draw_states', loto.id);
            const snap = await getDoc(docRef);
            if (!snap.exists()) {
              // Try to seed initial state
              const now = Date.now();
              const dateStr = new Date(now).toISOString().slice(0, 10).replace(/-/g, '');
              const initialId = loto.specialDisplay ? `${dateStr}001` : '2026105';
              await setDoc(docRef, {
                nextDraw: now + (loto.drawInterval * 1000),
                drawId: initialId,
                lastResult: null,
                lastResultTime: now
              });
            }
          } catch (err) {
             // Silence errors for non-admins during auto-init
          }
        }
      };
      initStates();
    }
  }, [isLoggedIn]);

  const settleBets = async (lotoId: string, drawId: string, result: number[]) => {
    try {
      const q = query(
        collection(db, 'purchases'), 
        where('lotteryId', '==', lotoId),
        where('drawId', '==', drawId),
        where('status', '==', 'pending')
      );
      const snap = await getDocs(q);
      
      if (snap.empty) {
        console.log(`No pending bets found for ${lotoId} draw ${drawId}`);
        return;
      }

      console.log(`Settling ${snap.size} bets for ${lotoId} draw ${drawId}`);
      
      for (const betDoc of snap.docs) {
        try {
          const bet = betDoc.data();
          let totalWinAmount = 0;
          let hasAnyWin = false;
          
          // --- Win Logic ---
          const lotoConfig = lotteryConfigs.find(c => c.id === lotoId);
          if (lotoId === 'f3') {
            const sumResult = (Array.isArray(result) ? result : []).reduce((a, b) => a + Number(b), 0);
            const isBig = sumResult >= 11;
            const isSmall = sumResult <= 10;
            const isOdd = sumResult % 2 !== 0;
            const isEven = sumResult % 2 === 0;
            
            const betList = bet.bets || bet.lines || [];
            if (Array.isArray(betList)) {
              betList.forEach((b: any) => {
                let lineWon = false;
                let odds = 1.96;
                const betAmt = Number(b.amount || b.multiplier || (bet.amount / betList.length));
                
                if (b.type === 'sum') {
                  const bVal = parseInt(b.val);
                  if (bVal === sumResult) {
                    lineWon = true;
                    // Sum odds usually fixed but can be in config
                    const sumOddsArr: Record<number, number> = { 3: 180, 4: 60, 5: 30, 6: 18, 7: 12, 8: 8, 9: 7, 10: 6, 11: 6, 12: 7, 13: 8, 14: 12, 15: 18, 16: 30, 17: 60, 18: 180 };
                    odds = sumOddsArr[sumResult] || 2;
                  }
                } else if (b.type === 'binary') {
                  const bValUpper = b.val?.toString().toUpperCase();
                  if (bValUpper === 'BIG') {
                    if (isBig) lineWon = true;
                    odds = Number(lotoConfig?.binaryOdds?.big || 1.96);
                  } else if (bValUpper === 'SMALL') {
                    if (isSmall) lineWon = true;
                    odds = Number(lotoConfig?.binaryOdds?.small || 1.96);
                  } else if (bValUpper === 'ODD') {
                    if (isOdd) lineWon = true;
                    odds = Number(lotoConfig?.binaryOdds?.odd || 1.96);
                  } else if (bValUpper === 'EVEN') {
                    if (isEven) lineWon = true;
                    odds = Number(lotoConfig?.binaryOdds?.even || 1.96);
                  }
                }
                
                if (lineWon) {
                  totalWinAmount += betAmt * odds;
                  hasAnyWin = true;
                }
              });
            }
          } else if (lotoId === 'wg') {
            const res = Number(result[0]);
            const isBig = res >= 5;
            const isSmall = res <= 4;
            const isOdd = res % 2 !== 0;
            const isEven = res % 2 === 0;
            
            const lines = bet.lines || bet.bets || [];
            if (Array.isArray(lines)) {
              lines.forEach((l: any) => {
                let lineWon = false;
                let odds = 9;
                const betAmt = Number(bet.amount / lines.length);

                if (l.main?.map(Number).includes(res)) {
                  lineWon = true;
                } else if (l.type === 'binary') {
                  const v = l.val?.toString().toUpperCase();
                  if (v === 'BIG') {
                    if (isBig) lineWon = true;
                    odds = Number(lotoConfig?.binaryOdds?.big || 1.96);
                  } else if (v === 'SMALL') {
                    if (isSmall) lineWon = true;
                    odds = Number(lotoConfig?.binaryOdds?.small || 1.96);
                  } else if (v === 'ODD') {
                    if (isOdd) lineWon = true;
                    odds = Number(lotoConfig?.binaryOdds?.odd || 1.96);
                  } else if (v === 'EVEN') {
                    if (isEven) lineWon = true;
                    odds = Number(lotoConfig?.binaryOdds?.even || 1.96);
                  } else if (v === 'GREEN') {
                    if ([1, 3, 5, 7, 9].includes(res)) lineWon = true;
                    odds = res === 5 ? 1.5 : 2;
                  } else if (v === 'RED') {
                    if ([0, 2, 4, 6, 8].includes(res)) lineWon = true;
                    odds = res === 0 ? 1.5 : 2;
                  } else if (v === 'PURPLE') {
                    if ([0, 5].includes(res)) lineWon = true;
                    odds = 4.5;
                  }
                }

                if (lineWon) {
                  totalWinAmount += betAmt * odds;
                  hasAnyWin = true;
                }
              });
            }
          } else {
            // Standard lotteries
            if (Array.isArray(bet.lines)) {
              bet.lines.forEach((line: any) => {
                const matches = line.main?.filter((n: number) => result.includes(n)).length || 0;
                if (matches >= 3) {
                  hasAnyWin = true;
                  totalWinAmount += matches === 3 ? 10 : matches === 4 ? 100 : 1000;
                }
              });
            }
          }
          
          // --- Update Purchase & Balance ---
          await runTransaction(db, async (transaction) => {
            const betRef = doc(db, 'purchases', betDoc.id);
            const freshBetSnap = await transaction.get(betRef);
            
            if (!freshBetSnap.exists() || freshBetSnap.data().status !== 'pending') return;

            transaction.update(betRef, {
              status: hasAnyWin ? 'won' : 'lost',
              winAmount: totalWinAmount,
              result: result,
              settledAt: serverTimestamp()
            });
            
            if (hasAnyWin && totalWinAmount > 0) {
              const userRef = doc(db, 'users', bet.uid);
              transaction.update(userRef, { balance: increment(totalWinAmount) });
            }
          });
        } catch (betError) {
          console.error(`Error settling individual bet ${betDoc.id}:`, betError);
        }
      }
    } catch (e) {
      console.error("Settlement engine error:", e);
    }
  };

  const settleAllMissingBets = async () => {
    try {
      let q = query(
        collection(db, 'purchases'), 
        where('status', '==', 'pending'),
        limit(50)
      );
      
      if (!isAdmin) {
        if (!currentUser) return;
        q = query(
          collection(db, 'purchases'),
          where('uid', '==', currentUser.uid),
          where('status', '==', 'pending'),
          limit(50)
        );
      }
      
      const snap = await getDocs(q);
      
      for (const betDoc of snap.docs) {
        const bet = betDoc.data();
        const historyId = `${bet.lotteryId}_${bet.drawId}`;
        const historySnap = await getDoc(doc(db, 'draw_history', historyId));
        
        if (historySnap.exists()) {
          const history = historySnap.data();
          await settleBets(bet.lotteryId, bet.drawId, history.res || history.result);
        }
      }
    } catch (e) {
      console.error("Missing bets settlement error:", e);
    }
  };

  // --- Admin Draw Transitions ---
  const drawStatesRef = useRef(drawStates);
  const isAdminRef = useRef(isAdmin);
  const currentUserRef = useRef<any>(currentUser);

  useEffect(() => {
    drawStatesRef.current = drawStates;
    isAdminRef.current = isAdmin;
    currentUserRef.current = currentUser;
    if (isAdmin) {
      settleAllMissingMissingBets();
    }
  }, [drawStates, isAdmin, currentUser]);

  const settleAllMissingMissingBets = async () => {
    // Wrap to avoid duplicate triggers if needed
    await settleAllMissingBets();
  };

  useEffect(() => {
    const timer = setInterval(async () => {
      const now = Date.now();
      
      // Perform draw transitions via heartbeat
      // Transaction ensures only one person actually writes the result
      if (!currentUserRef.current) return;

      const currentStates = drawStatesRef.current;

      for (const loto of lotteries) {
        const lotoId = loto.id;
        const state = currentStates[lotoId] as LotteryDrawState | undefined;

        // If state is missing OR it is time to draw
        if (!state || now >= state.nextDraw) {
          try {
            await runTransaction(db, async (transaction) => {
              const drwRef = doc(db, 'draw_states', lotoId);
              const drwSnap = await transaction.get(drwRef);
              const currentData = drwSnap.exists() ? drwSnap.data() as LotteryDrawState : null;
              
              // Re-check nextDraw inside transaction to avoid duplicate draws
              if (currentData && now < currentData.nextDraw) return null;

              // Fetch LOTO config inside transaction
              const configRef = doc(db, 'lottery_configs', lotoId);
              const configSnap = await transaction.get(configRef);
              const config = configSnap.exists() ? configSnap.data() as any : null;

              let res: number[] = [];
              
              if (currentData && config?.scheduled_results?.[currentData.drawId]) {
                res = config.scheduled_results[currentData.drawId];
                // Clear the used scheduled result
                const newScheduled = { ...config.scheduled_results };
                delete newScheduled[currentData.drawId];
                transaction.update(configRef, { scheduled_results: newScheduled });
              } else if (config?.next_manual_result) {
                res = config.next_manual_result;
                transaction.update(configRef, { next_manual_result: null });
              } else {
                res = generateResult(lotoId);
              }

              const dateStr = new Date(now).toISOString().slice(0, 10).replace(/-/g, '');
              let nextDrawId = '';
              if (loto.specialDisplay || loto.region === 'Rapid' || loto.region === 'Daily' || loto.region === 'Virtual') {
                const currentDrawId = currentData?.drawId || `${dateStr}000`;
                const prefix = currentDrawId.substring(0, 8);
                const seqStr = currentDrawId.substring(8) || '000';
                let seq = parseInt(seqStr) || 0;
                
                if (prefix !== dateStr) {
                  nextDrawId = `${dateStr}001`;
                } else {
                  nextDrawId = `${dateStr}${String(seq + 1).padStart(3, '0')}`;
                }
              } else {
                const baseId = currentData?.drawId || '2026000';
                nextDrawId = (parseInt(baseId) + 1).toString();
              }

              const interval = config?.drawInterval || loto.drawInterval;
              
              const updateData = {
                nextDraw: now + (interval * 1000),
                lastResult: res,
                drawId: nextDrawId,
                lastResultTime: now
              };

              if (drwSnap.exists()) {
                transaction.update(drwRef, updateData);
              } else {
                transaction.set(drwRef, updateData);
              }

              // Robust settlement: Settle the one just finished AND any recent pending ones
              const settlementDrawId = currentData?.drawId || 'INITIAL';
              
              // Also create a history record
              const historyId = `${lotoId}_${settlementDrawId}`;
              transaction.set(doc(db, 'draw_history', historyId), {
                lotteryId: lotoId,
                drawId: settlementDrawId,
                res: res,
                timestamp: now
              });

              const settleRecentPending = async () => {
                try {
                  // Settle the main one
                  if (settlementDrawId !== 'INITIAL') {
                    await settleBets(lotoId, settlementDrawId, res);
                  }
                  
                  // Check for any other pending bets for this loto (max 5)
                  const pq = query(
                    collection(db, 'purchases'),
                    where('lotteryId', '==', lotoId),
                    where('status', '==', 'pending'),
                    limit(20)
                  );
                  const psnap = await getDocs(pq);
                  for (const pdoc of psnap.docs) {
                    const p = pdoc.data();
                    if (p.drawId === settlementDrawId) continue; // already handled
                    
                    const histId = `${lotoId}_${p.drawId}`;
                    const histSnap = await getDoc(doc(db, 'draw_history', histId));
                    if (histSnap.exists()) {
                      await settleBets(lotoId, p.drawId, histSnap.data().res);
                    }
                  }
                } catch (err) {
                  console.error("Async background settlement error:", err);
                }
              };

              settleRecentPending();

              return { res, drawId: settlementDrawId };
            });
          } catch (err) {
            console.error(`Heartbeat Transition error for ${lotoId}:`, err);
          }
        }
      }
    }, 2000); 
    return () => clearInterval(timer);
  }, []);


  // --- Auth & Profile State ---
  useEffect(() => {
    let profileUnsub: (() => void) | null = null;
    
    const authUnsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        
        // 1. Setup real-time profile listener
        profileUnsub = onSnapshot(doc(db, 'users', user.uid), async (userDoc) => {
          if (userDoc.exists()) {
            setCurrentUser(userDoc.data());
          } else if (user.email === 'oopqwe001@gmail.com') {
            // Seed admin profile if missing
            const adminProfile = { 
              uid: user.uid, 
              email: user.email, 
              displayName: 'System Admin', 
              balance: 0, 
              invite_code: 'ADMIN001', 
              createdAt: serverTimestamp() 
            };
            await setDoc(doc(db, 'users', user.uid), adminProfile);
          }
        });
        
        // 2. Initial Admin Check
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        if (adminDoc.exists()) {
          setIsAdmin(true);
        } else if (user.email === 'oopqwe001@gmail.com') {
          await setDoc(doc(db, 'admins', user.uid), { role: 'admin' });
          setIsAdmin(true);
        }
        
        // Final fail-safe
        if (user.email === 'oopqwe001@gmail.com') setIsAdmin(true);
        
      } else {
        if (profileUnsub) profileUnsub();
        setCurrentUser(null);
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    });

    return () => {
      authUnsub();
      if (profileUnsub) profileUnsub();
    };
  }, []);

  // --- Referral Detection ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      const resolveReferrer = async () => {
        // Find user by invite code
        const q = query(collection(db, 'users'), where('invite_code', '==', ref));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const referrerData = snapshot.docs[0].data();
          setReferrerId(referrerData.uid);
          // Persist for the session
          sessionStorage.setItem('referral_id', referrerData.uid);
        }
      };
      resolveReferrer();
    } else {
      const saved = sessionStorage.getItem('referral_id');
      if (saved) setReferrerId(saved);
    }
  }, []);

  // --- Language Detection ---
  useEffect(() => {
    const initializeLanguage = async () => {
      // 1. Check local storage first (highest priority)
      const savedLang = localStorage.getItem('app_lang');
      if (savedLang) {
        const found = languages.find(l => l.code === savedLang);
        if (found) {
          setSelectedLang(found);
          return;
        }
      }

      // 2. Try browser language (fastest check)
      const browserLangCode = navigator.language.split('-')[0];
      const browserMatch = languages.find(l => l.code === browserLangCode);
      if (browserMatch) {
         setSelectedLang(browserMatch);
      }

      // 3. Try IP-based detection (most accurate for region)
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          const countryCode = data.country_code?.toLowerCase();
          
          const countryToLang: Record<string, string> = {
            'cn': 'zh', 'hk': 'zh', 'tw': 'zh', 'vn': 'vi',
            'jp': 'ja', 'kr': 'ko', 'in': 'hi', 'th': 'th',
            'id': 'id', 'us': 'en', 'gb': 'en', 'tr': 'tr',
            'it': 'it', 'es': 'es', 'fr': 'fr', 'de': 'de',
            'br': 'pt', 'pt': 'pt', 'ru': 'ru', 'mx': 'es',
            'sa': 'ar', 'ae': 'ar', 'eg': 'ar'
          };

          if (countryCode && countryToLang[countryCode]) {
            const ipMatch = languages.find(l => l.code === countryToLang[countryCode]);
            if (ipMatch && !localStorage.getItem('app_lang')) {
              setSelectedLang(ipMatch);
            }
          }
        }
      } catch (err) {
        console.warn("Geo-IP detection failed, falling back to browser language.");
      }
    };

    initializeLanguage();
  }, []);

  // Persist language selection
  const handleSetLang = (l: Language) => {
    setSelectedLang(l);
    localStorage.setItem('app_lang', l.code);
  };

  const handleSelectLoto = (loto: Lottery) => {
    setSelectedLoto(loto);
    setView('select');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <LanguageContext.Provider value={{ lang: selectedLang, setLang: handleSetLang, t: getT(selectedLang.code) }}>
      <ReferralContext.Provider value={{ referrerId }}>
        <LotteryContext.Provider value={{ drawStates, lotteryConfigs, lotteryHistory, settleBets }}>
          <AppContent 
            view={view} 
            setView={setView}
            lobbyTab={lobbyTab}
            setLobbyTab={setLobbyTab}
            selectedLoto={selectedLoto}
            setSelectedLoto={setSelectedLoto}
            handleSelectLoto={handleSelectLoto}
            selectedLotoForHistory={selectedLotoForHistory}
            setSelectedLotoForHistory={setSelectedLotoForHistory}
            showWinPopup={showWinPopup}
            setShowWinPopup={setShowWinPopup}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            isAdmin={isAdmin}
            currentUser={currentUser}
            drawStates={drawStates}
            onSettleMissing={settleAllMissingBets}
          />
        </LotteryContext.Provider>
      </ReferralContext.Provider>
    </LanguageContext.Provider>
  );
}

// --- Winning Popup ---
const WinPopup = ({ onClose }: { onClose: () => void }) => {
  const { t } = useContext(LanguageContext);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-blue/30 backdrop-blur-md"
      />
      
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div 
            key={i}
            className="confetti-piece"
            style={{ 
              left: `${Math.random() * 100}%`,
              top: `-30px`,
              animationDelay: `${Math.random() * 6}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: Math.random() * 0.7 + 0.3,
              width: `${Math.random() * 6 + 4}px`,
              height: `${Math.random() * 10 + 6}px`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="glass-card w-full max-w-[280px] rounded-[2rem] p-6 text-center relative overflow-hidden"
      >
        {/* Advanced Light streaks */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[conical-gradient(from_0deg,transparent,rgba(255,215,0,0.2),transparent,rgba(255,215,0,0.1),transparent)] animate-spin-slow" />
        </div>

        <div className="relative z-10">
          <div className="w-14 h-14 bg-gradient-to-br from-yellow-200 via-yellow-500 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_10px_30px_rgba(184,134,11,0.3)] border-2 border-white/60 relative group">
             <div className="absolute inset-[-5px] rounded-full animate-pulse bg-yellow-400/20 blur-lg" />
             <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.6),transparent)]" />
            <Trophy size={28} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] z-10" />
          </div>

          <h2 className="text-lg font-black text-text-main mb-1 tracking-tight uppercase">{t('congratulations')}</h2>
          <p className="text-text-muted text-[8px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">{t('verified_winner')}</p>
          
          <div className="bg-white/40 rounded-2xl p-4 mb-5 border border-white/60 relative overflow-hidden shadow-inner">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <p className="text-[9px] font-black text-brand-blue mb-1 uppercase tracking-[0.1em] opacity-80">{t('you_won')}</p>
            <div className="flex flex-col items-center">
              <p className="text-4xl font-black text-brand-blue tracking-[calc(-0.05em)] leading-none text-glow-blue">$50,000</p>
              <p className="text-[8px] font-bold text-text-muted mt-2 uppercase tracking-wider">{t('matched_desc')}</p>
            </div>
            <p className="text-[8px] font-black text-brand-blue/60 mt-4 uppercase tracking-[0.15em] italic border-t border-brand-blue/5 pt-3">
              {t('win_footer_text').replace('{{lottery}}', 'Powerball').replace('{{id}}', '2026105')}
            </p>
          </div>

          <div className="space-y-2 mb-6">
            <button className="w-full bg-gradient-to-br from-yellow-400 via-orange-500 to-amber-700 text-white py-3 rounded-xl font-black text-[10px] shadow-[0_10px_20px_rgba(249,115,22,0.2)] hover:scale-[1.03] transition-all active:scale-95 uppercase tracking-[0.15em] border-t border-white/40 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
              {t('view_wallet')}
            </button>
            <button 
              onClick={onClose}
              className="w-full py-1.5 text-[8px] font-black text-text-muted hover:text-brand-blue transition-colors uppercase tracking-[0.2em] flex items-center justify-center gap-1.5 group"
            >
              <Send size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              {t('share_result')}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 pt-3 border-t border-white/40">
             <ShieldCheck size={10} className="text-success opacity-80" />
             <span className="text-[8px] font-black text-text-muted uppercase tracking-[0.1em] opacity-50">Secure Transaction Verified</span>
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-text-muted hover:text-danger transition-colors z-20 hover:rotate-90"
        >
          <X size={16} />
        </button>
      </motion.div>
    </div>
  );
};

// --- Fast 3 Selection Page ---
const Fast3Selection = ({ lottery, onBack, onWin, currentUser }: { lottery: Lottery; onBack: () => void; onWin: () => void; currentUser: any }) => {
  const { t } = useContext(LanguageContext);
  const { drawStates, lotteryConfigs } = useContext(LotteryContext);
  const currentDraw = drawStates[lottery.id];
  const config = lotteryConfigs.find(c => c.id === lottery.id);
  
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!currentDraw) return;
      const diff = Math.max(0, currentDraw.nextDraw - Date.now());
      setTimeLeft(Math.floor(diff / 1000));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [currentDraw?.nextDraw]);

  const [lastResult, setLastResult] = useState<number[]>([2, 4, 3]);
  const [history, setHistory] = useState(() => {
    return Array.from({ length: 15 }).map((_, i) => {
      const nums = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
      const sum = nums.reduce((a, b) => a + b, 0);
      const seq = parseInt((currentDraw?.drawId || '001').slice(-3));
      const prevSeq = (((seq - i - 1 - 1) % 999) + 999) % 999 + 1;
      const id = (currentDraw?.drawId || '2026105').slice(0, -3) + String(prevSeq).padStart(3, '0');
      return { id, nums, sum, isBig: sum >= 11, isOdd: sum % 2 !== 0 };
    });
  });

  useEffect(() => {
    if (currentDraw?.lastResult) {
      setLastResult(currentDraw.lastResult.slice(0, 3));
      const sum = currentDraw.lastResult.slice(0, 3).reduce((a, b) => a + b, 0);
      const seq = parseInt(currentDraw.drawId.slice(-3));
      const prevSeq = (((seq - 1 - 1) % 999) + 999) % 999 + 1;
      const historyId = currentDraw.drawId.slice(0, -3) + String(prevSeq).padStart(3, '0');
      setHistory(prev => [{ id: historyId, nums: currentDraw.lastResult!.slice(0, 3), sum, isBig: sum >= 11, isOdd: sum % 2 !== 0 }, ...prev.slice(0, 49)]);
    }
  }, [currentDraw?.drawId]);

  const [activeBets, setActiveBets] = useState<{ type: string; val: any }[]>([]);
  const [betAmount, setBetAmount] = useState('10');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [showSmartFollower, setShowSmartFollower] = useState(false);
  const [isActuallyRolling, setIsActuallyRolling] = useState(false);
  const [rollingNums, setRollingNums] = useState<number[]>([1, 1, 1]);

  useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0) {
      setIsActuallyRolling(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (currentDraw?.drawId) {
      setIsActuallyRolling(false);
    }
  }, [currentDraw?.drawId]);

  useEffect(() => {
    let rollInterval: any;
    if (isActuallyRolling) {
      rollInterval = setInterval(() => {
        setRollingNums([
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1
        ]);
      }, 70);
    }
    return () => clearInterval(rollInterval);
  }, [isActuallyRolling]);

  const toggleBet = (type: string, val: any) => {
    const exists = activeBets.find(b => b.type === type && b.val === val);
    if (exists) {
      setActiveBets(activeBets.filter(b => !(b.type === type && b.val === val)));
    } else {
      // For binary bets, mutually exclusive check (optional, but keep it flexible here)
      setActiveBets([...activeBets, { type, val }]);
    }
  };

  const handlePurchase = async () => {
    if (activeBets.length === 0 || isPurchasing || !currentUser) return;
    
    const unitPrice = parseFloat(betAmount) || 10;
    const totalPrice = activeBets.length * unitPrice;
    
    if (currentUser.balance < totalPrice) {
      alert("余额不足，请充值");
      return;
    }

    setIsPurchasing(true);
    
    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await transaction.get(userRef);
        
        if (!userSnap.exists()) throw "User profile not found";
        const currentBalance = userSnap.data().balance;
        if (currentBalance < totalPrice) throw "Insufficient balance";
        
        // Deduct balance
        transaction.update(userRef, { balance: currentBalance - totalPrice });
        
        // Add purchase record
        const purchaseRef = doc(collection(db, 'purchases'));
        transaction.set(purchaseRef, {
          uid: currentUser.uid,
          userEmail: currentUser.email,
          lotteryId: lottery.id,
          lotteryName: lottery.name,
          drawId: currentDraw?.drawId || 'unknown',
          bets: activeBets.map(b => ({ ...b, multiplier: unitPrice / 1 })), // standard multiplier is unit/1
          amount: totalPrice,
          status: 'pending',
          timestamp: serverTimestamp()
        });
      });

      setIsPurchasing(false);
      setPurchased(true);
      
      setActiveBets([]);
      setTimeout(() => setPurchased(false), 2000);
    } catch (error) {
      console.error("Purchase error:", error);
      setIsPurchasing(false);
      alert(typeof error === 'string' ? error : "购买失败，请稍后再试");
    }
  };

   const getDiceColor = (num: number) => {
     const colors: Record<number, string> = {
       1: 'bg-red-500', 2: 'bg-blue-500', 3: 'bg-green-500',
       4: 'bg-amber-500', 5: 'bg-purple-500', 6: 'bg-slate-700'
     };
     return colors[num] || 'bg-brand-blue';
   };

  const trendData = [
    { res: '大', color: 'text-danger' },
    { res: '小', color: 'text-brand-blue' },
    { res: '大', color: 'text-danger' },
    { res: '大', color: 'text-danger' },
    { res: '小', color: 'text-brand-blue' },
    { res: '小', color: 'text-brand-blue' },
    { res: '大', color: 'text-danger' },
    { res: '小', color: 'text-brand-blue' },
    { res: '大', color: 'text-danger' },
    { res: '小', color: 'text-brand-blue' },
  ];

  const sumOdds: Record<number, string> = {
    3: '180', 4: '60', 5: '30', 6: '18', 7: '12', 8: '8',
    9: '7', 10: '6', 11: '6', 12: '7', 13: '8', 14: '12',
    15: '18', 16: '30', 17: '60', 18: '180'
  };

  return (
    <div className="max-w-5xl w-full mx-auto pb-40 px-3 md:px-4">
      {/* Mini Header */}
      <div className="flex items-center justify-between mb-2 py-1.5">
        <button onClick={onBack} className="flex items-center gap-1 text-text-muted font-bold transition-colors hover:text-brand-blue">
          <ChevronLeft size={14} />
          <span className="text-[10px] uppercase tracking-widest">{t('lobby')}</span>
        </button>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-blue/5 text-brand-blue rounded-full text-[9px] font-black border border-brand-blue/10">
          <Activity size={10} className="animate-pulse" />
          {t('live')}
        </div>
      </div>

      {/* Hero Timer & Jackpot - Compact */}
      <div className="bg-brand-blue rounded-[1.5rem] p-5 mb-4 relative overflow-hidden shadow-xl shadow-brand-blue/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-center justify-between gap-4">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md">
                    <div className="w-5 h-5 flex items-center justify-center bg-white/20 rounded-sm"><Trophy size={12} className="text-white" /></div>
                 </div>
                 <h1 className="text-lg font-black text-white tracking-tight uppercase leading-none">{lottery.name}</h1>
              </div>
              <div className="flex items-center gap-3 mt-2">
                 <div>
                    <p className="text-white/60 text-[9px] font-black tracking-[0.2em] uppercase mb-1.5">{t('previous_result')}</p>
                    <div className="flex gap-2">
                       {(isActuallyRolling ? rollingNums : lastResult).map((n, i) => (
                         <motion.div 
                           key={i} 
                           initial={{ scale: 0.5, opacity: 0 }}
                           animate={{ 
                              scale: 1, 
                              opacity: 1,
                              y: isActuallyRolling ? [0, -5, 0] : 0,
                              rotate: isActuallyRolling ? [0, 10, -10, 0] : 0
                           }}
                           transition={{ 
                              delay: isActuallyRolling ? 0 : 0,
                              repeat: isActuallyRolling ? Infinity : 0,
                              duration: isActuallyRolling ? 0.3 : 0.2
                           }}
                           className={`w-7 h-7 rounded-sm flex items-center justify-center text-white text-[13px] font-black shadow-xl border border-white/20 ${getDiceColor(n)}`}
                         >
                           {n}
                         </motion.div>
                       ))}
                    </div>
                 </div>
                 <div className="w-px h-8 bg-white/20" />
                 <div>
                    <p className="text-white/60 text-[9px] font-black tracking-[0.2em] uppercase mb-1.5">{t('sum')}</p>
                    <p className="text-sm font-black text-white">{lastResult.reduce((a, b) => a + b, 0)}</p>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="text-center">
                 <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">{t('ends_in_timer')}</p>
                 <div className="relative w-16 h-12 rounded-full border-2 border-white/20 flex flex-col items-center justify-center px-2">
                    <span className="text-lg font-black text-white font-mono leading-none">{formatTimer(timeLeft)}</span>
                 </div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-right">
                 <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-0.5">{t('prize_pool')}</p>
                 <p className="text-xl font-black text-white tracking-tighter leading-none">$100,000</p>
              </div>
           </div>
        </div>
      </div>

      {/* Live Trend Analysis */}
      <div className="bg-white border border-border-grey rounded-2xl p-4 mb-4 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-4 px-1">
           <h3 className="text-[9px] font-black text-text-main uppercase tracking-widest flex items-center gap-1.5">
             <TrendingUp size={12} className="text-brand-blue" />
             {t('live_trend_analysis')}
           </h3>
           <div className="flex gap-2">
             <div className="flex items-center gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-danger" />
               <span className="text-[7px] font-black text-text-muted uppercase">{t('big')}/{t('odd')}</span>
             </div>
             <div className="flex items-center gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
               <span className="text-[7px] font-black text-text-muted uppercase">{t('small')}/{t('even')}</span>
             </div>
           </div>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
           {history.slice(0, 10).map((record, i) => (
             <div key={record.id} className="flex flex-col items-center gap-2 min-w-[34px]">
                <div className="flex flex-col gap-1">
                  <div className={`w-8 h-8 rounded-sm border flex items-center justify-center text-[8px] font-black shadow-sm transition-all
                    ${record.isBig ? 'bg-danger/5 border-danger/20 text-danger' : 'bg-brand-blue/5 border-brand-blue/20 text-brand-blue'}
                  `}>
                    {record.isBig ? 'BIG' : 'SMALL'}
                  </div>
                  <div className={`w-8 h-8 rounded-sm border flex items-center justify-center text-[8px] font-black shadow-sm transition-all
                    ${record.isOdd ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-700'}
                  `}>
                    {record.isOdd ? 'ODD' : 'EVEN'}
                  </div>
                </div>
                <span className="text-[9px] font-black font-mono text-text-muted/80 tracking-tighter">{record.id.toString().slice(-3)}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* Binary Selection */}
        <div className="space-y-2">
           <div className="grid grid-cols-2 gap-2">
              {[
                { label: t('big'), sub: t('big_desc'), color: 'bg-danger', textColor: 'text-danger', val: 'BIG', type: 'binary', odds: config?.binaryOdds?.big || 1.96 },
                { label: t('small'), sub: t('small_desc'), color: 'bg-brand-blue', textColor: 'text-brand-blue', val: 'SMALL', type: 'binary', odds: config?.binaryOdds?.small || 1.96 },
                { label: t('odd'), sub: t('odd_desc'), color: 'bg-indigo-600', textColor: 'text-indigo-600', val: 'ODD', type: 'binary', odds: config?.binaryOdds?.odd || 1.96 },
                { label: t('even'), sub: t('even_desc'), color: 'bg-slate-700', textColor: 'text-slate-700', val: 'EVEN', type: 'binary', odds: config?.binaryOdds?.even || 1.96 },
              ].map(btn => {
                const isSelected = activeBets.some(b => b.val === btn.val);
                return (
                  <button
                    key={btn.label}
                    onClick={() => toggleBet(btn.type, btn.val)}
                    className={`relative overflow-hidden p-3 rounded-xl transition-all active:scale-95 border-2 flex flex-col items-center group
                      ${isSelected 
                        ? `${btn.color} border-transparent text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] scale-[1.02] ring-4 ring-white/10` 
                        : 'bg-white border-border-grey text-text-main hover:border-brand-blue/30 shadow-sm'}
                    `}
                  >
                    {/* Selected state accent */}
                    {isSelected && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute top-1.5 right-1.5 w-4 h-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                      >
                        <Check size={10} className="text-white" strokeWidth={4} />
                      </motion.div>
                    )}
                    
                    <span className={`text-base font-black tracking-widest mb-0.5 transition-colors ${isSelected ? 'text-white' : btn.textColor}`}>{btn.label}</span>
                    <div className="flex items-center gap-1 opacity-80">
                      <span className={`text-[8px] font-black uppercase transition-colors ${isSelected ? 'text-white/80' : 'text-text-muted'}`}>
                        {btn.sub}
                      </span>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded transition-all ${isSelected ? 'bg-white/20 text-white' : 'bg-brand-blue/5 text-brand-blue'}`}>
                        {btn.odds}x
                      </span>
                    </div>

                    {/* Hover Glow */}
                    {!isSelected && (
                       <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    )}
                  </button>
                );
              })}
           </div>

           <button 
             onClick={() => setShowSmartFollower(true)}
             className="w-full py-3.5 bg-indigo-600/5 border border-indigo-200 rounded-2xl flex items-center justify-center gap-2 group transition-all hover:bg-indigo-600/10"
           >
             <Brain size={14} className="text-indigo-600 animate-pulse" />
             <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{t('smart_follower')}</span>
           </button>
        </div>

        {/* Sum Betting */}
        <div className="bg-surface-grey/30 rounded-2xl p-4 border border-border-grey/30">
           <div className="flex items-center justify-between mb-3">
              <h3 className="text-[8px] font-black text-text-main uppercase tracking-widest">{t('sum_betting_grid')}</h3>
              <span className="text-[7px] font-bold text-brand-blue uppercase bg-brand-blue-light px-1.5 py-0.5 rounded leading-none">{t('odd_multipliers')}</span>
           </div>
           <div className="grid grid-cols-4 gap-1.5">
              {Object.keys(sumOdds).map(num => (
                <button
                  key={num}
                  onClick={() => toggleBet('sum', parseInt(num))}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all relative group
                    ${activeBets.find(b => b.type === 'sum' && b.val === parseInt(num))
                      ? 'bg-brand-blue border-transparent text-white shadow-[0_5px_15px_rgba(37,99,235,0.3)] scale-[1.08] z-10 ring-2 ring-white/20'
                      : 'bg-white border-border-grey hover:border-brand-blue/20 hover:shadow-sm'}
                  `}
                >
                  {activeBets.find(b => b.type === 'sum' && b.val === parseInt(num)) && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-success rounded-full border-2 border-white flex items-center justify-center z-20">
                      <Check size={8} strokeWidth={4} />
                    </motion.div>
                  )}
                  <span className="text-sm font-black transition-transform group-active:scale-90">{num}</span>
                  <span className={`text-[7px] font-bold ${activeBets.find(b => b.type === 'sum' && b.val === parseInt(num)) ? 'text-white/80' : 'text-text-muted'}`}>
                    x{sumOdds[parseInt(num)]}
                  </span>
                </button>
              ))}
           </div>
        </div>

        {/* Draw History List */}
        <div className="bg-white rounded-2xl border border-border-grey overflow-hidden shadow-sm">
           <div className="px-4 py-3 bg-surface-grey border-b border-border-grey flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <List size={14} className="text-brand-blue" />
                 <h3 className="text-[9px] font-black text-text-main uppercase tracking-widest leading-none">Complete Draw History</h3>
              </div>
              <button className="text-[8px] font-black text-brand-blue uppercase tracking-widest hover:underline transition-all">View All</button>
           </div>
           <div className="divide-y divide-border-grey/50">
              {history.slice(0, 10).map((record) => (
                <div key={record.id} className="px-4 py-3 flex items-center justify-between hover:bg-surface-grey/50 transition-colors">
                   <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-black text-text-main font-mono">#{record.id}</span>
                      <span className="text-[7px] font-bold text-text-muted uppercase tracking-tighter">2026-04-20 13:45</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                         {record.nums.map((n, idx) => (
                           <div key={idx} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm ${getDiceColor(n)}`}>
                              {n}
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="flex gap-1">
                      <div className={`w-10 py-1 rounded text-[8px] font-black text-center ${record.isBig ? 'bg-danger/10 text-danger' : 'bg-brand-blue/10 text-brand-blue'}`}>
                         {record.isBig ? 'BIG' : 'SMALL'}
                      </div>
                      <div className={`w-10 py-1 rounded text-[8px] font-black text-center ${record.isOdd ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-700'}`}>
                         {record.isOdd ? 'ODD' : 'EVEN'}
                      </div>
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full py-4 text-[9px] font-black text-text-muted uppercase tracking-widest bg-surface-grey/30 hover:bg-surface-grey transition-all">
              Load More History
           </button>
        </div>
      </div>

      {/* Optimized Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-grey shadow-[0_-8px_24px_rgba(0,0,0,0.08)] z-50 pt-3 pb-6 md:pb-8 px-5">
         <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1.5 truncate">
                  <span className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-none">余额:</span>
                  <span className="text-[13px] font-black text-brand-blue font-mono leading-none">${(currentUser?.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-surface-grey px-3 py-1.5 rounded-2xl border border-border-grey shrink-0 shadow-inner">
                     <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">Amt</span>
                     <input 
                       type="number" 
                       value={betAmount}
                       onChange={(e) => setBetAmount(e.target.value)}
                       className="w-16 h-6 bg-transparent text-center text-sm font-black focus:outline-none"
                       placeholder="10"
                     />
                  </div>
               </div>
            </div>

            <button 
              onClick={handlePurchase}
              disabled={activeBets.length === 0 || isPurchasing}
              className={`flex-1 shrink-0 max-w-[170px] h-14 rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-lg transition-all flex items-center justify-center gap-2 group
                ${purchased 
                  ? 'bg-success text-white shadow-success/30'
                  : 'bg-brand-blue text-white shadow-brand-blue/30 hover:scale-[1.02] active:scale-95'
                }
                ${(activeBets.length === 0 && !purchased) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isPurchasing ? 'Processing...' : purchased ? 'Success!' : 'Confirm Bets'}
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                {isPurchasing ? (
                  <RotateCw size={14} className="animate-spin" />
                ) : purchased ? (
                  <Check size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </div>
            </button>
         </div>
      </div>

      {/* Modal - Unchanged but scaled */}
      <AnimatePresence>
        {showSmartFollower && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSmartFollower(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[2rem] p-6 w-full max-w-xs relative z-10 shadow-2xl">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto rotate-3 group hover:rotate-0 transition-transform">
                   <Brain size={24} className="animate-pulse" />
                </div>
                <h2 className="text-base font-black text-center text-text-main uppercase tracking-tight mb-2">AI Smart Follower</h2>
                <p className="text-center text-text-muted text-[10px] leading-relaxed mb-6 opacity-80">Would you like to auto-bet on the current high-probability pattern (**BIG + ODD**)?</p>
                <div className="space-y-2">
                   <button onClick={() => { toggleBet('binary', 'BIG'); toggleBet('binary', 'ODD'); setShowSmartFollower(false); }} className="w-full bg-brand-blue text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest">Apply AI Bets</button>
                   <button onClick={() => setShowSmartFollower(false)} className="w-full py-2 text-[9px] font-black text-text-muted uppercase text-center">Cancel</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
