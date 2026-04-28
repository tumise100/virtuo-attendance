import CustomAvatar from "@/src/components/UI/CustomAvatar";
import CustomPaperTextInputWithIcons from "@/src/components/UI/Inputs/CustomPaperTextInputWithIcons";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import { showToast } from "@/src/components/UI/showToast";
import { IClassHeader } from "@/src/contracts/course";
import { IStudent } from "@/src/contracts/user";
import { GetAttendanceStats, GetStudentAttendance, GetStaffAttendance } from "@/src/services/attendance";
import { asArray } from "@/src/utils";
import { useDragToClose } from "@/src/components/UI/useDragToClose";
import { GetNotifications } from "@/src/services/communication";
import { GetSchoolTimetable, GetTodaySchedule } from "@/src/services/timetable";
import { combineStore } from "@/src/store";
import { COLORS } from "@/src/theme/colors";
import { InputLabelMedium12, TextMedium14 } from "@/src/theme/typography";
import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { GetMe } from "@/src/services/auth";
import React, { useEffect, useState } from "react";
import { GetCurrentSession, GetSessions, GetTerms, SetCurrentTerm } from "@/src/services/academic-session";
import { Modal, Pressable, RefreshControl } from "react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import QuickAction from "./components/QuickAction";
import RecentClasses from "./components/RecentClasses";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<any, any>;
}) => {
  const [attendanceOverview, setAttendanceOverview] = useState<any[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState<{ todayPresent: number; todayAbsent: number }>({ todayPresent: 0, todayAbsent: 0 });
  const [todayStudentAttendance, setTodayStudentAttendance] = useState<any[]>([]);
  const [todayStaffAttendance, setTodayStaffAttendance] = useState<any[]>([]);
  const [todaySchedules, setTodaySchedules] = useState<any[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [currentAcademicInfo, setCurrentAcademicInfo] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const { user, updateUser, activeTermId, activeSessionId, updateActiveTerm } = combineStore();
  const [userPickedTerm, setUserPickedTerm] = useState(false);
  const [sessionPickerOpen, setSessionPickerOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const sessionDragHandlers = useDragToClose(() => setSessionPickerOpen(false));

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Refresh sequentially to keep the UI responsive while the main
      // JS thread processes each response before firing the next.
      await fetchCurrentSession();
      await fetchAttendanceOverview();
      if (user) await fetchTodaySchedules(user);
      await fetchNotificationCount();
    } finally {
      setRefreshing(false);
    }
  };

  const [loadingOverview, setLoadingOverview] = useState(false);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchNotificationCount();
    fetchCurrentSession();
  }, []);

  // Look up the selected term's date window so the home data can be
  // scoped to whichever session/term the user has picked.
  const selectedTermDateRange = React.useMemo(() => {
    if (!activeTermId) return null;
    for (const s of sessions) {
      const t = (s?.terms || []).find((tt: any) => tt.id === activeTermId);
      if (t) {
        return {
          sessionId: s.id,
          termId: t.id,
          startDate: t.startDate,
          endDate: t.endDate,
        };
      }
    }
    const fallback = currentAcademicInfo?.term;
    if (fallback) {
      return {
        sessionId: currentAcademicInfo?.session?.id,
        termId: fallback.id,
        startDate: fallback.startDate,
        endDate: fallback.endDate,
      };
    }
    return null;
  }, [sessions, activeTermId, currentAcademicInfo]);

  useEffect(() => {
    fetchAttendanceOverview();
    if (user) fetchTodaySchedules(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTermId, activeSessionId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchNotificationCount();
    }, [])
  );

  const fetchUser = () => {
    setLoadingUser(true);
    GetMe()
      .then(({ responseData, responseStatus }) => {
        if (responseStatus === 200 && responseData.accounts) {
          const user = responseData;
          const accounts = user.accounts || [];

          if (!user.firstName || !user.lastName) {
            const staffAccount = accounts.find((acc: any) => acc.type === "STAFF");
            const schoolAccount = accounts.find((acc: any) => acc.type === "SCHOOL");
            const adminAccount = accounts.find((acc: any) => acc.type === "ADMIN");

            if (staffAccount?.staff) {
              user.firstName = staffAccount.staff.firstName || "";
              user.lastName = staffAccount.staff.lastName || "";
            } else if (schoolAccount?.school) {
              user.firstName = schoolAccount.school.ownerName || schoolAccount.school.name || "School";
              user.lastName = "Owner";
            } else if (adminAccount) {
              user.firstName = "Admin";
              user.lastName = "User";
            }
          }
          updateUser(user);
          fetchTodaySchedules(user);
        } else if (responseStatus !== 200) {
          showToast(responseData.message || "Failed to fetch profile");
        }
      })
      .catch((err) => {
        console.error("fetchUser error:", err);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  };

  const fetchAttendanceOverview = async () => {
    setLoadingOverview(true);
    const today = moment().format('YYYY-MM-DD');

    const termRange = selectedTermDateRange;
    const termFromIso = termRange?.startDate ? moment(termRange.startDate).format('YYYY-MM-DD') : null;
    const termToIso = termRange?.endDate ? moment(termRange.endDate).format('YYYY-MM-DD') : null;
    const todayDate = moment(today);
    const termStartMoment = termFromIso ? moment(termFromIso) : null;
    const termEndMoment = termToIso ? moment(termToIso) : null;
    const isTodayWithinSelectedTerm = !termRange ||
      ((!termStartMoment || todayDate.isSameOrAfter(termStartMoment, 'day')) &&
       (!termEndMoment || todayDate.isSameOrBefore(termEndMoment, 'day')));

    // "Marked today" is only meaningful when today falls inside the
    // selected term. When it doesn't, we show the latest day of records
    // from that term instead, so the cards still reflect the chosen scope.
    const studentQuery: any = {};
    const staffQuery: any = {};
    if (isTodayWithinSelectedTerm) {
      studentQuery.date = today;
      staffQuery.date = today;
    } else if (termFromIso && termToIso) {
      studentQuery.fromDate = termFromIso;
      studentQuery.toDate = termToIso;
      staffQuery.fromDate = termFromIso;
      staffQuery.toDate = termToIso;
    }
    if (termRange?.termId) {
      studentQuery.termId = termRange.termId;
    }
    if (termRange?.sessionId) {
      studentQuery.sessionId = termRange.sessionId;
    }

    // Fire sequentially so each response paints before the next request
    // starts. With Promise.all every response lands at once and React
    // batches the state updates, which made the home screen stutter on
    // slower devices or large datasets.
    try {
      const statsRes = await GetAttendanceStats({ period: 'today' });
      if (statsRes.responseStatus === 200) {
        const data = statsRes.responseData || {};
        setAttendanceSummary({
          todayPresent: data.todayPresent || 0,
          todayAbsent: data.todayAbsent || 0,
        });
        setAttendanceOverview(asArray(data.trend));
      }

      const studentsRes = await GetStudentAttendance(studentQuery);
      if (studentsRes.responseStatus === 200) {
        setTodayStudentAttendance(asArray(studentsRes.responseData));
      }

      const staffRes = await GetStaffAttendance(staffQuery);
      if (staffRes.responseStatus === 200) {
        setTodayStaffAttendance(asArray(staffRes.responseData));
      }
    } catch (err) {
      console.error("fetchAttendanceOverview error:", err);
    } finally {
      setLoadingOverview(false);
    }
  };

  const fetchTodaySchedules = async (currentUser?: any) => {
    setLoadingSchedules(true);

    const accountUser = currentUser || user;
    const accounts = accountUser?.accounts || [];
    const staffAccount = accounts.find((acc: any) => acc.type === "STAFF");
    const schoolAccount = accounts.find((acc: any) => acc.type === "SCHOOL");

    const formatToday = moment().format("dddd").toLowerCase();
    const normalizeDay = (input: string = "") => input.trim().toLowerCase();

    const request = staffAccount?.staff?.id
      ? GetTodaySchedule(Number(staffAccount.staff.id), selectedTermDateRange?.termId)
      : schoolAccount?.school?.id
        ? GetSchoolTimetable(selectedTermDateRange?.termId)
        : null;

    if (!request) {
      setTodaySchedules([]);
      setLoadingSchedules(false);
      return;
    }

    try {
      const { responseData, responseStatus } = await request;
      if (responseStatus === 200) {
        const rows = Array.isArray(responseData) ? responseData : [];
        const filteredRows = rows.filter(
          (schedule: any) => normalizeDay(schedule?.day || "") === formatToday,
        );
        setTodaySchedules(filteredRows);
      }
    } catch (err) {
      console.error("fetchTodaySchedules error:", err);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const fetchNotificationCount = async () => {
    try {
      const { responseData, responseStatus } = await GetNotifications(true, activeTermId || undefined);
      if (responseStatus === 200) {
        const unread = (responseData || []).filter((n: any) => !n.isRead).length;
        setNotificationCount(unread);
      }
    } catch (err) {
      console.error("fetchNotificationCount error:", err);
    }
  };

  const fetchCurrentSession = async () => {
    try {
      const currentRes = await GetCurrentSession();
      if (currentRes.responseStatus === 200 && currentRes.responseData) {
        setCurrentAcademicInfo(currentRes.responseData);
        if (!userPickedTerm) {
          updateActiveTerm(currentRes.responseData.term?.id ?? null, currentRes.responseData.session?.id ?? null);
        }
      }
      const allRes = await GetSessions();
      if (allRes.responseStatus === 200) {
        setSessions(asArray(allRes.responseData));
      }
    } catch (err) {
      console.error("fetchCurrentSession error:", err);
    }
  };

  // return <Text>Hello</Text>;

  if (loadingUser) {
    return (
      <View className="flex-1 bg-white p-3">
        <LoadingComponent />
        <LoadingComponent />
        <LoadingComponent />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-4 pt-2"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#F97316" colors={["#F97316"]} />}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu-outline" size={30} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 max-w-[60%]"
            onPress={() => setSessionPickerOpen(true)}
          >
            {(() => {
              // Look up session/term across all loaded sessions, then fall
              // back to currentAcademicInfo, then to any session containing
              // the selected term. This keeps the pill in sync with whichever
              // value the user just picked — even if the session itself isn't
              // the one currently marked as "current" on the backend.
              let sess: any = sessions.find((s: any) => s.id === activeSessionId);
              if (!sess && activeTermId) {
                sess = sessions.find((s: any) => (s?.terms || []).some((t: any) => t.id === activeTermId));
              }
              if (!sess) sess = currentAcademicInfo?.session;

              let term: any = sess?.terms?.find?.((t: any) => t.id === activeTermId);
              if (!term && activeTermId) {
                for (const s of sessions) {
                  const found = (s?.terms || []).find((t: any) => t.id === activeTermId);
                  if (found) { term = found; break; }
                }
              }
              if (!term) term = currentAcademicInfo?.term;

              return (
                <Text className="text-sm font-semibold mr-2" numberOfLines={1}>
                  {sess?.name || "Select session"} • {term?.name || "No term"}
                </Text>
              );
            })()}
            <Ionicons name="chevron-down" size={18} color="black" />
          </TouchableOpacity>

          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => navigation.navigate("AnnouncementsScreen")}
              className="relative"
            >
              <Ionicons name="notifications-outline" size={26} color="black" />
              {/* Notification Badge */}
              {notificationCount > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full items-center justify-center">
                  <Text className="text-[10px] text-white font-bold">{notificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            <CustomAvatar
              size={40}
              name={`${user?.firstName || 'User'} ${user?.lastName || ''}`}
              onPress={() => navigation.navigate("ProfileScreen")}
            />
          </View>
        </View>

        {/* Today's Attendance Summary */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-black">Today's Attendance</Text>
            <Text className="text-xs text-gray-500">{moment().format('ddd, Do MMM')}</Text>
          </View>

          <View className="flex-row">
            <View className="flex-1 bg-green-50 border border-green-100 rounded-2xl p-3 mr-2">
              <Text className="text-xs text-green-700">Present</Text>
              <Text className="text-2xl font-bold text-green-700 mt-1">{attendanceSummary.todayPresent}</Text>
            </View>
            <View className="flex-1 bg-red-50 border border-red-100 rounded-2xl p-3 ml-2">
              <Text className="text-xs text-red-700">Absent</Text>
              <Text className="text-2xl font-bold text-red-700 mt-1">{attendanceSummary.todayAbsent}</Text>
            </View>
          </View>
        </View>

        {/* Quick Action */}
        <QuickAction />

        {/* Students Marked Today */}
        <View className="mt-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold text-gray-900">Students Marked Today ({todayStudentAttendance.length})</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AttendanceHistoryDetailScreen" as any, {
                date: moment().format('YYYY-MM-DD'),
                attendancePeriod: moment().hours() >= 12 ? 'Afternoon' : 'Morning',
              })}
            >
              <Text className="text-sm font-semibold text-primary-500">See all</Text>
            </TouchableOpacity>
          </View>
          {todayStudentAttendance.length === 0 ? (
            <View className="bg-gray-50 rounded-xl p-4 items-center">
              <Text className="text-gray-400 text-xs">No student attendance yet</Text>
            </View>
          ) : (
            todayStudentAttendance.slice(0, 3).map((record: any, index: number) => {
              const student = record?.student || {};
              const fullName = [student.firstName, student.lastName].filter(Boolean).join(' ') || 'Student';
              const markedAt = record?.date ? moment(record.date).format('h:mm A') : '';
              return (
                <View key={`s-${record?.id || index}`} className="bg-white border border-gray-100 rounded-2xl p-3 flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center flex-1">
                    <CustomAvatar name={fullName} size={36} />
                    <View className="ml-3 flex-1">
                      <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>{fullName}</Text>
                      <Text className="text-[11px] text-gray-500">{student.currentClass?.name || 'Student'} • {markedAt}</Text>
                    </View>
                  </View>
                  <View className={`px-2 py-1 rounded-full ${record?.status === 'PRESENT' ? 'bg-green-50' : 'bg-red-50'}`}>
                    <Text className={`text-[10px] font-bold ${record?.status === 'PRESENT' ? 'text-green-600' : 'text-red-600'}`}>{record?.status || 'PRESENT'}</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Staff Marked Today */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold text-gray-900">Staff Marked Today ({todayStaffAttendance.length})</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AttendanceHistoryDetailForInstructorScreen" as any, {
                date: moment().format('YYYY-MM-DD'),
                attendancePeriod: moment().hours() >= 12 ? 'Afternoon' : 'Morning',
              })}
            >
              <Text className="text-sm font-semibold text-primary-500">See all</Text>
            </TouchableOpacity>
          </View>
          {todayStaffAttendance.length === 0 ? (
            <View className="bg-gray-50 rounded-xl p-4 items-center">
              <Text className="text-gray-400 text-xs">No staff attendance yet</Text>
            </View>
          ) : (
            todayStaffAttendance.slice(0, 3).map((record: any, index: number) => {
              const staff = record?.staff || {};
              const fullName = [staff.firstName, staff.lastName].filter(Boolean).join(' ') || 'Staff';
              const markedAt = record?.date ? moment(record.date).format('h:mm A') : '';
              return (
                <View key={`st-${record?.id || index}`} className="bg-white border border-gray-100 rounded-2xl p-3 flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center flex-1">
                    <CustomAvatar name={fullName} size={36} />
                    <View className="ml-3 flex-1">
                      <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>{fullName}</Text>
                      <Text className="text-[11px] text-gray-500">{staff.designation || 'Staff'} • {markedAt}</Text>
                    </View>
                  </View>
                  <View className={`px-2 py-1 rounded-full ${record?.status === 'PRESENT' ? 'bg-green-50' : 'bg-red-50'}`}>
                    <Text className={`text-[10px] font-bold ${record?.status === 'PRESENT' ? 'text-green-600' : 'text-red-600'}`}>{record?.status || 'PRESENT'}</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Today Schedules */}
        <View className="mt-6 mb-24">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-black">Today Schedules</Text>
            <TouchableOpacity onPress={() => navigation.navigate("TimetableScreen" as any)}>
              <Text className="text-sm font-semibold text-primary-500">See all</Text>
            </TouchableOpacity>
          </View>
          <View>
            {todaySchedules.length === 0 ? (
              <View className="bg-gray-50 rounded-xl p-6 items-center">
                <Text className="text-gray-400">No classes scheduled for today</Text>
              </View>
            ) : (
              todaySchedules.slice(0, 10).map((schedule: any, index: number) => {
                const staffName = [
                  schedule?.staff?.firstName,
                  schedule?.staff?.lastName,
                ]
                  .filter(Boolean)
                  .join(" ") || schedule?.teacherName || "";
                return (
                  <View
                    key={schedule?.id || index}
                    className={`border rounded-xl p-4 flex-row justify-between items-center mb-2 ${
                      index % 4 === 0 ? 'border-green-200 bg-green-50' :
                      index % 4 === 1 ? 'border-purple-200 bg-purple-50' :
                      index % 4 === 2 ? 'border-blue-200 bg-blue-50' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <View className="flex-1 pr-2">
                      <Text className="text-base font-bold text-gray-900" numberOfLines={1}>{schedule?.subject?.name || 'Subject'}</Text>
                      <Text className="text-xs text-gray-500 mt-1">{schedule?.startTime} - {schedule?.endTime}</Text>
                      {staffName ? (
                        <Text className="text-[11px] text-gray-600 mt-1" numberOfLines={1}>Teacher: {staffName}</Text>
                      ) : null}
                    </View>
                    <View className="items-end">
                      <Text className="text-xs font-bold text-gray-900">{schedule?.class?.name || 'Class'}</Text>
                      {schedule?.class?.section?.name ? (
                        <Text className="text-[10px] text-gray-500">{schedule.class.section.name}</Text>
                      ) : null}
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </View>

      </ScrollView>

      <Modal transparent visible={sessionPickerOpen} animationType="slide" onRequestClose={() => setSessionPickerOpen(false)}>
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={() => setSessionPickerOpen(false)}>
          <Pressable className="bg-white rounded-t-3xl p-6 pb-10 max-h-[80%]" onPress={(e) => e.stopPropagation()}>
            <View {...sessionDragHandlers} className="items-center mb-4 py-2">
              <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </View>
            <Text className="text-lg font-bold mb-4 text-black">Select Session & Term</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {sessions.length === 0 ? (
                <View className="bg-gray-50 rounded-xl p-6 items-center">
                  <Text className="text-gray-400">No sessions available</Text>
                </View>
              ) : (
                sessions.map((sess: any) => {
                  const isSelectedSess = sess.id === activeSessionId;
                  const terms = asArray(sess?.terms);
                  return (
                    <View key={sess.id} className="mb-4">
                      <TouchableOpacity
                        onPress={() => {
                          updateActiveTerm(terms[0]?.id ?? null, sess.id);
                          setUserPickedTerm(true);
                        }}
                        className={`flex-row items-center justify-between p-3 border rounded-xl ${isSelectedSess ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}`}
                      >
                        <Text className="text-base font-semibold text-gray-900">{sess.name}</Text>
                        {sess.isCurrent ? (
                          <View className="bg-green-100 px-2 py-0.5 rounded-full">
                            <Text className="text-[10px] text-green-700 font-bold">CURRENT</Text>
                          </View>
                        ) : null}
                      </TouchableOpacity>
                      {isSelectedSess && terms.length > 0 && (
                        <View className="mt-2 ml-2">
                          {terms.map((term: any) => (
                            <TouchableOpacity
                              key={term.id}
                              onPress={() => {
                                updateActiveTerm(term.id);
                                setUserPickedTerm(true);
                              }}
                              className={`flex-row items-center justify-between px-3 py-2 mb-1 rounded-lg ${activeTermId === term.id ? 'bg-orange-100' : 'bg-gray-50'}`}
                            >
                              <Text className={`text-sm ${activeTermId === term.id ? 'text-orange-700 font-semibold' : 'text-gray-700'}`}>{term.name}</Text>
                              {term.isCurrent ? (
                                <Text className="text-[10px] text-green-700 font-bold">CURRENT</Text>
                              ) : null}
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })
              )}
            </ScrollView>
            <View className="flex-row mt-2">
              <TouchableOpacity
                onPress={() => setSessionPickerOpen(false)}
                className="flex-1 border border-gray-200 rounded-xl py-3 items-center mr-2"
              >
                <Text className="text-gray-700 font-semibold">Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  if (activeTermId) {
                    try {
                      await SetCurrentTerm(activeTermId);
                      fetchCurrentSession();
                      showToast("Session & term updated");
                    } catch (e) {
                      console.error("Set current term error:", e);
                    }
                  }
                  setSessionPickerOpen(false);
                }}
                className="flex-1 bg-orange-500 rounded-xl py-3 items-center ml-2"
              >
                <Text className="text-white font-semibold">Apply</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-4">
        <TouchableOpacity
          className="bg-orange-500 flex-row items-center px-6 py-4 rounded-full shadow-lg"
          onPress={() => navigation.navigate("AttendanceTakingForSecondaryScreen")}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text className="text-white font-bold text-base ml-2">Mark Attendance</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default HomeScreen;
