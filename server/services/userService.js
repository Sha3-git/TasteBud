const puppeteer = require("puppeteer");

const updateUser = async (userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
};
const generateHTML = ({
    user,
    monthlyAnalysis,
    suspectedFoods,
    crossReactions,
    year,
    month
}) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f7fb;
      padding: 20px;
      color: #333;
    }

    .container {
      background: white;
      border-radius: 12px;
      padding: 20px;
    }

    
    h1 {
        color: white;
        background-color: #475567;
        padding-block: 20px;
        padding-left: 10px;
    }

    .section {
      margin-top: 25px;
    }

    .card {
      background: #eef3ff;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 10px;
    }

    .grid {
      display: flex;
      gap: 15px;
    }

    .grid .card {
      flex: 1;
      text-align: center;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    th, td {
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }

    th {
      background: #475567;
      color: white;
    }

    .badge {
      padding: 5px 10px;
      border-radius: 6px;
      color: white;
    }

    .high { background: #e74c3c; }
    .medium { background: #f39c12; }
    .low { background: #27ae60; }
  </style>
</head>

<body>
  <div class="container">

    <h1>Health Report</h1>
    <p><strong>User:</strong> ${user.name || "N/A"}</p>
    <p><strong>Month:</strong> ${month}/${year}</p>

    <!-- SUMMARY -->
    <div class="section">
      <h2>Summary</h2>
      <div class="grid">
        <div class="card">
          <h3>${monthlyAnalysis.monthlyImprovement}%</h3>
          <p>Improvement</p>
        </div>
        <div class="card">
          <h3>${monthlyAnalysis.symptomFreeDays}</h3>
          <p>Symptom-Free Days</p>
        </div>
        <div class="card">
          <h3>${monthlyAnalysis.reactionCount}</h3>
          <p>Reactions</p>
        </div>
      </div>
    </div>

    <!-- WEEKLY TREND -->
    <div class="section">
      <h2>Weekly Severity Trend</h2>
      <canvas id="weeklyChart"></canvas>
    </div>

    <!-- TIME OF DAY -->
    <div class="section">
      <h2>Reactions by Time of Day</h2>
      <canvas id="timeChart"></canvas>
    </div>

    <!-- SUSPECTED FOODS -->
    <div class="section">
      <h2>Suspected Ingredients</h2>
      <table>
        <tr>
          <th>Ingredient</th>
          <th>Confidence</th>
          <th>Reaction Rate</th>
          <th>Severity</th>
          <th>Recommendation</th>
        </tr>

        ${suspectedFoods.map(f => `
          <tr>
            <td>${f.ingredientName}</td>
            <td><span class="badge ${f.confidence}">${f.confidence}</span></td>
            <td>${f.reactionRate}%</td>
            <td>${f.avgSeverity}</td>
            <td>${f.recommendation}</td>
          </tr>
        `).join("")}

      </table>
    </div>

    <!-- CROSS REACTIONS -->
    <div class="section">
      <h2>Cross Reactions</h2>

      ${crossReactions.map(cr => `
        <div class="card">
          <strong>${cr.ingredientName}</strong> → ${cr.relatedFoods?.join(", ") || "N/A"}
        </div>
      `).join("")}

    </div>

  </div>

<script>
  const weeklyData = ${JSON.stringify(monthlyAnalysis.weeklyTrend)};

  new Chart(document.getElementById('weeklyChart'), {
    type: 'line',
    data: {
      labels: weeklyData.map(w => w.week),
      datasets: [{
        label: 'Avg Severity',
        data: weeklyData.map(w => w.avgSeverity),
        borderWidth: 2
      }]
    }
  });

  const timeData = ${JSON.stringify(monthlyAnalysis.timeOfDay)};

  new Chart(document.getElementById('timeChart'), {
    type: 'pie',
    data: {
      labels: ['Breakfast', 'Lunch', 'Dinner'],
      datasets: [{
        data: [
          timeData.breakfast,
          timeData.lunch,
          timeData.dinner
        ]
      }]
    }
  });
</script>

</body>
</html>
`;
};
const generateUserReport = async ({
    user,
    monthlyAnalysis,
    suspectedFoods,
    crossReactions,
    year,
    month
}) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const html = generateHTML({
        user,
        monthlyAnalysis,
        suspectedFoods,
        crossReactions,
        year,
        month
    });

    await page.setContent(html, { waitUntil: "networkidle0" });

    await page.pdf({
        path: `report-${user._id}.pdf`,
        format: "A4",
        printBackground: true
    });

    await browser.close();
};

module.exports = {
    updateUser,
    generateUserReport
};