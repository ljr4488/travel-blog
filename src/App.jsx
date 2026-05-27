import './style.css'

import { useCallback, useEffect, useRef, useState } from 'react'
import { isSupabaseConfigured, supabase } from './supabase'

const trips = [
  {
    day: 'Day 1',
    city: 'Seoul to Shanghai',
    date: '2026.06.12',
    title: '상해 도착',
    schedule: [
      { time: '06:50 - 00:02', plan: '지하철', destination: '올림픽공원역', note: '' },
      { time: '07:01 - 01:40', plan: '공항버스', destination: '인천국제공항 2터미널', note: '올림픽선수촌 탑승' },
      { time: '11:10 - 02:15', plan: '비행', destination: '푸동국제공항 1터미널', note: '' },
      { time: '14:00 - 00:50', plan: '숙소 이동', destination: '상하이 센트럴 호텔', note: '택시' },
      { time: '14:50 - 00:10', plan: '체크인', note: '' },
      { time: '15:00 - 01:00', plan: '점심', destination: 'SMP몰', note: '点都德(白玉兰店)' },
      { time: '16:00 - 01:00', plan: '쇼핑', destination: 'SMP몰', note: '핸드크림' },
      { time: '17:00 - 01:30', plan: '숙소', note: '휴식' },
      { time: '18:30 - 02:30', plan: '관광', note: '와이탄 & 황푸강' },
      { time: '21:00 - 01:30', plan: '저녁', destination: '헌지우이치엔(광음광장점)', note: '' },
    ],
  },
  {
    day: 'Day 2',
    city: 'Shanghai',
    date: '2026.06.13',
    title: '쇼핑과 관광',
    schedule: [
      { time: '09:00 - 01:00', plan: '아침', destination: '산동잡곡전병', note: '' },
      { time: '10:00 - 00:30', plan: '카페', destination: 'CHAGEE', note: '' },
      { time: '10:30 - 01:30', plan: '숙소', note: '휴식 or 운동' },
      { time: '12:00 - 01:00', plan: '점심', destination: '홍쿠이지아', note: '' },
      { time: '13:00 - 01:00', plan: '카페', destination: '상하이 스타벅스 리저브', note: '' },
      { time: '14:00 - 01:30', plan: '쇼핑', destination: '따룬파마트', note: '大润发(平型关店)' },
      { time: '15:30 - 01:30', plan: '숙소', note: '휴식' },
      { time: '17:00 - 01:00', plan: '쇼핑', destination: '미니소랜드', note: '' },
      { time: '18:00 - 01:30', plan: '관광', destination: '예원', note: '' },
      { time: '19:30 - 01:00', plan: '저녁', destination: '상하이 그랜드마더', note: '' },
    ],
  },
  {
    day: 'Day 3',
    city: 'Shanghai',
    date: '2026.06.14',
    title: '관광과 쇼핑',
    schedule: [
      { time: '09:00 - 01:00', plan: '아침', destination: '', note: '또우장 & 요우티아오' },
      { time: '10:00 - 01:00', plan: '숙소', note: '' },
      { time: '11:00 - 01:00', plan: '관광', destination: '우캉멘션', note: '' },
      { time: '12:00 - 01:00', plan: '점심', destination: '라오지스', note: '' },
      { time: '13:00 - 01:00', plan: '관광', destination: '신천지 임시정부', note: '' },
      { time: '14:00 - 02:00', plan: '쇼핑', destination: '티엔즈팡', note: '홀리랜드, 핸드크림' },
      { time: '16:00 - 01:00', plan: '숙소', note: '' },
      { time: '17:00 - 01:00', plan: '저녁', destination: '신세계백화점', note: '좌정우원(훠궈)' },
      { time: '18:00 - 01:00', plan: '쇼핑', destination: '신세계백화점', note: '' },
      { time: '19:00 - 01:00', plan: '휴식', destination: '도원향(난징동루점)', note: '발 마사지' },      
    ],
  },
  {
    day: 'Day 4',
    city: 'Shanghai to Seoul',
    date: '2026.06.15',
    title: '마지막 날, 서울로 이동',
    schedule: [
      { time: '09:00 - 01:00', plan: '아침', destination: '장씨네 게살국수', note: '' },
      { time: '10:00 - 00:30', plan: '쇼핑', destination: '미니소랜드', note: '' },
      { time: '10:30 - 00:30', plan: '숙소', destination: '상하이 센트럴 호텔', note: '체크아웃' },
      { time: '11:00 - 00:50', plan: '공항 이동', destination: '푸동국제공항 1터미널', note: '' },
      { time: '11:50 - 02:05', plan: '비행', destination: '인천국제공항 2터미널', note: '16:45분 도착' },
    ],
  },
]

const notes = [
  { label: 'Budget', value: '₩1,000,000' },
  { label: 'Travelers', value: '2 people' },
]

const TRAVEL_CHECKLIST_STORAGE_KEY = 'shanghai-travel-checklist'

const travelChecklist = [
  { id: 'passport', label: '여권 유효기간 확인' },
  { id: 'flight', label: '항공권 예약 확인' },
  { id: 'hotel', label: '숙소 예약 바우처 준비' },
  { id: 'insurance', label: '여행자 보험 가입' },
  { id: 'esim', label: 'eSIM 설정' },
  { id: 'payment', label: '해외 결제 카드 확인' },
  { id: 'apps', label: '고덕지도, 알리페이, 위챗, 파파고, 디디(택시)' },
  { id: 'medicine', label: '상비약 챙기기(정로환, 타이레놀, 알레그라 등)' },
  { id: 'power', label: '보조배터리와 충전기, 멀티 어댑터 챙기기' },
  { id: 'weather', label: '출발 전 날씨 확인' },
]

