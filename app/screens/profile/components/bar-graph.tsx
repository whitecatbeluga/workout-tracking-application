import { View, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";

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

type BarGraphProps = {
  graphData: {
    labels: string[];
    datasets: { data: number[] }[];
  };
  ySuffixLabel: string;
};

const BarGraph = ({ graphData, ySuffixLabel }: BarGraphProps) => {
  return (
    <View style={{ gap: 10 }}>
      <BarChart
        data={graphData}
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix={ySuffixLabel}
        chartConfig={chartConfig}
      />
    </View>
  );
};

export default BarGraph;
