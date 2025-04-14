import { View, Text } from "react-native";
import { ProgressChart } from "react-native-chart-kit";

import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: "transparent",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "transparent",
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(0, 106, 113, ${opacity})`, // bar color
  labelColor: (opacity = 1) => `rgba(0, 106, 113, ${opacity})`, // label color
  strokeWidth: 2,
  useShadowColorFromDataset: false,
  propsForBackgroundLines: {
    stroke: "#e3e3e3", // subtle gridlines
  },
  propsForLabels: {
    fontSize: 12,
  },
  decimalPlaces: 0,
};

type ProgressRingProps = {
  graphData: {
    labels: string[];
    datasets: { data: number[] }[];
  };
  ySuffixLabel: string;
};

const ProgressRing = ({ graphData, ySuffixLabel }: ProgressRingProps) => {
  return (
    <View style={{ gap: 10 }}>
      <ProgressChart
        data={{
          labels: graphData.labels,
          data: graphData.datasets[0]?.data || [],
        }}
        width={screenWidth - 275}
        height={150}
        strokeWidth={12}
        chartConfig={chartConfig}
        hideLegend={true}
      />
    </View>
  );
};

export default ProgressRing;
