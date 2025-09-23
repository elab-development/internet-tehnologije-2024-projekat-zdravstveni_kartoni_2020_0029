import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useCorona } from "./hooks/useCorona";
import Layout from "../layout/Layout";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// 📌 Tip za podatke trenda
interface TrendPoint {
  period: string;
  novi_slucajevi: number;
  ukupno_smrti: number;
}

function CoronaTrendChart() {
  const { regions, fetchRegions, fetchReport, loading, error } = useCorona();
  const [selectedIso, setSelectedIso] = useState<string>("");
  const [trend, setTrend] = useState<TrendPoint[]>([]);

  const quarters = [
    "2020-03-31",
    "2020-06-30",
    "2020-09-30",
    "2020-12-31",
    "2021-03-31",
    "2021-06-30",
    "2021-09-30",
    "2021-12-31",
  ];

  // 📌 Učitaj listu država
  useEffect(() => {
    fetchRegions();
  }, []);

  // 📌 Default na SRB ili prvu državu
  useEffect(() => {
    if (regions.length > 0 && !selectedIso) {
      const srb = regions.find((r) => r.iso === "SRB");
      setSelectedIso(srb ? srb.iso : regions[0].iso);
    }
  }, [regions]);

  // 📌 Učitaj trend za izabranu državu
  useEffect(() => {
    const loadTrend = async () => {
      const promises = quarters.map((date) =>
        fetchReport(selectedIso, date).then((rep) =>
          rep
            ? {
                period: date.slice(0, 7),
                novi_slucajevi: rep.novi_slucajevi,
                ukupno_smrti: rep.ukupno_smrti,
              }
            : null
        )
      );
      const results = (await Promise.all(promises)).filter(
        (r): r is TrendPoint => r !== null
      );
      setTrend(results);
    };

    if (selectedIso) loadTrend();
  }, [selectedIso]);

  // 📊 Dataset: dva grafa
  const chartData = {
    labels: trend.map((t) => t.period),
    datasets: [
      {
        label: "Novi slučajevi",
        data: trend.map((t) => t.novi_slucajevi),
        borderColor: "blue",
        backgroundColor: "blue",
        fill: false,
      },
      {
        label: "Ukupno smrti",
        data: trend.map((t) => t.ukupno_smrti),
        borderColor: "red",
        backgroundColor: "red",
        fill: false,
      },
    ],
  };

  return (
    <Layout>
      <Box>
        <Typography variant="h5" gutterBottom>
          COVID trend (Novi slučajevi i Ukupne smrti, 2020–2021)
        </Typography>

        <FormControl sx={{ minWidth: 200, mb: 3 }}>
          <InputLabel>Izaberi državu</InputLabel>
          <Select
            value={selectedIso || ""}
            onChange={(e) => setSelectedIso(e.target.value)}
            label="Izaberi državu"
          >
            {regions.map((r, idx) => (
              <MenuItem key={`${r.iso}-${idx}`} value={r.iso}>
                {r.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {loading && <p>Učitavanje...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {trend.length > 0 && (
          <Box sx={{ p: 8, height: 700, width: "100%" }}>
            <Line data={chartData} options={{ maintainAspectRatio: false }} />
          </Box>
        )}
      </Box>
    </Layout>
  );
}

export default CoronaTrendChart;
