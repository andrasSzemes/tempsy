import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { usePracticeClient } from '../contexts/clientProviders/usePracticeClient';
import { useUser } from '../contexts/useUser';
import type { PracticeStatistics } from '../client/PracticeClient';

type MonthSelection = {
  year: number;
  month: number;
};

type DayCell = {
  dateKey: string | null;
  dayNumber: number | null;
  count: number;
};

type TenseSlice = {
  tense: string;
  percentage: number;
  color: string;
};

const PIE_COLORS = ['#e5c8ab', '#b77743', '#d8b08b', '#8a5429', '#f0d7c2', '#9c6337'];

const Page = styled.div`
  min-height: 100%;
  padding: 24px;
  color: #f4eee7;
`;

const UserEmailBar = styled.div`
  margin-bottom: 16px;
  text-align: center;
  color: rgba(244, 238, 231, 0.9);
  font-size: 0.98rem;
  font-weight: 600;
`;

const EmptyStateContainer = styled.div`
  min-height: calc(100vh - 48px);
  display: flex;
`;

const Card = styled.section`
  background: rgba(0, 0, 0, 0.28);
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 16px;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: 100vh;
  align-items: stretch;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const LeftColumn = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const RightColumn = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: #fff;
`;

const MonthControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MonthButton = styled.button`
  border: 1px solid rgba(209, 180, 140, 0.45);
  background: rgba(209, 180, 140, 0.12);
  color: #f4eee7;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;

const MonthLabel = styled.div`
  min-width: 150px;
  text-align: center;
  font-weight: 700;
  letter-spacing: 0.02em;
`;

const WeekdayHeader = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(7, 44px);
  gap: 10px;
`;

const WeekdayCell = styled.div`
  font-size: 0.73rem;
  color: rgba(244, 238, 231, 0.78);
  text-align: center;
`;

const WeeksGrid = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const WeekRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 44px);
  gap: 10px;
`;

const DaySquare = styled.div<{ $color: string; $empty: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 9px;
  background: ${({ $color }) => $color};
  color: ${({ $empty }) => ($empty ? 'transparent' : '#2f1a0d')};
  font-size: 0.95rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
`;

const DayNumber = styled.span`
  opacity: 0.7;
`;

const LegendRow = styled.div`
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LegendSquare = styled.div<{ $color: string }>`
  width: 54px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid rgba(73, 44, 24, 0.2);
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  color: #fff;
  font-weight: 700;
  text-shadow: 0 1px 2px #222, 0 0px 1px #222;
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(209, 180, 140, 0.24);
  border-radius: 10px;
  padding: 12px;
`;

const MetricValue = styled.div`
  font-size: 1.6rem;
  font-weight: 800;
  color: #fff;
`;

const MetricLabel = styled.div`
  margin-top: 4px;
  font-size: 0.85rem;
  color: #fff;
`;

const MetricCardTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 1rem;
  color: #fff;
`;

const TenseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TenseRow = styled.div`
  display: grid;
  grid-template-columns: 12px 1fr auto;
  align-items: center;
  gap: 10px;
`;

const TenseColorDot = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const TenseName = styled.div`
  font-size: 0.9rem;
  color: #fff;
`;

const DistributionLayout = styled.div`
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  @media (max-width: 760px) {
    flex-direction: column;
  }
`;

const DonutChart = styled.div<{ $gradient: string }>`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: ${({ $gradient }) => $gradient};
  position: relative;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 34px;
    border-radius: 50%;
    background: rgba(20, 14, 9, 0.95);
    border: 1px solid rgba(209, 180, 140, 0.22);
  }
`;

const TensePercent = styled.div`
  text-align: right;
  font-weight: 700;
  font-size: 0.85rem;
  color: #fff;
`;

const EmptyText = styled.div`
  padding: 2em;
  color: #fff;
  margin: auto;
  text-align: center;
`;

function getMonthKey(selection: MonthSelection): number {
  return selection.year * 12 + (selection.month - 1);
}

