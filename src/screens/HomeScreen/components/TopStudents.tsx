import { View, Text } from "react-native";
import React from "react";
import { Sub2Text } from "@/src/theme/typography/SubtitleText";
import { TextFontType } from "@/src/theme/typography/typography";
import LoadingComponent from "@/src/components/UI/LoadingComponent";
import StudentOverviewCard from "@/src/components/UI/StudentOverviewCard";
import { IStudent } from "@/src/contracts/user";

const TopStudents = ({
  loadingAllStudent,
  allStudents,
}: {
  loadingAllStudent: boolean;
  allStudents: IStudent[] | null;
}) => {
  return (
    <View className="my-3">
      <Sub2Text
        type={TextFontType.Bold}
        text="Top Students"
        customClassName="mb-2"
      />
      <View>
        {loadingAllStudent ? (
          <LoadingComponent />
        ) : allStudents && allStudents.length ? (
          allStudents.map(
            ({ id, student: { firstName, lastName } }) => (
              <StudentOverviewCard
                key={id}
                fullName={`${firstName} ${lastName}`}
                // Presentational only — no onPress so the card doesn't
                // navigate to a hard-coded / wrong student id.
              />
            )
          )
        ) : (
          <Text>No Data</Text>
        )}
        {/* <StudentOverviewCard />
          <StudentOverviewCard />
          <StudentOverviewCard /> */}
      </View>
    </View>
  );
};

export default TopStudents;