const routeDays = [
  {
    id: 'day1',
    label: '1일차',
    routes: [
      { from: '상하이센트럴호텔', to: 'SMP몰', taxiTime: '14분', taxiDistance: '3km', taxiFare: '15Y' ,walkTime: '37분', walkDistance: '2.8km' },
      { from: 'SMP몰', to: '상하이센트럴호텔', taxiTime: '14분', taxiDistance: '3.2km', taxiFare: '15Y', walkTime: '38분', walkDistance: '2.8km' },
      { from: '상하이센트럴호텔', to: '황푸강 유람선 선착장', taxiTime: '12분', taxiDistance: '1.8km', taxiFare: '12Y', walkTime: '21분', walkDistance: '1.5km' },
      { from: '황푸강 유람선 선착장', to: '헌지우이치엔(광음광장점)', taxiTime: '15분', taxiDistance: '5.2km', taxiFare: '19Y', walkTime: '45분', walkDistance: '3.3km' },
      { from: '헌지우이치엔(광음광장점)', to: '상하이센트럴호텔', taxiTime: '15분', taxiDistance: '5.3km', taxiFare: '22Y', walkTime: '72분', walkDistance: '5.4km' },
    ],
  },
  {
    id: 'day2',
    label: '2일차',
    routes: [
      { from: '상하이센트럴호텔', to: '산동잡곡전병', taxiTime: '', taxiDistance: '', taxiFare: '', walkTime: '7분', walkDistance: '480m' },
      { from: '산동잡곡전병', to: 'CHAGEE', taxiTime: '', taxiDistance: '', taxiFare: '', walkTime: '6분', walkDistance: '424m' },
      { from: 'CHAGEE', to: '상하이센트럴호텔', taxiTime: '', taxiDistance: '', taxiFare: '', walkTime: '3분', walkDistance: '163m' },
      { from: '상하이센트럴호텔', to: '홍쿠이지아', taxiTime: '11분', taxiDistance: '1.4km', taxiFare: '15Y', walkTime: '14분', walkDistance: '1km' },
      { from: '홍쿠이지아', to: '상하이 스타벅스 리저브', taxiTime: '16분', taxiDistance: '3km', taxiFare: '18Y', walkTime: '29분', walkDistance: '2.2km' },
      { from: '상하이 스타벅스 리저브', to: '따룬파 마트', taxiTime: '19분', taxiDistance: '5km', taxiFare: '19Y', walkTime: '57분', walkDistance: '4.3km' },
      { from: '따룬파 마트', to: '상하이센트럴호텔', taxiTime: '19분', taxiDistance: '4.6km', taxiFare: '22Y', walkTime: '60분', walkDistance: '4.5km' },
      { from: '상하이센트럴호텔', to: '미니소랜드', taxiTime: '', taxiDistance: '', taxiFare: '', walkTime: '5분', walkDistance: '348m' },
      { from: '미니소랜드', to: '예원', taxiTime: '15분', taxiDistance: '1.8km', taxiFare: '13Y', walkTime: '25분', walkDistance: '1.8km' },
      { from: '예원', to: '상하이 그랜드마더', taxiTime: '15분', taxiDistance: '2.6km', taxiFare: '13Y', walkTime: '23분', walkDistance: '1.7km' },
      { from: '상하이 그랜드마더', to: '상하이센트럴호텔', taxiTime: '', taxiDistance: '', taxiFare: '', walkTime: '5분', walkDistance: '320m' },
    ],
  },
  {
    id: 'day3',
    label: '3일차',
    routes: [
      { from: '상하이센트럴호텔', to: '우캉멘션', taxiTime: '29분', taxiDistance: '6.8km', taxiFare: '30Y', walkTime: '79분', walkDistance: '6km' },
      { from: '우캉멘션', to: '라오지스', taxiTime: '', taxiDistance: '', taxiFare: '', walkTime: '3분', walkDistance: '188m' },
      { from: '라오지스', to: '신천지 임시정부', taxiTime: '25분', taxiDistance: '4.5km', taxiFare: '25Y', walkTime: '55분', walkDistance: '4.1km' },
      { from: '신천지 임시정부', to: '티엔즈팡', taxiTime: '15분', taxiDistance: '2.4km', taxiFare: '17Y', walkTime: '24분', walkDistance: '1.7km' },
      { from: '티엔즈팡', to: '상하이센트럴호텔', taxiTime: '19분', taxiDistance: '4.3km', taxiFare: '22Y', walkTime: '53분', walkDistance: '3.9km' },
      { from: '상하이센트럴호텔', to: '신세계 백화점', taxiTime: '8분', taxiDistance: '1km', taxiFare: '', walkTime: '12분', walkDistance: '864m' },
      { from: '신세계 백화점', to: '도원향(난징동루점)', taxiTime: '', taxiDistance: '', taxiFare: '', walkTime: '8분', walkDistance: '463m' },
      { from: '도원향(난징동루점)', to: '상하이센트럴호텔', taxiTime: '', taxiDistance: '', taxiFare: '', walkTime: '5분', walkDistance: '293m' },
    ],
  },
  {
    id: 'day4',
    label: '4일차',
    routes: [
      { from: '상하이센트럴호텔', to: '장씨네 게살국수', taxiTime: '9분', taxiDistance: '1.4km', taxiFare: '', walkTime: '13분', walkDistance: '949m' },
      { from: '장씨네 게살국수', to: '미니소랜드', taxiTime: '8분', taxiDistance: '1.1km', taxiFare: '', walkTime: '13분', walkDistance: '973m' },
      { from: '미니소랜드', to: '상하이센트럴호텔', taxiTime: '', taxiDistance: '', taxiFare: '', walkTime: '5분', walkDistance: '349m' },
      { from: '상하이센트럴호텔', to: '푸동국제공항', taxiTime: '52분', taxiDistance: '43.5km', taxiFare: '180Y', walkTime: '', walkDistance: '' },
    ],
  },
]