function getBrownScaleColor(count: number): string {
  if (count <= 0) return '#f2ede7'; // 0
  if (count <= 9) return '#e6c9aa'; // 0+
  if (count <= 19) return '#d09f6e'; // 10+
  if (count <= 29) return '#b67745'; // 20+
  return '#8a5429'; // 30+
}

function buildMonthWeeks(year: number, month: number, dailyCounts: Map<string, number>): DayCell[][] {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const firstWeekday = (firstDay.getUTCDay() + 6) % 7; // Monday=0

  const cells: DayCell[] = [];

  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push({ dateKey: null, dayNumber: null, count: 0 });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(Date.UTC(year, month - 1, day));
    const dateKey = date.toISOString().slice(0, 10);
    cells.push({
      dateKey,
      dayNumber: day,
      count: dailyCounts.get(dateKey) ?? 0,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ dateKey: null, dayNumber: null, count: 0 });
  }

  const weeks: DayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return weeks;
}

function buildDonutGradient(slices: TenseSlice[]): string {
  if (slices.length === 0) {
    return '#2a1b10';
  }

  let start = 0;
  const segments = slices.map((slice) => {
    const end = Math.min(start + slice.percentage, 100);
    const segment = `${slice.color} ${start}% ${end}%`;
    start = end;
    return segment;
  });

  if (start < 100) {
    segments.push(`#2a1b10 ${start}% 100%`);
  }

  return `conic-gradient(${segments.join(', ')})`;
}

