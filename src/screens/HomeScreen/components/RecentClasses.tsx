import { View, Text } from "react-native";
import React from "react";
import { Sub2Text } from "@/src/theme/typography/SubtitleText";
import { TextFontType } from "@/src/theme/typography/typography";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import ClassCardOverview from "@/src/components/UI/ClassCardOverview";
import { IClass, IClassHeader } from "@/src/contracts/course";

const RecentClasses = ({
  loadingRecentClass,
  recentClass,
}: {
  loadingRecentClass: boolean;
  recentClass: IClassHeader[] | null;
}) => {
  return (
    <View className="mt-4">
      <Sub2Text
        type={TextFontType.Bold}
        text="Last Class Overview"
        customClassName="mb-2"
      />
      {loadingRecentClass ? (
        <LoadingComponent />
      ) : recentClass && recentClass.length ? (
        recentClass.map((classItem) => (
          <ClassCardOverview
            key={classItem.id}
            title={classItem.course.title}
            courseCode={classItem.course.code}
            startTime={classItem.startTime}
            endTime={classItem.endTime}
            showAttendanceStats={false}
            showAttendanceAvg={false}
            // title={`Introduction to Biology ${classItem.id}`}
          />
        ))
      ) : (
        <Text>No Data</Text>
      )}
    </View>
  );
};

export default RecentClasses;