const costs = [
  { id: 1, name: '항공권', type: '교통', amount: '360000', amount_cny: '', note: '왕복 항공권 2인' },
  { id: 2, name: '숙소', type: '숙박', amount: '320000', amount_cny: '', note: '상하이 센트럴 호텔 3박' },
  { id: 3, name: '식비', type: '식비', amount: '180000', amount_cny: '', note: '식당, 카페, 간식' },
  { id: 4, name: '현지 교통', type: '교통', amount: '70000', amount_cny: '', note: '택시, 지하철, 공항 이동' },
  { id: 5, name: '쇼핑', type: '쇼핑', amount: '70000', amount_cny: '', note: '기념품, 마트, 핸드크림' },
]

const createAmapUrl = (query) =>
  `https://www.amap.com/ssr/search?query_type=TQUERY&query=${encodeURIComponent(query)}`

const formatSavedTime = () => {
  const now = new Date()
  const pad = (value) => String(value).padStart(2, '0')

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
    now.getHours(),
  )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

const places = [
  {
    nameKo: '상하이 센트럴 호텔',
    nameZh: '上海王宝和大酒店',
    nameEn: 'Shanghai Central Hotel',
    category: '숙소',
    address: '上海市黄浦区九江路555号',
    amapUrl: 'https://surl.amap.com/cRymWRI1p4B6',
    coordinates: { lat: 31.236637, lng: 121.476061 },
  },
  {
    nameKo: '점도덕',
    nameZh: '点都德(白玉兰店)',
    category: '식당',
    address: '上海市虹口区上海城区东大名路555号白玉兰广场2楼',
    amapUrl: 'https://surl.amap.com/4mGMVUOr66Z',
    coordinates: { lat: 31.250377, lng: 121.492825 },
  },
  {
    nameKo: 'CHAGEE(SMP점)',
    nameZh: '霸王茶姬(上海白玉兰广场店)',
    category: '카페',
    address: '上海市虹口区北外滩街道东大名路501号上海白玉兰广场1楼',
    amapUrl: 'https://surl.amap.com/4UNsF8O1ce8H',
    coordinates: { lat: 31.250901, lng: 121.492299 },
  },  
  {
    nameKo: 'SMP몰',
    nameZh: 'SMP上海白玉兰广场',
    category: '쇼핑',
    address: '上海市虹口区东大名路501号',
    amapUrl: 'https://surl.amap.com/jzTD6kyP8Hr',
    coordinates: { lat: 31.251171, lng: 121.493592 },
  },
  {
    nameKo: '미니소랜드',
    nameZh: '名创优品IP乐园(全球壹号店)',
    nameEn: '',
    category: '쇼핑',
    address: '上海市黄浦区南京东路479号',
    amapUrl: 'https://surl.amap.com/3zI8yauR3Aq',
    coordinates: { lat: 31.237926, lng: 121.476930 },
  },
  {
    nameKo: '헌지우이치엔(광음광장점)',
    nameZh: '很久以前羊肉串(光音广场店)',
    nameEn: '',
    category: '식당',
    address: '银城路167号兴业银行大厦东侧B1层',
    amapUrl: 'https://surl.amap.com/borF5bcP74Z',
    coordinates: { lat: 31.244590, lng: 121.509473 },
  },
  {
    nameKo: '와이탄',
    nameZh: '外滩',
    nameEn: 'The Bund',
    category: '명소',
    address: '上海市黄浦区中山东二路1号',
    amapUrl: 'https://surl.amap.com/DHTfEOadpJ',
    coordinates: { lat: 31.235454, lng: 121.487790 },
  },
  {
    nameKo: '황푸강 유람선 선착장',
    nameZh: '黄浦江游览码头',
    nameEn: '',
    category: '명소',
    address: '上海市黄浦区中山东二路481号',
    amapUrl: 'https://surl.amap.com/3ABiCUGGde5',
    coordinates: { lat: 31.230574, lng: 121.492956 },
  },
  {
    nameKo: '산동잡곡전병',
    nameZh: '山东杂粮煎饼',
    category: '식당',
    address: '上海市黄浦区广西北路430号',
    amapUrl: 'https://surl.amap.com/kYdPQJQMcsj',
    coordinates: { lat: 31.238266, lng: 121.472327 },
  },
  {
    nameKo: 'CHAGEE(중푸청점)',
    nameZh: '霸王茶姬(中福城店)',
    category: '카페',
    address: '上海市黄浦区浙江中路210号底层',
    amapUrl: 'https://surl.amap.com/fdL747Q1B6wC',
    coordinates: { lat: 31.235807, lng: 121.474663 },
  },
  {
    nameKo: '홍쿠이지아',
    nameZh: '红盔甲·小龙虾(人民广场店)',
    category: '식당',
    address: '上海市黄浦区金陵东路500号亚龙国际广场2楼',
    amapUrl: 'https://surl.amap.com/jhfuqKaA4vT',
    coordinates: { lat: 31.228991, lng: 121.475723 },
  },
  {
    nameKo: '상하이 스타벅스 리저브',
    nameZh: 'STARBUCKS+RESERVE(益丰·外滩源店)',
    category: '카페',
    address: '上海市黄浦区北京东路99号益丰·外滩源F1层',
    amapUrl: 'https://surl.amap.com/g9Q9DS61x7ic',
    coordinates: { lat: 31.242559, lng: 121.484467 },
  },
  {
    nameKo: '따룬파마트',
    nameZh: '大润发(平型关店)',
    category: '쇼핑',
    address: '上海市静安区俞泾港路11号',
    amapUrl: 'https://surl.amap.com/6URQaBw165k',
    coordinates: { lat: 31.268567, lng: 121.462006 },
  },
  {
    nameKo: '예원',
    nameZh: '豫园(上海老街店)',
    category: '명소',
    address: '上海市黄浦区豫园路',
    amapUrl: 'https://surl.amap.com/hhDreKqFeSp',
    coordinates: { lat: 31.229248, lng: 121.487122 },
  },
  {
    nameKo: '상하이 그랜드마더',
    nameZh: '上海姥姥家常饭馆(九江路新店)',
    category: '식당',
    address: '上海市黄浦区九江路399号2楼',
    amapUrl: 'https://surl.amap.com/hrXXMvoy1rd',
    coordinates: { lat: 31.237702, lng: 121.478024 },
  },
  {
    nameKo: '우캉멘션',
    nameZh: '武康大楼',
    category: '명소',
    address: '上海市徐汇区淮海中路1850号',
    amapUrl: 'https://surl.amap.com/GFou0e1aTR',
    coordinates: { lat: 31.206296, lng: 121.433733 },
  },
  {
    nameKo: '라오지스',
    nameZh: '老吉士饭馆(天平路店)',
    category: '식당',
    address: '上海市徐汇区天平路41号(近淮海中路)',
    amapUrl: 'https://surl.amap.com/dbgpxlQ1e0kG',
    coordinates: { lat: 31.204837, lng: 121.433293 },
  },
  {
    nameKo: '신천지 임시정부',
    nameZh: '大韩民国临时政府旧址',
    category: '명소',
    address: '上海市黄浦区马当路306弄4号',
    amapUrl: 'https://surl.amap.com/dxWozU6Yguh',
    coordinates: { lat: 31.218654, lng: 121.468679 },
  },
  {
    nameKo: '티엔즈팡',
    nameZh: '田子坊',
    category: '쇼핑',
    address: '上海市黄浦区泰康路210弄',
    amapUrl: 'https://surl.amap.com/eD5jB7s1d8bU',
    coordinates: { lat: 31.210331, lng: 121.464098 },
  },
  {
    nameKo: '도원향',
    nameZh: '桃源乡(南京东路店)',
    category: '마사지',
    address: '上海市黄浦区南京东路505号',
    amapUrl: 'https://surl.amap.com/3fh4LLNv2fjR',
    coordinates: { lat: 31.237720, lng: 121.476490 },
  },  
  {
    nameKo: '좌정우원',
    nameZh: '左庭右院鲜牛肉火锅(新世界新丸中心店)',
    category: '식당',
    address: '上海市黄浦区南京东路228号新世界大丸百货B2层',
    amapUrl: 'https://surl.amap.com/4ycF1IO1g4NY',
    coordinates: { lat: 31.239963, lng: 121.481034 },
  },  
  {
    nameKo: '신세계백화점',
    nameZh: '上海新世界大丸百货',
    category: '쇼핑',
    address: '上海市黄浦区南京东路228号',
    amapUrl: 'https://surl.amap.com/azeoA4W1hfRD',
    coordinates: { lat: 31.240348, lng: 121.481109 },
  },
  {
    nameKo: '헤이티',
    nameZh: '喜茶(上海新世界新丸中心店)',
    category: '카페',
    address: '上海市黄浦区南京东路228号上海新世界大丸百货商场1楼',
    amapUrl: 'https://surl.amap.com/1Lo8UPoo1wU',
    coordinates: { lat: 31.240481, lng: 121.480358 },
  },   
  {
    nameKo: '장씨네 게살국수',
    nameZh: '庄氏隆兴·非遗蟹点(外滩店)',
    category: '식당',
    address: '上海市黄浦区四川中路156号',
    amapUrl: 'https://surl.amap.com/7HRxfIGo9Mc',
    coordinates: { lat: 31.237041, lng: 121.484633 },
  },
  {
    nameKo: '푸동국제공항 1터미널',
    nameZh: '上海浦东国际机场',
    category: '공항',
    address: '上海市浦东新区迎宾大道6000号',
    amapUrl: 'https://surl.amap.com/iFI45U1q7Jw',
    coordinates: { lat: 31.14275, lng: 121.80490 },
    mapMarkerDisabled: true,
  },
]

