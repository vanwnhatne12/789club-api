const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Thuật toán VIP không random
function duDoanVIP(dice) {
  const tong = dice.reduce((a, b) => a + b, 0);
  let prediction = "";
  let ly_do = "";

  if (tong <= 10 && new Set(dice).size <= 2) {
    prediction = "Xỉu";
    ly_do = `Tổng ${tong} nhỏ hơn 10 và có ít nhất 2 xúc xắc giống nhau`;
  } else if (tong >= 11 && new Set(dice).size === 3) {
    prediction = "Tài";
    ly_do = `Tổng ${tong} lớn hơn 10 và 3 xúc xắc khác nhau`;
  } else if (tong % 2 === 0) {
    prediction = "Tài";
    ly_do = `Tổng ${tong} là số chẵn → xu hướng Tài`;
  } else {
    prediction = "Xỉu";
    ly_do = `Tổng ${tong} là số lẻ → xu hướng Xỉu`;
  }

  const chi_tiet = `Tổng: ${tong} (${dice.join(" + ")})`;
  const do_tin_cay = `${Math.min(99.99, 50 + Math.abs(11 - tong) * 4).toFixed(2)}%`;

  return { prediction, ly_do, chi_tiet, do_tin_cay };
}

// API endpoint
app.get("/api/789", async (req, res) => {
  try {
    const response = await axios.get("https://seven89club-taixiu.onrender.com/taixiu");
    const data = response.data;

    const phien_truoc = data.phien_truoc;
    const phien_tiep_theo = data.phien_hien_tai;
    const xuc_xac = data.Dice;
    const ket_qua = data.ket_qua;

    const { prediction, ly_do, chi_tiet, do_tin_cay } = duDoanVIP(xuc_xac);

    const result = {
      phien_truoc: phien_truoc,
      xuc_xac: xuc_xac,
      ket_qua: ket_qua,
      phien_tiep_theo: phien_tiep_theo,
      prediction: prediction,
      tin_cay: do_tin_cay,
      chi_tiet_du_doan: chi_tiet,
      ly_do: ly_do,
      id: "Tele@QuocHuy_207"
    };

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(result, null, 2)); // đẹp JSON
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server
app.listen(PORT, () => {
  console.log(`API is running on port ${PORT}`);
});