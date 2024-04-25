import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  Company,
  JobTabs,
  JobAbout,
  JobFooter,
  ScreenHeaderBtn,
  Specifics,
} from "../../components";
import { useCallback, useState } from "react";
import {
  useRouter,
  Stack,
  useSearchParams,
  useGlobalSearchParams,
} from "expo-router";
import { COLORS, icons, SIZES } from "../../constants";
import useFetch from "../../hook/useFetch";

const JobDetails = () => {
  const params = useGlobalSearchParams();
  const router = useRouter();
  const { data, isLoading, error, reFetch } = useFetch("job-details", {
    job_id: params.id,
  });

  const [refreshing, setRefreshing] = useState(false);
  const tabs = ["About", "Qualifications", "Responsibilities"];
  const [activeTab, setActiveTab] = useState(tabs[0])

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    reFetch();
    setRefreshing(false);
  },[])

  const displayTabContent = () => {
    switch (activeTab) {
      case "Qualifications":
        return <Specifics
          title="Qualification"
          points={data.data[0]?.job_highlights?.Qualifications ?? ['N/A']}
        />
        break;
      case "About":
        return <JobAbout
          info={data.data[0]?.job_description ?? "No data provided"}
        />
        break;
      case "Responsibilities":
        return  <Specifics
        title="Responsibilities"
        points={data.data[0]?.job_highlights?.Responsibilities ?? ['N/A']}
      />
        break;

      default:
        break;
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerRight: () => (
            <ScreenHeaderBtn iconUrl={icons.share} dimension="60%" />
          ),
          headerTitle: "",
        }}
      />
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : error ? (
            <Text>Something went wrong</Text>
          ) : data.length === 0 ? (
            <Text>No data</Text>
          ) : (
            <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
              <Company
                companyLogo={data?.data[0]?.employer_logo}
                jobTitle={data?.data[0]?.job_title}
                companyName={data?.data[0]?.employer_name}
                location={data?.data[0]?.job_country}
              />

              <JobTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              {displayTabContent()}

            </View>
          )}
        </ScrollView>
        <JobFooter
          url={data[0]?.job_google_link ?? 'https://careers/google.com/jobs/results'}
        />
      </>
    </SafeAreaView>
  );
};

export default JobDetails;