const placesWithAmapLinks = places.map((place) => ({
  ...place,
  amapUrl: place.amapUrl || createAmapUrl(`${place.address}`),
}))

const calendarWeeks = [
  ['', '1', '2', '3', '4', '5', '6'],
  ['7', '8', '9', '10', '11', '12', '13'],
  ['14', '15', '16', '17', '18', '19', '20'],
  ['21', '22', '23', '24', '25', '26', '27'],
  ['28', '29', '30', '', '', '', ''],
]

const tripDates = ['12', '13', '14', '15']

const TILE_SIZE = 256
const MAP_CENTER = { lat: 31.22, lng: 121.6 }
const MIN_MAP_ZOOM = 9
const MAX_MAP_ZOOM = 20
const MAP_CATEGORY_OPTIONS = [
  { id: 'food', label: '식당', categories: ['식당'] },
  { id: 'cafe', label: '카페', categories: ['카페'] },
  { id: 'shopping', label: '쇼핑', categories: ['쇼핑', '쇼핑거리', '마트', '복합몰'] },
  { id: 'spot', label: '명소', categories: ['명소'] },
  { id: 'hotel', label: '숙소', categories: ['숙소', '마사지'] },
]
const MAP_CATEGORY_COLOR_CLASS = {
  식당: 'food',
  카페: 'cafe',
  쇼핑: 'shopping',
  쇼핑거리: 'shopping',
  마트: 'shopping',
  복합몰: 'shopping',
  명소: 'spot',
  숙소: 'hotel',
  마사지: 'hotel',
}

function projectToTilePixels({ lat, lng }, zoom) {
  const scale = TILE_SIZE * 2 ** zoom
  const sinLat = Math.sin((lat * Math.PI) / 180)

  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
  }
}

function unprojectFromTilePixels({ x, y }, zoom) {
  const scale = TILE_SIZE * 2 ** zoom
  const lng = (x / scale) * 360 - 180
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / scale)))

  return {
    lat: (latRad * 180) / Math.PI,
    lng,
  }
}

