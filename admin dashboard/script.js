// Initialize circular progress on each KPI card.
// For each .card, read the percentage text inside .number p, parse it to a number,
// and assign it to the CSS variable --percent on the .progress-circle SVG.
document.querySelectorAll('.card').forEach(card => {
  const percentText = card.querySelector('.number p').textContent; // e.g. "77%"
  const percent = parseInt(percentText, 10); // "77%" -> 77 (integer)
  const svg = card.querySelector('.progress-circle');
  svg.style.setProperty('--percent', percent); // drives the stroke-dashoffset in CSS
});

// Sidebar and layout elements used for toggling visibility/compact state
let container = document.querySelector(".container");
let sidebar_anchor = document.querySelectorAll("aside .sidebar a");
let sidebar_links = document.querySelectorAll("aside .sidebar a h3");
let logo_and_name = document.querySelector(".logo-and-name");
let logo_name = document.querySelector(".logo-and-name h2");
let charts_container = document.querySelector(".charts-row");
let line_graphs = document.querySelector('.line-graph');
let pie_graphs = document.querySelector('.pie-graph');
let close_btn = document.querySelector(".close-btn"); // close sidebar (mobile)
let menu_btn = document.querySelector(".menu-btn"); // open sidebar (mobile)
let aside = document.querySelector("aside"); // sidebar element
let slide_menu_btn = document.querySelector(".slide-menu-btn"); // collapse/expand toggle

// Open sidebar on small screens: show aside, ensure hidden class is removed, and reveal close button
menu_btn.addEventListener('click', () => {
  aside.classList.add("aside-show");
  aside.classList.remove("aside-hide");
  close_btn.style.display = "block";
});

// Close sidebar on small screens: hide aside and conceal close button
close_btn.addEventListener('click', () => {
  aside.classList.remove("aside-show");
  aside.classList.add("aside-hide");
  close_btn.style.display = "none";
});

// Toggle compact vs expanded sidebar and synchronized layout changes.
// We first toggle a container-wide state; when expanding, delay inner element toggles
// slightly to allow CSS transitions to feel smoother.
slide_menu_btn.addEventListener('click', () => {
  container.classList.toggle("container-expand");

  if (container.classList.contains("container-expand")) {
    aside.classList.toggle("aside-expand");
    setTimeout(() => {
      logo_name.classList.toggle("logo-name-expand");
      sidebar_anchor.forEach(anchor => anchor.classList.toggle("sidebar-anchor-expand"));
      sidebar_links.forEach(link => link.classList.toggle("sidebar-linkname-expand"));
      logo_and_name.classList.toggle("logo-and-name-expand");
      charts_container.classList.toggle("charts-row-expand");
      line_graphs.classList.toggle("line-graph-expand");
      pie_graphs.classList.toggle("pie-graph-expand");
    }, 200);
  } else {
    // Revert to default expanded state by removing expansion classes explicitly
    logo_name.classList.remove("logo-name-expand");
    sidebar_anchor.forEach(anchor => anchor.classList.remove("sidebar-anchor-expand"));
    sidebar_links.forEach(link => link.classList.remove("sidebar-linkname-expand"));
    logo_and_name.classList.remove("logo-and-name-expand");
    charts_container.classList.remove("charts-row-expand");
    line_graphs.classList.remove("line-graph-expand");
    pie_graphs.classList.remove("pie-graph-expand");
  }
});

// Chart.js helpers to create charts using CSS-driven colors so theme changes propagate automatically
function createLineChart() {
  const styles = getComputedStyle(document.documentElement);
  return new Chart(document.getElementById('line-chart'), {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Whole Year Sales',
        data: [30, 60, 50, 90, 30, 50, 90, 49, 77, 66, 36, 90],
        borderColor: styles.getPropertyValue('--chart-line'),
        backgroundColor: styles.getPropertyValue('--chart-line'),
        tension: 0.3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: styles.getPropertyValue('--chart-text') } },
        title: { display: true, color: styles.getPropertyValue('--chart-text') }
      },
      scales: {
        x: {
          title: { display: true, text: 'MONTHS', color: styles.getPropertyValue('--chart-text') },
          ticks: { color: styles.getPropertyValue('--chart-text') },
          grid: { color: styles.getPropertyValue('--chart-grid') }
        },
        y: {
          min: 0, max: 100,
          ticks: {
            color: styles.getPropertyValue('--chart-text'),
            callback: value => value + '%'
          },
          grid: { color: styles.getPropertyValue('--chart-grid') }
        }
      }
    }
  });
}

function createPieChart() {
  const styles = getComputedStyle(document.documentElement);
  return new Chart(document.getElementById('productPieChart'), {
    type: 'pie',
    data: {
      labels: ['Foldable Mini Drone', 'USB', 'Football', 'Camera', 'Smart Watch'],
      datasets: [{
        label: 'Sales Count',
        data: [120, 95, 80, 150, 110],
        backgroundColor: [
          '#22c55e', '#f59e0b', '#dc2626', '#9333ea', '#0ea5e9'
        ],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Top 6 Selling Products', color: styles.getPropertyValue('--chart-text') },
        legend: { labels: { color: styles.getPropertyValue('--chart-text') } }
      }
    }
  });
}

// Create charts once on load
let lineChart = createLineChart();
let pieChart = createPieChart();

// Theme toggling (light/dark). We apply classes on <html> and then sync chart colors
// from CSS variables so charts match the active theme.
const root = document.documentElement;
const lightBtn = document.querySelector(".light-mode");
const darkBtn = document.querySelector(".dark-mode");

// Refresh chart colors after theme changes by reading CSS variables again
function updateCharts() {
  const styles = getComputedStyle(document.documentElement);

  // Line chart colors and grid
  lineChart.data.datasets[0].borderColor = styles.getPropertyValue('--chart-line');
  lineChart.data.datasets[0].backgroundColor = styles.getPropertyValue('--chart-line');
  lineChart.options.plugins.legend.labels.color = styles.getPropertyValue('--chart-text');
  lineChart.options.plugins.title.color = styles.getPropertyValue('--chart-text');
  lineChart.options.scales.x.title.color = styles.getPropertyValue('--chart-text');
  lineChart.options.scales.x.ticks.color = styles.getPropertyValue('--chart-text');
  lineChart.options.scales.x.grid.color = styles.getPropertyValue('--chart-grid');
  lineChart.options.scales.y.ticks.color = styles.getPropertyValue('--chart-text');
  lineChart.options.scales.y.grid.color = styles.getPropertyValue('--chart-grid');
  lineChart.update();

  // Pie chart legend/title colors
  pieChart.options.plugins.title.color = styles.getPropertyValue('--chart-text');
  pieChart.options.plugins.legend.labels.color = styles.getPropertyValue('--chart-text');
  pieChart.update();
}

// Activate dark theme

darkBtn.addEventListener("click", () => {
  root.classList.remove("light-theme");
  root.classList.add("dark-theme");
  darkBtn.classList.add("active-theme-background");
  lightBtn.classList.remove("active-theme-background");
  updateCharts();
});

// Activate light theme
lightBtn.addEventListener("click", () => {
  root.classList.remove("dark-theme");
  root.classList.add("light-theme");
  lightBtn.classList.add("active-theme-background");
  darkBtn.classList.remove("active-theme-background");
  updateCharts();
});