function Statistics() {
  const { isLoggedIn, userEmail } = useUser();
  const practiceClient = usePracticeClient();

  const [selection, setSelection] = useState<MonthSelection>(() => {
    const now = new Date();
    return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
  });
  const [statistics, setStatistics] = useState<PracticeStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setStatistics(null);
      setError(null);
      return;
    }

    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await practiceClient.getStatistics(selection.year, selection.month);
        if (!isMounted) {
          return;
        }

        setStatistics(response);

        if (response.month.year !== selection.year || response.month.month !== selection.month) {
          setSelection({ year: response.month.year, month: response.month.month });
        }
      } catch (requestError) {
        if (!isMounted) {
          return;
        }
        setError(requestError instanceof Error ? requestError.message : 'Could not load statistics.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, practiceClient, selection.year, selection.month]);

  const dayCountMap = useMemo(() => {
    const map = new Map<string, number>();
    statistics?.dailyCounts.forEach((entry) => {
      map.set(entry.date, entry.count);
    });
    return map;
  }, [statistics]);

  const weeks = useMemo(() => {
    if (!statistics) {
      return [];
    }
    return buildMonthWeeks(statistics.month.year, statistics.month.month, dayCountMap);
  }, [statistics, dayCountMap]);

  const canGoPrevious = useMemo(() => {
    if (!statistics) {
      return false;
    }
    const current = getMonthKey(selection);
    const min = getMonthKey({
      year: statistics.range.startYear,
      month: statistics.range.startMonth,
    });
    return current > min;
  }, [statistics, selection]);

  const canGoNext = useMemo(() => {
    if (!statistics) {
      return false;
    }
    const current = getMonthKey(selection);
    const max = getMonthKey({
      year: statistics.range.endYear,
      month: statistics.range.endMonth,
    });
    return current < max;
  }, [statistics, selection]);

  const stepMonth = (offset: number) => {
    setSelection((prev) => {
      const index = prev.year * 12 + (prev.month - 1) + offset;
      return {
        year: Math.floor(index / 12),
        month: (index % 12) + 1,
      };
    });
  };

  const tenseSlices = useMemo<TenseSlice[]>(() => {
    if (!statistics) {
      return [];
    }

    return statistics.tenseBreakdown.map((item, index) => ({
      tense: item.tense,
      percentage: item.percentage,
      color: PIE_COLORS[index % PIE_COLORS.length],
    }));
  }, [statistics]);

  const donutGradient = useMemo(() => buildDonutGradient(tenseSlices), [tenseSlices]);

  if (!isLoggedIn) {
    return (
      <Page>
        <EmptyStateContainer>
          <EmptyText>Login required to view your practice statistics.</EmptyText>
        </EmptyStateContainer>
      </Page>
    );
  }

  return (
    <Page>
      <UserEmailBar>
        Logged in as {userEmail ?? 'unknown email'}
      </UserEmailBar>
      <DashboardGrid>
        <LeftColumn>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Title style={{ textAlign: 'center', marginBottom: '18px' }}>Monthly Activity</Title>
            <MonthControls style={{ marginBottom: '18px' }}>
              <MonthButton onClick={() => stepMonth(-1)} disabled={!canGoPrevious || isLoading}>
                Prev
              </MonthButton>
              <MonthLabel>{statistics?.month.label ?? 'Loading...'}</MonthLabel>
              <MonthButton onClick={() => stepMonth(1)} disabled={!canGoNext || isLoading}>
                Next
              </MonthButton>
            </MonthControls>

            {error && <EmptyText>{error}</EmptyText>}

            {!error && (
              <>
                <WeekdayHeader style={{ margin: '0 auto' }}>
                  <WeekdayCell>Mon</WeekdayCell>
                  <WeekdayCell>Tue</WeekdayCell>
                  <WeekdayCell>Wed</WeekdayCell>
                  <WeekdayCell>Thu</WeekdayCell>
                  <WeekdayCell>Fri</WeekdayCell>
                  <WeekdayCell>Sat</WeekdayCell>
                  <WeekdayCell>Sun</WeekdayCell>
                </WeekdayHeader>

                <WeeksGrid style={{ margin: '0 auto' }}>
                  {weeks.map((week, weekIndex) => (
                    <WeekRow key={`week-${weekIndex}`}>
                      {week.map((day, dayIndex) => (
                        <DaySquare
                          key={day.dateKey ?? `empty-${weekIndex}-${dayIndex}`}
                          $color={getBrownScaleColor(day.count)}
                          $empty={day.dateKey === null}
                          title={day.dateKey && day.count > 0 ? `${day.count} practice` : undefined}
                        >
                          <DayNumber>{day.dayNumber ?? ''}</DayNumber>
                        </DaySquare>
                      ))}
                    </WeekRow>
                  ))}
                </WeeksGrid>

                <LegendRow style={{ margin: '0 auto', marginTop: '14px' }}>
                  <LegendSquare $color={getBrownScaleColor(0)}>0</LegendSquare>
                  <LegendSquare $color={getBrownScaleColor(1)}>0+</LegendSquare>
                  <LegendSquare $color={getBrownScaleColor(10)}>10+</LegendSquare>
                  <LegendSquare $color={getBrownScaleColor(20)}>20+</LegendSquare>
                  <LegendSquare $color={getBrownScaleColor(30)}>30+</LegendSquare>
                </LegendRow>
              </>
            )}
          </Card>
        </LeftColumn>

        <RightColumn>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MetricValue style={{ fontSize: '2rem', fontWeight: 800 }}>
              {statistics?.totals.monthly ?? 0} / {statistics?.totals.allTime ?? 0}
            </MetricValue>
            <MetricLabel style={{ marginTop: 8, fontSize: '1rem', color: '#f4eee7' }}>
              monthly practice – total practice
            </MetricLabel>
          </Card>

          <Card>
            <Title>Tense Distribution (Month)</Title>
            {tenseSlices.length > 0 ? (
              <DistributionLayout>
                <DonutChart $gradient={donutGradient} />
                <TenseList>
                  {tenseSlices.map((item) => (
                    <TenseRow key={item.tense}>
                      <TenseColorDot $color={item.color} />
                      <TenseName>{item.tense}</TenseName>
                      <TensePercent>{item.percentage.toFixed(1)}%</TensePercent>
                    </TenseRow>
                  ))}
                </TenseList>
              </DistributionLayout>
            ) : (
              <EmptyText>No practice data for this month.</EmptyText>
            )}
          </Card>
        </RightColumn>
      </DashboardGrid>
    </Page>
  );
}

export default Statistics;