function ShanghaiMap({ places }) {
  const mapRef = useRef(null)
  const didSetInitialZoom = useRef(false)
  const dragRef = useRef(null)
  const pointersRef = useRef(new Map())
  const pinchRef = useRef(null)
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 })
  const [zoom, setZoom] = useState(11)
  const [mapCenter, setMapCenter] = useState(MAP_CENTER)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [zoomAnimation, setZoomAnimation] = useState(null)
  const [visibleCategoryGroups, setVisibleCategoryGroups] = useState(
    () => new Set(MAP_CATEGORY_OPTIONS.map((option) => option.id)),
  )
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (!mapRef.current) {
      return undefined
    }

    const observer = new ResizeObserver(([entry]) => {
      setMapSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })

    observer.observe(mapRef.current)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!mapSize.width || didSetInitialZoom.current) {
      return
    }

    didSetInitialZoom.current = true

    if (mapSize.width < 700) {
      setZoom(10)
    }
  }, [mapSize.width])

  const changeZoom = useCallback((delta) => {
    setZoom((currentZoom) => {
      const nextZoom = Math.max(MIN_MAP_ZOOM, Math.min(MAX_MAP_ZOOM, currentZoom + delta))

      if (nextZoom === currentZoom) {
        return currentZoom
      }

      setZoomAnimation({
        key: `${currentZoom}-${nextZoom}-${Date.now()}`,
        scale: delta > 0 ? 2 : 0.5,
      })

      window.setTimeout(() => {
        setZoomAnimation(null)
      }, 180)

      return nextZoom
    })
    setDragOffset({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    const mapElement = mapRef.current

    if (!mapElement) {
      return undefined
    }

    const zoomWithWheel = (event) => {
      event.preventDefault()
      changeZoom(event.deltaY < 0 ? 1 : -1)
    }

    mapElement.addEventListener('wheel', zoomWithWheel, { passive: false })

    return () => {
      mapElement.removeEventListener('wheel', zoomWithWheel)
    }
  }, [changeZoom])

  const zoomIn = () => {
    changeZoom(1)
  }

  const zoomOut = () => {
    changeZoom(-1)
  }

  const toggleCategoryGroup = (categoryId) => {
    setVisibleCategoryGroups((currentGroups) => {
      const nextGroups = new Set(currentGroups)

      if (nextGroups.has(categoryId)) {
        nextGroups.delete(categoryId)
      } else {
        nextGroups.add(categoryId)
      }

      return nextGroups
    })
  }

  const startMapDrag = (event) => {
    if (event.target.closest('.map-marker, .map-controls, .map-filter-controls')) {
      return
    }

    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    })

    event.currentTarget.setPointerCapture(event.pointerId)

    if (pointersRef.current.size === 2) {
      const points = Array.from(pointersRef.current.values())
      const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)

      pinchRef.current = {
        distance,
        zoom,
        lastStep: 0,
      }
      dragRef.current = null
      setDragOffset({ x: 0, y: 0 })
      setIsDragging(false)
      return
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      center: projectToTilePixels(mapCenter, zoom),
    }
    setDragOffset({ x: 0, y: 0 })
    setIsDragging(true)
  }

  const moveMapDrag = (event) => {
    if (pointersRef.current.has(event.pointerId)) {
      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      })
    }

    if (pointersRef.current.size >= 2 && pinchRef.current) {
      const points = Array.from(pointersRef.current.values()).slice(0, 2)
      const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)
      const step = Math.trunc((distance - pinchRef.current.distance) / 80)

      if (step !== pinchRef.current.lastStep) {
        setZoom(
          Math.max(
            MIN_MAP_ZOOM,
            Math.min(MAX_MAP_ZOOM, pinchRef.current.zoom + step),
          ),
        )
        pinchRef.current.lastStep = step
      }

      return
    }

    const drag = dragRef.current

    if (!drag || drag.pointerId !== event.pointerId) {
      return
    }

    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY

    setDragOffset({ x: deltaX, y: deltaY })
  }

  const endMapDrag = (event) => {
    pointersRef.current.delete(event.pointerId)

    if (pinchRef.current) {
      pinchRef.current = null
      dragRef.current = null
      setDragOffset({ x: 0, y: 0 })
      setIsDragging(false)
      return
    }

    const drag = dragRef.current

    if (!drag || drag.pointerId !== event.pointerId) {
      return
    }

    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY

    setMapCenter(
      unprojectFromTilePixels(
        {
          x: drag.center.x - deltaX,
          y: drag.center.y - deltaY,
        },
        zoom,
      ),
    )
    setDragOffset({ x: 0, y: 0 })
    dragRef.current = null
    setIsDragging(false)
  }

  const width = mapSize.width || 1000
  const height = mapSize.height || 560
  const center = projectToTilePixels(mapCenter, zoom)
  const minTileX = Math.floor((center.x - width / 2) / TILE_SIZE) - 1
  const maxTileX = Math.floor((center.x + width / 2) / TILE_SIZE) + 1
  const minTileY = Math.floor((center.y - height / 2) / TILE_SIZE) - 1
  const maxTileY = Math.floor((center.y + height / 2) / TILE_SIZE) + 1
  const tiles = []

  for (let tileX = minTileX; tileX <= maxTileX; tileX += 1) {
    for (let tileY = minTileY; tileY <= maxTileY; tileY += 1) {
      tiles.push({
        key: `${zoom}-${tileX}-${tileY}`,
        src: `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`,
        left: width / 2 + tileX * TILE_SIZE - center.x,
        top: height / 2 + tileY * TILE_SIZE - center.y,
      })
    }
  }

  return (
    <div
      className={`city-map${isDragging ? ' is-dragging' : ''}`}
      ref={mapRef}
      aria-label="상하이 방문 장소 지도"
      onPointerDown={startMapDrag}
      onPointerMove={moveMapDrag}
      onPointerUp={endMapDrag}
      onPointerCancel={endMapDrag}
    >
      <div className="map-controls" aria-label="지도 확대 축소">
        <button
          type="button"
          onClick={zoomIn}
          disabled={zoom >= MAX_MAP_ZOOM}
          aria-label="지도 확대"
        >
          +
        </button>
        <button
          type="button"
          onClick={zoomOut}
          disabled={zoom <= MIN_MAP_ZOOM}
          aria-label="지도 축소"
        >
          -
        </button>
      </div>

      <div className="map-filter-controls" aria-label="지도 카테고리 필터">
        {MAP_CATEGORY_OPTIONS.map((option) => (
          <button
            className={`map-filter-button ${option.id}${
              visibleCategoryGroups.has(option.id) ? ' is-active' : ''
            }`}
            key={option.id}
            type="button"
            onClick={() => toggleCategoryGroup(option.id)}
            aria-pressed={visibleCategoryGroups.has(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div
        className={`map-tiles${zoomAnimation ? ' is-zooming' : ''}`}
        aria-hidden="true"
        key={zoomAnimation?.key || zoom}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(${
            zoomAnimation?.scale || 1
          })`,
        }}
      >
        {tiles.map((tile) => (
          <img
            alt=""
            height={TILE_SIZE}
            key={tile.key}
            src={tile.src}
            style={{ left: tile.left, top: tile.top }}
            width={TILE_SIZE}
          />
        ))}
      </div>

      {places.map((place, index) => {
        if (place.mapMarkerDisabled) {
          return null
        }

        const categoryGroup = MAP_CATEGORY_OPTIONS.find((option) =>
          option.categories.includes(place.category),
        )

        if (categoryGroup && !visibleCategoryGroups.has(categoryGroup.id)) {
          return null
        }

        const point = projectToTilePixels(place.coordinates, zoom)
        const left = width / 2 + point.x - center.x
        const top = height / 2 + point.y - center.y

        return (
          <a
            className={`map-marker ${MAP_CATEGORY_COLOR_CLASS[place.category] || 'spot'}`}
            // href={place.amapUrl}
            key={`${place.nameKo}-marker`}
            rel="noreferrer"
            style={{ left: left + dragOffset.x, top: top + dragOffset.y }}
            target="_blank"
            title={`${place.nameKo} - ${place.nameZh}`}
          >
            {index + 1}
            <span>{place.nameKo}</span>
          </a>
        )
      })}

      <div className="map-attribution">
        Map data © OpenStreetMap contributors
      </div>
    </div>
  )
}

function CopyChineseNameButton({ name }) {
  const [copied, setCopied] = useState(false)

  const copyName = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(name)
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = name
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }

    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <button
      className="copy-name-button"
      type="button"
      onClick={copyName}
      aria-label={`${name} 복사`}
    >
      {copied ? '완료' : '복사'}
    </button>
  )
}

function CostTable() {
  const [rows, setRows] = useState(costs.map(({ id, ...cost }) => ({ sort_order: id, ...cost })))
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return undefined
    }

    let isMounted = true

    const loadCosts = async () => {
      setIsLoading(true)
      setErrorMessage('')

      const { data, error } = await supabase
        .from('costs')
        .select('sort_order, name, type, amount, amount_cny, note')
        .order('sort_order', { ascending: true })

      if (!isMounted) {
        return
      }

      if (error) {
        setErrorMessage(`비용 데이터를 불러오지 못했습니다: ${error.message}`)
      } else {
        setRows(data || [])
      }

      setIsLoading(false)
    }

    loadCosts()

    return () => {
      isMounted = false
    }
  }, [])

  const updateRow = (sortOrder, field, value) => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.sort_order === sortOrder
          ? {
              ...row,
              [field]: value,
              ...(field === 'amount' && value ? { amount_cny: '' } : {}),
              ...(field === 'amount_cny' && value ? { amount: '' } : {}),
              isDirty: !row.isNew,
            }
          : row,
      ),
    )
  }

  const addRow = () => {
    const nextSortOrder =
      rows.length > 0 ? Math.max(...rows.map((row) => Number(row.sort_order) || 0)) + 1 : 1
    const newRow = {
      sort_order: nextSortOrder,
      name: '',
      type: '',
      amount: '',
      amount_cny: '',
      note: '',
      isNew: true,
      isDirty: false,
    }

    setRows((currentRows) => [...currentRows, newRow])
    setErrorMessage('')
  }

  const saveRow = async (sortOrder) => {
    if (!isSupabaseConfigured) {
      return
    }

    const row = rows.find((currentRow) => currentRow.sort_order === sortOrder)

    if (!row) {
      return
    }

    const amountKrw = String(row.amount ?? '').trim()
    const amountCny = String(row.amount_cny ?? '').trim()
    const savedRow = {
      sort_order: row.sort_order,
      name: row.name.trim(),
      type: formatSavedTime(),
      amount: amountKrw || null,
      amount_cny: amountCny || null,
      note: row.note.trim(),
    }

    if (!savedRow.name || (!amountKrw && !amountCny)) {
      setErrorMessage('항목명과 원화 또는 위안화 금액 하나를 입력한 뒤 저장하세요.')
      return
    }

    if (amountKrw && amountCny) {
      setErrorMessage('원화와 위안화 중 하나만 입력할 수 있습니다.')
      return
    }

    const query = row.isNew
      ? supabase.from('costs').insert(savedRow)
      : supabase.from('costs').update(savedRow).eq('sort_order', sortOrder)

    const { data, error } = await query
      .select('sort_order, name, type, amount, amount_cny, note')
      .single()

    if (error) {
      setErrorMessage(`비용 항목을 저장하지 못했습니다: ${error.message}`)
    } else if (data) {
      setRows((currentRows) =>
        currentRows.map((currentRow) =>
          currentRow.sort_order === sortOrder
            ? { ...data, isNew: false, isDirty: false }
            : currentRow,
        ),
      )
      setErrorMessage('')
    }
  }

  const deleteRow = async (sortOrder) => {
    const previousRows = rows

    setRows((currentRows) => currentRows.filter((row) => row.sort_order !== sortOrder))

    const row = rows.find((currentRow) => currentRow.sort_order === sortOrder)

    if (!isSupabaseConfigured || row?.isNew) {
      return
    }

    const { error } = await supabase.from('costs').delete().eq('sort_order', sortOrder)

    if (error) {
      setRows(previousRows)
      setErrorMessage(`비용 항목을 삭제하지 못했습니다: ${error.message}`)
    } else {
      setErrorMessage('')
    }
  }

  const seedDefaultCosts = async () => {
    const defaultRows = costs.map(({ id, ...cost }) => ({
      sort_order: id,
      ...cost,
    }))

    const { data, error } = await supabase
      .from('costs')
      .upsert(defaultRows, { onConflict: 'sort_order' })
      .select('sort_order, name, type, amount, amount_cny, note')
      .order('sort_order', { ascending: true })

    if (error) {
      setErrorMessage(`기본 비용 데이터를 저장하지 못했습니다: ${error.message}`)
      return
    }

    setRows((data || defaultRows).map((row) => ({ ...row, isNew: false, isDirty: false })))
    setErrorMessage('')
  }

  if (isLoading) {
    return <p className="cost-status">비용 데이터를 불러오는 중입니다.</p>
  }

  return (
    <div className="cost-table-area">
      {!isSupabaseConfigured && (
        <p className="cost-status">
          Supabase 연결을 위해 프로젝트 루트에 .env.local 파일을 만들고
          VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 입력하세요.
        </p>
      )}
      {errorMessage && <p className="cost-status error">{errorMessage}</p>}
      {isSupabaseConfigured && rows.length === 0 && (
        <div className="cost-empty">
          <p>등록된 비용 항목이 없습니다.</p>
          {/* <button className="cost-add-button" type="button" onClick={seedDefaultCosts}>
            기본 항목 넣기
          </button> */}
        </div>
      )}
      <CostTableView
        rows={rows}
        updateRow={updateRow}
        addRow={addRow}
        saveRow={saveRow}
        deleteRow={deleteRow}
      />
    </div>
  )
}

function CostTableView({ rows, updateRow, addRow, saveRow, deleteRow }) {
  const summary = rows.reduce(
    (total, row) => ({
      count: total.count + 1,
      amount: total.amount + (Number(row.amount) || 0),
      amount_cny: total.amount_cny + (Number(row.amount_cny) || 0),
    }),
    { count: 0, amount: 0, amount_cny: 0 },
  )

  const formatAmount = (amount) => amount.toLocaleString('ko-KR')

  return (
    <>
      <div className="cost-table-wrap">
        <table className="cost-table">
          <thead>
            <tr>
              <th scope="col">순번</th>
              <th scope="col">항목명</th>
              <th scope="col">원화</th>
              <th scope="col">위안화</th>
              <th scope="col">비고</th>
              <th scope="col">시간</th>
              <th scope="col">관리</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.sort_order}>
                <td>{index + 1}</td>
                <td>
                  <input
                    value={row.name}
                    onChange={(event) => updateRow(row.sort_order, 'name', event.target.value)}
                    aria-label={`${index + 1}번 항목명`}
                  />
                </td>
                <td>
                  <input
                    inputMode="numeric"
                    value={row.amount || ''}
                    onChange={(event) => updateRow(row.sort_order, 'amount', event.target.value)}
                    aria-label={`${index + 1}번 원화 금액`}
                    disabled={Boolean(row.amount_cny)}
                  />
                </td>
                <td>
                  <input
                    inputMode="decimal"
                    value={row.amount_cny || ''}
                    onChange={(event) =>
                      updateRow(row.sort_order, 'amount_cny', event.target.value)
                    }
                    aria-label={`${index + 1}번 위안화 금액`}
                    disabled={Boolean(row.amount)}
                  />
                </td>
                <td>
                  <input
                    value={row.note}
                    onChange={(event) => updateRow(row.sort_order, 'note', event.target.value)}
                    aria-label={`${index + 1}번 비고`}
                  />
                </td>
                <td>
                  <input
                    value={row.type}
                    onChange={(event) => updateRow(row.sort_order, 'type', event.target.value)}
                    aria-label={`${index + 1}번 저장 시간`}
                    placeholder="저장 시 자동 입력"
                    readOnly
                  />
                </td>                
                <td className="cost-actions-cell">
                  {(row.isNew || row.isDirty) && (
                    <button
                      className="cost-save-button"
                      type="button"
                      onClick={() => saveRow(row.sort_order)}
                      aria-label={`${index + 1}번 비용 항목 저장`}
                    >
                      저장
                    </button>
                  )}
                  <button
                    className="cost-delete-button"
                    type="button"
                    onClick={() => deleteRow(row.sort_order)}
                    aria-label={`${index + 1}번 비용 항목 삭제`}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>총 {summary.count}개 항목</td>
              <td>합계</td>
              <td>{formatAmount(summary.amount)}원</td>
              <td>{formatAmount(summary.amount_cny)}위안</td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <button className="cost-add-button" type="button" onClick={addRow}>
        항목 추가
      </button>
    </>
  )
}

function TravelChecklist() {
  const [checkedItems, setCheckedItems] = useState(() => {
    const savedItems = window.localStorage.getItem(TRAVEL_CHECKLIST_STORAGE_KEY)

    if (!savedItems) {
      return []
    }

    try {
      const parsedItems = JSON.parse(savedItems)

      return Array.isArray(parsedItems) ? parsedItems : []
    } catch {
      return []
    }
  })

  const checkedSet = new Set(checkedItems)
  const checkedCount = checkedItems.length

  const toggleItem = (itemId) => {
    setCheckedItems((currentItems) => {
      const nextItems = currentItems.includes(itemId)
        ? currentItems.filter((id) => id !== itemId)
        : [...currentItems, itemId]

      window.localStorage.setItem(TRAVEL_CHECKLIST_STORAGE_KEY, JSON.stringify(nextItems))

      return nextItems
    })
  }

  return (
    <div className="travel-info-checklist">
      <div className="checklist-progress">
        <strong>{checkedCount}</strong>
        <span>/ {travelChecklist.length}</span>
      </div>

      <div className="checklist-items">
        {travelChecklist.map((item) => (
          <label className="checklist-item" key={item.id}>
            <input
              type="checkbox"
              checked={checkedSet.has(item.id)}
              onChange={() => toggleItem(item.id)}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function RouteTable() {
  return (
    <div className="route-days">
      {routeDays.map((day) => (
        <article className="route-day" key={day.id}>
          <div className="route-day-heading">
            <h3>{day.label}</h3>
          </div>

          <div className="route-table-wrap">
            <table className="route-table">
              <thead>
                <tr>
                  <th scope="col">출발지</th>
                  <th scope="col">도착지</th>
                  <th scope="col">택시 예상 시간</th>
                  <th scope="col">택시 거리</th>
                  <th scope="col">택시 요금</th>
                  <th scope="col">도보 예상 시간</th>
                  <th scope="col">도보 거리</th>
                </tr>
              </thead>
              <tbody>
                {day.routes.map((row, index) => (
                  <tr key={`${day.id}-${row.from}-${row.to}-${index}`}>
                    <td>{row.from}</td>
                    <td>{row.to}</td>
                    <td>{row.taxiTime}</td>
                    <td>{row.taxiDistance}</td>
                    <td>{row.taxiFare}</td>
                    <td>{row.walkTime}</td>
                    <td>{row.walkDistance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      ))}
    </div>
  )
}

function App() {
  return (
    <main className="app-shell">
      <section className="hero-section" aria-label="Travel overview">
        <nav className="topbar" aria-label="Primary navigation">
          <strong>S♥R Travel Log</strong>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Trip planner and shareable blog</p>
            <h1>상해 여행 노트</h1>
            <p>
              2026년 6월, 선량 상해 여행 노트
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#schedule">일정 보기</a>
              <a className="secondary-action" href="#places">방문 장소</a>
              <a className="secondary-action" href="#map">지도</a>
              <a className="secondary-action" href="#routes">이동 동선</a>
              <a className="secondary-action" href="#cost">비용</a>
              <a className="secondary-action" href="#travel-info">여행 정보</a>
            </div>
          </div>

          <aside className="trip-panel" aria-label="Trip summary">
            <span className="panel-label">Next Trip</span>
            <h2>Shanghai Weekend</h2>
            <p>June 12 - 15, 2026</p>
            <div className="metric-row">
              {notes.map((note) => (
                <div key={note.label}>
                  <span>{note.label}</span>
                  <strong>{note.value}</strong>
                </div>
              ))}
            </div>

            <div className="calendar-card" aria-label="June 2026 travel calendar">
              <div className="calendar-head">
                <strong>June 2026</strong>
                <span>4-day route</span>
              </div>
              <div className="calendar-weekdays" aria-hidden="true">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              <div className="calendar-grid">
                {calendarWeeks.flat().map((date, index) => (
                  <span
                    className={tripDates.includes(date) ? 'selected-date' : ''}
                    key={`${date || 'empty'}-${index}`}
                  >
                    {date}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="content-section" id="schedule">
        <div className="section-heading">
          <p className="eyebrow">여행 일정</p>
          <h2>일일 여행 계획</h2>
        </div>

        <div className="timeline">
          {trips.map((trip) => (
            <article className="timeline-card" key={trip.day}>
              <div className="timeline-meta">
                <span>{trip.day}</span>
                <strong>{trip.date}</strong>
              </div>
              <div className="timeline-content">
                <p className="city">{trip.city}</p>
                <h3>{trip.title}</h3>
                <div className="schedule-table-wrap">
                  <table className="schedule-table">
                    <thead>
                      <tr>
                        <th scope="col">시작시간</th>
                        <th scope="col">예상소요시간</th>
                        <th scope="col">일정</th>
                        <th scope="col">목적지</th>
                        <th scope="col">비고</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trip.schedule.map((item) => {
                        const [startTime, endTime = ''] = item.time.split(' - ')

                        return (
                          <tr key={`${trip.day}-${item.time}-${item.plan}`}>
                            <td data-label="시작시간">{startTime}</td>
                            <td data-label="예상소요시간">{endTime}</td>
                            <td data-label="일정">{item.plan}</td>
                            <td data-label="목적지">{item.destination}</td>
                            <td data-label="비고">{item.note}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section places-section" id="places">
        <div className="section-heading">
          <p className="eyebrow">방문 장소</p>
          <h2>여행 중 들를 곳</h2>
        </div>

        <div className="places-grid">
          {placesWithAmapLinks.map((place, index) => (
            <article className="place-card" key={`${place.nameKo}-${place.nameZh}`}>
              <div className="place-side">
                <span className="place-number">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="place-info">
                <span className="place-category">{place.category}</span>
                <h3>{place.nameKo}</h3>
                <h3>{place.nameEn}</h3>
                <div className="place-name-zh">
                  <span>{place.nameZh}</span>
                  <CopyChineseNameButton name={place.nameZh} />
                </div>
                <div className="place-name-address">
                  <address>{place.address}</address>
                  <CopyChineseNameButton name={place.address} />
                </div>
              </div>
              <a
                className="place-map-link"
                href={place.amapUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${place.nameKo} 지도 열기`}
              >
                Amap
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section map-section" id="map">
        <div className="section-heading">
          <p className="eyebrow">Shanghai Map</p>
          <h2>방문 지도</h2>
        </div>

        <ShanghaiMap places={placesWithAmapLinks} />
      </section>

      <section className="content-section route-section" id="routes">
        <div className="section-heading">
          <p className="eyebrow">이동 동선</p>
          <h2>일자별 이동 계획</h2>
        </div>

        <RouteTable />
      </section>

      <section className="content-section cost-section" id="cost">
        <div className="section-heading">
          <p className="eyebrow">여행 비용</p>
          <h2>경비</h2>
        </div>

        <CostTable />
      </section>

      <section className="travel-info-section" id="travel-info">
        <div>
          <p className="eyebrow">여행 정보</p>
          <h2>여행 준비 체크리스트</h2>
          <p>출발 전 준비할 항목을 체크해두고 빠뜨린 준비물을 한 번에 확인하세요.</p>
        </div>
        <TravelChecklist />
      </section>
    </main>
  )
}

export default App
