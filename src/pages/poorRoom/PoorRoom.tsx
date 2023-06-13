/* eslint-disable prefer-const */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router';
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from 'react-query';
import { BsFillCaretRightFill } from 'react-icons/bs';
import beggars from '../../api/beggars';
import '../../styles/pages/_PoorRoom.scss';
import '../../styles/components/_Slickslider.scss';
import {
  Button,
  Controller,
  Header,
  LevelMedal,
  RecentMyConsumechart,
  MyConsumePropensitychart,
  ProgressBar,
  SlickSlider,
} from '../../components';
import myPoorState from '../../shared/MyPoor';
import PoorCharacter from './PoorCharacter';
import Loading from '../status/Loading';
import Error from '../status/Error';
import containerPositionState from '../../shared/ScrollContainer';

function PoorRoom() {
  // PoorRoom Hooks & State
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [myPoorInfo, setMyPoorInfo] = useRecoilState(myPoorState);
  const [scrollPosition, setScrollPosition] = useRecoilState(
    containerPositionState
  );

  // =================================================================
  // *** PoorRoom Data Query *****************************************
  // =================================================================
  type Badge = {
    badgeImage: string;
    badgeNum: number;
    badgeTitle: string;
    createdAt: string;
    id: number;
    modifiedAt: string;
  };

  interface MyData {
    beggarId: string;
    userId: string;
    nickname: string;
    exp: number;
    point: number;
    level: number;
    description: string;
    age: number;
    gender: string;
    topImage: string;
    bottomImage: string;
    accImage: string;
    customImage: string;
    badgeList: Badge[];
  }

  interface MyPointData {
    point_id: number;
    pointDescription: string;
    earnedPoint: number | null;
    usedPoints: number | null;
    beggar_id: number;
    createdAt: string;
  }

  const { isLoading, error, data }: UseQueryResult<MyData> = useQuery(
    'getMyPoorRoom',
    beggars.getMyPoorRoom
  );

  useEffect(() => {
    if (data !== undefined) {
      setMyPoorInfo(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setMyPoorInfo]);

  // =================================================================
  // *** PoorRoom Point Inquiry Query ********************************
  // =================================================================
  // 초기값 설정
  const initialDateType = 'week';
  const initialKind = null;
  const initialPage = 0;
  const initialButtonIndex = 0;

  const [dateType, setDateType] = useState(initialDateType);
  const [kind, setKind] = useState<string | null>(initialKind);
  const [page, setPage] = useState(initialPage);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);
  const [pointInquiryList, setPointInquiryList] = useState<MyPointData[]>([]);

  const {
    isLoading: PointLoading,
    error: PointError,
    data: PointData,
  } = useQuery<MyPointData[]>(
    ['getMyPointInquiry', { dateType, kind, page }],
    () => beggars.getMyPointInquiry({ dateType, kind, page })
  );

  // 포인트 내역 조회 mutation
  const pointInquiryMutation = useMutation(beggars.getMyPointInquiry, {
    onSuccess: (response) => {
      setPointInquiryList(response);
      queryClient.invalidateQueries('getMyPointInquiry');
    },
  });

  type PointInquiry = {
    newDateType: string;
    newKind: string | null;
    newPage: number;
    buttonIndex: number;
  };

  const getPointInquiry = ({
    newDateType,
    newKind,
    newPage,
    buttonIndex,
  }: PointInquiry) => {
    setDateType(newDateType);
    setKind(newKind);
    setPage(newPage);
    pointInquiryMutation.mutate({
      dateType: newDateType,
      kind: newKind,
      page: newPage,
    });
    setSelectedButtonIndex(buttonIndex);
  };

  // 초기값 설정 및 첫번째 조회 실행
  useEffect(() => {
    getPointInquiry({
      newDateType: initialDateType,
      newKind: initialKind,
      newPage: initialPage,
      buttonIndex: initialButtonIndex,
    });
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  return (
    <main id="myPoorRoom">
      <Header>MY</Header>
      <article>
        <section id="myPoorInfo">
          <div className="poorProfile">
            <PoorCharacter avatarType="poorRoom" />
          </div>
          <LevelMedal level={data?.level as number} />
          <h2 className="nickname">{data?.nickname}</h2>
          <p className="info">
            {data?.gender === 'female' ? '여' : '남'} / {data?.age}
            <Button
              className="whiteRoundCommon"
              onClick={() => navigate('/poorItemSetting')}
            >
              아이템 <BsFillCaretRightFill />
            </Button>
            <Button
              className="textType"
              onClick={() => navigate('/poorItemSetting')}
            >
              로그아웃
            </Button>
          </p>
        </section>
        <section id="myConsumePropensity">
          <h1>소비성향</h1>
          <div style={{ width: '100%', height: '430px' }}>
            <MyConsumePropensitychart />
          </div>
        </section>
        <section id="consumeBadgeArea">
          <h1>소비뱃지</h1>
          <SlickSlider
            id="badgeSlide"
            loop={false}
            slidesToShow={3}
            slidesToScroll={1}
            arrows={false}
          >
            {data?.badgeList
              .filter((item) => item.badgeNum >= 1 && item.badgeNum <= 5)
              .map((item) => (
                <div key={item.badgeTitle} className="item">
                  <img src={item.badgeImage} alt={item.badgeTitle} />
                  <p>{item.badgeTitle}</p>
                </div>
              ))}
          </SlickSlider>
          <Button
            className="whiteCommon"
            onClick={() => navigate('/badgeList')}
          >
            모든 뱃지 보기
          </Button>
        </section>
        <section id="myConsumeRecentGraph">
          <h1>최근 6개월 소비근황</h1>
          <p>단위 : 만원</p>
          <div style={{ width: '100%', height: '370px' }}>
            <RecentMyConsumechart />
          </div>
        </section>
        <section id="myPointBreakdown">
          <h1>
            {data?.nickname}님의 푸어포인트 <span className="tooltip">!</span>
          </h1>
          {data && (
            <ProgressBar
              data={{ exp: data.exp, point: data.point, level: data.level }}
            />
          )}
          <div className="periodInquiry">
            <Button
              className={`filterButton ${
                selectedButtonIndex === 0 ? 'checked' : ''
              }`}
              onClick={() =>
                getPointInquiry({
                  newDateType: 'week',
                  newKind: 'total',
                  newPage: 0,
                  buttonIndex: 0,
                })
              }
            >
              1주일
            </Button>
            <Button
              className={`filterButton ${
                selectedButtonIndex === 1 ? 'checked' : ''
              }`}
              onClick={() =>
                getPointInquiry({
                  newDateType: 'month',
                  newKind: 'total',
                  newPage: 0,
                  buttonIndex: 1,
                })
              }
            >
              1개월
            </Button>
            <Button
              className={`filterButton ${
                selectedButtonIndex === 2 ? 'checked' : ''
              }`}
              onClick={() =>
                getPointInquiry({
                  newDateType: '3month',
                  newKind: 'total',
                  newPage: 0,
                  buttonIndex: 2,
                })
              }
            >
              3개월
            </Button>
            <Button
              className={`filterButton ${
                selectedButtonIndex === 3 ? 'checked' : ''
              }`}
              onClick={() =>
                getPointInquiry({
                  newDateType: '6month',
                  newKind: 'total',
                  newPage: 0,
                  buttonIndex: 3,
                })
              }
            >
              6개월
            </Button>
            <Button
              className={`filterButton ${
                selectedButtonIndex === 4 ? 'checked' : ''
              }`}
              onClick={() =>
                getPointInquiry({
                  newDateType: 'year',
                  newKind: 'total',
                  newPage: 0,
                  buttonIndex: 4,
                })
              }
            >
              1년
            </Button>
          </div>
          <div className="detailOfPoint">
            <ul className="detailOfPointFilter">
              <li className="checked">전체</li>
              <li>적립</li>
              <li>사용</li>
            </ul>
            <ul className="detailOfPointList">
              {pointInquiryList?.map((list) => (
                <li key={list.point_id}>
                  <p className="title">
                    {list.pointDescription} <span>{list.createdAt}</span>
                  </p>
                  <p
                    className={`value ${
                      list.usedPoints === null ? 'save' : 'use'
                    }`}
                  >
                    {list.usedPoints === null ? '+' : '-'}
                    {list.usedPoints === null
                      ? list.earnedPoint
                      : list.usedPoints}
                    P <span>{list.usedPoints === null ? '적립' : '사용'}</span>
                  </p>
                </li>
              ))}
            </ul>
            <Button
              className="whiteCommon"
              onClick={() =>
                getPointInquiry({
                  newDateType: dateType,
                  newKind: kind,
                  newPage: page + 1,
                  buttonIndex: selectedButtonIndex,
                })
              }
            >
              더 보기
            </Button>
          </div>
        </section>
      </article>
    </main>
  );
}

export default PoorRoom;
